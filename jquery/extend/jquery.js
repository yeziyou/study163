(function(root) {
    var jQuery = function (selector, context) {
        return new jQuery.fn.init(selector, context);
    }

    jQuery.fn = jQuery.prototype = {
        init: function() {
            
        },
    }

    jQuery.extend = jQuery.fn.extend = function() {
        var target = arguments[0] || {};
        var length = arguments.length;
        var i = 1; 
        var deep = false;
        var copyIsArray = false;
        var option, key, src, copy, clone;
        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[1];
            i = 2;
        }
        
        if (typeof target !== 'object') {
            target = {};
        }
        if (length === i) {
            target = this;
            i--;
        }
        for (; i < length; i++) {
            if (typeof (option = arguments[i]) != null) {
                for(key in option) {
                    copy = option[key];
                    src = target[key];
                    if (deep && (jQuery.isPlainObject(copy) || 
                    (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src: [];
                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }
                        target[key] = jQuery.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[key] = copy;
                    }
                    // if (deep && ((isObject = toString.call(option[key])) === '[object Object]' ||
                    // (isArray = toString.call(option[key])) === '[object Array]')){
                    //     if (isObject) {
                    //         src = target[key] || {};
                    //     } else if (isArray) {
                    //         src = target[key] || [];
                    //     }
                    //     clone = option[key];
                    //     target[key] = $.extend(deep, src, clone);
                    // } else {
                    //     target[key] = option[key];
                    // }
                }
            }
        }

        return target;
    }

    jQuery.extend({
        isArray: function(o) {
            return toString.call(o) === '[object Array]';
        },
        
        isPlainObject: function(o) {
            return toString.call(o) === '[object Object]';
        }
    });

    jQuery.fn.init.prototype = jQuery.prototype;

    root.$ = root.jQuery = jQuery;

})(this);