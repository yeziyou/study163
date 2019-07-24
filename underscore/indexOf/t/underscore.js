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

	//数组去重
	_.uniq = _.unique = function(array, isSorted, iteratee, context) {
		// 没有传入 isSorted 参数
		if (!_.isBoolean(isSorted)) {
			context = iteratee;
			iteratee = isSorted;
			isSorted = false;
		}

		// 如果有迭代函数
		if (iteratee != null)
			iteratee = cb(iteratee, context);
		var result = [];
		// 用来过滤重复值
		var seen;

		for (var i = 0; i < array.length; i++) {
			var computed = iteratee ? iteratee(value, i, array) : array[i];
			// 如果是有序数组,则当前元素只需跟上一个元素对比即可
			// 用 seen 变量保存上一个元素
			if (isSorted) {
				if (!i || seen !== computed) result.push(computed);
				// seen 保存当前元素,供下一次对比
				seen = computed; //  1
			} else if (result.indexOf(computed) === -1) {
				result.push(computed);
			}
		}

		return result;
	};

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

	//去掉数组中所有的假值   _.identity = function(value){return value};
	_.compact = function(array) {
		return _.filter(array, _.identity);
	};


	// 返回某一个范围内的数值组成的数组 5   stop == 5      start === 0   step === 1
	_.range = function(start, stop, step) {
		if (stop == null) {
			stop = start || 0;
			start = 0;
		}

		step = step || 1; //2
		// 返回数组的长度  返回大于等于参数x的最小整数 向上取整 10/2  5
		var length = Math.max(Math.ceil((stop - start) / step), 0);
		// 返回的数组
		var range = Array(length);
		for (var index = 0; index < length; index++, start += step) { //1+2
			range[index] = start;
		}
		return range;
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

	// (dir === 1 => 从前往后找)  (dir === -1 => 从后往前找) 
	function createPredicateIndexFinder(dir) {
		return function(array, predicate, context) {
			predicate = cb(predicate, context);  // _.isNaN
			var length = array.length;
			// 根据 dir 变量来确定数组遍历的起始位置
			var index = dir > 0 ? 0 : length - 1;

			for (; index >= 0 && index < length; index += dir) {
				// 找到第一个符合条件的元素
				// 并返回下标值
				if (predicate(array[index], index, array))   //true
					return index;
			}
			return -1;
		};
	}
	_.findIndex = createPredicateIndexFinder(1);
	_.findLastIndex = createPredicateIndexFinder(-1);

	_.isNaN = function(obj) {   // NaN
		return _.isNumber(obj) && obj !== obj;
	};

	_.sortedIndex = function(array, obj, iteratee, context) {
		// 重点:cb函数 if (iteratee == null) {return function(value){return value;}}
		iteratee = cb(iteratee, context, 1);
		var value = iteratee(obj);
		var low = 0,
			high = array.length;
		// 二分查找
		while (low < high) {  //4  4 
			var mid = Math.floor((low + high) / 2);   //4
			if (iteratee(array[mid]) < value)    //  5 < 5
				low = mid + 1;  //4
			else
				high = mid;   //4
		}

		return low;     //4
	};

	function createIndexFinder(dir, predicateFind, sortedIndex) {
		// API 调用形式
		// _.indexOf(array, value, [isSorted])
		return function(array, item, idx) {
			var i = 0,
				length = array.length;
			// 第三个参数true用二分查找优化 否则 遍历查找
			if (sortedIndex && _.isBoolean(idx) && length) {
				// 能用二分查找加速的条件
				// 用 _.sortedIndex 找到有序数组中 item 正好插入的位置
				idx = sortedIndex(array, item);
				return array[idx] === item ? idx : -1;
			}

			//特殊情况 如果要查找的元素是 NaN 类型  NaN !== NaN
			if (item !== item) {
				idx = predicateFind(slice.call(array, i, length), _.isNaN);
				return idx >= 0 ? idx + i : -1;
			}

			// 非上述情况正常遍历
			for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
				if (array[idx] === item) return idx;
			}

			return -1;
		};
	}

	//_.findIndex  特殊情况下的处理方案  NAN  
	//_.sortedIndex 针对排序的数组做二分查找  优化性能
	_.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
    _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
	
	
	//类型检测
	_.isArray = function(array) {
		return toString.call(array) === "[object Array]";
	}

	_.each(["Function", "String", "Object", "Number", "Boolean"], function(name) {
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
