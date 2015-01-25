$contentLoadTriggered = false;
var offset = 0;
var startpage = 0;
var pageloaded = [];



$(function () {

    if (Modernizr.history) {

        /*
        History.Adapter.bind(window, "statechange", function () {
            
            var State = History.getState();
            if (State!=null){

                var stateDataObj = State.data;
                if (stateDataObj != null) {

                    var itemid = stateDataObj.itemid;
                    if (itemid != null)
                    {
                        var el = $('.item[data-id=' + itemid + ']');
                        if (el.length > 0) {
                            var f = function () {
                                var offsettop = el.offset().top;
                                $(window).scrollTop(offsettop - 70);
                                el.css({border:'1px solid red'});
                            }
                            setTimeout(function () { f }, 0);

                        }
                    }
                }
            }
        });
        */


        //var stateDataObj = { state_related: "info" };
        //History.pushState(stateDataObj, "Page Title", "/page/url/here");
        //var stateDataObj = { itemid: id };
        //History.pushState(stateDataObj, "Superpainel - Veículos", '?page='+page);

       
        

    }

        //  $(window).unload(function () { $.cookie('hash', page, { path: '/', domain: cookieName }); alert("Bye now!"); });

        var url = window.location;
        // if page variable is present 
        if (url.toString().indexOf('page=') > -1) {
            url = url.toString().split('page=');
            if (url[1] != null && !isNaN(url[1])) {
                startpage = parseInt(url[1]);
            }
            // console.log('startpage: ',startpage);
        }

        // if page hash is present override initial page variable
        if (url.toString().indexOf('#p=') > -1) {
            url = url.toString().split('#p=');
            if (url[1] != null && !isNaN(url[1])) {
                startpage = parseInt(url[1]);
                carModel.items.removeAll();
                if (startpage > 0) {

                    // if user links to this page with a hash #p=x user will be redirected to ?page=x
                    // this works but is annoying page flash and unescessary redirection
                    // window.location= ReloadToUrl();

                    //another solution would be just load the contents from desired page ?page=x via ajax
                    //GetLastPage(startpage);

                }
            }
        }
    

        if (startpage > 1) {
            page = startpage;
        }
        pageloaded.push(parseInt(page));

        $(window).bind('scroll.endless', function (e) {

            var windowheight = $(window).height();
            var scrolltop = $(this).scrollTop();

            offset = Math.round($('#loadmoreitems').offset().top);

            if ($(window).scrollTop() >= (offset - 600) && $contentLoadTriggered == false && (Math.abs(page) <= (Math.abs(maxpage))) && $.inArray(parseInt(page) + 1, pageloaded) == -1) {

                $contentLoadTriggered = true;

                var q = $('#q').val();
                if (q == null) { q = ""; }

                $('#loadmoreitems').show();

                pageloaded.push((parseInt(page)+1));

                $.ajax({
                    type: "get",
                    url: "/api/cars?page=" + (parseInt(page) + 1) + "&q=" + q + "&sorting=&matchallwords=false",
                    //data: "{}",
                    contentType: "application/json;",
                    dataType: "json",
                    async: true,
                    cache: true,
                    success: function (result) {
                        if (result != '') {
                            var items = carModel.items();
                            items.extend_forEach(result);
                            carModel.items(items);
                            $contentLoadTriggered = false;
                        }
                        $('#loadmoreitems').hide();
                    },
                    error: function (x, e) {
                        $('#loadmoreitems').hide();
                        if (console) { console.log("The call to the server side failed. " + x.responseText); }
                    }
                });

            } else {
                UpdateHash();
            }
        });

    
        var lastitem = $.cookie('lastvisiteditem');
        if (lastitem != null) {
            var el = $('.item[data-id=' + lastitem + ']');
            if (el.length > 0) {
                var f = function () {
                    var offsettop = el.offset().top;
                    $(window).scrollTop(offsettop - 70);
                    el.addClass('highlightedcard');//css({ border: '1px solid red' });
                    setTimeout(function () {
                        $('.item[data-id=' + lastitem + ']').switchClass('highlightedcard');
                        console.log('carai ', lastitem);
                    }, 4000);
                }
                setTimeout(function () { f() }, 100);
            }
        }

});
   
function ReloadToUrl()
{
    var s = window.location.toString(); // '?page=5#p=7';
    var rx2 = new RegExp('#p=[0-9]+', "gi");
    var pagehash = rx2.test(s);

    if (pagehash) {

        var rx = new RegExp('page=[0-9]+', "gi");
        s = s.replace(rx, '');
        s = s.replace('#p', '?page');
        s = s.replace("??", "?");
    }
    return s;
}


function UpdateHash() {
    
    var pageTemp = 0;
    
    var cleanUrl = window.location;
    var scrolltop = ($(window).scrollTop() + ($(window).height() / 2));
   
        var scrollArray = [];
        
        var seps = $('.pageseparator');
        for (var i = 0; i < seps.length; i++) {
            var s = $(seps[i]).offset().top;
            if (scrolltop > s ) {
                scrollArray.push(s);
                pageTemp++;
            }
        }
        
        if (pageTemp == 0) { pageTemp = 1;}
        
        page = parseInt(pageTemp) + (startpage > 0 ? parseInt(startpage) - 1 : 0);

        if (Modernizr.history) {
            var stateDataObj = { contentid: null};
            History.pushState(stateDataObj, "Superpainel - Veículos", "?page="+page);
        }
        else
        {
            window.location.hash = '#p=' + page;
        }
      
}

function GetLastPage(p) {


            var q = $('#q').val();
            if (q == null) { q = ""; }

            if ($contentLoadTriggered == false) {

                $contentLoadTriggered = true;

                $.ajax({
                    type: "get",
                    url: "/api/cars?page=" + (parseInt(p)) + "&q=" + q + "&sorting=&matchallwords=false",
                    //data: "{}",
                    contentType: "application/json;",
                    dataType: "json",
                    async: true,
                    cache: true,
                    success: function (result) {

                        $contentLoadTriggered = false;

                        if (result != '') {
                            carModel.items.removeAll();
                            setTimeout(function () {
                                carModel.items(result);
                            }, 0);
                            pageloaded.push(parseInt(p));
                        }
                    },
                    error: function (x, e) {
                        if (console) { console.log("The call to the server side failed. " + x.responseText); }
                    }
                });
            }
        
    }

