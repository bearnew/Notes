```css
@keyframes breathe {
    0% {
        opacity: .2;
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: .2;
    }
}
.test {
    animation: breathe cubic-bezier(.2,.73,.71,.44) 2s infinite;
}
```