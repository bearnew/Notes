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
4. ios微信中audio元素的autoplay无效，需要
```js
wx.ready(() => {
    $audio.play()
})
```
5. 使用`AudioContext`控制音频，想跟随系统的状态，即手机调成震动/静音模式了，这个声音也就不要出了    