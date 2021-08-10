# vite 入门

## 1.模块打包工具解决的问题

1. `ES Module`的浏览器兼容性问题
2. 合并代码，解决模块文件过多导致的频繁发送网络请求的问题
3. 资源文件模块化的问题

## 2.vite 的特点

1. vite 在开发模式下不需要打包可以直接运行，使用的是 ES6 的模块化加载机制
2. vite 基于缓存的热更新，`webpack`基于自己的热更新
3. 按需进行编译，不会刷新全部`DOM`
4. 生产环境采用`rollup`打包
5. vite 主要特点：快速启动、按需编译、模块热更新

## 3.vite 实现的原理

1. `webpack`文件变更后，会将变更文件相关的内容重新打包成`bunble`，更新到内存中，`web server`重启加载
2. `vite`启动`vite server`服务直接返回原文件，无论是`.vue`还是`.jsx`文件，响应头的`content-type`都为`application/javascript`

## 4.vite 使用 esbuild 预构建依赖

1. Esbuild 使用 Go 编写，并且比以 JavaScript 编写的打包器预构建依赖快 10-100 倍。
2. Esbuild 加载器的作用与 webpack 中 loader 作用类似，都是对于某种类型的文件进行编译。
3. esbuild 提供了 api 调用的方式，在调用 api 时传入 option 进行相应功能的设置。在 esbuild 的 API 中，有两个主要的 API 调用方式：transform 和 build。两者的区别在于是否最终生成文件。
4. esbuild 就是和它的名字一样，只负责处理 ts 和 js 的……更适合作为 tsc 和 babel 的对标

## 5.vite 命令

```js
// 查看vite命令
npx vite --help
```

## 6.插件

1. `vite-plugin-md`
   - 转换 md 为组件
2. 插件实现

```ts
// vite-plugin-vFile
export default function myPlugin() {
  const vfileid = "my-vfiles";
  return {
    name: "my-vfiles-plugin",
    resolveId(id) {
      if (id === vFileid) {
        return vFileid;
      }
    },
    load(id) {
      if (id === vFileid) {
        return `export const msg = "vite plugin test"`;
      }
    },
  };
}
```

```ts
import test from "my-vfiles";

console.log(test); // vite plugin test
```

## 7.命令行

1. 创建 1 个命令行工具

```js
// 生成package.json时不敲回车，直接生成命令
npm init -y
```

```js
// 在package.json中
{
  "name": "testbin",
  "bin": "index.js"
}
```

```js
#!/usr/bin/env node
console.log("terminate test");
```

```js
// 命令
npm link
```

```js
// 命令
testbin; // terminate test
```
