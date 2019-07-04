(function(root){
    var optionsCache = {};
    var _ = {
        callbacks: function(option) {
            var options = typeof option === 'string' ? (optionsCache[option] || createOptions(option)) : {};
            var list = [];
            var testing, memory, start, starts;
            // console.log(Object.keys(optionsCache));
            var fire = function(data) {
                var length = list.length;
                var index = starts || 0;
                testing = true;
                // memory = options.memory;
                // 如此就能取到上下文及fire的arguments了
                memory = options.memory && data;
                for(;index < length; index++) {
                    // if (list[index](data[1]) === false && options.stopOnfalse) {
                    //     break;
                    // }
                    if (list[index].apply(data[0], data[1]) === false && options.stopOnfalse){
                        memory = false;
                        break;
                    };
                } 
            }

            var self = {
                add: function(fn) {
                    start = list.length;
                    if (toString.call(fn) === '[object Function]') {
                        list.push(fn);
                    }
                    if(memory){
                        starts = start;
                        // 这里就不能用到上次fire的arguments 是否有设计缺陷 ？？？
                        // self.fire();
                        // 修改为如下
                        // 此时memory为[context, args]; 
                        // 修改为此 就不受once限制 once之后仍可以执行
                        fire(memory);
                    }
                    return this;
                },
                fireWith: function(context, args) {
                    // 这里的context有什么用，应该是需要在fn执行的时候绑定用  ？？？
                    // 可是这里的this就是self没啥用，什么情况下这个context才是有用的呢
                    // 函数执行之后保留各自的this，似乎还是没啥用，对于函数执行来说无差别
                    var param = [context, args];
                    // 首次执行 !testing为true 即不管once是否为true都执行
                    // 二次执行 !testing为false 即根据once判断是否执行 once为false 执行 once为true 不执行
                    if (!options.once || !testing) {
                        fire(param);
                    }
                    return this;
                },
                fire: function() {
                    self.fireWith(this, arguments);
                    return this;
                },
            }
            return self;
        }
    }

    function createOptions(option){
        
        // var options = option.split(/\s+/);
        // options.forEach(function(op) {
        //     optionsCache[op] = true;
        // })
        // return optionsCache;
        // 自己写的optionsCache理解有误
        // 修改为如下
        var object = optionsCache[option] = {};
		option.split(/\s+/).forEach(function(value) {
			object[value] = true;
        });
        // console.log(object, optionsCache);
		return object;
    }

    root._ = _;
})(this);