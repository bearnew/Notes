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
  // __dirname当前脚本所在目录的绝对路径
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

### 三、开源

1. 开源协议

   - MIT，一般库都选择 MIT
   - BSD
   - Apache，涉及专利技术选择 Apache 协议

2. 发布包
   - 使用`.npmignore`来忽略文件
   - 发布测试包
   ```js
   npm publish --tag=beta
   ```
   - 发布共有包
   ```js
   npm publish --access public
   ```
   - 在 package.json 中添加`publishConfig`字段
   ```js
   {
        "publishConfig": {
            "registry": "https://registry.npmjs.org",
            "access": "public"
        }
   }
   ```
   - 发布后添加 tag
   ```js
   git tag 1.0.0 // 添加指定版本tag
   git push --tags // 将tag推送到远端
   ```
3. github registry 数据
   - https://github.com/bearnew/Notes/graphs/traffic
   - https://github.com/bearnew/webpack-template/network/dependents
4. npm 数据
   - https://www.npmjs.com/package/next-webpack-cli

### 四、维护

1. 规范

- `EditorConfig`
- `prettier`
- `husky`
- `eslint`

  ```js
  // eslint初始化
  npx eslint --init
  ```

  ```js
  // 解决Eslint和Prettier的规则
  npm i eslint-plugin-prettier -D // 让Eslint对prettier进行检查
  npm i eslint-config-prettier -D // 把Eslint和prettier冲突的规则都关闭
  ```

- `Conventional commits`规范`commit`的提交
- 持续集成（test、lint）

### 五、设计更好的 JS 库

1. 设计更好的函数

- 命名准确简洁
- 参数个数越少越好，2 个参数或者对象化参数
- 返回值一致，字符串使用''兜底，而不是`undefined`
- 参数校验
  - 对于`object array function`要做强制校验
  - 对于`number string boolean`做自动转换
    - 数字用`Number`
    - 整数用`Math.round`
    - 字符串用`String`
    - 布尔值使用`!!`
- 副作用
  - 不要修改环境信息如`Array.prototype`
  - 不要修改函数参数，如参数是对象，在函数内修改了参数
- 异常捕获

  ```js
  function safeParse(str, backupData) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return backupData;
    }
  }

  // 不报错，返回{}
  safeParse("1", {});
  ```

-

2. 兼容性问题

- `String.prototype.trim`，ES2015 新增的函数
- `String.prototype.trimStart`，ES2021 新增函数
- `String.proptype.replaceAll`，ES2021
- `Array.from` ES2015
- `Array.prototype.findIndex`，ES2015
- `Array.prototype.includes`，ES2016
- `Array.prototype.flat` ES2019
- `Array.prototype.fill` ES2015
- `Object.values` ES2017
- `Object.entries` ES2017
  ```js
  const obj = {
    a: 1,
    b: 2,
  };
  Object.entries(obj); // [['a', 1], ['b', 2]]
  ```
-

### 六、安全防护

1. 冻结对象

- `Object.preventExtensions`
- `Object.seal`
- `Object.freeze`

2. npm list 查看完整依赖库
3. npm audit 安全审核

### 七、抽象标准库

1. Once

```js
export function once(fn) {
  let count = 0;
  return function (...args) {
    if (count === 0) {
      count += 1;
      return fn(...args);
    }
  };
}

const log = () => {
  console.log("1111");
};
const log1 = once(log);

log1(); // 1111
log1(); // 无输出
```

2. 递归循环引用，会导致栈溢出，不递归，改用循环

```js
function cloneForce(x) {
  const uniqueList = []; // 用来去重
  let root = {};

  // 循环数组
  const loopList = [
    {
      parent: root,
      key: undefined,
      data: x,
    },
  ];

  while (loopList.length) {
    // 深度优先
    const node = loopList.pop();
    const parent = node.parent;
    const key = node.key;
    const data = node.data;

    // 初始化赋值目标，如果key为undefined，则拷贝到parent，否则拷贝到parent[key]
    let res = parent;
    if (typeof key !== "undefined") {
      res = parent[key] = {};
    }

    let uniqueData = find(uniqueList, data);
    if (uniqueData) {
      parent[key] = uniqueData.target;
      continue;
    }

    uniqueList.push({
      source: data,
      target: res,
    });

    for (let k in data) {
      if (data.hasOwnProperty(k)) {
        if (typeof data[k] === "object") {
          // 下一次循环
          loopList.push({
            parent: res,
            key: k,
            data: data[k],
          });
        } else {
          res[k] = data[k];
        }
      }
    }
  }
  return root;
}

function find(arr, item) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].source === item) {
      return arr[i];
    }
  }

  return null;
}
```

## 八、命令行工具

1. 使用`jslib`初始化一个项目

```js
jslibbook new mylib
```

2. 交互式界面可以使用`Inquirer.js`
3. `chalk`打印颜色
4. `ora`实现`loading`效果

## 九、工具库

1. 博客推荐使用`Gatsby`或`Hexo`
2. 写文档推荐`Docusaurus`(`react`)或`VuePress`
