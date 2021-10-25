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

## 8.React

1. 使用`@vitejs/plugin-react-refresh`替换`react-hot-loader`
   - 解决了很多`react-hot-loader`无法解决的问题
   - 速度更快
   - 支持局部更新

## 9.Vite 使用 typescript

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node", // 通过node的方式解析模块
    "jsx": "preserve", // ts不编译jsx的语法
    "sourceMap": true, // 直接调试ts的代码
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "lib": ["esnext", "dom"],
    "types": ["vite/client"] // 可以使用import.meta上的属性
  },
  "include": ["src/**/*"]
}
```

## 10.vite 处理静态文件

1. `types`

   - `url`
     ```js
     import test from "./test?url";
     ```
   - `raw`
     ```js
     import test from "./test?raw";
     ```
   - `worker/worker inline`

     ```js
     // worker.js
     function timedCount() {
       i = i + 1;
       postMessage(i);
       setTimeout(timedCount, 500);
     }

     timedCount();
     ```

     ```js
     // test.js
     import Worker from "./worker?worker";
     const worker = new Worker();
     ```

     - `json`

     ```js
     import { version } from "../package.json";
     ```

## 11.vite 环境变量

1. Build In（import.meta.env）
   - MODE
   - BASE_URL
   - PROD
   - DEV
2. 在根目录的`.env`文件定义变量
   ```js
   // .env
   // .env.development 测试环境生效
   // .env.production 生产环境生效
   VITE_AAA = xxx;
   ```
3. 在`vite-env.d.ts`中声明类型
   ```js
   interface ImportMetaEnv {
     VITE_TITLE: string;
   }
   ```

## 12.hmr 热更新

- 文件更新，`server`端通过`websocket`推送事件给客户端，客户端重新请求`js`替换执行

## 13.使用 glob-import 批量导入

```js
const globModules = import.meta.glob("./glob/*-[0-9].js");

Object.entries(globModules).forEach(([k, v]) => {
  v().then((m) => console.log(k + ":" + m.default));
});
```

## 14.预编译

1. `vite`预编译会将`commonjs`的文件预编译成`ES module`文件，放到`.Vite`文件下
2. `vite`预编译会将同一依赖下的多个文件打包成一个文件
3. `optimizeDeps`

```js
export default defineConfig({
  optimizeDeps: {
    // include: [], // 需要预编译的文件
    exclide: ["react"], // 不需要预编译的文件
  },
});
```

## 15.SSR

```js
const app = express();
const { createServer: createViteServer } = require("vite");
createViteServer({
  server: {
    middlewareMode: "ssr",
  },
}).then((vite) => {
  app.use(vite.middlewares);

  const url = req.originalUrl;

  let template, render;
  if (!isProd) {
    // always read fresh template in dev
    template = fs.readFileSync(resolve("index.html"), "utf-8");
    // 热更新
    template = await vite.transformIndexHtml(url, template);
    // 加载
    render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render;
  } else {
    template = indexProd;
    render = require("./dist/server/entry-server.js").render;
  }

  app.listen(4000);
});
```

## 16.vite 插件

1. 插件执行时机

- `pre`
- `normal`
- `post`

2. 插件示例

```js
export default (enforce?: "pre" | "post") => {
  return {
    name: "test",
    enforce,
    buildStart() {
      console.log("buildStart", enforce);
    },
    // 如何去找到文件
    resolveId() {
      console.log("resolved", enforce);
    },
    load() {
      console.log("load", enforce);
    },
  };
};
```

```js
// 在vite启动之前执行
// buildStart pre
// buildStart undefined
// buildStart post
// resolved pre
// load pre
// load undefined
// load post
{
  plugins: [testPlugin("post"), testPlugin(), testPlugin("pre")];
}
```

3.
