# webpack 与 rollup 打包区别

## 1.Webpack Runtime

1. `__webpack_modules__`
   - 维护一个所有模块的数组，将入口模块解析成`AST`，根据`AST`深度优先搜索所有的模块，并构建出这个模块数组
   - 每个模块都由一个包裹函数(`module, module,exports, __webpack_require__`)对模块进行包裹构成
2. `__webpack_require__(moduleId)`
   - 手动实现加载一个模块
   - 对已加载过的模块进行缓存
   - 对未加载过的模块，执行 id 定位到 `__webpack_modules__` 中的包裹函数，执行并返回 module.exports，并缓存
3. `__webpack_require__(0)`: 运行第一个模块，即运行入口模块
4. `code spliting`
   - `webpack` 中会有 `jsonp` 加载 `chunk` 的运行时代码。
5. `example`

```js
/******/ var __webpack_modules__ = [
  ,
  /* 0 */ /* 1 */
  /***/ (module) => {
    module.exports = (...args) => args.reduce((x, y) => x + y, 0);

    /***/
  },
  /******/
];
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
  /******/ // Check if module is in cache
  /******/ var cachedModule = __webpack_module_cache__[moduleId];
  /******/ if (cachedModule !== undefined) {
    /******/ return cachedModule.exports;
    /******/
  }
  /******/ // Create a new module (and put it into the cache)
  /******/ var module = (__webpack_module_cache__[moduleId] = {
    /******/ // no module.id needed
    /******/ // no module.loaded needed
    /******/ exports: {},
    /******/
  });
  /******/
  /******/ // Execute the module function
  /******/ __webpack_modules__[moduleId](
    module,
    module.exports,
    __webpack_require__
  );
  /******/
  /******/ // Return the exports of the module
  /******/ return module.exports;
  /******/
}
/******/
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
  const sum = __webpack_require__(1);

  sum(3, 8);
})();
```

## 2.Rollup

1. `Rollup`仅仅是将模块铺平展开

```js
// index.js
import name from "./name";
console.log(name);
```

```js
// name.js
const name = "shanyue";
export default name;
```

```js
// output.js
const name = "shanyue";
console.log(name);
```
