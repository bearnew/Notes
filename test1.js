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
