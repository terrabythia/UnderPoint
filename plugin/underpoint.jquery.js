/*
 *  Project: UnderPoint jQuery Plugin
 *  Description: Returns a jQuery Object that contains all the objects under the current mousepoint
 *  Author: Sander Bruggeman
 *  License: MIT (https://github.com/SanderSoulwax/UnderPoint/blob/master/licence.txt)
 *
 */

;(function ( $, window, document, undefined ) {

    var pluginName = "underpoint",
        defaults = {
            trigger:[ "click"], // can be all events that contain the pageX and pageY property (mousemove, mouseover, mouseout etc)
            selector: "*", // (div, a, etc.) "*" = all children
            depth: 0, 
            callback: function($elements, event){}
        };

    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options );
        if((typeof this.options.trigger) === 'string' ) {
            this.options.trigger = [ this.options.trigger ];
        }

        this._defaults = defaults;
        this._name = pluginName;
        this._mousePos = {x:0,y:0};

        this.init();
    }

    Plugin.prototype = {

        init: function() {

            this.proxied = {
                didTrigger: jQuery.proxy(this._didTrigger, this),
                mouseMove: jQuery.proxy(this._mouseMoveForManualTrigger, this)
            };

            this.publicFunctions = {
                mousePoint: jQuery.proxy(this.elementsUnderMousePoint, this),
                point: jQuery.proxy(this.elementsUnderPoint, this)
            };

            var i = this.options.trigger.length-1,
                trigger;
            for (;i >= 0; i--) {
                trigger = this.options.trigger[i];

                if (trigger !== "manual")
                    $(this.element).on(trigger, this.proxied.didTrigger);
                else
                    $(this.element).on('mousemove', this.proxied.mouseMove)
            }

        },

        _mouseMoveForManualTrigger: function(event) {
            this._mousePos = {x:event.pageX,y:event.pageY};
        },

        _didTrigger: function(event) {
            this.options.callback(this._elementsUnderPoint(event.pageX,event.pageY), event);
        },

        _elementsUnderPoint: function(x,y) {

             var $list
                ,$elements
                ,offset
                ,range;

            $elements = this._findAtDepth($(this.element), this.options.selector, this.options.depth);
            $list = $elements.filter(function() {
                offset = $(this).offset();
                range = {
                    x: [ offset.left,
                        offset.left + $(this).outerWidth() ],
                    y: [ offset.top,
                        offset.top + $(this).outerHeight() ]
                };
                return (x >= range.x[0] && x <= range.x[1]) && (y >= range.y[0] && y <= range.y[1])
            });

            return $list;
        },

        _findAtDepth: function (element, selector, maxDepth) {
            var depths = [], i;

            if (maxDepth > 0) {
                for (i = 1; i <= maxDepth; i++) {
                    depths.push('> ' + new Array(i).join('* > ') + selector);
                }

                selector = depths.join(', ');
            }

            return element.find(selector);

        },

        elementsUnderMousePoint: function() {
            return this._elementsUnderPoint(this._mousePos.x,this._mousePos.y);
        },

        elementsUnderPoint: function(point) {
            if((typeof point)==="undefined" || (typeof point.x)==="undefined" || (typeof point.y)==="undefined")
                return false;

            return this._elementsUnderPoint(point.x,point.y);
        }
    };

    $.fn[pluginName] = function ( options, param ) {
        if ((typeof options) === "string" && this.length >= 1 && $.data(this[0], "plugin_" + pluginName)) {
            var element = this[0];
            var func = $.data(element, "plugin_" + pluginName).publicFunctions[options];
            if ((typeof func) !== "undefined") {
                // getters
                return func(param);
            }
        }
        else {
            return this.each(function () {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
                }
            });
        }
        return false;
    };

})( jQuery, window, document );
