/*!
Copyright (c) 2010 a b <a.b@c.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/


angular.module('ng-iscroll-slideshow', []).directive('ngIscrollSlideshow', function () {
    return {
        replace: false,
        restrict: 'A',
        link: function (scope, element, attr) {
            // default scope
            scope.$parent.SlideShows = [];
            scope.$parent.Playing = [];
            scope.$parent.ActiveSlideshow = [];

            var ngiScroll_timeout = 500;
            var SlideShowInterval = null;

            // default options
            var options = {
                scrollX: true,
                scrollY: false,
                momentum: false,
                snap: true,
                snapSpeed: 400,
                keyBindings: true,
                click: true,
                indicators: {
                    el: '#slideshow .slideshowindicator',
                    resize: false,
                    shrink: false,
                    interactive: false,
                    listenX: true,
                    listenY: false
                }
            };

            var count = $('[ng-iscroll-slideshow]').filter('[id]').length;

            var id = element.attr('id');
            if (id == null || id == '') { id = 'slideshow' + count; element.attr('id', id); }

            options.indicators.el = '#' + id + ' .slideshowindicator';

            element.find('.scroller').attr('id', id + '_scroller');

            SetSlideShowScrollerWidth(id);

            // if ng-iscroll-form='true' then the additional settings will be supported
            if (attr.ngIscrollForm !== undefined && attr.ngIscrollForm == 'true') {
                options.useTransform = false;
                options.onBeforeScrollStart = function (e) {
                    var target = e.target;
                    while (target.nodeType != 1) target = target.parentNode;

                    if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                        e.preventDefault();
                };
            }

            // extend options

            if (scope.$parent.myScrollOptions) {
                for (var i in scope.$parent.myScrollOptions) {
                    if (i === id) {
                        for (var k in scope.$parent.myScrollOptions[i]) {
                            options[k] = scope.$parent.myScrollOptions[i][k];
                        }
                    } else {
                        options[i] = scope.$root.myScrollOptions[i];
                    }
                }
            }

            // iScroll initialize function
            function setScroll() {
                var slideshow = new IScroll(element[0], options);
                scope.$parent.SlideShows.push(slideshow);
                scope.$parent.Playing.push(slideshow);
            }

            // new specific setting for setting timeout using: ng-iscroll-timeout='{val}'
            if (attr.ngIscrollDelay !== undefined) {
                ngiScroll_timeout = attr.ngIscrollDelay;
            }

            // watch for 'ng-iscroll' directive in html code
            scope.$watch(attr.ngIscroll, function () {
                setTimeout(setScroll, ngiScroll_timeout);
            });

            function SetSlideShowScrollerWidth(slideshowid) {

                var slideshow = $('#' + slideshowid);
                var slideshowwidth = slideshow.width();
                var scroller = $('.scroller', '#' + slideshowid);
                var slides = $('.slide', scroller)

                slides.width(slideshowwidth);

                var scrollerwidth = slides.length * slideshowwidth;
                scroller.width(scrollerwidth);

                $('.slideshowindicator', '#' + slideshowid).width(slides.length * 24);
            }

            function StopAll() {
                scope.$parent.Playing = [];
                clearInterval(SlideShowInterval);
                SlideShowInterval = null;
            }

            function Play() {

                SlideShowInterval = setInterval(function () {

                    if (scope.$parent == null) { return false; }
                    for (var i = 0; i < scope.$parent.Playing.length; i++) {

                        var lastPage = scope.$parent.Playing[i].pages.length - 1;
                        var currentPage = scope.$parent.Playing[i].currentPage;

                        if (currentPage.pageX == lastPage) {

                            scope.$parent.Playing[i].goToPage(0, 0, 1000, IScroll.utils.ease.circular);
                        } else {
                            scope.$parent.Playing[i].next();
                        }

                    }
                }
                    , 4000);
            }


            function SetActive(id) {
                for (var i = 0; i < scope.$parent.SlideShows.length; i++) {
                    if (scope.$parent.SlideShows[i].wrapper.id == id) {
                        scope.$parent.ActiveSlideshow = scope.$parent.SlideShows[i];
                        break;
                    }
                }
            }

            function Stop(id) {
                for (var i = 0; i < scope.$parent.Playing.length; i++) {
                    if (scope.$parent.Playing[i].wrapper.id == id) {
                        scope.$parent.Playing.splice(scope.$parent.Playing.indexOf(scope.$parent.Playing[i]), 1);
                        break;
                    }
                }
            }

            // pause on mouseover
            $('.slideshow').unbind('mouseover.slideshow_pause').on('mouseover.slideshow_pause', function () {
                SetActive($(this).attr('id'));
                Stop($(this).attr('id'));
            });

            // resume playing on mouseout
            $('.slideshow').unbind('mouseout.slideshow_resume').on('mouseout.slideshow_resume', function () {

                var id = $(this).attr('id');
                for (var i = 0; i < scope.$parent.SlideShows.length; i++) {
                    if (scope.$parent.SlideShows[i].wrapper.id == id) {
                        scope.$parent.Playing.push(scope.$parent.SlideShows[i]);
                        break;
                    }
                }
            });

            // go to page on mouseup
            $('.slideshow').unbind('mouseup.slideshow_changepage').on('mouseup.slideshow_changepage', '.slideshowindicator', function (ev) {

                var slideshowid = $(this).closest('.slideshow').attr('id');
                SetActive(slideshowid);
                Stop(slideshowid);

                var offset = $(this).offset();

                var x = ev.pageX - offset.left;

                var rounded = Math.ceil(x / 24.0) * 24;

                var page = rounded / 24;

                setTimeout(function () {
                    scope.$parent.ActiveSlideshow.goToPage(page - 1, 0, 1000, IScroll.utils.ease.circular);
                }
                    , 0);

            });

            //recalculate slideshow width on window resize
            $(window).on('resize', function (ev) {
                if (scope.$parent!=null && scope.$parent.SlideShows.length>0) {
                    for (var i = 0; i < scope.$parent.SlideShows.length; i++) {
                        var id = scope.$parent.SlideShows[i].wrapper.id;
                        SetSlideShowScrollerWidth(id);
                        scope.$parent.SlideShows[i].refresh();
                    }
                }
            });

            
                Play();
            

        }
    };
});
