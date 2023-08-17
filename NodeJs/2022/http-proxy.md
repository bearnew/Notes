# http-proxy

## 代理概念

###### 1.正向代理

1. 案例：用户 A 通过代理服务器 Z 去访问服务器 B
2. 场景：
   - 绕开问题链路: 用户 A 到服务 B 的路由链路出现问题
   - 加速访问: 用户 A 到代理 Z，代理 Z 到服务 B，都是高宽带链路，访问更快
   - Cache: 在代理服务 Z 中做 Cache
   - 隐藏用户 A 的行踪：服务 B 并不知道是用户 A 在访问

###### 2.反向代理

1. 案例：用户 A 不知道经过了代理服务器 Z，用户 A 认为是直接访问的服务 B，反向代理是一种部署方式
2. 场景：
   - 负载均衡：代理服务器去分发流量，如 NGINX 服务器
   - Cache：CDN 核心技术就是反向代理
   - 绕过跨域

###### 3.透明代理

1. 案例：用户 A 访问服务器，透明代理设备会拦截修改用户 A 的报文
2. 场景：公司行为管理透明代理

## 代理代码

1. 正向代理

```js
// 新建一个demo文件加
// 新建一个server.js 8000.js

// server.js内容
// 正向代理 ：如axios，http.proxy 用户直到，类似于梯子
// 反向代理 ：nginx 解决用户请求的，用户不知道

// 使用http-proxy 进行正向代理
var http = require("http");
var httpProxy = require("http-proxy");

// 创建代理服务器
let proxy = httpProxy.createProxyServer();

let server = http.createServer((req, res) => {
  proxy.web(req, res, {
    target: "http://localhost:8000",
  });
});

server.listen(3000);
// server启动成功
server.on("listening", () => {
  console.log("http启动完成");
});

// 关闭HTTP服务器

server.on("close", () => {
  console.log("服务器关闭");
});
```

```js
// 8000.js 内容
let http = require("http");

let server = http.createServer((req, res) => {
  res.write("this is port 8000");
  res.end();
});

server.listen(8000);

// server启动成功
server.on("listening", () => {
  console.log("http启动完成");
});

// 关闭HTTP服务器
server.on("close", () => {
  console.log("服务器关闭");
});

// 配置host文件 把www.test.com www.demo.com配置为本地
// 启动server.js的服务
// 启动8000的服务
// 我们在客户端访问localhost:3000就会拿到服务器返回的结果 this is port 8000
```

2.反向代理

```js
// 在当前目录新建一个proxy.js, 新建一个5000.js

/*
 * proxy.js内容
 */
// 反向代理
let httpProxy = require("http-proxy");
let http = require("http");
// 这是我们配置的域名，我们可以访问这些域名，拿到对应的结果
let hosts = {
  "m.hutaojie.com": "http://localhost:5000",
};

// 创建代理服务器
let proxy = httpProxy.createProxyServer();

let server = http.createServer((req, res) => {
  // 拿到host 访问对应的服务器
  let host = req.headers["host"].split(":")[0];
  proxy.web(req, res, {
    target: hosts[host],
    changeOrigin: true,
  });
});

server.listen(3000);
// server启动成功
server.on("listening", () => {
  console.log("http启动完成");
});

// 关闭HTTP服务器
server.on("close", () => {
  console.log("服务器关闭");
});
```

```js
/*
 * 5000.js
 */
let http = require("http");

let server = http.createServer((req, res) => {
  console.log(req.url);
  res.write("this is port 5000");
  res.end();
});

server.listen(5000);

// server启动成功
server.on("listening", () => {
  console.log("http启动完成");
});

// 关闭HTTP服务
server.on("close", () => {
  console.log("服务器关闭");
});

// 启动8000.js的服务
// 启动5000.js的服务
// 启动proxy.js的服务
//在浏览器访问 www.test.com:3000， www.demo.com:3000
```
