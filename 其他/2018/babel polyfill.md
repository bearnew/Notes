## 寻找适合低端机的`babel polyfill`方式
#### 1. 使用corejs-3编译, 编译后的语法过新，低端机报错
```js
    const presets = [
        [
            '@babel/preset-env',
            {
                modules: 'commonjs',
                // 文档https://github.com/browserslist/browserslist
                // targets: 'iOS >= 10, FirefoxAndroid >= 50, ChromeAndroid >= 40, Android >= 40',
                targets: 'since 2014',
                useBuiltIns: 'usage',
                corejs: 3
            }
        ],
        '@babel/preset-typescript',
        '@babel/preset-react'
    ];
```
```js
{
"type":"ERROR_RUNTIME",
"message":"Uncaught TypeError: Cannot convert a Symbol value to a string at http://www.dev.qa.nt.tripcorp.com/m/flights/static/common/pages-common.js:11279:47",
"stack":"TypeError: Cannot convert a Symbol value to a string
at baseGetTag (http://www.dev.qa.nt.tripcorp.com/m/flights/static/common/pages-common.js:11279:47)
at isFunction (http://www.dev.qa.nt.tripcorp.com/m/flights/static/common/pages-common.js:14401:13)
at baseIsNative (http://www.dev.qa.nt.tripcorp.com/m/flights/static/common/pages-common.js:11597:17)
at getNative (http://www.dev.qa.nt.tripcorp.com/m/flights/static/common/pages-common.js:12510:10)
at Object.push.../node_modules/_lodash@4.17.11@lodash/_Map.js (http://www.dev.qa.nt.tripcorp.com/m/flights/static/common/pages-common.js:10710:11)
at __webpack_require__ (http://www.dev.qa.nt.tripcorp.com/m/flights/static/pages/book_b.js:783:30)
at fn (http://www.dev.qa.nt.tripcorp.com/m/flights/static/pages/book_b.js:151:20)
at Object.push.../node_modules/_lodash@4.17.11@lodash/_stackSet.js (http://www.dev.qa.nt.tripcorp.com/m/flights/static/common/pages-common.js:13871:11)
at __webpack_require__ (http://www.dev.qa.nt.tripcorp.com/m/flights/static/pages/book_b.js:783:30)
at fn (http://www.dev.qa.nt.tripcorp.com/m/flights/static/pages/book_b.js:151:20)",
"pageid":"10320667442",
"url":"http://www.dev.qa.nt.tripcorp.com/m/flights/book/?shoppingid=8000000000I0h0010024aH0h00203PaaH800000000000000000000100JmT510G0028YvQe030Um8000000000I&criteriatoken=tripType%3AOW%7CcabinClass%3AYSGroup%7Cadult%3A1%7CdCity_1%3ALON%7CaCity_1%3ASHA%7Cdate_1%3A2019-06-01%7Cvstype%3A2%7Cselectab%3AD&ddate=2019-06-01&dcitycode=LON&acitycode=SHA&classtype=0&classgroupsearch=true&triptype=0&adult=1&child=0&infant=0&transactionid=20190530205208211"
}
```
#### 2. 使用corejs-2编译，无法对新语法进行编译(corejs-2的最新版本发布于4年前)，报错
```js
    const presets = [
        [
            '@babel/preset-env',
            {
                modules: 'commonjs',
                // 文档https://github.com/browserslist/browserslist
                // targets: 'iOS >= 10, FirefoxAndroid >= 50, ChromeAndroid >= 40, Android >= 40',
                targets: 'since 2014',
                useBuiltIns: 'usage',
                corejs: 2
            }
        ],
        '@babel/preset-typescript',
        '@babel/preset-react'
    ];
```
```js
{
    "type":"ERROR_RUNTIME",
    "message":"Uncaught TypeError: undefined is not a function at http://www.dev.qa.nt.tripcorp.com/m/flights/static/pages/book_b.js:13618:25",
    "stack":"TypeError: undefined is not a function
    at _iterableToArray (http://www.dev.qa.nt.tripcorp.com/m/flights/static/common/pages-common.js:293:118)
    at _toConsumableArray (http://www.dev.qa.nt.tripcorp.com/m/flights/static/common/pages-common.js:507:36)
    at http://www.dev.qa.nt.tripcorp.com/m/flights/static/pages/book_b.js:36727:42
    at http://www.dev.qa.nt.tripcorp.com/m/flights/static/pages/book_b.js:16093:25
    at http://www.dev.qa.nt.tripcorp.com/m/flights/static/pages/book_b.js:16053:25
    at http://www.dev.qa.nt.tripcorp.com/m/flights/static/pages/book_b.js:16107:33
    at http://www.dev.qa.nt.tripcorp.com/m/flights/static/pages/book_b.js:16053:25
    at http://www.dev.qa.nt.tripcorp.com/m/flights/static/pages/book_b.js:16103:37
    at http://www.dev.qa.nt.tripcorp.com/m/flights/static/pages/book_b.js:16053:25
    at Function.mapStateToProps (http://www.dev.qa.nt.tripcorp.com/m/flights/static/pages/book_b.js:31487:67)",
    "pageid":"10320667441",
    "url":"http://www.dev.qa.nt.tripcorp.com/m/flights/book/?currencytag=USD&shoppingid=8000000008I0W08L0Z15NX003R0FoghmY8000000001I00000000001000s9510G0038uYQe0067u8000WuiLUJ4&criteriatoken=tripType%3AOW%7CcabinClass%3AYSGroup%7Cadult%3A1%7CdCity_1%3ASHA%7CaCity_1%3ATYO%7Cdate_1%3A2019-12-21%7CExtensionFlag%3A0%7Cselectab%3AA%7CSubChannel%3A0%7CCurrency%3AUSD&ddate=2019-12-21&dcitycode=SHA&acitycode=TYO&classtype=0&classgroupsearch=true&triptype=0&adult=1&child=0&infant=0&transactionid=20191219210357359"
}
```
![image](/uploads/ca0c7bb3b522f38c7756db1a30c3e7e7/image.png)
#### 3. [`@babel/runtime`](https://babeljs.io/docs/en/babel-plugin-transform-runtime)
  * 复用帮助函数，减小包大小
  * 创建沙盒环境，不污染全局变量
  * 也可以进行`babel-polyfill`操作, 并且兼容性更好，版本也更新
```js
    const plugins = [
        // 减少 babel helper 函数
        [
            '@babel/plugin-transform-runtime',
            {
                // 使用babel-runtime进行polyfill
                'corejs': 3, // 依赖@babel/runtime-corejs3
                'helpers': true, // 默认，可以不写
                'regenerator': true, // 提供regeneratorRuntime, 用于编译async await
                'useESModules': false, // 使用 es modules helpers, 减少 commonJS 语法代码
                'absoluteRuntime': true // 是否跨项目引用 runtime
            }
        ]
      ]
```
![image](/uploads/c5f7f0f1b396f3e43d3fa09eaeabc22e/image.png)

## `corejs-2`， `corejs-3`, '@babel/runtime-corejs3'进行`polyfill`的区别
#### 1. polyfill是对ES6以及ES6+内置对象，静态方法，实例方法进行编译
  * 内置对象
    `Symbol Set Map WeakSet WeakMap Proxy Reflect Promise`  
  * 静态方法
    * `Number.isNaN() Number.parseInt() Number.parseFloat()`
    * `Array.from() Array.of()`
    * `Object.assign() Object.keys() Object.setPrototypeOf()`  
* 实例方法
    `find() findIndex() includes() flat()`

#### 2. polyfill原理
1. 三者都是使用的`https://github.com/zloirock/core-js`的源码进行polyfill
  * `corejs-2`和`corejs-3`使用的是`core-js/packages/core-js`
  * `@babel/runtime-corejs3`使用的是`core-js/packages/core-js-pure`
2. 编译比较
  * ES6源码
  ```js
  
// 语法糖
const a = `babel`;
class b {
};

// 内置对象
const c = [...new Set([1, 2, 3, 3])]

// 静态方法
const d = Array.from('foo');

// 实例方法
const e = [1, 2, 3].includes(4);  
```
  * `corejs-2`编译
  ```js
  "use strict";

var _interopRequireDefault = require("/Users/xiong_x/Ctrip/babel-test/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.string.includes");

require("core-js/modules/es6.array.from");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.set");

var _toConsumableArray2 = _interopRequireDefault(require("/Users/xiong_x/Ctrip/babel-test/node_modules/@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("/Users/xiong_x/Ctrip/babel-test/node_modules/@babel/runtime/helpers/classCallCheck"));

// 语法糖
var a = "babel";

var b = function b() {
  (0, _classCallCheck2.default)(this, b);
};

; // 内置对象

var c = (0, _toConsumableArray2.default)(new Set([1, 2, 3, 3])); // 静态方法

var d = Array.from('foo'); // 实例方法

var e = [1, 2, 3].includes(4);
  ```
  * `corejs-3`编译
  ```js
  "use strict";

var _interopRequireDefault = require("/Users/xiong_x/Ctrip/babel-test/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.set");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

var _toConsumableArray2 = _interopRequireDefault(require("/Users/xiong_x/Ctrip/babel-test/node_modules/@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("/Users/xiong_x/Ctrip/babel-test/node_modules/@babel/runtime/helpers/classCallCheck"));

// 语法糖
var a = "babel";

var b = function b() {
  (0, _classCallCheck2.default)(this, b);
};

; // 内置对象

var c = (0, _toConsumableArray2.default)(new Set([1, 2, 3, 3])); // 静态方法

var d = Array.from('foo'); // 实例方法

var e = [1, 2, 3].includes(4);

  ```
  * `@babel/runtime-corejs3`编译
  ```js
  "use strict";

var _interopRequireDefault = require("/Users/xiong_x/Ctrip/babel-test/node_modules/@babel/runtime-corejs3/helpers/interopRequireDefault");

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

var _from = _interopRequireDefault(require("/Users/xiong_x/Ctrip/babel-test/node_modules/@babel/runtime-corejs3/core-js-stable/array/from"));

var _set = _interopRequireDefault(require("/Users/xiong_x/Ctrip/babel-test/node_modules/@babel/runtime-corejs3/core-js-stable/set"));

var _toConsumableArray2 = _interopRequireDefault(require("/Users/xiong_x/Ctrip/babel-test/node_modules/@babel/runtime-corejs3/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("/Users/xiong_x/Ctrip/babel-test/node_modules/@babel/runtime-corejs3/helpers/classCallCheck"));

var _context;

// 语法糖
var a = "babel";

var b = function b() {
  (0, _classCallCheck2["default"])(this, b);
};

; // 内置对象

var c = (0, _toConsumableArray2["default"])(new _set["default"]([1, 2, 3, 3])); // 静态方法

var d = (0, _from["default"])('foo'); // 实例方法

var e = (0, _includes["default"])(_context = [1, 2, 3]).call(_context, 4);

  ```