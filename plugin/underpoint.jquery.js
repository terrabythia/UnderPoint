/*
 *  Project: UnderPoint jQuery Plugin
 *  Description: Returns a jQuery Object that contains all the objects under the current mousepoint
 *  Author: Sander Bruggeman
 *  License: Attribution 3.0 Unported (http://creativecommons.org/licenses/by/3.0/)
 *
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "underpoint",
        defaults = {
            trigger: "click", // can be all events that contain the pageX and pageY property (mousemove, mouseover, mouseout etc)
            selector: "*", // (div, a, etc.) "*" = all children
            depth: 0, 
            callback: function($elements, event){}
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).

            this.proxied = {
                didTrigger: jQuery.proxy(this.didTrigger, this)
            };

            $(this.element).on(this.options.trigger, this.proxied.didTrigger);

        },

        didTrigger: function(event) {

            var clickX = event.pageX
                ,clickY = event.pageY
                ,$list
                ,$elements
                ,offset
                ,range;

            $elements = this.findAtDepth($(this.element), this.options.selector, this.options.depth);
            $list = $elements.filter(function() {
                offset = $(this).offset();
                range = {
                    x: [ offset.left,
                        offset.left + $(this).outerWidth() ],
                    y: [ offset.top,
                        offset.top + $(this).outerHeight() ]
                };
                return (clickX >= range.x[0] && clickX <= range.x[1]) && (clickY >= range.y[0] && clickY <= range.y[1])
            });

            this.options.callback($list, event);
        },

        findAtDepth: function (element, selector, maxDepth) {
            var depths = [], i;

            if (maxDepth > 0) {
                for (i = 1; i <= maxDepth; i++) {
                    depths.push('> ' + new Array(i).join('* > ') + selector);
                }

                selector = depths.join(', ');
            }

            return element.find(selector);

        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );
