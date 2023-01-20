# 现代 javascript 库开发

## 一、构建

### 1.模块

1. 原始模块

```js
// jQuery需要先于代码被引用
(function (mod, $) {
    function clone(source) {}
    mod.clone = clone;
})((window.clone = window.clone || {}), jQuery);
```

2. AMD

-   浏览器不支持`AMD`
-   是异步模块加载规范
-   `Require.js`是最广泛的模块加载器

```js
define(["clone"], function (clone) {
    const a = { a: 1 };
    const b = clone(b); // 使用clone函数
});
```

3. CommonJS

-   用于浏览器环境中

```js
function clone() {}
module.exports = clone;
```

```js
const clone = require("./clone.js");
```

4. UMD

-   通用模块加载规范
-   对原始模块、AMD、CommonJS 的整合

```js
(function (root, factory) {
    const clone = factory(root);
})(this, function (root) {
    function clone() {}
    return clone;
});
```

5. ES Module
6. 开源库一般提供 2 个入口文件

| 入口文件     | 支持的模块                                  |
| :----------- | :------------------------------------------ |
| index.js     | 原始模块、AMD 模块、CommonJs 模块、UMD 模块 |
| index.esm.js | ES Module                                   |
