## validator 表单验证

------
### 使用要求
* 表单项必须放在一个容器中，由容器调用validator()

* 其中 "validator-item" "validator-input" "validator-error"可根据自己需要配置 并在dom中保持一致

* 每项表单item上必须有data-key

* 每项表单input上必须有name值 

* name和data-key的值一致

示例如下：
``` html
<div class="validator-wrapper">
    <div class="validator-item" data-key="username">
        <label for="">姓 名:</label> 
        <input type="text" class="validator-input" name="username" data-label="姓名"  required="true" />
        <span calss="validator-error"></span>
    </div>
</div>    
```
------

### 用法
``` html
<script src="jquery-2.0.3.js"></script>
<script src="validator.js"></script>
<script>
    (function(){
        // $('.validator-form') 为表单容器
        var validator = $('.validator-form').validator({
            event: 'blur',
        });
        $('.btn-submit').on('click', function(e) {
            validator.validate();
        });
    })();
</script>
```
---------

### validator 参数

config `{Object}` 

| 参数 | 描述 | 类型 | 默认值 | 是否必填 | 备注 |
| --- | --- | --- | ----- | --- | ---- |
| event | 表单验证触发事件 | String | 无 | 否 | 没有设置时不会自动验证，需手动调用validate方法触发验证
| itemClass | 表单元素的父级节点的ClassName | String | validator-item | 否 | |
| inputClass | 表单元素的ClassName | String | validator-input | 否 | |
| errorClass | 错误展示节点的ClassName | String | validator-error | 否 | |
| showError | 自定义错误展示函数 | Function | 默认使用errorClass展示错误 | 否 | |
| hideError | 自定义错误隐藏函数 | Function | 默认使用errorClass重置错误 | 否 | |
| rules | 表单需要验证的信息配置 | Object | 无 | 否 |没有配置则自动获取dom节点上配置信息作为默认配置


config.rules `{Object Object}` 

| 参数 | 描述 | 类型 | 默认值 | 是否必填 | 备注 |
| --- | --- | --- | ----- | --- | --- |
| key | 每个表单节点对应的唯一key | String | 无 | 是 | |
| rule | 表单节点对应需要验证的规则 | String 或 Object | 无 | 是 | |
| label | 表单对应的描述 | String | 无 | 否 | 用于错误展示 |
``` js
// 参数示例
{   
    // 和item上的data-key值一致
    username: {  
        key: 'username',   // 和item上的data-key值一致
        rule: 'required',
        label: '姓名'
    },
    email: {
        key: 'email',
        rule: {
            require: true,  //验证必填
            email: true,    //验证邮箱
            minlength: 4,   //最少x位数
            maxlength: 6,   //最多x位数
            mobile: true,   //验证手机号
            idcard: true,   //验证身份证号
        },
        label: '邮件'
    },
}
```

-------------
-------------

### validator 方法

validator.validate(rules)调用验证方法

参数 rules `{String || Array || Object}` 需要验证的表单项目及对应的验证规则

* rules 为 String时，验证该项目下所有规则，如 值为'username',
* rules 为 Array时，验证Array中项目下的所有规则，如 值为['username', 'email']
* rules 为 Object时， 验证Object中项目下的指定规则， 如 值为{username: 'required', email: ['required', 'email']}
``` js
    var validator = $('.validator-form').validator();
    //验证username下所有规则
    validator.validate('username');  
    //验证username和email下所有规则
    validator.validate(['username', 'email']); 
    //验证username下的必填规则，验证email下的必填和邮箱格式规则
    validator.validate({username: 'required', email: ['required', 'email']});

``` 





