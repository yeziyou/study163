(function(root){
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

    //类型检测
	_.isArray = function(array) {
		return toString.call(array) === "[object Array]";
    }

    var createReduce = function(dir) {
        var reduce = function(obj, iteratee, memo, init) {
            var keys = !_.isArray(obj) && Object.keys(obj);
            var length = keys ? keys.length : obj.length;
            var index = dir > 0 ? 0 : length - 1;
            if (!init) {
                init = obj[keys ? keys[index] : index];
                dir += dir;
            }
            for (;index >= 0 && index < length; index += dir) {
                var currentKey = keys ? keys[index] : index;
                memo = iteratee(memo, obj[currentKey], currentKey, obj);
            }
            return memo;
        }
        return function(obj, iteratee, memo, context) {
            init = arguments.length >= 3;
            return reduce(obj, optimizeCb(iteratee, context, 4), memo, init);
        }
    }
    
    _.reduce = createReduce(1);
    
    root._ = _;
})(window);