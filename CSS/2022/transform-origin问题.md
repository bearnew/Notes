# transform-origin 问题

1. 当元素存在`translate`时，`transform-origin:center center`表现成了`transform-origin: bottom right`
2. 使用`transform-origin: top left`表现成`center`

```css
.test {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  transform: scale(0.4) translate(-50%, -50%);
  transform-origin: top left;
}
```

3. 包 1 层`wrap`

```css
.wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.test {
  width: 1.5rem;
  height: 1.93rem;
  translate: scale(0.2);
}
```
