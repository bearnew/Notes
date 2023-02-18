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

- 浏览器不支持`AMD`
- 是异步模块加载规范
- `Require.js`是最广泛的模块加载器

```js
define(["clone"], function (clone) {
  const a = { a: 1 };
  const b = clone(b); // 使用clone函数
});
```

3. CommonJS

- 用于浏览器环境中

```js
function clone() {}
module.exports = clone;
```

```js
const clone = require("./clone.js");
```

4. UMD

- 通用模块加载规范
- 对原始模块、AMD、CommonJS 的整合

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

7. 打包工具
   - `webpack`将多个模块合并到一个匿名函数中，通过`_webpack_require(1)`进行引用，但是会生成很多冗余的代码
   - `rollup.js`打包内容没有模块的概念，巧妙的将被依赖模块放到依赖模块之前，`rollup.js`是库开发者最完美的方案

### 2.rollup.js

1. `rollup config`

| 打包输出的文件    | 配置文件                    | 技术体系 | 模块规范  |
| :---------------- | :-------------------------- | :------- | :-------- |
| dist/index.js     | config/rollup.config.js     | Node.js  | CommonJS  |
| dist/index.esm.js | config/rollup.conig.esm.js  | webpack  | ES Module |
| dist/index.aio.js | config/rollup.config.aio.js | 浏览器   | UMD       |

2. 通过插件将依赖的库打包进来

```js
var pkg = require("../package.json");
var version = pkg.version;
var banner = `/*!
* ${pkg.name} ${version}
* Licensed under MIT
*/
`;
var nodeResolve = require("rollup-plugin-node-resolve");
module.exports = {
  input: "src/index.js",
  output: {
    file: "dist/index.aio.js",
    format: "umd",
    name: "clone",
    banner: banner,
  },
  plugins: [nodeResolve({ main: true })],
};
```

3. 设置`sideEffects: false`进行优化
4. es5-shim
   - `es5.shim.js`可以放心食用
   - `es5.sham.js`里面包含存在兼容性的特性
5. 使用`babel`编译,loose 为 true 能更好的兼容 IE8 浏览器

```js
// 源代码
const aaa = 1;
export default aaa;
```

```js
// 当loose为false时
Object.defineProperty(exports, "_esModule", {
  value: true,
});
var aaa = 1;
exports.default = 1;
```

```js
// 当loose为true
exports.__esModule = true;
var aaa = 1;
exports.default = 1;
```

6. 使用`@babel/plugin-transform-runtime`编译

## 二、测试

1. 单元测试
   - `Jest`
   - `Mocha`，使用`expect.js`作为断言库
   - `storybook`
2. `nyc`获得代码覆盖率

- 语句覆盖率
- 分支覆盖率
- 函数覆盖率
- 行覆盖率

```js
{
    "script": {
        "test": "nyc mocha"
    }
}
```

3. `babel-lugin-istanbul`源代码覆盖率
4. `jsdom`提供了对`DOM`进行模拟
   - `mocha-jsdom`
5. 新建`index.html`模拟真实的浏览器环境测试

```html
<script>
  var libs = {
    "expect.js": expect,
    "../src/index.js": window["clone"],
  };
  var require = function (path) {
    return libs[path];
  };
</script>
```

6. 使用`puppeteer.js`自动化测试

```js
const puppeteer = require("puppeteer");

(async () => {
  const testPath = `file: //${__dirname}/index.html`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(testPath);

  // 截屏并保存
  const pngPath = `${__dirname}/browser.png`;
  await page.screenshot({ path: pngPath, fullPage: true });

  /** 占位符 */
  await browser.clone();
})();
```
