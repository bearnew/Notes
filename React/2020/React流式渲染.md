## SSR 流式渲染实践

### 1.stream（流）

1.  `stream`是 Node.js 提供的又一个仅在服务区端可用的模块，流是一种抽象的数据结构。
2.  `stream`以高效的方式处理读/写文件、网络通信、或任何类型的端到端的信息交换。
3.  传统的文件处理，会将文件从头到尾读入内存，然后进行处理，使用流，则可以逐个片段地读取并处理（而无需全部保存在内存中）。
4.  `stream`的优点
    - **内存效率**: 无需加载大量的数据到内存中即可进行处理。
    - **时间效率**: 当获得数据之后即可立即开始处理数据，这样所需的时间更少，而不必等到整个数据有效负载可用才开始。
5.  `stream`示例

    - readFile 直接读取

    ```js
    // readFile() 读取文件的全部内容，并在完成时调用回调函数。
    // 如果文件很大，则该操作会花费较多的时间
    const http = require("http");
    const fs = require("fs");

    const server = http.createServer(function (req, res) {
      fs.readFile(__dirname + "/data.txt", (err, data) => {
        res.end(data);
      });
    });
    server.listen(3000);
    ```

    - 使用`stream`

    ```js
    // 获得数据就立即开始将其流式传输到 HTTP 客户端，而不是等待文件被完全读取
    const http = require("http");
    const fs = require("fs");

    const server = http.createServer((req, res) => {
      const stream = fs.createReadStream(__dirname + "/data.txt");
      stream.pipe(res);
    });
    server.listen(3000);
    ```

### 2.React SSR 流式服务端渲染

1. `React16`支持了流式服务端渲染
   - `renderToNodeStream`用于替代`renderToString`，返回一个可输出`HTML`字符串的可读流
   - `renderToStaticNodeStream`用于替代`renderToStaticMarkup`，生成用于静态页面（生成干净的 HTML，不带额外的 DOM 属性，没有事件交互，不需要 `hydrate`）的可读流
2. `React16`流式渲染的优点
   - 并行地分发`HTML`片段，让渲染出的首字节有意义的内容给用户速度更快
   - 相对`renderToString`，流是异步的。这个可以让你的`Node.js`服务一次性渲染多个请求，并且保持在高请求压力环境下的及时响应

### 3.流式渲染接入

1. 常规的流式渲染接入

   ```js
   import { renderToNodeStream } from "react-dom/server";
   import FrontendApp from "../client";

   app.use("*", (request, response) => {
     // 一开始发送有意义的页面部分
     response.write(
       '<html><head><title>Page</title></head><body><div id="root">'
     );
     // 把组件渲染成流，并且给Response
     const stream = renderToNodeStream(<FrontendApp />);
     stream.pipe(response, { end: "false" });
     // 当React渲染结束后，发送剩余的HTML部分给浏览器
     stream.on("end", () => {
       response.end("</div></body></html>");
     });
   });
   ```

2. 针对我们项目`ejs`和`css modules`接入`renderToNodeStream`

   - 接入前(`renderToString`)

     ```jsx
     const html = ReactDomServer.renderToString(
       <StyleContext.Provider value={{ insertCss }}>
         <Provider {...stores}>
           <App stores={Object.values(stores)} />
         </Provider>
       </StyleContext.Provider>
     );

     res.render(appView, {
       error: null,
       content: html,
       rawData: serialize(stores, { isJSON: true }),
       isoStyle: `<style>${[...css].join("")}</style>`,
     });
     ```

   - 接入`renderToNodeStream`

     ```jsx
     // 借助ejs-stream2向ejs模板html中传入变量
     const ejsStream = require("ejs-stream2");

     // templateHtml为ejs模板html
     const stream = ejsStream.compile(templateHtml)({
       content: ReactDomServer.renderToNodeStream(
         <StyleContext.Provider value={{ insertCss }}>
           <Provider {...stores}>
             <App stores={Object.values(stores)} />
           </Provider>
         </StyleContext.Provider>
       ),
       ...res.locals,
       error: null,
       rawData: serialize(stores, { isJSON: true }),
     });

     res.writeHead(200, { "Content-type": "text/html;charset=utf-8" });
     // 流式输出
     stream.pipe(res);
     stream.on("error", (error) => {
       res.end();
     });
     // 刷新响应头
     stream.on("end", (error) => {
       res.flushHeaders();
     });
     ```

   - 接入`renderToNodeStream`（非核心代码）
     - 生成`templateHtml`
       - 因为我们使用了`express-ejs-layouts`，`layout`和页面 html 分开的
       - 使用`stream`流式渲染需要将模板`html`合并起来
     - 使用了`css-modules`，流式渲染无法生成组件的`css`，需要改写`isomorphic-style-loader`源码
       - 参考`Issue`: https://github.com/kriasoft/isomorphic-style-loader/pull/166/commits/b81558a178b1d59b181509f74f794a1b4aa0b936

### 4.实际项目流式渲染

1. renderToNodeStream 对项目提升并不大
2. 主要时间在服务端对数据的请求
3. 思路：服务端请求数据前，先把 head 头部渲染出来，head 头部中包含首屏资源的 preload

```js
const streamCallBack = async (err, html) => {
  if (err) {
    return req.next(err);
  }

  // 设置streaming html header
  res.set({
    "X-Accel-Buffering": "no",
    "Content-Type": "text/html; charset=UTF-8",
  });
  res.writeHead(200);

  // 把渲染出来的整个html分为5部分
  const chunkSplitTag = '<div class="stream-split"></div>';
  const splitChunks = html.split(chunkSplitTag);
  const firstChunk = splitChunks[0];
  const secondChunk = splitChunks[1]; // renderToString的内容填充
  const thirdChunk = splitChunks[2];
  const fourthChunk = splitChunks[3]; // rawData内容填充
  const fifthChunk = splitChunks[4];

  // firstChunk中包含了首屏js的preload
  res.write(firstChunk);

  const stores = await getMainData();

  const css = new Set(); // CSS for all rendered React components
  const insertCss = (...styles) =>
    styles.forEach((style) => css.add(style._getCss()));
  const reactHtml = ReactDomServer.renderToString(
    <StyleContext.Provider value={{ insertCss }}>
      <Provider {...stores}>
        <App stores={Object.values(stores)} />
      </Provider>
    </StyleContext.Provider>
  );

  res.write(`<style>${[...css].join("")}</style>`);
  res.write(`<div id="main">${reactHtml}</div>`);
  const rawData = serialize(stores, { isJSON: true });
  res.write(thirdChunk);
  res.write(`<script>window.rawData=${rawData};</script>`);
  res.write(fifthChunk);
  res.end();
};

res.render(
  appView,
  {
    error: null,
    content: "",
    rawData: "{}",
    isoStyle: "",
  },
  streamCallBack
);
```
