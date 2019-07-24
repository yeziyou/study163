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
		for (var index = 0; index < length; index++, start += step) {
			range[index] = start;
		}
		return range;
	};

	//摊平数组
	var flatten = function(array, shallow) {
		var ret = [];
		var index = 0;
		for (var i = 0; i < array.length; i++) {
			var value = array[i]; //展开一次
			if (_.isArray(value) || _.isArguments(value)) {
				//递归全部展开
				if (!shallow) {
					value = flatten(value, shallow);
				}
				var j = 0,
					len = value.length;
				ret.length += len;
				while (j < len) {
					ret[index++] = value[j++];
				}
			} else {
				ret[index++] = value;
			}
		}
		return ret;
	}

	_.flatten = function(array, shallow) {
		return flatten(array, shallow);
	}

	//返回数组中除了最后一个元素外的其他全部元素。 在arguments对象上特别有用。
	_.initial = function(array, n) {
		return slice.call(array, 0, Math.max(0, array.length - (n == null ? 1 : n)));
	};

	//返回数组中除了第一个元素外的其他全部元素。传递 n 参数将返回从n开始的剩余所有元素
	_.rest = function(array, n, guard) {
		return slice.call(array, n == null ? 1 : n);
	};

	// 返回一个 [min, max] 范围内的任意整数
	_.random = function(min, max) {
		if (max == null) {
			max = min;
			min = 0;
		}
		// 3-6  3    0-1*4  !0 !4
		return min + Math.floor(Math.random() * (max - min+1));
	};

	//确定集合是应该作为数组还是作为对象进行迭代。
	var isArrayLike = function(obj) {
		var length = obj.length;
		return typeof length == 'number' && length >= 0;
	};
	
	_.clone = function(obj) {
		return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	};
   
   //返回乱序之后的数组副本
   _.shuffle = function(array){
	   //array.length
	   return _.sample(array,Infinity);
   }
   //抽样函数  10  11 
   _.sample = function(array, n){
	   if(n == null){
		  return  array[_.random(array.length-1)];
	   }
	   var sample = _.clone(array);
	   var length = sample.length;
	   var last = length-1;
	   n = Math.max(Math.min(n, length),0);
	   for(var index = 0; index<n; index++){
		   //随机数   index  n
		   var rand = _.random(index, last);
		   var temp = sample[index];
		   sample[index] = sample[rand];   //交换
		   sample[rand] = temp;  //交换
	   }
	   return sample.slice(0, n);
   }
	
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

	_.each(["Function", "String", "Object", "Number", "Boolean", "Arguments"], function(name) {
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
