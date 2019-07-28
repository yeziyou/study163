## lazyload

### 用法
``` html
<script src="jquery-2.0.3.js"></script>
<script src="lazyload.js"></script>
<script>
    $('.lazy-demo').lazyload({
        // root: $('.lazy-wrapper')[0],
        threshold: 1,  //为了看清楚懒加载的效果，设置元素需要完全进入视窗才加载
        // rootMargin: '30%',
        onLoad: function(entry) {
            $(entry.target).css('height', 'auto');
        }
    });
</script>
```

### 参数
#### 参数config {Object} 
| 参数 | 描述| 类型 | 默认值 | 备注
| --- | --- | ------| ----- |---|
| selector | 需要懒加载目标元素的选择器 | String | img |
| root | 容器元素，滚动视窗元素 | element | window |
| threshold | 容器元素与目标元素的相交程度 | Number | 0.25 | 值范围 [0 - 1]
| rootMargin | 控制容器元素的收缩扩张 | String | '0px' | 值可以为 '10px' || '10%'
| onLoad | 目标元素加载后回调 | Function | 无 | |


### [查看示例](./index.html)

