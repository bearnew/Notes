# css 动画曲线

```css
.right {
    /* animation: MoveRight linear 0.4s 1 forwards; */
    transform: translateX(400px);
    transition: all 2s linear;
}
.top {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    position: fixed;
    left: 500px;
    top: 500px;
    background: repeating-conic-gradient(
        black,
        black 63deg,
        /* 黑色转60度 */ yellow 60deg,
        yellow 120deg /* 黄色转60度 */
    );
    /* https://cubic-bezier.com/#.55,1.56,.74,1.25 */
    /* animation: MoveTop cubic-bezier(0.55, 1.56, 0.74, 1.25) 0.4s 1 forwards; */
    transform: translateY(-400px);
    transition: all 2s cubic-bezier(0.55, 1.56, 0.74, 1.25);
}
@keyframes MoveRight {
    from {
        transform: translate(0, 0);
    }
    to {
        transform: translateX(400px);
    }
}
@keyframes MoveTop {
    from {
        transform: translate(0, 0);
    }
    to {
        transform: translateY(-400px);
    }
}
```

```html
<div class="right">
    <div class="top"></div>
</div>
```
