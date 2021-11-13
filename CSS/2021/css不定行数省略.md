# css 不定行数省略

```css
* {
  margin: 0;
  padding: 0;
}
.title {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.section {
  display: flex;
  overflow: hidden;
  height: 72px; /*定一个高度*/
  flex-direction: column;
}
.excerpt {
  flex: 1; /*自适应剩余空间*/
  overflow: hidden;
}
.excerpt::before {
  content: "...";
  float: right;
  height: 100%;
  display: flex;
  align-items: flex-end;
  /* 环绕在右下角，不占位置 */
  shape-outside: inset(calc(100% - 1.5em) 0 0);
}
/* 隐藏省略号 */
.excerpt::after {
  content: "";
  position: absolute;
  width: 999vh;
  height: 999vh;
  background: #fff;
  box-shadow: -2em 2em #fff; /*左下的阴影*/
}
```

```html
<div class="section">
  <h3 class="title">
    LGD 在 TI10 放猛犸，RNG 在 S7 放加里奥最后都输了，哪个更让你愤怒失望？
  </h3>
  <p class="excerpt">
    猛犸是对面的绝中绝，大家都知道，并且之前扳回两局已经证明了，当lgd选择ban掉猛犸，或者自己抢掉猛犸时，对面完全不是对手。
  </p>
</div>
```
