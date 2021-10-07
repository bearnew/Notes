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
```

```shell
node test.js rock
```
