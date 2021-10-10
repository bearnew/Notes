# NodeJs 实战

## 1.NodeJs 是什么

1. 官方
   - `Node.js`是一个基于`Chrome V8`引擎的`js`运行环境
   - `Node.js`使用了一个事件驱动、非阻塞式 I/O 模型，使其轻量又高效
2. 和 web 区别
   - `Node.js`没有浏览器的`API`，即`document`和`window`等
   - 存在自己的`Node.js`的`Api`
   - `Chrome`里面的`js`控制浏览器，`Node.js`控制整个计算机

## 2.Node.js 可以做什么

1. 搜索引擎优化
2. 首屏速度优化（服务端渲染）
3. 用 Nodejs 做构建工具
4. 用 Nodejs 客户端技术(`electron`)实现，最大限度复用现有工程

```js
// process.argv可以读取命令参数
console.log(process.argv[process.argv.length - 1]); // rock
console.log(process);

// 程序持久运行，打印参数
process.stdin.on("data", (e) => {
  const result = process.argv[process.argv.length - 1];
  if (result === "quit") {
    process.exit();
  }
});
```

```shell
node test.js rock
```

## 3.commonJS

1. <Script/>标签加载脚本的弊端
   1. 脚本变多时，需要手动管理加载顺序
   2. 不同脚本之间的逻辑调用，需要通过全局变量的方式
   3. `NodeJS`没有`html`环境，无法写`<script/>`标签
2. 初始状态模块无导出，得到空对象，有值则为对象
   ```js
   // lib.js
   ```
   ```js
   // index.js
   var lib = require("./lib.js");
   console.log(lib); // {}
   ```
   ```js
   // lib.js
   exports.hello = "world";
   ```
   ```js
   var lib = require("./lib.js");
   console.log(lib); // { hello: 'world' }
   ```
3. `require`到的对象和`exports`导出的是同一个引用

   ```js
   // lib.js
   exports.hello = "world";

   setTimeout(() => {
     console.log(exports); // { hello: 'world', test: 'test' }
   }, 1000);
   ```

   ```js
   var lib = require("./lib.js");
   console.log(lib); // { hello: 'world' }
   lib.test = "test";
   ```

4. `module.exports`直接导出需要`require`的内容，会覆盖掉`export`变量本身

   ```js
   // lib.js
   exports.add = "add";
   module.exports = function test() {};
   setTimeout(() => {
     console.log(exports); // { add: 'add' }
   }, 1000);
   ```

   ```js
   // index.js
   var lib = require("./lib.js");
   console.log(lib); // [Function: test]
   console.log(lib.add); // undefined

   // .test挂载在了module.exports的函数上
   lib.test = "test";
   console.log(lib); // [Function: test] { test: 'test' }
   ```

## 4.npm

> Node.js 的包管理工具

1. 初始化一个 npm 包

```js
npm init
```

## 5.Node.js 内置模块

1. Node.js 内置模块流程

- ![Node.js内置模块](https://github.com/bearnew/picture/blob/master/markdown_v2/2021/nodeJS%E5%AE%9E%E6%88%98/nodejs%E8%BF%90%E8%A1%8C%E6%B5%81%E7%A8%8B.PNG?raw=true)

2. `Node.js`的事件模块

```js
const EventEmitter = require("events").EventEmitter;

class GeekTime extends EventEmitter {
  constructor() {
    super();
    setInterval(() => {
      this.emit("newlesson", { price: Math.random() * 100 });
    }, 3000);
  }
}

const geektime = new GeekTime();

geektime.addListener("newlesson", (res) => {
  console.log("newlesson come", res);
  if (res.price < 50) {
    console.log("cheap!");
  }
});
```

## 5.Node.js 的非阻塞 I/O

1. I/O 即`Input/Output`，即系统的输入/输出
2. 阻塞 I/O 和非阻塞 I/O 的区别在于系统接收输入再到输出期间，能不能接收其他输入
3. `glob`获取文件

```js
const glob = require("glob");

// 阻塞I/O
var result = glob.sync(__dirname + "/**/*");
// 非阻塞I/O
glob(__dirname + "/**/*", function (err, res) {
  result = res;
});
```
