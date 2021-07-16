# css 九宫格拉伸

## border-image 用途

1. 元素边框不规则的情况。这时候，就需要用设计图作为边框背景，border-image 与 background-image 相比，好处是更具灵活性，可以用代码控制边框背景的拉伸和重复，因而能够创造出更多样的效果
2. 按钮宽高不确定的情况。用 border-image 来制作按钮，可以用同一张背景图，制造出各种宽高的按钮。

## border-image 属性

1. `border-image-source`
   - 边框背景图片。格式为：`url("test.png")`。
2. `border-image-slice`
   - 图片边框向内偏移的距离。格式：`border-image-slice：top right bottom left`。分别指切割背景图片的四条线距离上右下左的距离
   - 该距离接受数值，百分数。默认数值的单位是 px,但是不能在数值后面加 px，否则这句 css 将不被浏览器解析。
   ```css
   .test {
     border-image-slice: 10; /*距离上下左右均为10px;*/
     border-image-slice: 10 30; /*距离上下10px,左右30px;*/
     border-image-slice: 10 30 20; /*距离上10px,下20px,左右30px;*/
     border-image-slice: 10 30 20 40; /*距离上10px,右30px,下20px,左40px;*/
   }
   ```
   - slice 不接受负值；如果 slice 切割的左右距离之和大于背景图的宽，则上下边框不显示。如果 slice 切割的上下距离之和大于背景图的高，则左右边框不显示。
   - 四条线将背景图分割成了 9 个部分，其中 1,2,3,4,6,7,8,9 这八个区域将会被切割，作为图片边框，如果除了设置数值或者百分数，还加了一个“fill”，那么区域 5 就会作为背景填充进元素 content，如：
   ```css
   .test {
     border-image-slice: 25 11 fill;
   }
   ```

## border-image 使用

```css
.test {
  border: 0.08rem solid transparent;
  border-image-source: url("https://funimg.pddpic.com/leisure/hp_line.png.slim.png");
  border-image-slice: 16 fill;
}
```
