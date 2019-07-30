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
        this.errorHandle = this.errorHandle();
        this.resetError = this.resetError();
        if (config.event) {
            this.bindEvent(config.event);
        }
    }

    Validator.prototype = {
        bindEvent: function(event) {
            var me = this;
            me.$wrapper.on(event, `.${me.itemClass} .${me.inputClass}`, function(e) {
                var $ip = $(e.target);
                var key = $ip.attr('name');
                me.validate(key);
            });
            me.$wrapper.on('focus', `.${me.itemClass} .${me.inputClass}`, function(e) {
                var $ip = $(e.target);
                $ip.closest(`.${me.itemClass}`).find(`.${me.errorClass}`).hide();
            });
        },
        errorHandle: function() {
            return this.config.errorHandle && _t.isFunction(this.config.errorHandle) ? this.config.errorHandle : this.showErrors;
        },
        showErrors: function() {
            var me = this;
            for(var key in me.errors) {
                me.showError(key);
            }
        },
        showError: function(key) {
            var me = this;
            var $tg = me.$wrapper.find(`[name=${key}]`);
            var $item = $tg.closest(`.${me.itemClass}`);
            var $error = $item.find(`.${me.errorClass}`);
            if ($error.length) {
                $error.html(me.errors[key].join('，'));
                $error.show();
            } else {
                $item.append(`<span class="${me.errorClass}">${me.errors[key].join('，')}</span>`);
            }
        },
        resetError: function() {
            return (this.config.resetError) && _t.isFunction(this.config.resetError) ? this.config.resetError : this.reset; 
        },
        reset: function() {
            var me = this;
            var $errors = me.$wrapper.find(`.${me.errorClass}`);
            $errors.hide();
        },
        getValidate: function(rules) {
            var me = this;
            var _cache = rules ? {} : me.actions;
            if (_t.isString(rules)) {
                _cache[rules] = me.actions[rules];
            } else if (_t.isArray(rules)) {
                rules.forEach(function(key) {
                    if (!me.actions[key]) return;
                    _cache[key] = me.actions[key];
                });
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
            me.errorHandle();
            return valid;
        },
        /**
         * 
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
                    me.setValid(rule, action, rls);
                } else if (_t.isArray(rls)) {
                    rls.forEach(function(rl) {
                        me.setValid(rule, action, rl, [value]);
                    })
                } else if (_t.isObject(rls)) {
                    for(var k in rls) {
                        me.setValid(rule, action, k);
                    }
                }
                
            }
        },
        setValid: function(rule, action, key) {
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
        getValue: function(elem) {
            return elem.value;
        },
    }

    $.fn.extend({
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
        getRuleAttrs: function() {
            var rules1 = ['minlength', 'maxlength']
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
            Object.defineProperty(rAttrs, 'length', {
                value: len,
                enumerable: false,
                configurable: true,
                writable: true,
            })
            return rAttrs;
        },
        getRules: function() {
            var itemClass = this.options.itemClass || ITEM_CLASS;
            var $items = this.find(`.${itemClass}`);
            var $item, $input, label, key, attrs;
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
        var rules = options && options.rules || this.getRules();
        options.$wrapper = this;
        var _validate = new Validator(options);
        _validate.add(rules);
        return _validate;
    }

})(jQuery)