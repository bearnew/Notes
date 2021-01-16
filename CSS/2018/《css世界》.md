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
    white-space: pre-wrap; 
    animation: dot 3s infinite step-start both;
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
### 22.字母x
1. 字母x的下边缘就是我们的基线（`baseline`）
2. `x-height`是指小写字母x的高度
3. `vertical-align: middle`, 指的是基线往上1/2 x-height高度， 近似理解为x交叉点的位置
4. 不同的字体在行内盒子中的位置是不一样的，因此`vertical-align: middle`并不是绝对的垂直居中对齐
5. `ex`是css的相对单位，指的小写字母x的高度
```css
/* 图标和文字天然居中方式 */
/* 使用ex单位对齐，不受字体和字号的影响 */
.icon-arrow {
    display: inline-block;
    width: 20px;
    height: 1ex;
    background: url(arrow.png) no-repeat center;
}
```
### 23.line-height
1. div的高度是由`line-height`决定的
2. 行距为`line-height - font-size`
3. 多行文字`line-height`垂直居中
```html
<div class="box">
    <div class="content">基于行高实现的...</div>
</div>
```
```css
.box {
    line-height: 120px;
    background-color: #f0f3f9;
}
.content {
    display: inline-block;
    line-height: 20px;
    margin: 0 20px;
    vertical-align: middle;
}
```
4. `line-height`的默认值是`normal`, 不同的`font-family`, `normal`对应的值不一样
5. `line-height`的值
    * 数值(`line-height: 1.5`)，百分比(`line-height: 150%`)，长度值(`line-height: 1.5em`)最终的计算值是和当前`font-size`相乘后的值
    * 数值(`line-height: 1.5`)，所有子元素继承的都是这个值
    * 使用百分比值或者长度值作为属性值，所有子元素继承的是最终的值
    * HTML中的很多替换元素，尤其表单类的替换元素，如输入框、按钮之类的，很多具有继承特性的CSS属性其自己也有一套，如`font-family`、`font-size`以及这里的`line-height`
    ```css
    body {
        line-height: 1.5;
    }
    input, button {
        line-height: inherit;
    }
    ```
    * 浏览器计算`14 * 1.42857`近乎是`20px`，会以`19px`的高度呈现
6. `line-height`的大值特性
    * 以下2种方式的css,高都是`96px`
    ```html
    <div class="box">
        <span>内容...</span>
    </div>
    ```
    ```css
    <!-- 方案1 -->
    .box {
        line-height: 20px;
    }
    .box span {
        line-height: 96px;
    }
    ```
    ```css
    .box {
        line-height: 96px;
    }
    .box span {
        line-height: 20px;
    }
    ```
    * `span`元素前会存在幽灵空白节点，`box`设置`line-height: 96px`，幽灵空白节点的高度为`96px`，设置`span`的`line-height: 96px`，`span`的高度则变成了`96px`，行框盒子的高度由高度最高的那个内联盒子决定，因此`box`的高度永远是最大的那个`line-height`
7. `line-height`的好朋友`vertical-align`
    1. `vertical-align`的值
        * 线类，如`baseline`、`top`、`middle`、`bottom`
        * 文本类，`text-top`，`text-bottom`
        * 上标下标类，如`sub`、`super`
        * 数值百分比类，如`20px`、`2em`、`20%`等
    2. 设置`vertical-align: 10px`，文字内容会在当前基线位置往上精确偏移`10px`
    3. `vertical-align: middle`会让图标近似居中，而默认情况下文字(基线x)是偏下的，因此会使高度大于容器设置的高度，我们可以设置`vertical-align: -5px`，图标和文字会实现真正意义上的居中，并且容器的可视高度会和当前行高保持一致。
    4. `margin`和`padding`的百分比值是相对于宽度计算的，`line-height`的百分比值是相对于`height`计算的，`vertical-align`是相对于`line-height`计算的。
    5. `vertical-align`的属性只能在`display`为`inline`，`inline-block`，`inline-table`，`table-cell`的元素上。
    6. `float: left`浮动和绝对定位(`position: absolute`)会使元素块状化，所以`vertical-align`是无效的。
    7. `vertical-align: middle`是和`line-height`相关的
        ```html
        <div class="box">
            <img src="1.jpg">
        </div>
        ```
        * 盒子前面的幽灵空白节点高度太小，img不会垂直居中，会顶着box元素的上边缘显示
        ```css
        .box {
            height: 128px;
        }
        .box > img {
            height: 96px;
            vertical-align: middle;
        }
        ```
        * 设置行高，让幽灵空白节点的高度足够，img就垂直居中了
        ```css
        .box {
            height: 128px;
            line-height: 128px;
        }
        .box > img {
            height: 96px;
            vertical-align: middle;
        }
        ```
        * `table-cell`元素设置`vertical-align`垂直对齐的是子元素，子元素即使为块级元素，也能垂直居中。
        ```css
        .cell {
            height: 128px;
            display: table-cell;
            vertical-align: middle;
        }
        .cell > img {
            height: 96px;
        }
        ``` 
    8. 
8. 