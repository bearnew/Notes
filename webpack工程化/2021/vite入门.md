# vite 入门

## 1.模块打包工具解决的问题

1. `ES Module`的浏览器兼容性问题
2. 合并代码，解决模块文件过多导致的频繁发送网络请求的问题
3. 资源文件模块化的问题

## 2.vite 的特点

1. vite 在开发模式下不需要打包可以直接运行，使用的是 ES6 的模块化加载机制
2. vite 基于缓存的热更新，`webpack`基于自己的热更新
3. vite 主要特点：快速启动、按需编译、模块热更新

## 3.vite 实现的原理

1. `webpack`文件变更后，会将变更文件相关的内容重新打包成`bunble`，更新到内存中，`web server`重启加载
2. `vite`启动`vite server`服务直接返回原文件，无论是`.vue`还是`.jsx`文件，响应头的`content-type`都为`application/javascript`
