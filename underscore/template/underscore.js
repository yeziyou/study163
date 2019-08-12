(function(root){
    var _ = function(obj) {
		if (obj instanceof _) {
			return obj;
		}

		if (!(this instanceof _)) {
			return new _(obj);
		}
		this._wrapped = obj;
    }

    _.isObject = function(obj) {
		var type = typeof obj;
		return type === "function" || type === "object";
	}
    var hasEnumbug = ({
		toString: null
	}).propertyIsEnumerable("toString"); //正常浏览器 => true
    //获取object对象上所有属性的名称(自身+原型链可枚举的属性) 
    _.allKeys = function(obj) {
        var prop;
        if (!_.isObject(obj)) {
            return []
        };
        var result = [];
        for (var key in obj) {
            result.push(key);
        }
        //IE>9  bug
        if (!hasEnumbug) {
            for (var i = 0, length = colletNotEnumProps.length; i < length; i++) {
                prop = colletNotEnumProps[i];
                if (obj[prop] !== obj.__proto__[prop]) {
                    result.push(prop);
                }
            }
        }
        return result;
    }

    var createAssigner = function(func) {
		return function(obj) {
			var length = arguments.length;
			if (length < 2 || obj == null) {
				return obj
			};

			for (var i = 1; i < length; i++) {
				var source = arguments[i];
				var keys = func(source); //data
				var len = keys.length;
				for (var j = 0; j < len; j++) {
					var key = keys[j]; //data
					obj[key] = source[key]; //
				}
			}
			return obj;
		}
	}

	//jQuery  extend   对象扩展  $.extend({}, object1, object2);    for in
    _.extend = createAssigner(_.allKeys); //自身对象+原型链上可枚举的属性
    
    _.template = function(templateString, setting){
        var RULES = {
            interpolate: /<%=([\s\S]+?)%>/g,
            escape: /<%=([\s\S]+?)%>/g,
            expression: /<%([\s\S]+?)%>/g,
        }
        setting = _.extend({}, RULES, setting);
        var matcher = new RegExp([
            setting.interpolate.source,
            setting.escape.source,
            setting.expression.source
        ].join('|') + '|$', 'g');

        var source = "_p+='";
        var index = 0;
        templateString.replace(matcher, function(match, interpolate, escape, expression, offset) {
            source += templateString.slice(index, offset).replace(/\n/g, '\\n');
            index = offset + match.length;
            if (interpolate) {
                source += "'+\n((_t="+interpolate+") == null?'':_t)+\n'"; 
            } else if (escape) {

            } else if (expression) {
                source += "';\n" + expression + ";\n_p+='";
            }
        });
        // source += templateString.slice(index, templateString.length).replace(/\n/g, '\\n');
        source += "';";
        source = "with(obj){\n" + source + "}\n";
        source = "var _t,_p='';\n" + source + "return _p;\n";
        console.log(source);
        var render = new Function('obj', source);

        return function(data) {
            return render.call(null, data);
        }
    }

    root._ = _;

})(window);