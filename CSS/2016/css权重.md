#### css权重
> 通用选择器（*） < 元素(类型)选择器 < 类选择器 < 属性选择器 < 伪类 < ID 选择器 <内联样式
* 元素，伪元素：+1
    * `:first-letter`
    * `:first-line`
    * `:before`
    * `:after`
    ```css
    p.article:first-letter
    {
        color: #FF0000;
    }
    ```
* 类，属性，伪类：+10
    * https://www.runoob.com/css/css-pseudo-classes.html
* id: +100
* 内联样式：+1000
