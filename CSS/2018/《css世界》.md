## css 世界读后感

### 1.长度单位(https://github.com/simaQ/cssfun/issues/1)

- 相对长度单位
  - 相对字体长度单位:
    ```
    em: 以父元素为参考对象
    rem：以根元素为参考对象
    ex：义为当前字体的小写x字母的高度或者 1/2 的 1em
    ch：定义为数字0的宽度
    ```
  - 相对视区长度单位
    `vw, vh, vmin(vw和vh较小的值), vmax（vw和vh较大的值）`
- 绝对长度单位
  `px, pt(1pt＝1/72英寸，用于印刷业), cm(厘米), mm（毫米）, pt(相当于我国新四号铅字的尺寸)`

### 2.选择器

- 属性选择器
  指含有[]的选择器，eg:`[title]{}, [title="css-world"], [title~="css-world"], [title^="css-world"], [title$="css-world"]`
- 关系选择器
  - 相邻后代选择器：>
    ```css
    /* 父元素是 <div> 元素的每个 <p> 元素 */
    div > p {
    }
    ```
  - 兄弟选择器：～
    ```css
    /* 所有相同的父元素中位于 p 元素之后的所有 ul 元素 */
    p ~ ul {
    }
    ```
  - 相邻兄弟选择器：+
    ```css
    /* <div> 元素之后同级的紧跟的每个 <p> 元素 */
    div + p {
    }
    ```

### 3.css 包裹性

- 文字少的时候会居中，文字多的时候会居左

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

- img 的最后宽度为 256px

```js
<img src="1.jpg" style="width: 480px !important;">
img { max-width: 256px }
```

- container 的最后宽度为 140px

```css
.container {
  min-width: 140px;
  max-width: 120px;
}
```

### 5.任意高度元素展开收起动画技术

- max-height 太大，展开/收起的动画时间为`实际高度/max-height * transitionTime`, 并且收起会有动画延迟

```html
<input id="check" type="checkbox" />
<div class="element">
  <p>
    display:table-cell其他一些应用，例如，两栏自适应布局，垂直居中效果等等都是可以通过其他技术手段模拟出来的，但是，根据列表个数自动等宽的效果，其他CSS是很难模拟的，尤其当需要兼容IE8浏览器的时候。
  </p>
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
<img />
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

inline-block 元素的所有解析和渲染就如同每个行框盒子的前面有一个“空白节点”一样

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

- 1.`<img>, <object>, <video>, <iframe>, <textarea>, <input>`都是典型的替换元素
- 2.替换元素，内容的外观不受 css 的影响
- 3.有自己的尺寸
- 4.在很多 css 上都有自己的一套表现规则
- 4.vertical-align 的默认值 baseline 被定义为 x 的下边缘,替换元素的基线被定义为元素的下边缘

### 9.图片加载

```html
<img />
```

```css
img:not([src]) {
  content: url(1.jpg);
}
```

### 10 通过 hover 将图片变成另一张图片

```html
<img src="laugh.png" />
```

```css
img:hover {
  content: url(laugh-tear.png);
}
```

### 11.通过 content 实现背景图片

```css
h1 {
  content: url(logo.png);
}
```

### 12.清除浮动

```css
.clear:after {
  content: "";
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
  content: "";
  display: inline-block;
  height: 100%;
}
.box:after {
  content: "";
  display: inline-block;
  height: 100%;
}
.bar {
  display: inline-block;
  width: 20px;
}
```

### 14.css 实现加载中效果

\A,\D 实现换行效果

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
  content: "...\A..\A.";
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

### 15.content attr 属性值内容审查

```css
img:after {
  content: attr(alt);
}
.icon:before {
  content: attr(data-title);
}
```

### 16.CSS counter 计数器

> 遇见 counter-increment 一次，变化一次

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
  /* 14 */
  content: counter(wangxiaoer);
  counter-increment: wangxiaoer;
}
```

### 17.左右 padding 之和大于 content 时

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

### 18.clip 裁剪

```html
<button id="btn"></button> <label for="btn">按钮</label>
```

```css
button {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
label {
  display: inline-block;
  line-height: 20px;
  padding: 10px;
}
```

### 19.css 菜单栏

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
   <!-- son的宽度为340px -- > .son {
     margin: 0 -20px;
   }
   ```
2. 用负 Margin 实现右侧间距
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
3. margin 合并的场景
   - 相邻兄弟元素的 margin 合并
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
   - 父级第一个/最后一个子元素
   ```html
   <div class="father" style="margin-top: 80px;">
     <div class="son" style="margin-top: 80px;"></div>
   </div>
   ```
   - 空块级元素的 margin 合并
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

- border-width
  - thin: 1px
  - medium：3px(默认值)
  - thick：4px
- border-style
  - none(默认值)
  - solid
  - dashed
  - dotted
  - double
  - inset(内凹)
  - outset(外凸)
  - groove(沟槽)
  - ridge(山脊)
- border-color
  - border-color 默认颜色就是 color 色值
- border 使用透明边框小技巧
  - 增加点击区域大小
    ```css
    .icon-clear {
      width: 16px;
      height: 16px;
      border: 11px solid transparent;
    }
    ```
  - 绘制三角形
    ```css
    .trangle {
      width: 0;
      border: 10px solid;
      border-color: #f30 transparent transparent;
    }
    ```
  - 梯形
    ```css
    .trapezoid {
      width: 10px;
      height: 10px;
      border: 10px solid;
      border-color: #f30 transparent transparent;
    }
    ```
  - 一侧开口
    ```css
    div {
      width: 0;
      border-width: 10px 20px;
      border-style: solid;
      border-color: #f30 #f30 transparent transparent;
    }
    ```

### 22.字母 x

1. 字母 x 的下边缘就是我们的基线（`baseline`）
2. `x-height`是指小写字母 x 的高度
3. `vertical-align: middle`, 指的是基线往上 1/2 x-height 高度， 近似理解为 x 交叉点的位置
4. 不同的字体在行内盒子中的位置是不一样的，因此`vertical-align: middle`并不是绝对的垂直居中对齐
5. `ex`是 css 的相对单位，指的小写字母 x 的高度

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

1. div 的高度是由`line-height`决定的
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

4.  `line-height`的默认值是`normal`, 不同的`font-family`, `normal`对应的值不一样
5.  `line-height`的值
    - 数值(`line-height: 1.5`)，百分比(`line-height: 150%`)，长度值(`line-height: 1.5em`)最终的计算值是和当前`font-size`相乘后的值
    - 数值(`line-height: 1.5`)，所有子元素继承的都是这个值
    - 使用百分比值或者长度值作为属性值，所有子元素继承的是最终的值
    - HTML 中的很多替换元素，尤其表单类的替换元素，如输入框、按钮之类的，很多具有继承特性的 CSS 属性其自己也有一套，如`font-family`、`font-size`以及这里的`line-height`
    ```css
    body {
      line-height: 1.5;
    }
    input,
    button {
      line-height: inherit;
    }
    ```
    - 浏览器计算`14 * 1.42857`近乎是`20px`，会以`19px`的高度呈现
6.  `line-height`的大值特性
    - 以下 2 种方式的 css,高都是`96px`
    ```html
    <div class="box">
      <span>内容...</span>
    </div>
    ```
    ```css
    <!-- 方案1 -- > .box {
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
    - `span`元素前会存在幽灵空白节点，`box`设置`line-height: 96px`，幽灵空白节点的高度为`96px`，设置`span`的`line-height: 96px`，`span`的高度则变成了`96px`，行框盒子的高度由高度最高的那个内联盒子决定，因此`box`的高度永远是最大的那个`line-height`
7.  `line-height`的好朋友`vertical-align` 1. `vertical-align`的值
    _ 线类，如`baseline`、`top`、`middle`、`bottom`
    _ 文本类，`text-top`，`text-bottom`
    _ 上标下标类，如`sub`、`super`
    _ 数值百分比类，如`20px`、`2em`、`20%`等 2. 设置`vertical-align: 10px`，文字内容会在当前基线位置往上精确偏移`10px` 3. `vertical-align: middle`会让图标近似居中，而默认情况下文字(基线 x)是偏下的，因此会使高度大于容器设置的高度，我们可以设置`vertical-align: -5px`，图标和文字会实现真正意义上的居中，并且容器的可视高度会和当前行高保持一致。 4. `margin`和`padding`的百分比值是相对于宽度计算的，`line-height`的百分比值是相对于`height`计算的，`vertical-align`是相对于`line-height`计算的。 5. `vertical-align`的属性只能在`display`为`inline`，`inline-block`，`inline-table`，`table-cell`的元素上。 6. `float: left`浮动和绝对定位(`position: absolute`)会使元素块状化，所以`vertical-align`是无效的。 7. `vertical-align: middle`是和`line-height`相关的
    `html <div class="box"> <img src="1.jpg"> </div> `
    _ 盒子前面的幽灵空白节点高度太小，img 不会垂直居中，会顶着 box 元素的上边缘显示
    `css .box { height: 128px; } .box > img { height: 96px; vertical-align: middle; } `
    _ 设置行高，让幽灵空白节点的高度足够，img 就垂直居中了
    `css .box { height: 128px; line-height: 128px; } .box > img { height: 96px; vertical-align: middle; } ` \* `table-cell`元素设置`vertical-align`垂直对齐的是子元素，子元素即使为块级元素，也能垂直居中。
    `css .cell { height: 128px; display: table-cell; vertical-align: middle; } .cell > img { height: 96px; } ` 8. 文字默认基线对齐，`font-size`越大字符的基线越往下，文字字号不一样，会发生上下位移，位移距离足够大就会超出行高
    ````css
            ```
        9.
    8.margin-top: 80px;">
    <div class="son" style="margin-top: 80px;"></div>
    </div>
    ` * 空块级元素的margin合并 `html
    <div class="father">
    <div class="son"></div>
    </div>
    ` `css
    .father {
    overflow: hidden;
    }
    .son {
    margin: 1em 0;
    }
    ````

### 21.border

- border-width
  - thin: 1px
  - medium：3px(默认值)
  - thick：4px
- border-style
  - none(默认值)
  - solid
  - dashed
  - dotted
  - double
  - inset(内凹)
  - outset(外凸)
  - groove(沟槽)
  - ridge(山脊)
- border-color
  - border-color 默认颜色就是 color 色值
- border 使用透明边框小技巧
  - 增加点击区域大小
    ```css
    .icon-clear {
      width: 16px;
      height: 16px;
      border: 11px solid transparent;
    }
    ```
  - 绘制三角形
    ```css
    .trangle {
      width: 0;
      border: 10px solid;
      border-color: #f30 transparent transparent;
    }
    ```
  - 梯形
    ```css
    .trapezoid {
      width: 10px;
      height: 10px;
      border: 10px solid;
      border-color: #f30 transparent transparent;
    }
    ```
  - 一侧开口
    ```css
    div {
      width: 0;
      border-width: 10px 20px;
      border-style: solid;
      border-color: #f30 #f30 transparent transparent;
    }
    ```

### 22.字母 x

1. 字母 x 的下边缘就是我们的基线（`baseline`）
2. `x-height`是指小写字母 x 的高度
3. `vertical-align: middle`, 指的是基线往上 1/2 x-height 高度， 近似理解为 x 交叉点的位置
4. 不同的字体在行内盒子中的位置是不一样的，因此`vertical-align: middle`并不是绝对的垂直居中对齐
5. `ex`是 css 的相对单位，指的小写字母 x 的高度

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

1. div 的高度是由`line-height`决定的
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
   - 数值(`line-height: 1.5`)，百分比(`line-height: 150%`)，长度值(`line-height: 1.5em`)最终的计算值是和当前`font-size`相乘后的值
   - 数值(`line-height: 1.5`)，所有子元素继承的都是这个值
   - 使用百分比值或者长度值作为属性值，所有子元素继承的是最终的值
   - HTML 中的很多替换元素，尤其表单类的替换元素，如输入框、按钮之类的，很多具有继承特性的 CSS 属性其自己也有一套，如`font-family`、`font-size`以及这里的`line-height`
   ```css
   body {
     line-height: 1.5;
   }
   input,
   button {
     line-height: inherit;
   }
   ```
   - 浏览器计算`14 * 1.42857`近乎是`20px`，会以`19px`的高度呈现
6. `line-height`的大值特性
   - 以下 2 种方式的 css,高都是`96px`
   ```html
   <div class="box">
     <span>内容...</span>
   </div>
   ```
   ```css
   <!-- 方案1 -- > .box {
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
   - `span`元素前会存在幽灵空白节点，`box`设置`line-height: 96px`，幽灵空白节点的高度为`96px`，设置`span`的`line-height: 96px`，`span`的高度则变成了`96px`，行框盒子的高度由高度最高的那个内联盒子决定，因此`box`的高度永远是最大的那个`line-height`

### 24.vertical-align

7. `line-height`的好朋友`vertical-align`

   1. `vertical-align`的值
      - 线类，如`baseline`、`top`、`middle`、`bottom`
      - 文本类，`text-top`，`text-bottom`
      - 上标下标类，如`sub`、`super`
      - 数值百分比类，如`20px`、`2em`、`20%`等
   2. 设置`vertical-align: 10px`，文字内容会在当前基线位置往上精确偏移`10px`
   3. `vertical-align: middle`会让图标近似居中，而默认情况下文字(基线 x)是偏下的，因此会使高度大于容器设置的高度，我们可以设置`vertical-align: -5px`，图标和文字会实现真正意义上的居中，并且容器的可视高度会和当前行高保持一致。
   4. `margin`和`padding`的百分比值是相对于宽度计算的，`line-height`的百分比值是相对于`height`计算的，`vertical-align`是相对于`line-height`计算的。
   5. `vertical-align`的属性只能在`display`为`inline`，`inline-block`，`inline-table`，`table-cell`的元素上。
   6. `float: left`浮动和绝对定位(`position: absolute`)会使元素块状化，所以`vertical-align`是无效的。
   7. `vertical-align: middle`是和`line-height`相关的
      ```html
      <div class="box">
        <img src="1.jpg" />
      </div>
      ```
      - 盒子前面的幽灵空白节点高度太小，img 不会垂直居中，会顶着 box 元素的上边缘显示
      ```css
      .box {
        height: 128px;
      }
      .box > img {
        height: 96px;
        vertical-align: middle;
      }
      ```
      - 设置行高，让幽灵空白节点的高度足够，img 就垂直居中了
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
      - `table-cell`元素设置`vertical-align`垂直对齐的是子元素，子元素即使为块级元素，也能垂直居中。
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
   8. 文字默认基线对齐，`font-size`越大字符的基线越往下，文字字号不一样，会发生上下位移，位移距离足够大就会超出行高

      ```css
      .box {
        line-height: 32px;
      }
      .box > span {
        font-size: 24px;
      }
      ```

      ```html
      <!-- box实际高度为35px -->
      <div class="box">
        <span>文字</span>
      </div>
      ```

   9. 解决文字超出行高的方法

      1. 让幽灵空白节点与 span 元素字号一样大

      ```css
      .box {
        line-height: 32px;
        font-size: 24px;
      }
      .box > span {
      }
      ```

      ```html
      <!-- box实际高度为35px -->
      <div class="box">
        <span>文字</span>
      </div>
      ```

      2. 改成顶部对齐
         ```css
         .box {
           line-height: 32px;
         }
         .box > span {
           font-size: 24px;
           vertical-align: top;
         }
         ```

      ```html
      <!-- box实际高度为35px -->
      <div class="box">
        <span>文字</span>
      </div>
      ```

   10. 块级元素有图片，块级元素高度会比图片的高度高
       - 间隙是因为幽灵空白节点、line-height、vertical-align 造成的
       - 清除间隙的方法
         1. 图片块状化
         2. 容器`line-height`足够小，例如: `line-height: 0`
         3. `font-size`设置足够小，`font-size`设置 0
         4. 设置图片的`vertical-align`为`top`,`middle`,`bottom`
   11. 容器高度为 100px，图片高度为 95px, 设置图片`margin-top: -200px`, 图片并不会消失在容器中
       - 因为图片的位置被幽灵空白节点的`vertical-align: baseline`限死了

8. 通过`font-size: 0`或者`line-height: 0`移除幽灵空白节点
9. `vertical-align: top/bottom/middle`

   - `vertical-align: top`垂直行框盒子的上边缘对齐
   - `vertical-align: bottom`垂直行框盒子的下边缘对齐
   - `vertical-align: middle`元素的垂直中心点和行框盒子基线往上 1/2 x-height 处对齐，但所有的字体中字符 x 的位置都是偏下的
   - `vertical-align: text-top/text-bottom`盒子的顶部与父级内容顶部/底部对齐（与父级元素的`font-size`有关）
   - `vertical-align: super/sub`提高盒子的基线到父级上标（`<sup></sup>`）/下标(`<sub></sub>`)位置

10. 基于`vertical-align`实现水平垂直居中弹窗

```css
.container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  text-align: center;
  font-size: 0;
  white-space: nowrap;
  overflow: auto;
}
.container::after {
  content: "";
  display: inline-block;
  /* 设置height: 90%灵活控制垂直居中的比例 */
  height: 100%;
  vertical-align: middle;
}
.dialog {
  display: inline-block;
  vertical-align: middle;
  text-align: left;
  font-size: 14px;
  white-space: nowrap;
}
```

```html
<div class="container">
  <div class="dialog"></div>
</div>
```

### 25.float

1. float 属性不为`none`,display 计算值就是`block`或者`table`(通过`window.getComputedStyle(span).display`获取)
2. `inline-table`计算值会转换成`table`, 其余会转换成`block`
3. 行框盒子（内联元素）和浮动元素不会重叠
4. `float`的 2 栏布局

```css
.father {
  overflow: hidden;
}
.father img {
  width: 60px;
  height: 60px;
  float: left;
}
p {
  margin-left: 60px;
}
```

```html
<div class="father">
  <img
    src="https://dss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=282157823,3788160238&fm=55&app=54&f=JPEG?w=1140&h=640"
  />
  <p>
    上空的飞机阿贾克斯的flak圣诞节分厘卡即使刷卡大家flak时间的浪费凯撒的接口飞机喀什的肌肤
  </p>
</div>
```

5. `float`多栏布局

```css
.prev {
  float: left;
}
.next {
  float: right;
}
.title {
  margin: 0 70px;
  text-align: center;
}
```

```html
<div class="father">
  <a class="prev">上一章</a>
  <a class="next">下一章</a>
  <h3 class="title">动物世界</h3>
</div>
```

### 26.clear

1. 让自身不能与前面的浮动元素相邻
2. clear

- none: 默认值，左右浮动来就来
- left: 左侧抗浮动
- right: 右侧抗浮动
- both: 两侧抗浮动

### 27.BFC

1. 一个元素具有 BFC, 内部元素再怎么变化，都不会影响外部元素，因此 BFC 不会触发`margin`重叠，也可以用来清除浮动
2. 触发 BFC
   1. html 根元素
   2. float 属性不为 none
   3. position 为 absolute 或 fixed
   4. display 为 inline-block tabbel-cell table-caption flex inline-flex\
   5. overflow 不为 visible, 为 auto, scroll, hidden
3. BFC 主要用于实现健壮、智能的自适应布局

```css
.father {
  width: 200px;
}
img {
  float: left;
  width: 100px;
  height: 100px;
  margin-left: 10px;
  padding-right: 10px;
  border-right: 10px solid transparent;
}
p {
  overflow: hidden;
  padding-left: 10px;
  border-left: 10px solid transparent;
}
```

```html
<div class="father">
  <img
    src="https://pics5.baidu.com/feed/f9198618367adab4e2feb7f7d42bdd148601e464.jpeg?token=c43840f792b113fff224c1adbbfb2282"
  />
  <p>
    上课的开发将军澳隧道进口法拉士大夫艰苦ask到付即可拉开距离速度加快立法就流口水
  </p>
</div>
```

### 28.overflow

1. `overflow-x`和`overflow-y`属性中一个值设置为`visible`另一个设置成`scroll auto hidden`,则`visible`的样式表现为`auto`
2. 除非`overflow-x`和`overflow-y`的属性值都是`visible`，否则`visible`会被当成`auto`解析
3. 永远不可能实现 1 个方向溢出裁剪或滚动，另一个方向溢出显示

```css
html {
  overflow-x: hidden;
  /* 多余 */
  overflow-y: auto;
}
```

4. 浏览器默认滚动条都来自<html>
5. 去除页面默认滚动条

```css
html {
  overflow: hidden;
}
```

6. 在 PC 端窗体滚动高度可用`document.documentElement.scrollTop`获取，在移动端，可能要使用`document.body.scrollTop`获取
7. 滚动条会占用容器的可用宽度或高度
8. 滚动条的样式

- 整体部分：`::-webkit-scrollbar`
- 两端按钮：`::-webkit-scrollbar-button`
- 外层轨道：`::-webkit-scrollbar-track`
- 内层轨道: `::-webkit-scrollbar-track-piece`
- 滚动滑块: `::-webkit-scrollbar-thumb`
- 边角: `::-webkit-scrollbar-corner`

9. 最多显示 2 行

```css
.ell-row-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
```

10. 锚点定位
1. 利用 name 定位

```html
<a href="#1">发展历程</a> <a name="1"></a>
```

2. 利用标签的 id 定位

```html
<a href="#1">发展历程</a>
<h2 id="1">发展历程内容</h2>
```

11. 返回顶部

```html
<!-- 推荐 -->
<a href="#">返回顶部</a>
<!-- 不推荐 -->
<a href="javascript:">返回顶部</a>
```

12. focus 锚点定位

- url 锚点定位时让元素定位在浏览器窗体的的上边缘
- focus 锚点定位让元素在窗体范围内显示即可

```js
document.querySelector("input").focus();
```

13. 利用锚点实现 tab 切换

```css
.box {
  width: 20em;
  height: 10em;
  border: 1px solid #ddd;
  overflow: hidden;
}
.list {
  line-height: 10em;
  background: #ddd;
  text-align: center;
}
.list > input {
  position: absolute;
  top: 0;
  height: 100%;
  width: 1px;
  border: 0;
  clip: rect(0 0 0 0);
}
```

```html
<div class="box">
  <div class="list" id="one">1</div>
  <div class="list" id="two">2</div>
  <div class="list" id="three">3</div>
  <div class="list" id="four">4</div>
</div>
<div class="link">
  <a class="click" href="#one">1</a>
  <a class="click" href="#two">2</a>
  <a class="click" href="#three">3</a>
  <a class="click" href="#four">4</a>
</div>
```

### 28.absolute

1. absolute 与 float 同时存在时，float 属性没有效果
2. span 元素是 inline，一旦设置成`position: absolute`,`display`计算值就变成了`block`
3. width: 50%指的相对包含块宽度的一半
4. 包含块
   1. 根元素 html 是初始包含块，尺寸等于浏览器可视窗口的大小
   2. 元素的 position 是`relative`或者`static`，包含块由其最近的块容器的祖先盒的`content box`边界形成
   3. `position: fixed`则包含块是初始包含快 html
   4. 元素 position: absolute 由最近的`position`不为`static`的祖先元素建立，如果没有，则为初始包含块
5. 不设置`top left right bottom`的`absolute`，与`relative`是一样的效果，但是不占据尺寸空间
6. absolute 和 text-align

- img 是内联元素，p 标签中会有 👻 幽灵空白节点
- 幽灵空白节点会居中显示，img 会挨着幽灵空白节点在 p 标签的中间显示

```css
p {
  text-align: center;
}
img {
  position: absolute;
}
```

```html
<p><img src="test.png" /></p>
```

7. `overflow`不是定位元素，同时绝对定位元素和`overflow`容器之间也没有定位元素，则`overflow`无法对`absolute`元素进行裁剪
8. `clip`的元素必须是`absolute`或者`fixed`，属性才会起作用

```css
.test {
  clip: rect(top, right, bottom, left);
}
```

9. 可访问性隐藏

```css
.clip {
  position: absolute;
  /* 整块裁剪 */
  clip: rect(0, 0, 0, 0);
}
```

10. clip 是视觉上的隐藏，不会影响元素尺寸
11. `absolute`遇到`left/top/right/bottom`才会变成真正的绝对定位元素

```css
/* 水平方向绝对定位，垂直方向相对定位 */
.box {
  position: absolute;
  left: 0;
}
```

12. `absolute`流体特性

    1. 对立方向同时发生定位就会触发流体特性
    2. `left`和`right`属于水平对立定位方向，`top`和`bottom`属于垂直对立定位的方向
    3. 流体特性的元素宽高会自适应

    ```css
    <!-- 相对HTML定位，则宽度为100%-60px -- > .box {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      padding: 30px;
    }
    <!-- 宽度为100% + 60px -- > .box2 {
      position: absolute;
      left: 0;
      width: 100%;
      height: 100%;
      top: 0;
      padding: 30px;
    }
    ```

    ```css
    <!-- 上下左右留白30px -- > .box {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: 30px;
    }
    <!-- 超出窗体 -- > .box2 {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 30px;
    }
    ```

13. 利用流体特性居中元素

```css
.box {
  position: absolute;
  width: 300px;
  height: 300px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
```

### 29.relative

1. relative 的元素定位位移是相对于自身的，百分比的值根据包含块的高度来定，包含块的高度为`auto`，计算值就是 0
2. `relative`的元素，`top`和`bottom`同时使用`bottom`被干掉，`left`和`right`同时使用`right`毙命

```css
.example {
  position: relative;
  top: 10px;
  right: 10px; /* 无效 */
  bottom: 10px; /* 无效 */
  left: 10px;
}
```

3. 普通元素变成`relative`元素，层叠顺序会提高

### 30.fixed

1. `position: fixed`的包含块是根元素
2. 无依赖固定定位，没有设置`top/left/bottom/right`

```html
<div class="father">
  <div class="right">
    <div class="son"></div>
  </div>
</div>
```

```css
.father {
  position: relative;
  width: 100px;
  height: 100px;
}
.right {
  height: 0;
  text-align: right;
  overflow: hidden;
}
.son {
  display: inline;
  width: 40px;
  height: 40px;
  position: fixed;
  margin-left: -40px;
}
```

4. `absolute`模拟`fixed`

```html
<html>
  <body>
    <div class="page">固定定位元素</div>
    <div class="fixed"></div>
  </body>
</html>
```

```css
html,
body {
  height: 100%;
  overflow: hidden;
}
.page {
  height: 100%;
  overflow: auto;
}
.fixed {
  position: absolute;
}
```

5. `position: fixed`蒙层出现背景滚动，是因为滚动元素是根元素，如果希望背景被锁定，可以使用`absolute`模拟`fixed`，让页面滚动条由内部普通元素产生
6. 使用`border`隐藏滚动条

```js
var widthBar = 17,
  root = document.documentElement;
if (typeof window.innerWidth === "number") {
  widthBar = window.innerWidth - root.clientWidth;
}
root.style.overflow = "hidden";
root.style.borderRight = widthBar + "px solid transparent";
```

```js
// 隐藏
var root = document.documentElement;
root.style.overflow = "";
root.style.borderRight = "";
```

### 31.z-index

1. `z-index`属性只有与`position`不为`static`的元素在一起才有作用
2. `flex`元素的子元素设置`z-index`也有效

### 32.层叠上下文

1. css 层叠顺序

- ![层叠顺序](https://github.com/bearnew/picture/blob/master/markdown_v2/2021/css%E4%B8%96%E7%95%8C/zIndexStack.PNG?raw=true)
- `inline`包括`inline/inline-block/inline-table`元素的层叠顺序
- 从层叠水平上看，`z-index:0`和`z-index:auto`是一致的
- 内容元素（内联元素）的层叠是高于布局元素（浮动和块状元素）

2. 层叠上下文的特性

- 层叠上下文的层叠水平要比普通元素高
- 层叠上下文可以阻断元素的混合模式
- 层叠上下文可以嵌套，内部层叠上下文及其所有子元素均受制于外部的层叠上下文
- 每个层叠上下文和兄弟元素独立，也就是说，层叠变化或者渲染时，只需要考虑后代元素
- 元素发生层叠的时候，整个元素被认为是在父层叠上下文的层叠顺序中

3. 层叠上下文的创建

   1. 根层叠上下文
      - 页面根元素，html 元素，因此页面中所有的元素一定处于至少一个层叠结界中
   2. 定位元素与传统层叠上下文
      - 当`position`值为`relative/absolute`以及`Firebox/IE`浏览器下含有`position: fixed`声明的定位元素，当`z-index`不是`auto`时，会创建层叠上下文
   3. 父级元素没有创建层叠上下文，子元素的层叠比较就不会受父级影响，父元素创建了层叠上下文，子元素的层叠上下文只在父元素的内部作用

4. css3 的层叠上下文
   - 元素为`flex`的布局元素，同时`z-index`不为`auto`
   - 元素`opacity`不为 1
   - 元素`transform`值不为`none`
   - 元素`mix-blend-mode`的值不是`normal`
   - 元素`filter`的值不是`none`
   - 元素`isolation`的值是`isolate`
   - 元素`will-change`是上面 2-6 中的值
   - 元素`-webkit-overflow-scrolling`值为`touch`
5. `z-index`为负值的元素在层叠上下文元素的上面，`block`元素的下面
6. 尽量不使用`z-index`元素，元素一旦设置了`z-index`，就从普通定位元素变成了层叠上下文元素，层叠顺序就会发生变化

### 33.vertical-align 文字居中

```css
p {
  display: inline-block;
  font-size: 40px;
  line-height: 1.5;
}
img {
  /* 相当于40px * 1.5 * 25% = 15px */
  vertical-align: 25%;
  vertical-align: 15px;
  width: 16px;
  height: 16px;
  position: relative;
  top: 8px;
}
```

```html
<p>文字x<img src="https://himg.bdimg.com/sys/portraitn/item/10aeae46" /></p>
```

### 34.ex,em

1. ex 是字符 x 的高度
2. 1em 的计算值等同于当前元素所在的`font-size`计算值

### 35.chrome 设置的字体 12px，当文字小于 12px 会被当成 12px 处理，但 font-size 为 0 会被隐藏

### 36.font-family 设置的值会从左到右依次识别

### 37.font-weight

1. font-weight 可设置的值

- `normal`
- `bold`
- `lighter`, 相对于父元素
- `bolder`，相对于父元素
- 100-900

### 38.font-style

- normal,正常
- italic,使用当前字体的斜体字体
- oblique,单纯的让文字倾斜

### 39.font-variant

- normal
- small-caps，让英文字符表现成小体型大写字母

### 40.font-face

1. `example`

```css
@font-face {
  font-family: "example";
  src: url(example.ttf);
  font-style: normal;
  font-weight: normal;
  unicode-range: U+0025-00FF;
}
```

2. font-family，字体变量
3. src

- src 引入系统安装字体，使用`local()`功能符，使用外链字体，使用`url()`功能符
- 字体格式：
  - `.eof`，所有的 ie 浏览器都支持
  - `.woff`，`web open font format`，优先使用的字体格式，字体尺寸更小，加载更快
  - `.woff2`，比`woff`尺寸更小的字体，目前仅`chrome`和`firefox`支持较好
  - `.ttf`，作为系统安装字体比较多，尺寸较大，能兼容老版本`Android`(Android4.3 之前的版本)
  - `.svg`，可以兼容 ios4.1 以及之前的版本
- `format()`功能符提前让浏览器知道字体格式
- 最佳实践

```css
@font-face {
  font-family: ICON;
  src: url("icon.eot");
  src: local("😊"), url("icon.woff2") format("woff2"), url("icon.woff") format("woff"),
    url("icon.ttf");
}
```

4. 使用`iconfont.cn`来生成字体图标
5. 使用`iconfont`的 2 种方式

- css

```css
.icon-microphone:before {
  content: "\1f3a4";
}
```

- html

```html
<i class="icon">&#x1f3a4</i>
```

### 41.text-indent

1. 隐藏用于 SEO 的内容

```css
.logo {
  width: 120px;
  background: url(logo.png);
  text-indent: -120px;
}
```

```html
<h1 class="logo">css世界</h1>
```

2. `text-indent`仅对第一行内联盒子内容有效
3. 非替换元素以外的`display`计算值为`inline`的内联元素设置`text-indent`值无效，计算值是`inline-block/inline-table`则会生效。父级块状元素设置`text-indent`属性值，子`inline-block/inline-table`需要设置`text-indent: 0`重置。
4. `<input>`标签按钮`text-indent`值无效
5. `<button>`标签按钮`text-indent`值有效
