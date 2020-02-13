# CSS3多列布局
## 1.columns属性
* column-count: 定义列的数量
    * auto: 列的数量由其他css属性决定
    * number: 定义列的数量
* column-width: 定义列的宽度
    * auto
    * length
* column-gap: 定义列的间距
    * normal
    * length
* column-rule: 列的边框
    * column-rule-width: 列与列之间的边框宽度
    * column-rule-color: 列与列之间的边框颜色
    * column-rule-style: 列与列之间的边框样式
* column-span: 定义列元素是否跨列
    * none: 不跨列
    * all: 表示元素跨所有列
* column-fill: 定义列的高度是由内容决定，还是统一高度
    * auto: 列高度由内容决定
    * balance: 列高度以内容最多的一列高度为准
```css
.parent {
    column-width: 25%;
    column-count: 4;
    column-gap: 10px;
    /* column-rule-width: 5px;
    column-rule-color: red;
    column-rule-style: dotted; */
    column-rule: 5px red dotted;
}

.col {
    height: 300px;
    background: green;
}

.col2 {
    height: 300px;
    background: gray;
    column-span: all;
}
```
```html
<div class="parent">
    <div class="col"></div>
    <div class="col"></div>
    <div class="col"></div>
    <div class="col"></div>
</div>
<div class="parent">
    <div class="col2"></div>
</div>
``` 