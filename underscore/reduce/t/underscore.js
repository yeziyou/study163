(function(root) {
	var push = Array.prototype.push;

	var _ = function(obj) {
		if (obj instanceof _) {
			return obj;
		}

		if (!(this instanceof _)) {
			return new _(obj);
		}
		this._wrapped = obj;
	}

	_.unique = function(arr, callback) {
		var ret = [];
		var target, i = 0;
		for (; i < arr.length; i++) {
			var target = callback ? callback(arr[i]) : arr[i];
			if (ret.indexOf(target) === -1) {
				ret.push(target);
			}
		}

		return ret;
	}

	//开启链接式的调用
	_.chain = function(obj) {
		var instance = _(obj);
		instance._chain = true;
		return instance;
	}

	//辅助函数    obj   数据结果
	var result = function(instance, obj) {
		return instance._chain ? _(obj).chain() : obj;
	}

	_.prototype.value = function() {
		return this._wrapped;
	}

	_.functions = function(obj) {
		var result = [];
		var key;
		for (key in obj) {
			result.push(key);
		}
		return result;
	}

	_.map = function(obj, iteratee, context) {
		//生成不同功能迭代器
		var iteratee = cb(iteratee, context);
		//分辨 obj是数组对象, 还是object对象
		var keys = !_.isArray(obj) && Object.keys(obj);
		var length = (keys || obj).length;
		var result = Array(length);

		for (var index = 0; index < length; index++) {
			var currentKey = keys ? keys[index] : index;
			result[index] = iteratee(obj[currentKey], index, obj);
		}

		return result;
	}

	var cb = function(iteratee, context, count) {
		if (iteratee == null) {
			return _.identity;
		}

		if (_.isFunction(iteratee)) {
			return optimizeCb(iteratee, context, count);
		}
	}

	//optimizeCb优化迭代器
	var optimizeCb = function(func, context, count) {
		if (context == void 0) {
			return func;
		}

		switch (count == null ? 3 : count) {
			case 1:
				return function(value) {
					return func.call(context, value);
				};
			case 3:
				return function(value, index, obj) {
					return func.call(context, value, index, obj);
				};
			case 4:
				return function(memo, value, index, obj) {
					return func.call(context, memo, value, index, obj);
				};
		}
	}

	_.identity = function(value) {
		return value;
	}

	// rest 参数
	_.restArguments = function(func) {
		//rest参数位置
		var startIndex = func.length - 1;
		return function() {
			var length = arguments.length - startIndex,
				rest = Array(length),
				index = 0;
			// rest数组中的成员
			for (; index < length; index++) {
				rest[index] = arguments[index + startIndex];
			}
			//非rest参数成员的值一一对应
			var args = Array(startIndex + 1);
			for (index = 0; index < startIndex; index++) {
				args[index] = arguments[index];
			}

			args[startIndex] = rest;
			return func.apply(this, args);
		}
	}

	var Ctor = function() {};

	//Object.create polyfill
	var baseCreate = function(prototype) {
		if (!_.isObject(prototype)) return {};
		if (Object.create) return Object.create(prototype);
		Ctor.prototype = prototype;
		var result = new Ctor;
		Ctor.prototype = null;
		return result;
	};

	var createReduce = function(dir) {
		//累加
		var reduce = function(obj, iteratee, memo, init) {
			var keys = !_.isArray(obj) && Object.keys(obj),
				length = (keys || obj).length,
				index = dir > 0 ? 0 : length - 1;
			if (!init) {
				memo = obj[keys ? keys[index] : index];
				index += dir; //1   
			};
			for (; index >= 0 && index < length; index += dir) {
				var currnteKey = keys ? keys[index] : index;
				memo = iteratee(memo, obj[currnteKey], currnteKey, obj)
			}
			return memo;
		}
		//memo  最终能累加的结果     每一次累加的过程
		return function(obj, iteratee, memo, context) {
			var init = arguments.length >= 3;
			return reduce(obj, optimizeCb(iteratee, context, 4), memo, init);
		}
	}
	_.reduce = createReduce(1); //1 || -1

	//predicate  真值检测(重点: 返回值)
	_.filter = _.select = function(obj, predicate, context) {
		var results = [];
		predicate = cb(predicate, context);
		_.each(obj, function(value, index, list) {
			if (predicate(value, index, list)) results.push(value);
		});
		return results;
	};


	_.each = function(target, callback) {
		var key, i = 0;
		if (_.isArray(target)) {
			var length = target.length;
			for (; i < length; i++) {
				callback.call(target, target[i], i);
			}
		} else {
			for (key in target) {
				callback.call(target, key, target[key]);
			}
		}

	}
	/*
      createReduce  工厂函数生成reduce 
     */
	var createReduce = function(dir) {
		//累加
		var reduce = function(obj, iteratee, memo, init) {
			var keys = !_.isArray(obj) && _.keys(obj),
				length = (keys || obj).length,
				index = dir > 0 ? 0 : length - 1; //确定累加的方向
			if (!init) {
				memo = obj[keys ? keys[index] : index];
				index += dir;
			};
			for (; index >= 0 && index < length; index += dir) {
				var currnteKey = keys ? keys[index] : index;
				memo = iteratee(memo, obj[currnteKey], currnteKey, obj)
			}
			return memo;
		}
		//memo  第一次累加的时候初始化的值 || 数组数据中下标为0的值
		return function(obj, iteratee, memo, context) {
			var init = arguments.length >= 3;
			return reduce(obj, optimizeCb(iteratee, context, 4), memo, init);
		}
	}
	_.reduce = createReduce(1);

	//类型检测
	_.isArray = function(array) {
		return toString.call(array) === "[object Array]";
	}

	_.each(["Function", "String", "Object", "Number"], function(name) {
		_["is" + name] = function(obj) {
			return toString.call(obj) === "[object " + name + "]";
		}
	});

	//mixin  
	_.mixin = function(obj) {
		_.each(_.functions(obj), function(name) {
			var func = obj[name];

			_.prototype[name] = function() {
				var args = [this._wrapped];
				push.apply(args, arguments);
				// instance      去重之后的结果
				return result(this, func.apply(this, args));
			}
		});
	}

	_.mixin(_);
	root._ = _;
})(this);
