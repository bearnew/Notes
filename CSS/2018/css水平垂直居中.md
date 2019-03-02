## css水平垂直居中
html
```html
<div class="wrapper">
    <div class="inner"></div>
</div>
```
### 1.table-cell
```css
.wrapper {
    display: table-cell;
    width: 400px;
    height: 400px;
    text-align: center;
    vertical-align: middle;
    background: #ccc;
}
.inner {
    display: inline-block;
    width: 200px;
    height: 200px;
    background: greenyellow;
}
```
### 2.flex
```css
.wrapper {
    display: flex;
    width: 400px;
    height: 400px;
    justify-content: center;
    align-items: center;
    background: #ccc;
}
.inner {
    width: 200px;
    height: 200px;
    background: greenyellow;
}
```
### 3.absolute, translate
```css
.wrapper {
    position: relative;
    width: 400px;
    height: 400px;
    background: #ccc;
}
.inner {
    position: absolute;
    width: 100px;
    height: 100px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: greenyellow;
}
```
### 4.absolute margin: auto
> 原理: 绝对定位元素可以在其包含块内上下左右移动，指定其距离包含块上下左右的距离都为零时，子元素将填充其包含块所有的可用空间，所以 margin 在水平和垂直方向上都有了可分配的空间，此时使用自动外边距就可使子元素居中
```css
.wrapper {
    position: relative;
    width: 400px;
    height: 400px;
    background: #ccc;
}
.inner {
    position: absolute;
    width: 100px;
    height: 100px;
    margin: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: greenyellow;
}
```
### 5.grid
```css
.wrapper {
    display: grid;
    width: 400px;
    height: 400px;
    background: #ccc;
}
.inner {
    width: 100px;
    height: 100px;
    align-self: center;
    justify-self: center;
    background: greenyellow;
}
```

## 总结
### 仅居中元素定宽高适用
* absolute + 负margin
```css
position: absolute;;
top: 50%;
left: 50%;
margin-left: -50px;
margin-top: -50px;
```
* absolute + margin auto
```css
position: absolute;;
top: 0;
left: 0;
right: 0;
bottom: 0;
margin: auto;
```
* absolute + calc
```css
position: absolute;;
top: calc(50% - 50px);
left: calc(50% - 50px);
```

### 居中元素不定宽高
* absolute + transform
* lineheight
* writing-mode
* table
* css-table
* flex
* grid

> 参考链接 https://yanhaijing.com/css/2018/01/17/horizontal-vertical-center/
