#### css清除浮动
* 子元素浮动后，脱离文档流，导致父元素坍塌，影响布局和样式
```html
<div class="box clearfix">
  <div class="left"></div>
  <div class="right"></div>
  <div class="clear"></div>
</div>
```
* 给父元素定义高度 
* 使用`clear:both`
```css
/*清除浮动*/
.clearfix:after {
  content: " ";
  display: block;
  clear: both;
  height: 0;
}
.clearfix {
  zoom: 1;
}
```
```css
.box::after {
  content: '';
  display: table;
  clear: both;
}
```
```css
.clear {
  clear: both;
  height: 0;
}
```
* 使用`overflow:auto`
```css
.box {
  overflow:auto;
  zoom: 1; // 触发IE hasLayout。
}
```
#### 多行文字垂直居中
```css
.prepare-list .title {
    position: absolute;
    display: table;
    width: 135px;
    height: 60px;
    top: 0;
    left: 62px;
}
.prepare-list .title p {
    display: table-cell;
    vertical-align: middle;
    text-align: left;
}
```