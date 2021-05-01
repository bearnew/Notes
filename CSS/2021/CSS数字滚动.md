# css 数字滚动

```css
.box {
  position: relative;
  width: 20px;
  height: 20px;
  overflow: hidden;
  background: green;
}
.item-wrap {
  width: 100%;
  height: 100%;
  /* 使用 preserve-3d 支持3D */
  transform-style: preserve-3d;
  /* 滚动到2 动态改变transform为360-36*3 */
  transform: rotateX(252deg);
  transition: transform 10s ease;
  color: #fff;
}
.item {
  position: absolute;
  width: 20px;
  height: 20px;
  line-height: 20px;
  backface-visibility: hidden;
  text-align: center;
  font-size: 16px;
}
.item-0 {
  /* 使用rotateX和translateZ摆成1个圆 */
  /* 圆角为36deg的十边形 */
  /* translateZ的值需大于 20px/sin36，起空间效果 */
  transform: rotateX(36deg) translateZ(34px);
}
.item-1 {
  transform: rotateX(72deg) translateZ(34px);
}
.item-2 {
  transform: rotateX(108deg) translateZ(34px);
}
.item-3 {
  transform: rotateX(144deg) translateZ(34px);
}
.item-4 {
  transform: rotateX(180deg) translateZ(34px);
}
.item-5 {
  transform: rotateX(216deg) translateZ(34px);
}
.item-6 {
  transform: rotateX(252deg) translateZ(34px);
}
.item-7 {
  transform: rotateX(288deg) translateZ(34px);
}
.item-8 {
  transform: rotateX(324deg) translateZ(34px);
}
.item-9 {
  transform: rotateX(360deg) translateZ(34px);
}
```

```html
<div class="box">
  <div class="item-wrap">
    <div class="item item-0">0</div>
    <div class="item item-1">1</div>
    <div class="item item-2">2</div>
    <div class="item item-3">3</div>
    <div class="item item-4">4</div>
    <div class="item item-5">5</div>
    <div class="item item-6">6</div>
    <div class="item item-7">7</div>
    <div class="item item-8">8</div>
    <div class="item item-9">9</div>
  </div>
</div>
```
