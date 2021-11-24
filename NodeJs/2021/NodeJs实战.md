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

## 6.Node.js 事件循环

1. Node.js 事件循环
   - ![Node.js内置模块](https://github.com/bearnew/picture/blob/master/markdown_v2/2021/nodeJS%E5%AE%9E%E6%88%98/nodejs%E8%BF%90%E8%A1%8C%E6%B5%81%E7%A8%8B.PNG?raw=true)

## 7.HTTP

1. 一次网页请求，包含 2 次`HTTP`包交换

   - 浏览器向`HTTP`服务器发送请求`HTTP`包
   - `HTTP`服务器向浏览器返回`HTTP`包

2. HTTP 服务器作用
   - 解析进来的`HTTP`请求报文
   - 返回对应的`HTTP`返回报文

## 8.RPC 调用

1. `Remote Procedure Call`（远程过程调用）
2. 和`Ajax`有什么相同点

   - 都是两个计算机之间的网络通信
   - 需要双方约定一个数据格式

3. 和`Ajax`有什么不同点
   - 不一定使用`DNS`作为寻址服务
   - 应用层协议一般不使用`HTTP`
   - 使用基于`TCP`或`UDP`协议
4. `RPC`调用

   - 寻址/负载均衡
     - `Ajax`: 使用`DNS`进行寻址
     - `RPC`：使用特定服务进行寻址
   - `TCP`通信
     - 单工通信（永远只有一端给另一端发数据）
     - 半双工通信（同一时间只有一端给另一端发包）
     - 全双工通信（两端可以同时发包）
   - 二进制协议
     - 更小的数据包体积
     - 更快的编解码速率

5. `net`

- 全双工通信通道的搭建
  - 关键在于应用层协议需要有标记包号的字段
  - 处理以下情况，需要有标记包长的字段
    - 粘包
    - 不完整包
  - 错误处理
- server 端

  ```js
  const net = require("net");
  const server = net.createServer((socket) => {
    socket.on("data", (buffer) => {
      const id = buffer.readInt16BE();
      buffer.write(Buffer.from(data[id]));

      console.log(buffer, buffer.toString());
    });
  });

  server.listen(4000);

  const data = {
    1: "test-1",
    2: "test-2",
    3: "test-3",
    4: "test-4",
    5: "test-5",
    6: "test-6",
    7: "test-7",
    8: "test-8",
    9: "test-9",
  };

  const buffer = Buffer.alloc(4);
  buffer.writeInt16BE(data[Math.random()]);
  ```

- client 端

  ```js
  const net = require("net");
  const socket = new net.Scocket({});

  socket.connect({
    host: "127.0.0.1",
    port: 4000,
  });

  socket.write("hello world");
  ```

## 9.vm 模块

1. `vm`可以使用 v8 的`Virtual Machine contexts`动态地编译和执行代码，而代码的执行上下文是与当前进程隔离的，但是这里的隔离并不是绝对的安全，不完全等同浏览器的沙箱环境。
2. `vm`渲染模板字符串

```js
const result = `<h2>${user.name}</h2>`;
const vm = require("vm");

const templateMap = {
  templateA: `<h2>${include("templateB")}</h2>`,
  templateB: fs.readFilesync("templateB"),
};

const html = vm.runInNewContext(`${escape(result)}`, {
  user: { name: "test" },
  escape: function (markup) {
    if (!markup) return "";
    return String(html)
      .replace(/&(?!\w+;)/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;"); // IE不支持&apos, (单引号)转义
  },
  include: function (name) {
    return templateMap(name);
  },
});
```

3. `easy-socket`用于`socket`连接

## 11.Node.js 性能分析工具

1. profile

```js
node --prof entry.js
```

2. chrome devtool

```js
node --inspect-brk entry.js
```

```js
// 浏览器中
chrome://inspect/#devices
```

3. `clinic.js`

- nodejs 运行分析图表工具

## 12.代码优化

1. 文件读取操作不要放在中间件中

```js
const buffer = fs.readFileSync(__dirname + "/source/index.html");
app.use(
  mount("/", async (ctx) => {
    ctx.status = 200;
    ctx.type = "html";
    ctx.body = buffer;
  })
);
```

2. 内存优化管理

- 内存泄漏
  ```js
  const leak = [];
  app.use(
    mount("/", async (ctx) => {
      ctx.body = html;
      // 一直push不释放
      leak.push(leak);
    })
  );
  ```
- `Node.js Buffer`的内存分配策略
  - `Buffer`对应`C++`的`char[]`数组
  - `new`一个`8kb`的空间，小于`8kb`的都会分配`8kb`的`buffer`,然后后续小的`buffer`都会在前面`8kb`里面分配空间，不足，再分配新的`8KB`的空间

3.

## 13.Node.js C++插件

1. 将计算量转移到 C++进行

- 收益：C++运算比`javaScript`更快的部分
- 成本：C++变量和 V8 变量的转换

## 14.多进程优化

1. 使用子进程

```js
// master.js
const cp = require("child_process");
const child_process = cp.fork(__dirname + "/child.js");

child_process.send("haha");
child_process.on("message", (str) => {
  console.log("parent", str);
});
```

```js
// child.js
process.on("message", (str) => {
  console.log("child", str);
  process.send("hehe");
});
```

2. 使用子线程

- `worker_threads`

3. `cluster`

   - 通过`os.cpus().length`获取`cpu`的核数
   - 需要余出一些`CPU`处理事件循环以及节省内存

4. 进程守护与管理

```js
if (cluster.isMaster) {
  // 监听是否是僵尸进程(心跳检测)
  for(let i = 0;i < 1;i++) {
    const worker = cluster.fork();
    let missedPing = 0;
    let timerId = setInterval(() => {
      worker.send('ping');
      missedPing++;

      if (missedPing >= 3) {
        // worker.exit(1);
        clearInterval(timerId)
        process.kill(worker.process.pid);
      }
    }, 3000)
    worker.on('message', msg => {
      if (msg === 'pong') }{
        missedPing--;
      }
    })
  }

  cluster.on("exit", () => {
    // 复活死掉的进程
    setTimeout(() => {
      cluster.fork();
    }, 5000);
  });
} else {
  process.on("uncaughtException", (err) => {
    console.error(err);
  });

  process.on('message', str => {
    if (str === 'ping') {
      process.send('pong');
    }
  })

  setInterval(() => {
    if (process.memoryUsage().rss > 734003200) {
      console.log("oom");
      // 内存泄漏，推出程序
      process.exit(1);
    }
  }, 5000);
}
```

## 15.架构优化

1. 动静分离

- 静态内容：`CDN` 分发，`HTTP` 缓存
- 动态内容：用大量的源站机器承载，结合反向代理进行负载均衡

  2.使用`nginx`输出静态页面
