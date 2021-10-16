# patch-package

1. 使用`patch-package`本地 hot-fix`node_modules`中的内容
2. 报错

```js
// 报错
npm WARN cannot run in wd
```

```js
// 解决方案-1
npm install --unsafe-perm
// 解决方案-2
// 修改package.json
"config": {
    "unsafe-perm":true
}
```
