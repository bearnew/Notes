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
        ```vw, vh, vmin(vw和vh较小的值), vmax（vw和vh较大的值）```
* 绝对长度单位
    ```px, pt(1pt＝1/72英寸，用于印刷业), cm(厘米), mm（毫米）, pt(相当于我国新四号铅字的尺寸)```
### 2.选择器
* 属性选择器
    指含有[]的选择器，eg:```[title]{}, [title="css-world"], [title~="css-world"], [title^="css-world"], [title$="css-world"]```
* 关系选择器
    * 相邻后代选择器：>
        ```css
        /* 父元素是 <div> 元素的每个 <p> 元素 */
        div>p {}
        ```
    * 兄弟选择器：～
        ```css
        /* 所有相同的父元素中位于 p 元素之后的所有 ul 元素 */
        p~ul {}
        ```
    * 相邻兄弟选择器：+
        ```css
        /* <div> 元素之后同级的紧跟的每个 <p> 元素 */
        div+p {}
        ``` 
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
### 7.幽灵空白节点
inline-block元素的所有解析和渲染就如同每个行框盒子的前面有一个“空白节点”一样
```html
<div>
    <span></span>
</div>
```
```css
div {
    background: red;
}
span {
    display: inline-block;
}
```

### 8.替换元素
* 1.```<img>, <object>, <video>, <iframe>, <textarea>, <input>```都是典型的替换元素
* 2.替换元素，内容的外观不受css的影响
* 3.有自己的尺寸
* 4.在很多css上都有自己的一套表现规则
* 4.vertical-align的默认值baseline被定义为x的下边缘,替换元素的基线被定义为元素的下边缘

### 9.图片加载
```html
<img>
```
```css
img:not([src]) {
    content: url(1.jpg);
}
```

### 10通过hover将图片变成另一张图片
```html
<img src="laugh.png">
```
```css
img:hover {
    content: url(laugh-tear.png)
}
```

### 11.通过content实现背景图片
```css
h1 {
    content: url(logo.png);
}
```

### 12.清除浮动
```css
.clear:after {
    content: '';
    display: table;
    clear: both;
}
```

### 13.兼容所有浏览器的两端对齐
```html
<div class="box">
    <span class="bar"></span>
    <span class="bar"></span>
    <span class="bar"></span>
    <span class="bar"></span>
</div>
```
```css
.box {
    width: 256px;
    height: 256px;
    text-align: justify;
}
.box:before {
    content: '';
    display: inline-block;
    height: 100%;
}
.box:after {
    content: '';
    display: inline-block;
    height: 100%;
}
.bar {
    display: inline-block;
    width: 20px;
}
```

### 14.css实现加载中效果
\A,\D实现换行效果

```html
<dot></dot>
```
```css
dot {
    display: inline-block;
    height: 1em;
    line-height: 1em;
    overflow: hidden;
}
dot::before {
    display: block;
    content: '...\A..\A.';
    white-space: pre-wrap; // 换行
    animation: dot 3s infinite step-start both;animation
}
@keyframes dot {
    33% {
        transform: translateY(-2em);
    }
    66% {
        transform: translateY(-1em);
    }
}
```

### 15.content attr属性值内容审查
```css
img:after {
    content: attr(alt);
}
.icon:before {
    content: attr(data-title);
}
```

### 16.CSS counter计数器
> 遇见counter-increment一次，变化一次
```html
<p class="counter">
    <p class="inner"></p>
</p>
```
```css
.counter {
    counter-reset: wangxiaoer 12;
    counter-increment: wangxiaoer;
}
.inner::before {
    content: counter(wangxiaoer); // 14
    counter-increment: wangxiaoer;
}
```

### 17.左右padding之和大于content时
```html
<!-- 实际宽度变成了100px -->
<p class="box"></p>
```
```css
.box {
    width: 80px;
    padding: 0 50px;
    box-sizing: border-box;
}
```

### 18.clip裁剪
```html
<button id="btn"></button>
<label for="btn">按钮</label>
```
```css
button {
    position: absolute;
    clip: rect(0, 0, 0, 0)
}
label {
    display: inline-block;
    line-height: 20px;
    padding: 10px;
}
```

### 19.css菜单栏
```html
<div class="icon-menu"></div>
```
```css
.icon-menu {
    display: inline-block;
    width: 140px;
    height: 10px;
    padding: 35px 0;
    border-style: solid;
    border-width: 10px 0;
    border-color: #ccc;
    background-color: #ccc;
    background-clip: content-box;
}
```
```html
<div class="icon-dot"></div>
```
```css
.icon-dot {
    display: inline-block;
    width: 100px;
    height: 100px;
    padding: 10px;
    border: 10px #ccc solid;
    border-radius: 50%;
    background-color: #ccc;
    background-clip: content-box;
}
```

### 20.margin
1. 尺寸通过负值变大
    ```html
    <div class="father">
        <div class="son"></div>
    </div>
    ```
    ```css
    .father {
        width: 300px;
    }
    <!-- son的宽度为340px -->
    .son {
        margin: 0 -20px;
    }
    ```
2. 用负Margin实现右侧间距
    ```html
    <ul>
        <li></li>
        <li></li>
        <li></li>
    </ul>
    ```
    ```css
    ul {
        width: 100%;
        margin-right: -20px;
    }
    ul > li {
        float: left;
        width: 100px;
        margin-right: 20px;
        background: green;
    }
    ```
3. margin合并的场景
    * 相邻兄弟元素的margin合并
    ```html
    <ul class="box">
		<li></li>
		<li></li>
		<li></li>
	</ul>
    ```
    ```css
    ul {
        width: 100%;
        margin-bottom: -1em;
    }
    ul > li {
        margin: 1em 0;
        background: green;
    }
    ```
    * 父级第一个/最后一个子元素
    ```html
    <div class="father" style="margin-top: 80px;">
        <div class="son" style="margin-top: 80px;"></div>
    </div>
    ```
    * 空块级元素的margin合并
    ```html
    <div class="father">
        <div class="son"></div>
    </div>
    ```
    ```css
    .father {
        overflow: hidden;
    }
    .son {
        margin: 1em 0;
    }
    ```

### 21.border
* border-width
  * thin: 1px
  * medium：3px(默认值)
  * thick：4px
* border-style
  * none(默认值)
  * solid
  * dashed
  * dotted
  * double
  * inset(内凹)
  * outset(外凸)
  * groove(沟槽)
  * ridge(山脊)
* border-color
  * border-color默认颜色就是color色值
* border使用透明边框小技巧
  * 增加点击区域大小
    ```css
        .icon-clear {
            width: 16px;
            height: 16px;
            border: 11px solid transparent;
        }
    ```
  * 绘制三角形
    ```css
        .trangle {
            width: 0;
            border: 10px solid;
            border-color: #f30 transparent transparent;
        }
    ```
  * 梯形
    ```css
        .trapezoid {
            width: 10px;
            height: 10px;
            border: 10px solid;
            border-color: #f30 transparent transparent;
        }
    ```
  * 一侧开口
    ```css
        div {
            width: 0;
            border-width: 10px 20px;
            border-style: solid;
            border-color: #f30 #f30 transparent transparent;
        }
    ```
