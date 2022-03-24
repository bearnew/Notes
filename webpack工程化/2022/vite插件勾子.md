# vite 插件勾子

## 1.通用勾子（Rollup 通用勾子）

1. 服务器启动时调用 1 次

    - `options`替换或者操纵`rollup`选项
    - `buildStart`开始创建

2. 下面勾子每次有模块请求时都会被调用

    - `resolveId`创建自定义确认函数，常用于定义第三方依赖
    - `load`创建自定义加载函数，可用于返回自定义的内容
    - `transform`可用于转换已加载的模块内容

3. 下面的勾子会在服务器关闭时调用 1 次
    - `buildEnd`
    - `closeBundle`

## Vite 特有勾子

-   `config`: 修改`vite`配置
-   `configResolved`: `vite`配置确认
-   `configureServer`: 用于配置`dev server`
-   `transformIndexHtml`: 用于转换宿主页
-   `handleHotUpdate`: 自定义`HMR`更新时调用

## hooks 范例

```js
export default function vitePluginTest() {
    // 返回插件对象
    return {
        // 名称用于警告和错误展示
        name: "vite-plugin-test",
        // step3-初始化hooks，只走1次
        options(opts) {
            console.log("options", opts);
        },
        // step5-开始创建
        buildStart() {
            console.log("buildStart");
        },
        // step1-修改vite配置
        config(config) {
            console.log("config", config);
            // 会将返回的对象和默认的config进行合并
            return {};
        },
        // step2-vite配置确认
        configResolved(resolveConfig) {
            console.log("configResolved");
        },
        // step4-配置dev server
        configureServer(server) {
            console.log("configureServer");
            // 拿到server的实例，做中间件的处理
            server.app.use((req, res, next) => {});
        },
        // stepA-转换宿主页
        transformIndexHtml(html) {
            console.log("transformIndexHtml");
            return html.replace(
                /<title>(.*?)<\/title>/,
                `<title>vite plugin test</title>`
            );
        },
        // stepB-id确认
        resolveId(source) {
            if (source === "virtual-module") {
                console.log("resolveId", source);
                // 返回source标明命中，vite不再询问其他插件处理该id请求
                return source;
            }
            // 返回null表明是其他id要继续处理
            return null;
        },
        // stepC-加载模块代码
        load(id) {
            if (id === "virtual-module") {
                // 返回virtual-module模块源码
                return `export default "this is virtual"`;
            }
            // 其他id继续处理
            return null;
        },
        // stepD-转换
        transform(code, id) {
            if (id === "virtual-module") {
                console.log("transform");
            }
            return code;
        },
    };
}
```
