(function($){
    var ITEM_CLASS = 'validator-item';
    var INPUT_CLASS = 'validator-input';
    var ERROR_CLASS = 'validator-error';
    var _t = {
        isObject: function(obj) {
            var type = typeof obj;
            return type === 'function' || type === 'object' && !!obj;
        },
    };
    ['Arguments', 'Function', 'Array', 'String', 'Number', 'Boolean', 'Date', 'RegExp'].forEach(function(key) {
        _t[`is${key}`] = function(obj) {
            return toString.call(obj) === '[object ' + key + ']';
        }
    });
    _t.isEmpty = function(obj) {
        var keys = [];
        if (obj === null) return true;
        if (_t.isArray(obj) || _t.isString(obj) || _.isArguments(obj)) return obj.length === 0;   
        if (_t.isObject(obj)) {
            for(var key in obj){
                keys.push(key);
            }
            return keys.length === 0;
        }
    }

    var defTip = '请输入正确格式';
    var defTips = {
        required: function(label) {
            return label ? `${label}不能为空` : '必填项';
        },
        minlength: function(label, length) {
            return label ? `${label}不能小于${length}位` : `该项输入值不能小于${length}位数`;
        },
        maxlength: function(label, length) {
            return label ? `${label}不能大于${length}位` : `该项输入值不能大于${length}位数`;
        }
    };
    ['idcard', 'mobile', 'email'].forEach(function(key) {
        defTips[key] = function(label) {
            return label ? `请输入正确的${label}格式` : defTip;
        }
    });

    var strategies = {
        required: function(value) {
            return !_t.isEmpty(value);
        },
        minlength: function(value, length) {
            return value.length >= length;
        },
        maxlength: function(value, length) {
            return value.length <= length;
        },
        idcard: function(value) {
            var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
            return reg.test(value);
         },
        mobile: function(value) {
            var reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
            return reg.test(value);
        },
        email: function(value) {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            return reg.test(value);
        },
    }

    function Validator(config) {
        this.$wrapper = config.$wrapper;
        this.caches = {};
        this.actions = {};
        this.itemClass = config.itemClass || ITEM_CLASS;
        this.inputClass = config.inputClass || INPUT_CLASS;
        this.errorClass = config.errorClass || ERROR_CLASS;
        this.config = config;
        this.showError = this.showErrorHandle();
        this.hideError = this.hideErrorHandle();
        if (config.event) {
            this.bindEvent(config.event);
        }
    }

    Validator.prototype = {
        // 绑定触发事件
        bindEvent: function(event) {
            var me = this;
            me.$wrapper.on(event, `.${me.itemClass} .${me.inputClass}`, function(e) {
                var $ip = $(e.target);
                var key = $ip.attr('name');
                me.validate(key);
            });
            me.$wrapper.on('focus', `.${me.itemClass} .${me.inputClass}`, function(e) {
                var $ip = $(e.target);
                var key = $ip.attr('name');
                me.hideError(key);
            });
        },
        // 获取需要验证的规则
        getValidate: function(rules) {
            var me = this;
            var _cache = rules ? {} : me.actions;
            // 参数为字符串时
            if (_t.isString(rules)) {
                _cache[rules] = me.actions[rules];
            // 参数为数组时
            } else if (_t.isArray(rules)) {
                rules.forEach(function(key) {
                    if (!me.actions[key]) return;
                    _cache[key] = me.actions[key];
                });
            // 参数为对象时
            } else if (_t.isObject(rules)) {
                for (var i in rules) {
                    if (!me.actions[i]) continue;
                    _cache[i] = _cache[i] || {};
                    if (_t.isString(rules[i]) && me.actions[i][rules[i]]) {
                        _cache[i][rules[i]] = me.actions[i][rules[i]];
                        continue;
                    }
                    rules[i].forEach(function(j) {
                        if (me.actions[i][j]) {
                            _cache[i][j] = me.actions[i][j];
                        };
                    })
                }
            }
            return _cache;
        },
        // 验证指定的规则
        validate: function(rules) {
            var me = this;
            var valid = true;
            var _cache = me.getValidate(rules);
            me.errors = {};
            for (var key in _cache) {
                for(var inkey in _cache[key]){
                    var validatorFunc = _cache[key][inkey];
                    var _result = validatorFunc();
                    if (!_result) {
                        valid = false;
                        var _tip = me.caches[key].tips[inkey] || defTip;
                        me.errors[key] =  me.errors[key] || [];
                        me.errors[key].push(_tip);
                        break;
                    }
                }
            }
            // 错误处理
            me.showError();
            return valid;
        },
        /**
         * 添加要验证的规则到缓存区
         * @param {Object Object} rules 
         * {
         *  username: {
         *      key: {String}
         *      rule: {String || Array || Object}
         *      label: {String}
         *  }
         * }
         */
        add: function(rules) {
            var me = this;
            me.caches = rules;

            for (var key in rules){
                var rule = rules[key];
                !(me.actions[key]) && (me.actions[key] = {});
                var action = me.actions[key];
                var rls = rule.rule;

                rule.$input = rule.$input || me.$wrapper.find(`[name=${key}]`);

                if (_t.isString(rls)) {
                    me.setValidate(rule, action, rls);
                } else if (_t.isArray(rls)) {
                    rls.forEach(function(rl) {
                        me.setValidate(rule, action, rl, [value]);
                    })
                } else if (_t.isObject(rls)) {
                    for(var k in rls) {
                        me.setValidate(rule, action, k);
                    }
                }
                
            }
        },
        // 添加验证函数到缓存区
        setValidate: function(rule, action, key) {
            var _tips = rule.tips = rule.tips || {};
            var _valid = action = action || {};
            _tips[key] = _tips[key] || defTips[key] && defTips[key](rule.label, rule.rule[key]) || defTip;
            _valid[key] = _valid[key] || function() {
                var value = rule.$input[0].value;
                var args = [value];
                !_t.isBoolean(rule.rule[key]) && args.push(rule.rule[key]);
                return strategies[key].apply(null, args);
            }
        },
        // 展示错误函数处理 用默认还是自定义的
        showErrorHandle: function() {
            return this.config.showError && _t.isFunction(this.config.showError) ? 
            this.config.showError : 
            this.showError();
        },
        // 展示错误
        showError: function() {
            var me = this;
            function show(ky) {
                var $tg = me.$wrapper.find(`[name=${ky}]`);
                var $item = $tg.closest(`.${me.itemClass}`);
                var $error = $item.find(`.${me.errorClass}`);
                if ($error.length) {
                    $error.html(me.errors[ky].join('，'));
                    $error.show();
                } else {
                    $item.append(`<span class="${me.errorClass}">${me.errors[ky].join('，')}</span>`);
                }
            }
            return function(key) {
                if (key) {
                    show(key);
                    return;
                }
                for(var k in me.errors) {
                    show(k);
                }
            }
        },
        // 隐藏错误函数处理 用默认还是自定义的
        hideErrorHandle: function() {
            return (this.config.hideError) && _t.isFunction(this.config.hideError) ? 
            this.config.hideError : 
            this.hideError; 
        },
        // 隐藏错误
        hideError: function(key) {
            var me = this;
            var selector = key ? `[data-key="${key}"] .${me.errorClass}` : `.${me.errorClass}`;
            var $errors = me.$wrapper.find(selector);
            $errors.hide();
        },
    }

    $.fn.extend({
        // 获取节点上的所有attribute
        getAttrs: function() {
            var elem = this[0];
            var attrs = {};
            if (elem.hasAttributes()) {
                var _attrs = elem.attributes;
                for (var i = 0, j = _attrs.length; i < j; i++){
                    attrs[_attrs[i].name] = _attrs[i].value;
                }
            }
            return attrs;
        },
        // 获取跟规则相关的attribute
        getRuleAttrs: function() {
            // 需要值得规则
            var rules1 = ['minlength', 'maxlength']
            // 不需要值得规则
            var rules2 = ['required', 'email', 'mobile', 'idcard'];
            var attrs = this.getAttrs();
            var rAttrs = {};
            var len = 0;
            for(var key in attrs) {
                if (rules1.indexOf(key) > -1) {
                    rAttrs[key] = parseFloat(attrs[key]);
                    len++;
                } else if(rules2.indexOf(key) > -1) {
                    rAttrs[key] = true;
                    len++;
                }
            }
            // 设置不可枚举的length属性
            Object.defineProperty(rAttrs, 'length', {
                value: len,
                enumerable: false,
                configurable: true,
                writable: true,
            })
            return rAttrs;
        },
        // 获取节点上的validator验证配置
        getRules: function() {
            var itemClass = this.options.itemClass || ITEM_CLASS;
            var $items = this.find(`.${itemClass}`);
            var $item, $input, key, attrs;
            var rules = {}, rule = {};
            for(var i = 0, j = $items.length; i < j; i++) {
                $item = $items.eq(i);
                key = $item.data('key');
                $input = $item.find(`[name="${key}"]`);
                if (!$input.length) continue;
                attrs = $input.getRuleAttrs();
                rule = {
                    key: key,
                    label: $input.data('label'),
                    rule: attrs.length === 1 && _t.isBoolean(attrs[Object.keys(attrs)[0]]) ? Object.keys(attrs)[0] : attrs,
                    $input: $input,
                }
                rules[key] = rule;
            }
            return rules;
        },
    })

    $.fn.validator = function(options) {
        this.options = options;
        options.$wrapper = this;
        // 如果用户配置了使用用户配置的，没有则自动获取dom上的配置
        var rules = options && options.rules || this.getRules();
        var _validator = new Validator(options);
        _validator.add(rules);
        return _validator;
    }

})(jQuery)