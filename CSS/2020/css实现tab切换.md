## css 实现 tab 切换

```html
<div class="yw-tab-tab">
  <a href="javascript:" class="yw-tab-a"> QQ阅读 </a>
  <a href="javascript:" class="yw-tab-a"> 起点读书 </a>
  <a href="javascript:" class="yw-tab-a"> 红袖读书 </a>
  <a href="javascript:" class="yw-tab-a"> 飞读免费小说 </a>
</div>
```

```css
.yw-tab-tab {
    position: relative;
    display: flex;
    justify-content: space-between;
    max-width: 414px;
    border-bottom: 1px solid #717678;
    margin: 30px auto;
    background-color: #fff;
}

.yw-tab-tab::before,
.yw-tab-tab::after {
    position: absolute;
    left: calc(var(--target-left, -299) * 1px);
    width: calc(var(--target-width, 0) * 1px);
    color: #2a80eb;
}

.yw-tab-tab[style]::before,
.yw-tab-tab[style]::after {
    content: '';
}

.yw-tab-tab::before {
    height: calc(var(--target-height) * 1px);
    background-color: currentColor;
    mix-blend-mode: overlay;
}

.yw-tab-tab::after {
    bottom: -2px;
    border-bottom: solid;
    transition: left 0.2s, width 0.2s;
}

.yw-tab-a {
    padding: 10px 0;
    color: #717678;
}

```
