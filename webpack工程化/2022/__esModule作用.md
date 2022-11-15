# __esModule作用
- 解决`ESmodule`引用`commonjs`的问题
- 将`ES module`代码编译成`common.js`的时候会定义`__esModule`标识是否是`es module`模块
- `require`引入`import`模块的时候是`default`
```js
// a.js
const a = 1;
export default a;
```
```js
// b.js
export const b = 2;
```
```js
// main.js
const a = require('./a').default; // 1
const b = require('./b'); // { b: 2 }
```
```js
"use strict";
(() => {
var exports = {};
exports.id = 179;
exports.ids = [179];
exports.modules = {

/***/ 406:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.c = void 0;
const c = 1;
exports.c = c;

/***/ }),

/***/ 919:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {



var _c = _interopRequireDefault(__webpack_require__(406));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// console.log('main.js开始执行');
// import say from './a.js';
// import say1 from './b.js';
// say();
// console.log('main.js执行完毕');
console.log(_c.default);

/***/ })

};
;

// load runtime
var __webpack_require__ = require("./react_webpack_runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(919));
module.exports = __webpack_exports__;

})();
```