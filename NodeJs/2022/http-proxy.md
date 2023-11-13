# http-proxy

## 代理概念

###### 1.正向代理

1. 案例：用户 A 通过代理服务器 Z 去访问服务器 B
2. 场景：
   - 绕开问题链路: 用户 A 到服务 B 的路由链路出现问题
   - 加速访问: 用户 A 到代理 Z，代理 Z 到服务 B，都是高宽带链路，访问更快
   - Cache: 在代理服务 Z 中做 Cache
   - 隐藏用户 A 的行踪：服务 B 并不知道是用户 A 在访问
3. 在请求经过正向代理服务器时，代理服务器会在请求头中增加 Via 字段，用于标识请求经过的代理服务器列表。同时，代理服务器也会在请求头中增加 X-Forwarded-For 字段，用于标识请求的真实 IP 地址。

###### 2.反向代理

1. 案例：用户 A 不知道经过了代理服务器 Z，用户 A 认为是直接访问的服务 B，反向代理是一种部署方式
2. 场景：
   - 负载均衡：代理服务器去分发流量，如 NGINX 服务器
   - Cache：CDN 核心技术就是反向代理
   - 绕过跨域
   - 安全防护、访问控制
   - 内容路由：路由到不同的服务
3. 在请求经过反向代理服务器时，代理服务器会在请求头中增加 Via 字段，用于标识请求经过的代理服务器列表。同时，代理服务器也会在请求头中增加 X-Forwarded-Proto 字段，用于标识请求使用的协议（HTTP 或 HTTPS）
4. 目标服务器只能看到反向代理的 ip，无法识别客户端的真实 ip，可以通过读取 X-Forwarded-For 读取真实 Ip

###### 3.透明代理

1. 案例：用户 A 访问服务器，透明代理设备会拦截修改用户 A 的报文
2. 场景：
   - 公司行为管理透明代理
   - 访问控制：限制特定内容的访问
   - 带宽管理：限制特定用户或特定应用程序的带宽
3. 透明代理是一种不对请求头和响应头做任何修改的代理方式，因此不会增加任何额外的字段。
4. 目标服务器可以看到客户端的真实 IP 地址，并且无法识别请求是否经过了代理。
5. 公司监听到你的域名后
   - DNS 劫持是指返回给你一个伪造页面的 IP 地址
   - DNS 污染是返回给你一个不存在的页面的 IP 地址。

## VPN(Virtual Private Network) 虚化私有网络

1. 应用场景
   1. 任意 2 台机器进入虚拟局域网
      - 使用 vpn 网关加密，发出消息，接收站点使用 vpn 网关解密再发给站点
   2. 翻墙
2. 原理
   - vpn 在 Ip 层工作
   - vpn 是通过编写一套网卡驱动并注册到操作系统实现的虚拟网卡，这样数据只要经过网卡收发就可以进行拦截处理
   - 应用层并不知道网卡是虚拟的，这样 vpn 虚拟网卡将以中间人的身份对数据进行加工，从而实现各种神奇的效果
3. 隧道技术
   - 类似火车、地铁隧道，专用通道，不会堵车
4. 翻墙原理
   - 使用 VPS 搭建代理：VPS 技术通过使用虚拟化软件，将物理服务器分割成多个虚拟服务器。每个虚拟服务器都有自己的磁盘空间、内存、CPU 资源和网络接口。它们之间是相互独立的，互不干扰
   - 使用 IPV6 （IPV6 地址巨大，采用封地址不现实，但是目前国内只有部分高校部署了 IPV6）
   - 使用 HTTP 代理，请求代理服务器，代理服务器在去请求目标服务器。然后返回结果

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
