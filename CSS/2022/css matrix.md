# matrix
1. `skew scale rotate translate`本质上都是`matrix()`方法实现的
```css
.test {
    transform: matrix(${scaleX},${skewX},${skewY},${scaleY},${x}, ${y});
}
```