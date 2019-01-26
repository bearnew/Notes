## css世界读后感
### 1.长度单位(https://github.com/simaQ/cssfun/issues/1)
* 相对长度单位
    * 相对字体长度单位:
        ```
        em: 以父元素为参考对象
        rem：以根元素为参考对象
        ex：义为当前字体的小写x字母的高度或者 1/2 的 1em
        ch：定义为数字0的宽度
        ```
    * 相对视区长度单位
        ```vw, vh, vmin, vmax```
* 绝对长度单位
    ```px, pt(1pt＝1/72英寸，用于印刷业), cm(厘米), mm（毫米）, pt(相当于我国新四号铅字的尺寸)```
### 2.选择器
* 属性选择器
    指含有[]的选择器，eg:```[title]{}, [title="css-world"], [title~="css-world"], [title^="css-world"], [title$="css-world"]```
* 关系选择器
    * 相邻后代选择器：>
    * 兄弟选择器：～
    * 相邻兄弟选择器：+
### 3.css包裹性
* 文字少的时候会居中，文字多的时候会居左
```css
.box {
    text-align: center;
    .content {
        display: inline-block;
        text-align: left;
    }
}
```
### 4.超越!important，超越最大
* img的最后宽度为256px
```js
<img src="1.jpg" style="width: 480px !important;">
img { max-width: 256px }
```
* container的最后宽度为140px
```css
.container {
    min-width: 140px;
    max-width: 120px;
}
```
### 5.任意高度元素展开收起动画技术
* max-height太大，展开/收起的动画时间为```实际高度/max-height * transitionTime```, 并且收起会有动画延迟
```html
<input id="check" type="checkbox">
<div class="element">
    <p>display:table-cell其他一些应用，例如，两栏自适应布局，垂直居中效果等等都是可以通过其他技术手段模拟出来的，但是，根据列表个数自动等宽的效果，其他CSS是很难模拟的，尤其当需要兼容IE8浏览器的时候。</p>
</div>
<label for="check" class="check-in">更多↓/收起↑</label>
```
```css
.element {
    max-height: 0;
    overflow: hidden;
    transition: max-height 2s;
}
input {
    display: none;
}
input:checked ~ .element {
    max-height: 666px;
}
```
### 6.异步加载图片小技巧
```html
<img>
```
```css
img {
    visibility: hidden;
}
img[src] {
    visibility: visible;
}
```
阅读到 章节 3.4 页码 42
