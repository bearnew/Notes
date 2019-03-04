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