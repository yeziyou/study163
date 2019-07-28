/*
 * @Author: Administrator
 * @Date:   2018-10-30 20:40:51
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-07-25 16:47:48
 */
(function(root) {
	var testExp = /^\s*(<[\w\W]+>)[^>]*$/;
	var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
	var core_version = "1.0.1";
	var optionsCache = {};

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	//activeElement 属性返回文档中当前获得焦点的元素。
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch (err) {}
	}

	var jQuery = function(selector, context) {
		return new jQuery.prototype.init(selector, context);
	}

	jQuery.fn = jQuery.prototype = { //原型对象
		length: 0,
		jquery: core_version,
		selector: "",
		init: function(selector, context) {
			context = context || document;
			var match, elem, index = 0;
			//$()  $(undefined)  $(null) $(false)  
			if (!selector) {
				return this;
			}

			if (typeof selector === "string") {
				if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
					match = [selector]
				}
				//创建DOM
				if (match) {
					//this  
					jQuery.merge(this, jQuery.parseHTML(selector, context));
					//查询DOM节点
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
			i--; //0   
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
		expando: "jQuery" + (core_version + Math.random()).replace(/\D/g, ""),
		guid: 1, //计数器
		now: Date.now, //返回当前时间距离时间零点(1970年1月1日 00:00:00 UTC)的毫秒数
		//类型检测     
		isPlainObject: function(obj) {
			return typeof obj === "object";
		},

		isArray: function(obj) {
			return toString.call(obj) === "[object Array]";
		},

		isFunction: function(fn) {
			return toString.call(fn) === "[object Function]";
		},
		//类数组转化成正真的数组  
		markArray: function(arr, results) {
			var ret = results || [];
			if (arr != null) {
				jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
			}
			return ret;
		},

		//合并数组
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
			//过滤掉<a>   <a>   => a 
			var parse = rejectExp.exec(data);
			console.log(parse)
			return [context.createElement(parse[1])];
		},

		//$.Callbacks用于管理函数队列
		callbacks: function(options) {
			options = typeof options === "string" ? (optionsCache[options] || createOptions(options)) : {};
			var list = [];
			var index, length, testting, memory, start, starts;
			var fire = function(data) {
				memory = options.memory && data;
				index = starts || 0;
				start = 0;
				testting = true;
				length = list.length;
				for (; index < length; index++) {
					if (list[index].apply(data[0], data[1]) === false && options.stopOnfalse) {
						break;
					}
				}
			}
			var self = {
				add: function() {
					var args = Array.prototype.slice.call(arguments);
					start = list.length;
					args.forEach(function(fn) {
						if (toString.call(fn) === "[object Function]") {
							list.push(fn);
						}
					});
					if (memory) {
						starts = start;
						fire(memory);
					}
					return this;
				},
				//指定上下文对象
				fireWith: function(context, arguments) {
					var args = [context, arguments];
					if (!options.once || !testting) {
						fire(args);
					}

				},
				//参数传递
				fire: function() {
					self.fireWith(this, arguments);
				}
			}
			return self;
		},

		// 异步回调解决方案
		Deferred: function(func) {
			var tuples = [
					["resolve", "done", jQuery.callbacks("once memory"), "resolved"],
					["reject", "fail", jQuery.callbacks("once memory"), "rejected"],
					["notify", "progress", jQuery.callbacks("memory")]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					then: function( /* fnDone, fnFail, fnProgress */ ) {},
					promise: function(obj) {
						return obj != null ? jQuery.extend(obj, promise) : promise;
					}
				},
				deferred = {};

			tuples.forEach(function(tuple, i) {
				var list = tuple[2],
					stateString = tuple[3];

				// promise[ done | fail | progress ] = list.add
				promise[tuple[1]] = list.add;

				// Handle state
				if (stateString) {
					list.add(function() {
						// state = [ resolved | rejected ]
						state = stateString;
					});
				}

				// deferred[ resolve | reject | notify ]
				deferred[tuple[0]] = function() {
					deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
					return this;
				};
				deferred[tuple[0] + "With"] = list.fireWith;
			});

			// Make the deferred a promise
			promise.promise(deferred);

			return deferred;
		},
		//执行一个或多个对象的延迟对象的回调函数
		when: function(subordinate) {
			return subordinate.promise();
		},

		/*
		 object   目标源
		 callback  回调函数
		 args     自定义回调函数参数
		 */
		each: function(object, callback, args) {
			//object  数组对象 || object对象 
			var length = object.length;
			var name, i = 0;

			// 自定义callback 参数
			if (args) {
				if (length === undefined) {
					for (name in object) {
						callback.apply(object, args);
					}
				} else {
					for (; i < length;) {
						callback.apply(object[i++], args);
					}
				}
			} else {
				if (length === undefined) {
					for (name in object) {
						callback.call(object, name, object[name]);
					}
				} else {
					for (; i < length;) {
						callback.call(object[i], i, object[i++]);
					}
				}
			}
		},

	});

	function Data() {
		//jQuery.expando是jQuery的静态属性,对于jQuery的每次加载运行期间时唯一的随机数
		this.expando = jQuery.expando + Math.random();
		this.cache = {};
	}

	Data.uid = 1;

	Data.prototype = {
		key: function(elem) {
			var descriptor = {},
				unlock = elem[this.expando];

			if (!unlock) {
				unlock = Data.uid++;
				descriptor[this.expando] = { //钥匙
					value: unlock
				};
				//方法直接在一个对象上定义一个或多个新的属性或修改现有属性,并返回该对象。
				//DOM   =>  jQuery101089554822917892030.7449198463843298 = 1;
				Object.defineProperties(elem, descriptor);
			}
			//确保缓存对象记录信息
			if (!this.cache[unlock]) {
				this.cache[unlock] = {}; //  数据
			}

			return unlock;
		},

		get: function(elem, key) {
			//找到或者创建缓存
			var cache = this.cache[this.key(elem)]; //1  {events:{},handle:function(){}} 
			//key 有值直接在缓存中取读
			return key === undefined ? cache : cache[key];
		},
	}

	var data_priv = new Data();




	//jQuery 事件模块
	jQuery.event = {
		//1:利用 data_priv 数据缓存,分离事件与数据 2:元素与缓存中建立 guid 的映射关系用于查找 
		add: function(elem, type, handler) {
			var eventHandle, events, handlers;
			//事件缓存 数据对象
			var elemData = data_priv.get(elem);


			//检测handler是否存在ID(guid)如果没有那么传给他一个ID
			//添加ID的目的是 用来寻找或者删除相应的事件
			if (!handler.guid) {
				handler.guid = jQuery.guid++; //guid == 1
			}
			/*
			给缓存增加事件处理句柄
			elemData = {
			  events:
			  handle:	
			}
			*/
			//同一个元素,不同事件,不重复绑定    {events:{}}
			if (!(events = elemData.events)) {
				events = elemData.events = {};
			}
			if (!(eventHandle = elemData.handle)) {
				//Event 对象代表事件的状态 通过apply传递
				eventHandle = elemData.handle = function(e) {
					return jQuery.event.dispatch.apply(eventHandle.elem, arguments);
				}
			}
			eventHandle.elem = elem;
			//通过events存储同一个元素上的多个事件   {events:{click:[]}}   
			if (!(handlers = events[type])) {
				handlers = events[type] = [];
				handlers.delegateCount = 0; //有多少事件代理默认0
			}
			handlers.push({
				type: type,
				handler: handler,
				guid: handler.guid,
			});
			//添加事件
			if (elem.addEventListener) {
				elem.addEventListener(type, eventHandle, false);
			}
		},

		//修复事件对象event 从缓存体中的events对象取得对应队列。
		dispatch: function(event) {
			//IE兼容性处理如：event.target or event.srcElement
			//event = jQuery.event.fix(event);

			//提取当前元素在cache中的events属性值。 click
			var handlers = (data_priv.get(this, "events") || {})[event.type] || [];
			event.delegateTarget = this;
			var args = [].slice.call(arguments);
			
			//执行事件处理函数
			jQuery.event.handlers.call(this,handlers, args);
		},

		//执行事件处理函数
		handlers: function(handlers, args) {   //[event , 自定义参数]
			handlers[0].handler.apply(this, args);
		},

		fix: function(event) {
			if (event[jQuery.expando]) {
				return event;
			}
			// Create a writable copy of the event object and normalize some properties
			var i, prop, copy,
				type = event.type,
				originalEvent = event,
				fixHook = this.fixHooks[type];

			if (!fixHook) {
				this.fixHooks[type] = fixHook =
					rmouseEvent.test(type) ? this.mouseHooks :
					rkeyEvent.test(type) ? this.keyHooks : {};
			}
			copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;

			event = new jQuery.Event(originalEvent);

			i = copy.length;
			while (i--) {
				prop = copy[i];
				event[prop] = originalEvent[prop];
			}

			// Support: Cordova 2.5 (WebKit) (#13255)
			// All events should have a target; Cordova deviceready doesn't
			if (!event.target) {
				event.target = document;
			}

			// Support: Safari 6.0+, Chrome < 28
			// Target should not be a text node (#504, #13143)
			if (event.target.nodeType === 3) {
				event.target = event.target.parentNode;
			}

			return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
		},
		special: {
			load: {
				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {
				// 执行默认focus方法
				trigger: function() {
					if (this !== safeActiveElement() && this.focus) {
						//console.log( this.focus)
						this.focus();
						return false;
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function() {
					if (this === safeActiveElement() && this.blur) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {
				// For checkbox, fire native event so checked state will be right
				trigger: function() {
					if (this.type === "checkbox" && this.click && jQuery.nodeName(this, "input")) {
						this.click();
						return false;
					}
				},

				// For cross-browser consistency, don't fire native .click() on links
				_default: function(event) {
					return jQuery.nodeName(event.target, "a");
				}
			},

			beforeunload: {
				postDispatch: function(event) {

					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if (event.result !== undefined) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		},

		//event:  规定指定元素上要触发的事件,可以是自定义事件,或者任何标准事件。
		//data:  传递到事件处理程序的额外参数。
		//elem:  Element对象
		trigger: function(event, data, elem) {
			var i, cur, tmp, bubbleType, ontype, handle,
				i = 0,
				eventPath = [elem || document], //规划冒泡路线
				type = event.type || event,
				cur = tmp = elem = elem || document,
				//证明是ontype绑定事件
				ontype = /^\w+$/.test(type) && "on" + type;

			//模拟事件对象	如果有jQuery.expando说明event已经是模拟的事件对象
			event = event[jQuery.expando] ?
				event :
				new jQuery.Event(type, typeof event === "object" && event);
			//console.log(event);

			//定义event.target 属性
			if (!event.target) {
				event.target = elem;
			}
			console.log(data);
			//如果没有传入了参数,就把event存储在数组中 有传递合并数组
			//如之前所看到：data可选,传递到事件处理程序的额外参数。注意:事件处理程序第一个参数默认是event(此为出处)
			data = data == null ? [event] :
				jQuery.markArray(data, [event]);
			console.log(data);
             
			//事件类型是否需要进行特殊化处理   focus
			special = jQuery.event.special[type] || {};
			//如果事件类型已经有trigger方法，就调用它
			if (special.trigger && special.trigger.apply(elem, data) === false) {
				return;
			}
			//自己已经在冒泡路线中 不重复添加
			cur = cur.parentNode;
			//查找当前元素的父元素 添加到eventPath (规划冒泡路线)数组中
			for (; cur; cur = cur.parentNode) {
				eventPath.push(cur);
				tmp = cur;
			}

			if (tmp === (elem.ownerDocument || document)) { //当tmp为document时,cur为空,就退出循环
				eventPath.push(tmp.defaultView || tmp.parentWindow || window); //模拟冒泡到window对象
			}
			//console.log(eventPath);

			//沿着上面规划好的冒泡路线，把经过的元素节点的指定类型事件的回调逐一触发执行
			while ((cur = eventPath[i++])) {
				//先判断在缓存系统中是否有此元素绑定的此事件类型的回调方法，如果有，就取出来	
				handle = (data_priv.get(cur, "events") || {})[event.type] && data_priv.get(cur, "handle");
				if (handle) {
					console.log(handle)
                    handle.apply(cur, data);
				}
			}
		},
	}

    //模拟Event对象
	jQuery.Event = function(src, props) {
		//创建一个jQuery.Event实例对象
		if (!(this instanceof jQuery.Event)) {
			return new jQuery.Event(src, props);
		}
		//事件类型
		this.type = src;
		// 如果传入事件没有时间戳，则创建时间戳
		this.timeStamp = src && src.timeStamp || jQuery.now();
		// jQuery.Event实例对象标记
		this[jQuery.expando] = true;
	}

	jQuery.Event.prototype = {
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
		//取消事件的默认动作
		preventDefault: function() {
			var e = this.originalEvent;

			this.isDefaultPrevented = returnTrue;

			if (e && e.preventDefault) {
				e.preventDefault();
			}
		},
		// 方法阻止事件冒泡到父元素,阻止任何父事件处理程序被执行。
		stopPropagation: function() {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if (e && e.stopPropagation) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function() {
			this.isImmediatePropagationStopped = returnTrue;
			this.stopPropagation();
		}
	};

	jQuery.fn.extend({
		each: function(callback, args) {
			return jQuery.each(this, callback, args);
		},

		on: function(types, fn) {
			var type;
			if (typeof types === "object") {
				for (type in types) {
					this.on(types[type], fn);
				}
			}
			return this.each(function() {
				//this  element对象
				jQuery.event.add(this, types, fn);
			});
		},
		//语法: data可选,传递到事件处理程序的额外参数。  注意:事件处理程序第一个参数默认是event
		trigger: function(type, data) {
			return this.each(function() {
				// type 为focus
				// data为要传递的数据
				jQuery.event.trigger(type, data, this);
			});
		},
	})

	function createOptions(options) {
		var object = optionsCache[options] = {};
		options.split(/\s+/).forEach(function(value) {
			object[value] = true;
		});
		return object;
	}

	root.$ = root.jQuery = jQuery;
})(this);
