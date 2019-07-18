/*
 * @Author: Administrator
 * @Date:   2018-10-30 20:40:51
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-07-18 17:57:05
 */
(function(root) {
	var testExp = /^\s*(<[\w\W]+>)[^>]*$/;
	var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
	var version = "1.0.1";
	var jQuery = function(selector, context) {
		return new jQuery.prototype.init(selector, context);
	}

	jQuery.fn = jQuery.prototype = { //原型对象
		length: 0,
		jquery: version,
		selector: "",
		init: function(selector, context) {
			context = context || document;
			var match, elem, index = 0;
			if (!selector) {
				return this;
			}

			if (typeof selector === "string") {
				if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
					match = [selector]
				}
				if (match) {
					jQuery.merge(this, jQuery.parseHTML(selector, context));
				} else {
					elem = document.querySelectorAll(selector);
					var elems = Array.prototype.slice.call(elem);
					this.length = elems.length;
					for (; index < elems.length; index++) {
						this[index] = elems[index];
					}
					this.context = context;
					this.selector = selector;
				}
			} else if (selector.nodeType) {
				this.context = this[0] = selector;
				this.length = 1;
				return this;
			}

		},
		css: function() {
			console.log("di~~didi~~")
		},
		//....
	}

	jQuery.fn.init.prototype = jQuery.fn;


	jQuery.extend = jQuery.prototype.extend = function() {
		var target = arguments[0] || {};
		var length = arguments.length;
		var i = 1;
		var deep = false; //默认为浅拷贝 
		var option;
		var name;
		var copy;
		var src;
		var copyIsArray;
		var clone;

		if (typeof target === "boolean") {
			deep = target;
			target = arguments[1];
			i = 2;
		}

		if (typeof target !== "object") {
			target = {};
		}

		if (length == i) {
			target = this;
			i--;
		}

		for (; i < length; i++) {
			if ((option = arguments[i]) !== null) {
				for (name in option) {
					src = target[name];
					copy = option[name];
					if (deep && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];
						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}
						target[name] = jQuery.extend(deep, clone, copy);
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}
		return target;
	}


	jQuery.extend({
		//类型检测     
		isPlainObject: function(obj) {
			// return typeof obj === "object";
			return toString.call(obj) === "[object Object]";
		},

		isArray: function(obj) {
			return toString.call(obj) === "[object Array]";
		},

		isFunction: function(fn) {
			return toString.call(fn) === "[object Function]";
		},
		markArray: function(arr, results) {
			var ret = results || [];
			if (arr != null) {
				jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
			}
			return ret;
		},
		merge: function(first, second) {
			var l = second.length,
				i = first.length,
				j = 0;

			if (typeof l === "number") {
				for (; j < l; j++) {
					first[i++] = second[j];
				}
			} else {
				while (second[j] !== undefined) {
					first[i++] = second[j++];
				}
			}

			first.length = i;

			return first;
		},

		parseHTML: function(data, context) {
			if (!data || typeof data !== "string") {
				return null;
			}
			var parse = rejectExp.exec(data);
			console.log(parse)
			return [context.createElement(parse[1])];
		},

		access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
            var i = 0,
                length = elems.length,
                bulk = key == null;
    
            // Sets many values
            if ( jQuery.isPlainObject( key ) ) {
                chainable = true;
                for ( i in key ) {
                    jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
                }
    
            // Sets one value
            } else if ( value !== undefined ) {
                chainable = true;
    
                if ( !jQuery.isFunction( value ) ) {
                    raw = true;
                }
    
                if ( bulk ) {
                    // Bulk operations run against the entire set
                    if ( raw ) {
                        fn.call( elems, value );
                        fn = null;
    
                    // ...except when executing function values
                    } else {
                        bulk = fn;
                        fn = function( elem, key, value ) {
                            return bulk.call( jQuery( elem ), value );
                        };
                    }
                }
    
                if ( fn ) {
                    for ( ; i < length; i++ ) {
                        fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
                    }
                }
            }
    
            return chainable ?
                elems :
    
                // Gets
                bulk ?
                    fn.call( elems ) :
                    length ? fn( elems[0], key ) : emptyGet;
        },
		//set
		content: function(elem, value) {
			var nodeType = elem.nodeType;
			if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
				elem.textContent = value;
			}
		},
		text: function(elem) {
			var nodeType = elem.nodeType;
			if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
				return elem.textContent;
			}
		},
		style: function(elem, key, value) {
			if (!elem||elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
				return;
			}
			elem.style[key] = value;
		}

	});

	//$().text()  文本内容
	jQuery.fn.extend({
		text: function(value) {
			return jQuery.access(this, function(value) {
				//value === undefined   get
				return value === undefined ? jQuery.text(this) : jQuery.content(this, value);
			}, null, value);
		},
		css: function(key, value) { // key === string  key === array  key  === object
			return jQuery.access(this, function(key, value) {
				var styles, len;
				var map = {};
				if (jQuery.isArray(key)) { //获取当前元素的css样式表达  this   style
					styles = window.getComputedStyle(this, null);
					len = key.length;
					for (var i = 0; i < len; i++) {
						map[key[i]] = styles.getPropertyValue(key[i]) || undefined;
					}
					return map;
				}
				//set
				return value !== undefined ? jQuery.style(this, key, value) : window.getComputedStyle(this).getPropertyValue(key);
			}, key, value);
		}
	});
	root.$ = root.jQuery = jQuery;
})(this);
