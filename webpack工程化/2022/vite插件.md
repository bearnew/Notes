# vite 插件

#### 1. vite 插件继承至`rollup`插件

-   https://github.com/rollup/plugins

#### 2. 命名规范

-   通用，支持`rollup`: `rollup-plugin-xxx`
-   只支持`vite`: `vite-plugin-xxx`

#### 3. 执行时机

-   `pre`: 在`alias`插件执行后被调用
-   `normal`: 在`vite`核心插件之后，`build`之前执行，默认`normal`
-   `post`: 在`build`之后，压缩、代码分析

#### 4.通用勾子（Rollup 通用勾子）

1. 服务器启动时调用 1 次

    - `options`替换或者操纵`rollup`选项
    - `buildStart`开始创建

2. 下面勾子每次有模块请求时都会被调用

    - `resolveId`找到对应的文件
    - `load`创建自定义加载函数，可用于返回自定义的内容，一般插件不需要此勾子
    - `transform`可用于转换加载的模块内容

3. 下面的勾子会在服务器关闭时调用 1 次
    - `buildEnd`
    - `closeBundle`

#### 5.rollup 不会在 vite 中调用的勾子

-   `moduleParsed`: `rollup`中对代码进行`AST`解析，因为耗时，`vite`不会去执行，`vite`插件处理完成后使用`Esbuild`解析

#### 6.vite 特有勾子

-   `config`: 修改`vite`配置，会合并`vite`的`config`
-   `configResolved`: `vite`配置，可用于存在运行环境中，用于插件读取
-   `configureServer`: 用于配置`dev server`，对`dev server`进行中间件操作
-   `transformIndexHtml`: 用于转换入口`html`文件
-   `handleHotUpdate`: 自定义`HMR`更新时调用

#### 7.示例

```js
// step1-step6 启动时执行
// stepA-stepD 解析每个模块时执行
export default function vitePluginTest(enforce?: "pre" | "post") {
    // 返回插件对象
    return {
        // 名称，可用于警告和错误展示
        name: "vite-plugin-test",
        enforce,
        // step1-修改vite配置
        config(config) {
            console.log("config");
            // 会将返回的对象和默认的config进行合并
            return {
                resolve: {
                    alias: {
                        "@styles": "/src/styles",
                    },
                },
            };
        },
        // step2-vite配置确认
        configResolved(resolveConfig) {
            console.log("configResolved", resolveConfig.resolve.alias);
        },
        // step3-初始化hooks，只走1次
        options(opts) {
            console.log("options", opts);
        },
        // step4-配置dev server
        configureServer(server) {
            console.log("configureServer");
            // 拿到server的实例，做中间件的处理
            // 在vite server执行之前执行
            // server.middlewares.use((req, res, next) => {
            //     if (req.url === "/test") {
            //         res.end("hello vite plugin");
            //     } else {
            //         next();
            //     }
            // });

            // 在vite中间件之后执行
            return () => {
                server.middlewares.use((req, res, next) => {
                    if (req.url === "/test") {
                        res.end("hello vite plugin");
                    } else {
                        next();
                    }
                });
            };
        },
        // step5-开始创建
        buildStart() {
            console.log("buildStart");
        },
        // step6-自定义HMR
        // if (import.meta.hot) {
        //     import.meta.hot.on('hot-test', val => {
        //         console.log(val);
        //     })
        // }
        handleHotUpdate(ctx) {
            console.log("handleHotUpdate");
            ctx.server.ws.send({
                type: "custom",
                event: "hot-test",
                data: {
                    hello: "world",
                },
            });
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
            console.log("resolveId", source);
            if (source.includes("entry-client")) {
                console.log("resolveId", source);
                // 返回source标明命中，vite不再询问其他插件处理该模块id请求
                return source;
            }
            // 返回null表明是其他插件继续查找
            return null;
        },
        // stepC-加载模块代码
        load(id) {
            console.log("laod", id);
            if (id.includes("entry-client")) {
                // 返回virtual-module模块源码
                console.log("load");
                // return `export default "this is virtual"`;
            }
            // 其他id继续处理
            return null;
        },
        // stepD-转换
        transform(code, id) {
            console.log("transform", id);
            if (id.includes("entry-client")) {
                console.log("transform");
            }
            return code;
        },
    };
}
```
