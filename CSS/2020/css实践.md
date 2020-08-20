## css实践
1. 解决css动画闪烁问题
```css
.test {
    /* 属性定义当元素背面向屏幕时是否可见 */
    backface-visibility: hidden;
}
```
2. 开启GPU加速
* `transform:translateZ(0)`
* `will-change:transform`
3. `transform`和`opacity`的动画更加流畅
   * 不影响文档流
   * 不依赖于文档流
   * 不会造成重绘  