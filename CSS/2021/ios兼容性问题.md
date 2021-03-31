# ios 兼容性问题

1. `backface-visibility`在 ios 中，页面隐藏后，该属性异常
   - 通过`visibilityChangeHandler`显示/隐藏 播放/停止动画
   ```js
   document.addEventListener(eventName, visibilityChangeHandler, false);
   ```
2. ios 中使用`transform`，`z-index`失效，通过`translateZ`覆盖
   ```css
   .test {
     transform: translateZ(10px);
   }
   ```
3.
