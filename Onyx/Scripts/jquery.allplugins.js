(function ($) {
    $.fn.equalContentHeights = function () {
        var maxheight = 0;

        var el = $(this);
        el.each(function () {

            var child = el.children(':first').get(0);
            if (child != null) {
                maxheight = (child.clientHeight > maxheight) ? child.clientHeight : maxheight;
            }

        });
        setTimeout(function () { el.height(maxheight); }, 10);
    }


    $.fn.equalParentHeight = function () {

        var highest = 0;
        var el = $(this);

        setTimeout(function () {
            //loop through each one to find the highest
            el.each(function () {
                highest = ($(this).height() > highest) ? $(this).height() : highest;
            });
            // make them all the same height
            el.height(highest);
            //console.log('columns height before timeout ' + highest);

        }, 500);



    }

    $.fn.reverse = [].reverse;

    $.fn.outerHTML = function () {
        return $(this).clone().wrap('<div></div>').parent().html();
    }


    //clear a dropdown menu
    $.fn.clearSelect = function () {
        return this.each(function () {
            if (this.tagName == 'SELECT')
                this.options.length = 0;
        });
    }

    //populate dropdown with a list object 
    $.fn.fillSelect = function (data) {
        return this.clearSelect().each(function () {
            if (this.tagName == 'SELECT') {
                var dropdownList = this;
                $.each(data, function (index, optionData) {
                    var option = new Option(optionData.Text, optionData.Value);
                    if ($.browser.msie) { dropdownList.add(option); }
                    else { dropdownList.add(option, null); }
                });
            }
        });
    }

    $.fn.extend({
        countdown: function (start, callback) {

            var timerId;
            var el = $(this);
            el.html(start);

            timerId = setInterval(function () {
                var v = parseInt(el.html());
                el.html(v - 1);
                if (v <= 1) { clearInterval(timerId); callback(); }
            }, 1000);

        }

    });

    $.fn.extend({
        passwordStrength: function (n) {

            var txt = $(this).val();

            $('#passwordstrength').remove();
            $(this).css({ 'border-bottom': '' });

            if (txt.length == 0) { $('#passwordstrength').remove(); return false; }

            if ($('#passwordstrength').length == 0) {
                $(this).after('<span id="passwordstrength" style="width: 150px;z-index:100; float: left; text-align: center; position: absolute; margin: -4px 0px 0px 5px; padding: 5px; border-radius: 4px 4px 4px 4px; box-shadow: 0pt 0pt 5px -1px rgb(136, 136, 136); background-color: rgb(214, 225, 241); border: 1px solid rgb(109, 153, 214);">' +
                                  '<span id="passwordstrengthstatus" style="float: left; width: 100%;color:#222;">Too short</span>' +
                                  '<span id="passwordstrengthbaroutline" style="width: 148px; float: left; height: 5px; background-color: #eee; border: 1px solid #cccccc;">' +
                                      '<span id="passwordstrengthbar" style="background-color: #eee; height: 5px; width: 0%; float: left;"></span>' +
                                  '</span>' +
                              '</span>');
            }

            var ctx = $(this).siblings('#passwordstrength');
            var o = $('#passwordstrengthbaroutline', ctx);
            var b = $('#passwordstrengthbar', ctx);
            var s = $('#passwordstrengthstatus', ctx);


            if (txt.length < 3) {
                b.css({ 'background-color': '#cc0000', height: '5px', width: '10%' });
                s.html('Short');
                return false;
            }
            else if (txt.length == 3) {
                b.css({ 'background-color': '#ff5600', height: '5px', width: '20%' });
                s.html('Very weak');
                return false;
            }
            else if (txt.length < 6) {
                b.css({ 'background-color': '#ff9a00', height: '5px', width: '40%' });
                s.html('Weak');
                return false;
            }
            else if (txt.length < 8) {
                b.css({ 'background-color': '#FFFE00', height: '5px', width: '55%' });
                s.html('Weak');
                return false;
            }

            if (txt.match(/[a-z]/) || txt.match(/\d/)) {
                b.css({ 'background-color': '#e3ee00', height: '5px', width: '65%' });
                s.html('Medium');
            }

            if (txt.match(/[a-z]/) && txt.match(/[A-Z]/) && txt.match(/\d/)) {
                b.css({ 'background-color': '#f3e700', height: '5px', width: '75%' });
                s.html('Good');
            }

            if (txt.match(/\d/) && txt.match(/[A-Z]/) && txt.match(/[a-z]/) && txt.length >= 8) {
                b.css({ 'background-color': '#d4f200', height: '5px', width: '85%' });
                s.html('Strong');
            }

            if (txt.match(/\d/) && txt.match(/[A-z]/) && txt.match(/[!|@|#|$|%]/) && txt.length >= 10) {
                b.css({ 'background-color': '#a9f900', height: '5px', width: '100%' });
                s.html('Very Strong');
            }

            return $(this);
        }
    });


    $.fn.extend({
        truncate: function (n) {
            $(this).each(function () {
                var txt = $(this).text();
                txt = $(this).data('original-value') != null ? $(this).data('original-value') : txt;
                $(this).data('original-value', txt);
                if (txt.length + 3 > n) {
                    txt = txt.substring(0, n - 4);
                    txt = $.trim(txt);
                    txt += '...';
                }
                $(this).text(txt);
            });
            return $(this);
        },
        untruncate: function () {
                $(this).each(function () {
                    if ($(this).data('original-value') != null) {
                        var txt = $(this).data('original-value');
                        $(this).text(txt);
                    }
                });
            return $(this);
        }
    });


    $.fn.extend({
        parentsHeight: function (spacing) {
            var el = $(this);
            var p = el.closest('.panel');
            var h = p.height();
            if (spacing == null) { spacing = 40; }
            h = h - spacing;

            if (h < 100) { h = 100; }

            el.height(h);
            return el;
        }
    });



    /**
    * jQuery.fn.sortElements
    * --------------
    * @param Function comparator:
    *   Exactly the same behaviour as [1,2,3].sort(comparator)
    *   
    * @param Function getSortable
    *   A function that should return the element that is
    *   to be sorted. The comparator will run on the
    *   current collection, but you may want the actual
    *   resulting sort to occur on a parent or another
    *   associated element.
    *   
    *   E.g. $('td').sortElements(comparator, function(){
    *      return this.parentNode; 
    *   })
    *   
    *   The <td>'s parent (<tr>) will be sorted instead
    *   of the <td> itself.
    *
    *    $('li').sortElements(function(a, b){
    *        return $(a).text() > $(b).text() ? 1 : -1;
    *    });
    *
    *
    */
    jQuery.fn.sortElements = (function () {

        var sort = [].sort;

        return function (comparator, getSortable) {

            getSortable = getSortable || function () { return this; };

            var placements = this.map(function () {

                var sortElement = getSortable.call(this),
                parentNode = sortElement.parentNode,

                // Since the element itself will change position, we have
                // to have some way of storing its original position in
                // the DOM. The easiest way is to have a 'flag' node:
                nextSibling = parentNode.insertBefore(
                    document.createTextNode(''),
                    sortElement.nextSibling
                );

                return function () {

                    if (parentNode === this) {
                        throw new Error(
                        "You can't sort elements if any one is a descendant of another."
                    );
                    }

                    // Insert before flag:
                    parentNode.insertBefore(this, nextSibling);
                    // Remove flag:
                    parentNode.removeChild(nextSibling);

                };

            });

            return sort.call(this, comparator).each(function (i) {
                placements[i].call(getSortable.call(this));
            });

        };

    })();



})(jQuery);

/**
* jQuery.ScrollTo - Easy element scrolling using jQuery.
* Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
* Dual licensed under MIT and GPL.
* Date: 5/25/2009
* @author Ariel Flesler
* @version 1.4.2
*
* http://flesler.blogspot.com/2007/10/jqueryscrollto.html
*/
; (function (d) { var k = d.scrollTo = function (a, i, e) { d(window).scrollTo(a, i, e) }; k.defaults = { axis: 'xy', duration: parseFloat(d.fn.jquery) >= 1.3 ? 0 : 1 }; k.window = function (a) { return d(window)._scrollable() }; d.fn._scrollable = function () { return this.map(function () { var a = this, i = !a.nodeName || d.inArray(a.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) != -1; if (!i) return a; var e = (a.contentWindow || a).document || a.ownerDocument || a; return d.browser.safari || e.compatMode == 'BackCompat' ? e.body : e.documentElement }) }; d.fn.scrollTo = function (n, j, b) { if (typeof j == 'object') { b = j; j = 0 } if (typeof b == 'function') b = { onAfter: b }; if (n == 'max') n = 9e9; b = d.extend({}, k.defaults, b); j = j || b.speed || b.duration; b.queue = b.queue && b.axis.length > 1; if (b.queue) j /= 2; b.offset = p(b.offset); b.over = p(b.over); return this._scrollable().each(function () { var q = this, r = d(q), f = n, s, g = {}, u = r.is('html,body'); switch (typeof f) { case 'number': case 'string': if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)) { f = p(f); break } f = d(f, this); case 'object': if (f.is || f.style) s = (f = d(f)).offset() } d.each(b.axis.split(''), function (a, i) { var e = i == 'x' ? 'Left' : 'Top', h = e.toLowerCase(), c = 'scroll' + e, l = q[c], m = k.max(q, i); if (s) { g[c] = s[h] + (u ? 0 : l - r.offset()[h]); if (b.margin) { g[c] -= parseInt(f.css('margin' + e)) || 0; g[c] -= parseInt(f.css('border' + e + 'Width')) || 0 } g[c] += b.offset[h] || 0; if (b.over[h]) g[c] += f[i == 'x' ? 'width' : 'height']() * b.over[h] } else { var o = f[h]; g[c] = o.slice && o.slice(-1) == '%' ? parseFloat(o) / 100 * m : o } if (/^\d+$/.test(g[c])) g[c] = g[c] <= 0 ? 0 : Math.min(g[c], m); if (!a && b.queue) { if (l != g[c]) t(b.onAfterFirst); delete g[c] } }); t(b.onAfter); function t(a) { r.animate(g, j, b.easing, a && function () { a.call(this, n, b) }) } }).end() }; k.max = function (a, i) { var e = i == 'x' ? 'Width' : 'Height', h = 'scroll' + e; if (!d(a).is('html,body')) return a[h] - d(a)[e.toLowerCase()](); var c = 'client' + e, l = a.ownerDocument.documentElement, m = a.ownerDocument.body; return Math.max(l[h], m[h]) - Math.min(l[c], m[c]) }; function p(a) { return typeof a == 'object' ? a : { top: a, left: a} } })(jQuery);




/*
* JavaScript Pretty Date
* Copyright (c) 2008 John Resig (jquery.com)
* Licensed under the MIT license.
*/

// Takes an ISO time and returns a string representing how
// long ago the date represents.
function prettyDate(time) {
	var date = new Date(time),
		diff = (((new Date()).getTime() - date.getTime()) / 1000),
	day_diff = Math.floor(diff / 86400);

	if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31)
		return false;

	return day_diff == 0 && (
			diff < 60 && "just now" ||
			diff < 120 && "1 minute ago" ||
			diff < 3600 && Math.floor(diff / 60) + " minutes ago" ||
			diff < 7200 && "1 hour ago" ||
			diff < 86400 && Math.floor(diff / 3600) + " hours ago") ||
		day_diff == 1 && "Yesterday" ||
		day_diff < 7 && day_diff + " days ago" ||
		day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago";
};

if (!this.JSON) {
	JSON = function () {
		function f(n) { return n < 10 ? '0' + n : n; }
		Date.prototype.toJSON = function () {
			return this.getUTCFullYear() + '-' +
f(this.getUTCMonth() + 1) + '-' +
f(this.getUTCDate()) + 'T' +
f(this.getUTCHours()) + ':' +
f(this.getUTCMinutes()) + ':' +
f(this.getUTCSeconds()) + 'Z';
		}; var m = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' }; function stringify(value, whitelist) {
			var a, i, k, l, r = /["\\\x00-\x1f\x7f-\x9f]/g, v; switch (typeof value) {
				case 'string': return r.test(value) ? '"' + value.replace(r, function (a) {
					var c = m[a]; if (c) { return c; }
					c = a.charCodeAt(); return '\\u00' + Math.floor(c / 16).toString(16) +
(c % 16).toString(16);
				}) + '"' : '"' + value + '"'; case 'number': return isFinite(value) ? String(value) : 'null'; case 'boolean': case 'null': return String(value); case 'object': if (!value) { return 'null'; }
					if (typeof value.toJSON === 'function') { return stringify(value.toJSON()); }
					a = []; if (typeof value.length === 'number' && !(value.propertyIsEnumerable('length'))) {
						l = value.length; for (i = 0; i < l; i += 1) { a.push(stringify(value[i], whitelist) || 'null'); }
						return '[' + a.join(',') + ']';
					}
					if (whitelist) { l = whitelist.length; for (i = 0; i < l; i += 1) { k = whitelist[i]; if (typeof k === 'string') { v = stringify(value[k], whitelist); if (v) { a.push(stringify(k) + ':' + v); } } } } else { for (k in value) { if (typeof k === 'string') { v = stringify(value[k], whitelist); if (v) { a.push(stringify(k) + ':' + v); } } } }
					return '{' + a.join(',') + '}';
			} 
		}
		return { stringify: stringify, parse: function (text, filter) {
			var j; function walk(k, v) {
				var i, n; if (v && typeof v === 'object') { for (i in v) { if (Object.prototype.hasOwnProperty.apply(v, [i])) { n = walk(i, v[i]); if (n !== undefined) { v[i] = n; } } } }
				return filter(k, v);
			}
			if (/^[\],:{}\s]*$/.test(text.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) { j = eval('(' + text + ')'); return typeof filter === 'function' ? walk('', j) : j; }
			throw new SyntaxError('parseJSON');
		} 
		};
	} ();
}


//remove duplicates on an array

Array.prototype.unique = function () {
    return Object.keys(this.reduce(function (r, v) {
        return r[v] = 1, r;
    }, {}));
}


/*
Array.prototype.unique = function () {
    var r = [];
    for (var i = 0; i < this.length; i++) {
        if (r.indexOf(this[i]) === -1)
            r.push(this[i]);
    }
    return r;
}*/

/*
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from* /) {
        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this && this[from] === elt)
                return from;
        }
        return -1;
    };
}
*/


