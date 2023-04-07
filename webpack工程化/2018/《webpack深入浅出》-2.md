## 一、webpack 实战

#### 1.Babel

1. Babel 是一个 js 编译器，能将 ES6 代码转换成 ES5 代码
2. Babel 编译时会从根目录的`.babelrc`文件读取配置

```json
{
    "plugins": [
        [
            "transform-runtime",
            {
                "polyfill": false
            }
        ]
    ],
    "presets": [
        [
            "es2015",
            {
                "modules": false
            }
        ],
        "stage-2",
        "react"
    ]
}
```

3. plugins
    1. `transform-runtime`对应的插件是`babel-plugin-transform-runtime`, 作用是减少冗余的代码
    2. `babel-plugin-transform-runtime`依赖`babel-runtime`
    3. 将重复注入的辅助函数转换成`var _extent = require('babel-runtime'/helpers/_extent)`的导入语句
4. presets
    1. 按照 ECMAScript 草案来划分
        - ES2015
        - ES2016
        - ES2017
        - Env(包含所有 ECMAScript 标准里的最新特性)
    2. 被社区提出的，未被写入 ECMASCript 的特性
        - stage0, 美好激进的想法，不确定是否会被定为标准
        - stage1, 值得被纳入标准的特性
        - stage2, 特性已经被起草，将来会被纳入标准
        - stage3, 已经被定稿
        - stage4, 接下来的一年内将会加入到标准
    3. 用于一些特定应用场景下的语法特性，例如`babel-preset-react`支持 react 开发里面的 JSX 语法
    4. 使用 babel
        ```js
        npm i -D babel-core babel-loader
        npm i -D babel-preset-env
        ```
        ```js
        module.exports = {
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: ["babel-loader"],
                    },
                ],
            },
        };
        ```

#### 2.使用 TypeScript

1. 根目录新建`tsconfig.json`
    ```js
    {
        "compilerOptions": {
            "module": "common.js", // 编译的代码采用哪种模块规范
            "target": "es5", // 编译出的代码采用ES的哪个版本
            "sourceMap": true, // 输出source map方便调试
            "importHelpers": true // 减少辅助函数重复出现在多个文件
        },
        "exclude": [ // 不编译这些目录里的文件
            "node_modules"
        ]
    }
    ```
2. 集成 webpack
    ```js
    module.exports = {
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: "awesome-typescript-loader",
                },
            ],
        },
    };
    ```
3. Flow
    1. Flow 是 1 个 facebook 开源的一个 javascript 静态类型检测器, 是 js 语言的超集
    2. 将`babel-preset-flow`与`babel`集成
        ```js
        // .babelrc
        "presets": [
            ...[],
            "flow"
        ]
        ```
4. 使用 scss 语言
    1. `sass-loader`将 scss 源码转换成 css 代码，再将 css 代码交给 css-loader 处理
    2. `css-loader`找出 css 中@import 和 url()这样的导入语句，告诉 webpack 依赖这些资源,
       同时支持 css modules, 压缩 css 等功能, 处理完成后，交割 style-loader
    3. `style-loader`将 css 转换成字符串，通过 js 向 dom 增加样式，如果需要提取到单独的文件，使用`ExtractTextPlugin`
    4. `style-loader`依赖`node-sass`
        ```js
        npm i -D node-sass sass-loader css-loader style-loader
        ```
        ```js
        // webpack配置
        module.exports = {
            module: {
                rules: [
                    {
                        // 增加对scss文件的支持
                        test: /\.scss/,
                        // scss文件的处理顺序为先sass-loader，再css-loader, 再style-loader
                        use: ["style-loader", "css-loader", "sass-loader"],
                    },
                ],
            },
        };
        ```
5. postcss
    1. postcss 是一个 css 处理工具，可以通过插件机制灵活的扩展其支持的特性
    2. Postcss 和 scss 就像 babel 和 typescript 的关系
    3. 会从根目录下的 postcss.config.js 读取配置
    ```js
    npm i -D postcss-loader css-loader style-loader
    npm i -D postcss-cssnext
    ```
    ```js
    // postcss.config.js
    module.exports = {
        plugins: [
            // 需要使用的插件列表
            require("postcss-cssnext"),
        ],
    };
    ```
    ```js
    // webpack
    module.exports = {
        module: {
            rules: [
                {
                    // 使用postcss处理css文件
                    test: /\.css/,
                    use: ["style-loader", "css-loader", "postcss-loader"],
                },
            ],
        },
    };
    ```
6. react
    ```js
    // 安装依赖
    npm i -D react react-dom
    npm i -D babel-preset-react
    ```
    ```js
    // .babelrc
    "preset": [
        "react"
    ]
    ```
7. typescript 配合 react
    ```js
    // 安装依赖
    npm i -D @types/react @types/react-dom
    ```
    ```js
    // tsconfig
    {
        "compilerOptions": {
            "jsx": "react" // 开启jsx, 支持react
        }
    }
    ```
    ```js
    // webpack
    module.exports = {
        module: {
            rules: [
                {
                    // 同时匹配ts, tsx的typescript源码文件
                    test: /\.tsx?$/,
                    loader: "awesome-typescript-loader",
                },
            ],
        },
    };
    ```
8. 使用 vue
    1. `vue-loader`,解析和转换.vue 文件，提取出其中的逻辑代码 script, 样式代码 style,
       以及 HTMl 模板 template，再分别将它们交给对应的 Loader 处理
    2. `css-loader`, 加载由 vue-loader 提取出的 css
    3. `vue-template-compiler`, 将 vue-loader 提取出的 HTMl 模板编译成对应的可执行的 js 代码
9. 使用 typescript 编写 vue
    ```js
    // tsconfig
    {
        "compilerOptions": {
            // 构建出ES5版本的js,与vue的浏览器支持保持一致
            "target": "es5",
            // 开启严格模式，这可以对`this`上的数据属性进行更严格的判断
            "strict": true,
            // typescript编译器输出的js采用es2015模块化，使tree sharking生效
            "module": "es2015",
            "moduleResolution": "node"
        }
    }
    ```
    ```js
    // vue.shims.d.ts
    // 告诉Typescript编译器.vue文件其实是一个Vue
    declare module "*.vue" {
        import Vue from 'vue';
        export default Vue;
    }
    ```
    ```js
    npm i -D ts-loader typescript
    ```
    ```js
    // webpack
    module.exports = {
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: "ts-loader",
                    exclude: /node_modules/,
                    options: {
                        // 让ts处理vue
                        appendTsSuffixTo: [/\.vue$/],
                    },
                },
            ],
        },
    };
    ```
10. 生成 HTML

    1. 为单页应用生成 html
        ```js
        module.exports = {
            plugins: [
                // 1个webPlugin对应1个HTML文件
                new WebPlugin({
                    template: "./template.html", // HTML模板文件所在的文件路径
                    filename: "index.html", // 输出的HTML的文件名称
                }),
            ],
        };
        ```
    2. 多个单页应用

        ```js
        // webpack
        const { AutoWebPlugin } = require("web-webpack-plugin");

        // 自动寻找pages下的所有目录，将每一个目录当作1个单页应用
        const autoWebPlugin = new AutoWebPlugin("pages", {
            template: "./template.html", // html模板文件所在的文件路径
            postEntrys: ["./common.css"], // 所有页面都依赖的css样式
            commonChunk: {
                name: "common", // 提取公共代码的chunk名称
            },
        });

        module.exports = {
            entry: autoWebPlugin.entry({
                // 这里可加入我们额外需要的chunk入口
            }),
            plugins: [autoWebPlugin],
        };
        ```

#### 3.构建同构应用

> 同构应用是写一份代码同时在浏览器和服务器中运行的应用

1. 客户端渲染的缺点
    1. 搜索引擎无法收录网页，爬虫无法获取数据
    2. 低端设备用户会有性能问题
2. 虚拟 DOM 的优点
    1. 减少 dom 树操作，优化网页性能
    2. 能将虚拟 dom 用在服务端渲染，也能渲染成手机原生 UI 组件
    3. react-dom 渲染虚拟 dom
        1. 通过`render()`函数去操作浏览器 DOM 树来展示出结果
        2. 通过`renderToString()`计算虚拟 DOM 的 HTML 形式的字符串
3. 同构应用注意:

    1. 不能包含浏览器环境的 API
    2. 不能包含 css, 渲染 css 会增加计算量，影响服务端的性能
    3. 不能将 node.js 原生模块和 node_modules 第三方模块打包进去，需要通过 commonjs 规范引入
    4. 通过 CommonJs 规范导出 1 个渲染函数，在 HTTP 服务器中执行这个渲染函数，渲染出 HTML 的内容返回

    ```js
    // webpack.server.config.js
    module.exports = {
        context: path.resolve(__dirname, "../src"),
        entry: "./main_server.js", // js入口文件
        target: "node", // 为了不将node.js内置的模块打包进输出文件中
        externals: [nodeExternals()], // 为了不将node_modules下的第三方模块打包进输出文件中
        output: {
            libraryTarget: "commonjs2", // 为了被node.js编写的http服务调用
            filename: "bundle_server.js", // 将要在node.js运行的代码输出到bundle_server.js中
            path: path.resolve(__dirname, "./dist"),
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: ["babel-loader"],
                    exclude: path.resolve(__dirname, "node_modules"),
                },
                {
                    test: /\.css/,
                    use: ["ignore-loader"], // 忽略css文件
                },
            ],
        },
        devtool: "source-map",
    };
    ```

    ```js
    // main_server.js
    import React from "react";
    import { renderTostring } from "react-dom/server";

    export function render() {
        return renderTostring(<hl>Hello,Webpack</hl>);
    }
    ```

    ```js
    // http_server.js
    const express = require("express");
    const { render } = require("./dist/bundle_server");
    const app = express();

    app.get("/", function (req, res) {
        res.send(`
            <html>
                <head>
                    <meta charset="UTF-8">
                </head>
                <body>
                    <div id="app">${render()}</div>
                    <script src="./dist/bundle_browser.js"></script>
                </body>
            </html>
        `);
    });

    app.use(express.static("."));
    app.listen(3000, function () {
        console.log("app listening on port 3000!");
    });
    ```

#### 4.electron

1. 用 web 技术开发跨平台的桌面端应用
2. 用 Chromium 浏览器显示 web 界面作为应用的 GUI, 通过 Node.js 和操作系统交互
3. Atom 和 VsCode 就是使用 Electron 开发的
4. 优点
    - 降低开发门槛，大量 web 开发技术和现成库可以复用于 Electron
    - Chromium 浏览器和 Node.js 都是跨平台，Electron 能做到不同的操作系统运行一份代码
5. Electron 一个窗口对应一个网页

#### 5.构建 npm 模块

1. npm
    1. 每个模块根目录下都有 1 个 package.json 文件
    2. 模块文件以 js 为主，但同时可包括 css 图片 文件
    3. NPM 仓库目前广泛支持的是 commonjs 规范
2. 使用 webpack 构建 npm 模块

    ```js
    // webpack.config.js
    const path = require("path");
    const ExtractTextPlugin = require("extract-text-webpack-plugin");

    module.exports = {
        entry: "./src/index.js",
        output: {
            filename: "index.js",
            path: path.resolve(__dirname, "lib"), // lib放发布npm仓库的最终代码
            libraryTarget: "commonjs2", // 输出的代码符合CommonJs模块化规范，供其他模块导入使用
        },
        // 注册在运行环境中的全局变量访问，不能被打包进输出代码中，防止出现多次
        externals: /^(react|babel-runtime)/,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: ["babel-loader"],
                    exclude: path.resolve(__dirname, "node_modules"),
                },
                {
                    test: /\.css/,
                    use: ExtractTextPlugin.extract({
                        use: ["css-loader"],
                    }),
                },
            ],
        },
        plugins: [
            new ExtractTextPlugin({
                filename: "index.css", // 输出的css文件名称
            }),
        ],
        devtool: "source-map",
    };
    ```

    ```js
    // package.json
    {
        "main": "lib/index.js", // 代码入口文件
        "jsnext:main": "src/index.js" // ES6编写的模块入口文件所在位置，为了实现tree sharking
    }
    ```

#### 6.构建离线应用

1. 离线应用
    1. 无网络情况下也能打开网页
    2. 从本地加载，加快网页加载速度
    3. AppCache, 已被 web 标准废弃
    4. Service Workers, 是 web worker 的一部分，通过拦截网络请求实现离线缓存，是构建 PWA 应用的关键技术
2. Service Workers

    1. Service Workers 是一个在浏览器后台运行的脚本，生命周期完全独立于网页
    2. 无法直接访问 dom, 可通过 postMessage 接口发送消息来和 UI 进程通信
    3. Service Workders 可拦截网络请求，离线缓存，编译响应，过滤响应
    4. 判断浏览器是否支持 Service Workers
        ```js
        // main.js
        if (navigator.serviceWorker) {
            window.addEventListener("DOMContentLoaded", function () {
                // 调用 serviceWorker.register 注册，参数 /sw.js 为脚本文件所在的 URL 路径
                navigator.serviceWorker.register("sw.js");
            });
        }
        ```
    5. 注册 Service Workers

        ```js
        // sw.js
        var serviceWorkerOption = {
            assets: ["/app.js", "/app.css", "/index.html"],
        };

        var cacheKey = new Date().toISOString();

        // 当前缓存白名单，在新脚本的 install 事件里将使用白名单里的 key
        var cacheWhitelist = [cacheKey];

        // 需要被缓存的文件的 URL 列表
        var cacheFileList = global.serviceWorkerOption.assets;

        // 监听 install 事件
        self.addEventListener("install", function (event) {
            // 等待所有资源缓存完成时，才可以进行下一步
            event.waitUntil(
                caches.open(cacheKey).then(function (cache) {
                    // 要缓存的文件 URL 列表
                    return cache.addAll(cacheFileList);
                }),
            );
        });

        // 拦截网络请求
        self.addEventListener("fetch", function (event) {
            event.respondWith(
                // 去缓存中查询对应的请求
                caches.match(event.request).then(function (response) {
                    // 如果命中本地缓存，就直接返回本地的资源
                    if (response) {
                        return response;
                    }
                    // 否则就去用 fetch 下载资源
                    return fetch(event.request);
                }),
            );
        });

        // 新 Service Workers 线程取得控制权后，将会触发其 activate 事件
        self.addEventListener("activate", function (event) {
            event.waitUntil(
                caches.keys().then(function (cacheNames) {
                    return Promise.all(
                        cacheNames.map(function (cacheName) {
                            // 不在白名单的缓存全部清理掉
                            if (cacheWhitelist.indexOf(cacheName) === -1) {
                                // 删除缓存
                                return caches.delete(cacheName);
                            }
                        }),
                    );
                }),
            );
        });
        ```

    6. 搭建 webpack

        ```js
        // webpack.config.js
        const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin");

        module.exports = {
            plugins: [
                new ServiceWorkerWebpackPlugin({
                    // 自定义的 sw.js 文件所在路径
                    // ServiceWorkerWebpackPlugin 会把文件列表注入到生成的 sw.js 中
                    entry: path.join(__dirname, "sw.js"),
                }),
            ],
            devServer: {
                // Service Workers 依赖 HTTPS，使用 DevServer 提供的 HTTPS 功能。
                https: true,
            },
        };
        ```

    7. 启动 chrome 需忽略证书验证
        ```js
        chrome.exe --user-data-dir=./tmp --ignore-certificate-errors --unsafely-treat-insecure-origin-as-secure=https://localhost:8080
        ```

#### 7.npm script

1. npm script 的底层原理是通过 shell 去运行脚本命令

```js
{
    "script": {
        "dev": "webpack-dev-server --open",
        "dist": "NODE_ENV=production webpack --config webpack.prod.config.js",
        "pub": "npm run dist && rsync dist"
    }
}
```

#### 8.检查代码

1. eslint-loader
2. tslint-loader
3. stylelint-webpack-plugin
4. 使用 husky 为项目接入 git hook

```js
// package.json
{
    "scripts": {
        "precommit": "npm run lint", // 执行git commit前会执行的脚本
        "prepush": "lint", // 执行git push前会执行的脚本
        "lint": "eslint && stylelint"
    }
}
```

#### 9.DevServer 的实现原理

1. webpack-dev-middlerware 实现 devServer
2. webpack-hot-middleware 实现模块热替换

```js
const express = require("express");
const webpack = require("webpack");
const webpackMiddleware = require("webpack-dev-middleware");

// 从webpack.config.js中读取配置
const config = require("./webpack.config.js");
const app = express();

// 用读取到的webpack配置实例化一个compiler
const compiler = webpack(config);
// 为app注册webpackMiddleware中间件
app.use(webpackMiddleware(compiler));
app.use(require("webpack-hot-middleware")(compiler));
app.listen(3000);
```

#### 10.加载图, 文件

1. `file-loader`可以将 js 和 css 中导入图片的语句换成正确的地址，同时将文件输出到对应的位置

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.png$/,
                use: ["file-loader"],
            },
        ],
    },
};
```

2. `url-loader`可以将文件内容经过`base64`编码后注入 js 或 css 中

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        // 30kb以下的文件采用url-loader
                        limit: 1024 * 30
                        // 否则采用file-loader
                        fallback: 'file-loader'
                    }
                }]
            }
        ]
    }
}
```

3. 通过`imagemin-webpack-plugin`压缩图片
4. 通过`webpack-spritesmith`制作雪碧图
5. 使用`https://tinypng.com/`无损压缩图片
6. 使用`raw-loader`将文件内容读取出来，注入到 js 中
7. `svg-inline-loader`将文件内容读取出来，压缩后注入到 js 中

#### 11.source map

1. devtool 的选项列表

| devtool                 | 含义                                                                            |
| :---------------------- | :------------------------------------------------------------------------------ |
| 空                      | 不生成 source map                                                               |
| eval                    | 每个 module 会封装在 eval 里包裹起来执行                                        |
| source-map              | 额外生成一个单独的 source map 文件                                              |
| hidden-source-map       | 和 source-map 类似，但不会在 js 文件的末尾追加/# sourcemappingurl=bundle.js.map |
| inline-source-map       | 将 source map 转成 base64 编码内嵌到 js 中                                      |
| eval-source-map         | 将 source map 转换成 base64 编码内嵌到 eval 语句中                              |
| cheap-source-map        | 生成的 source map 没有列信息，生成速度更快                                      |
| cheap-module-source-map | 和 cheap-source-map 类似，但会包含 loader 生成的 source map                     |

## 二、webpack 优化

#### 1.缩小文件搜索范围

1. 优化 loader 配置
    1. 配置 test, include, exclude 三个配置缩小命中范围，让尽可能少的文件被 loader 处理
2. 优化 resolve.modules 配置
    1. 指明存放第三方模块的绝对路径，减少寻找
    ```js
    module.exports = {
        resolve: {
            // __dirname表示当前工作目录，也就是项目根目录
            modules: [path.resolve(__dirname, "node_modules")],
        },
    };
    ```
3. 优化 resolve.mainFields 配置
    1. 固定 mainFields 入口文件描述字段，减少搜索步骤
    ```js
    module.exports = {
        resolve: {
            mainFields: ["main"],
        },
    };
    ```
4. 优化 resolve.alias 配置
    1. 配置 alias，减少耗时的递归解析操作
    2. 配置了 alias，会影响 tree-sharking 去除无效代码
    ```js
    module.exports = {
        resolve: {
            alias: {
                react: path.resolve(
                    __dirname,
                    "./node_modules/react/dist/react.min.js",
                ),
            },
        },
    };
    ```
5. 优化 resolve.extensions 配置
    1. extensions 中的配置列表要尽可能的少
    2. 出现频率高的文件后缀要优先放前面
    3. 导入语句要尽可能的带上后缀
6. 优化 module.noParse 配置
    1. 配置 noParse 忽略对该文件的递归解析处理
    2. 被忽略的文件不应该包含 import, require, define 等语句
    ```js
    module.exports = {
        module: {
            noParse: [/react\.min\.js$/],
        },
    };
    ```

#### 2.使用 DLLPlugin

1. DLL
    1. 将依赖的基础模块抽离出来，打包到一个个单独的动态链接库中，在一个动态链接库中可以包含多个模块
    2. 动态链接库只会被编译一次
2. 接入 webpack
    1. DLLPlugin, 构建出动态链接库文件
        ```js
        // webpack.dll.config.js
        const DllPlugin = require("webpack/lib/DllPlugin");
        module.exports = {
            output: {
                filename: "[name].dll.js",
                path: path.resolve(__dirname, "dist"),
                // 存放动态链接库的全局变量名称
                library: "_dll_[name]",
            },
            plugins: [
                new DllPlugin({
                    name: "_dll_[name]", // 动态链接库的全局变量名称
                    path: path.join(__dirname, "dist", "[name].manifest.json"),
                }),
            ],
        };
        ```
    2. DLLReferencePlugin, 使用动态链接库文件
        ```js
        // webpack.config.js
        const DllReferencePlugin = require("webpack/lib/DllReferencePlugin");
        module.exports = {
            // dllreferencePlugin会从manifest.json文件中读取name的值
            plugins: new DllReferencePlugin({
                // 描述react动态链接库的内容
                manifest: require("./dist/react.manifest.json"),
            }),
        };
        ```

#### 3.使用 happyPack

1. 多进程处理 loader，较少构建时间

    ```js
    const HappyPack = require('happypack');
    const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

    module.exports = {
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: ['happypack/loader?id=babel']
                }
            ]
        }
        plugins: [
            new HappyPack({
                id: 'babel',
                loaders: ['babel-loader?cacheDirectory'],
                threadPool: happyThreadPool
            })
        ]
    }
    ```

#### 4.使用 ParallelUglifyPlugin

1. 开启多个子进程，对文件进行压缩

```js
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");

module.exports = {
    plugins: [
        new ParallelUglifyPlugin({
            uglifyJS: {
                output: {},
                compress: {},
            },
        }),
    ],
};
```

#### 5.使用自动刷新

1. webpack 自带的文件监听

```js
module.exports = {
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300, // 监听文件变化后300ms再去执行操作，截流
        poll: 1000, // 每秒轮询1000次
    },
};
```

2. webpack-dev-server 负责刷新浏览器
    - 通过关闭 inline, 让网页只注入一个代理客户端
    ```js
    webpack-dev-server --inline false
    ```
3. 开启热模块替换

    ```js
    webpack-dev-server --hot
    ```

    ```js
    // webpack.config.js
    const NameModulesPlugin = require("webpack/lib/NameModulesPlugin");

    module.exports = {
        plugins: [
            // 显示出被替换模块的名称
            new NameModulesPlugin(),
        ],
    };
    ```

#### 6.区分环境

```js
module.exports = {
    plugins: [
        // 定义当前config文件NODE_ENV环境变量为production
        new DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production"),
            },
        }),
    ],
};
```

#### 7.压缩

1. 使用`ParallelUglifyPlugin`

```js
const UglifyJSPlugin = require("webpack/lib/optimize/UglifyJsPlugin");

module.exports = {
    plugins: [
        new UglifyJSPlugin({
            compress: {
                // 删除没有用到的代码时，不输出警告
                warning: false,
                // 删除所有console语句
                drop_console: true,
                // 内嵌已定义，但是只用到一次的变量
                collapse_vars: true,
                // 提取出现了多次但没有定义成变量的静态值
                reduce_vars: true,
            },
            output: {
                // 不保留空格和制表符
                beautify: false,
                // 删除所有的注释
                comments: false,
            },
        }),
    ],
};
```

2. 开启`css-loader`的`minimize`选项压缩 css

```js
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    module: {
        rules: [
            {
                test: /\.css/,
                use: ExtractTextPlugin.extract({
                    use: ["css-loader?minimize"],
                }),
            },
        ],
    },
    plugins: [
        new ExtractTextPlugin({
            filename: `[name]_[contenthash:8].css`,
        }),
    ],
};
```

#### 8.CDN 加速

1. CDN 是将资源部署到世界各地，使用户访问时按就近原则从最近的服务器获取资源，加快获取资源的速度
2. 业界使用 CDN 的正确方式
    1. 针对 HTML 文件，不使用 CDN 服务，同时关闭自己服务器上的缓存
    2. 针对 js, css, 图片，开启 CDN 和缓存，用 hash 值判断文件内容是否变化
    3. 浏览器对同一域名的资源请求有限制（大概 4 个），将静态资源分散到不同的 CDN 服务上
3. Webpack 接入 CDN

    1. 在 output.publicPath 中设置 js 的地址
    2. 在 css-loader.publicPath 中设置 css 中导入的资源的地址
    3. 在 webplugin.stylePublicPath 设置 css 文件的地址

    ```js
    const ExtractTextPlugin = require("extract-text-webpack-plugin");
    const { WebPlugin } = require("web-webpack-plugin");

    module.exports = {
        output: {
            filename: "[name]_[chunkhash:8].js",
            path: path.resolve(__dirname, "./dist"),
            // 指定js文件的CDN目录URL
            publicPath: "//js.cdn.com/id/",
        },
        module: {
            rules: [
                {
                    test: "/.css/",
                    use: ExtractTextPlugin.extract({
                        use: ["css-loader?minimize"],
                        // 指定存放css中导入的资源（图片）的CDN目录的URL
                        publicPath: "//img.cdn.com/id/",
                    }),
                },
            ],
        },
        plugins: [
            new WebPlugin({
                template: "./template.html",
                filename: "index.html",
                // 指定存放css文件的CDN目录的URL
                stylePublicPath: "//css.cdn.com/id/",
            }),
        ],
    };
    ```

#### 9.使用 tree shaking

1. 用来剔除 js 中用不上的死代码，依赖 ES6 的模块化语法
2. 接入 webpack
    1. 关闭 babel 中的模块转换功能
    2. 配置第三方包采用 ES6 模块化语法
    ```js
    // .babelrc
    {
        "presets": [
            [
                "env",
                {
                    "modules": false
                }
            ]
        ]
    }
    ```
    ```js
    // webpack.config.js
    module.exports = {
        resolve: {
            // 针对第三方模块优先采用jsnext:main中指向es6的模块化语法
            mainFields: ["jsnext:main", "browser", "main"],
        },
    };
    ```
3. tree shaking 优化的点

```js
// format3.js
export function test4() {
    console.log("44444");
}

export function test5() {
    console.log("555555");
}
```

```js
// format.js
export * from "./format3";

export const testA = () => {
    console.log("aaaaa");
};

export const testB = () => {
    console.log("bbbbb");
};
```

```js
// 入口文件
// webpack只会打包testA和test4的代码
import { testA, test4 } from "./utils/format";

testA();
test4();
```

#### 10.提取公共代码

1. 提取公共代码的优点
    1. 减少网络传输流量，降低服务器成本
    2. 第一次打开网站得不到优化，之后访问其他页面的速度将大大提升
2. webpack 提取公共代码

```js
module.exports = {
    optimization: {
        splitChunks: {
            // 缓存组
            cacheGroups: {
                vendors: {
                    test: /react/,
                    name: "vendors",
                },
                common: {
                    // chunks(chunk){
                    //     return chunk.name.includes('common')
                    // }
                    chunks: "all",
                    minSize: 0, // 压缩前的最小模块大小
                    minChunks: 6, // 被引用的次数
                    name: "common",
                },
            },
        },
    },
};
```

#### 11.分割代码按需加载

1. 按需加载原因
    1. 将网站分割成一个个小功能
    2. 将每一类合并成 Chunk, 按需加载对应的 Chunk
    3. 对不依赖大量代码的功能点进行按需加载，例 Chart.js, flv.js
2. webpack 按需加载

    ```js
    npm i -D babel-plugin-syntax-dynamic-import
    ```

    ```js
    // .babelrc
    {
        "presets": [
            "env",
            "react"
        ],
        "plugins": [
            "syntax-dynamic-import"
        ]
    }
    ```

    ```js
    // webpack.config.js
    module.exports = {
        entry: {
            main: "./main.js",
        },
        output: {
            // 为entry中配置生成的chunk配置输出文件的名称
            filename: "[name].js",
            // 为动态加载的chunk配置输出文件的名称
            chunkFilename: "[name].js",
        },
    };
    ```

    ```js
    // 根组件
    function App() {
        return (
            <HashRouter>
                <Route path='/about' component={getAsyncComponent(
                    () => import('./pages/about')
                )}
            </HashRouter>
        )
    }
    ```

    ```js
    import React, { PureComponent, createElement } from "react";

    // 异步加载组件
    function getAsyncComponent(load) {
        return class AsyncComponent extends PureComponent {
            componentDidMount() {
                load().then(({ default: component }) => {
                    this.setState({
                        component,
                    });
                });
            }

            render() {
                const { component } = this.state || {};

                // component是React.Component类型，需要React.createElement生产一个组件实例
                return component ? createElement(component) : null;
            }
        };
    }
    ```

#### 12.使用 prepack

1. prepack 是激进的方法，会改变源代码的运行逻辑，输出性能更好的 js 代码
2. prepack 实际是一个部分求值器，编译代码时会提前将计算结果放到编译后的代码中，而不是在代码中运行时才去求值
3. prepack 还不能识别 DOM API 和部分 Node.js API
4. 接入 webpack

```js
const PrepackWebpackPlugin = require("prepack-webpack-plugin").default;

module.exports = {
    plugins: [new PrepackWebpackPlugin()],
};
```

#### 13.开启 Scope Hoisting(作用域提升)

1. Scope Hoisting 的好处
    1. 把一些模块的代码合并成一个模块作用域里
    2. 代码体积更小，因为函数声明语句会产生大量的代码
    3. 函数作用域变少了，内存开销变小了
2. 不会`scope hoisting`的情况
    1. Non ES6 Module 不会做 scope hoisting。
        - 只有`es module` 的依赖关系才是能被分析的，都不是 `es module` 怎么正确分析依赖关系，怎么 `hositing` 呢？
    2. export \* from "cjs-module" 不会做 scope hositing
        - 一旦模块引入了 `cjs module`，那就不可以分析依赖关系了，所以也就不能 `hoisting`
    3. `use eval()` 不会做 `scope hositing`
        - `eval` 的代码你不能保证有啥东西，去掉 `scope`，合在一起很容易出问题。
    4. `using module` 或者用了 `ProvidePlugin` 的变量，不会被 `scope hositing`。
        - 用到了 module 变量之后，你合并成了一个模块，那这个 module 不就没了么？用了 ProvidePlugin 注入的变量也差不多。
    5. `In Multiple Chunks` 不会被 `scope hositing`。
        - 要是被多个 chunk 用到了，那 hositing 之后，代码不就重复了多次么？
        - 所以只有被一个 chunk 用到的模块才会被 hositing 优化。
3. 接入 webpack

    ```js
    const ModuleConcatenationPlugin = require("webpack/lib/optimize/ModuleConcatenationPlugin");

    module.exports = {
        plugins: [
            // 开启scope hoisting，依赖源码时需采用ES6模块化语法
            new ModuleConcatenationPlugin(),
        ],
        resolve: {
            // 第三方模块优先使用ES6模块化语法
            mainFields: ["jsnext:main", "browser", "main"],
        },
    };
    ```

#### 14.输出分析

1. 使用官方的 webpack Analyse, 是一个在线的 web 应用
2. 使用 webpack-bundle-analyzer

## 二、原理

#### 1. webpack

1. webpack 编译流程
    1. 初始化参数，从配置文件和 shell 语句中读取与合并参数，得出最终的参数
    2. 开启编译，用上一步得到的参数初始化`Compiler`对象，加载所有配置的插件，通过执行对象的 run 方法开始执行编译
    3. 确定入口，根据配置中的`entry`找出所有的入口文件
    4. 编译模块，从入口文件出发，调用所有配置的`loader`对模块进行翻译，再找出该模块依赖的模块，递归，直到所有入口依赖的文件都经过本步骤处理
    5. 完成模块编译，`loader`翻译完所有模块后，得到了每个模块被翻译后的最终内容和依赖关系
    6. 输出资源，根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 chunk, 再将每个 chunk 转换成 1 个单独的文件，加入到输出列表中
    7. 输出完成，确定好输出内容后，根据`output`配置的输出路径和文件名，将文件内容写入文件系统中
2. webpack 构建流程
    1. 初始化，启动构建，读取和合并配置参数，加载`Plugin`, 实例化`Compiler`
    2. 编译，从 Entry 发出，针对每个`Module`串行调用对应的`Loader`去翻译文件的内容，再找到该`Module`依赖的`Module`，递归的进行编译处理
    3. 输出，将编译后的`Module`组合成`Chunk`，将`Chunk`转换成文件，输出到文件系统中
3. webpack 初始化阶段

| 事件名           | 解释                                                                                                                                             |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| 初始化参数       | 从配置文件和 shell 语句中读取和合并参数，得出最终参数，在这个过程中还会执行配置文件中的插件实例化语句`new Plugin`                                |
| 实例化`Compiler` | 用上一步的参数初始化`Compiler`实例，`Compiler`负责文件监听和启动编译，在`Compiler`实例中包含了完整的`webpack`配置，全局只有 1 个`Compiler`实例   |
| 加载插件         | 依次调用插件的`apply`方法，让插件可以监听后续的所有事件节点。同时向插件传入`compiler`实例的引用，以方便插件通过`compiler`调用 webpack 提供的 API |
| `environment`    | 开始应用 Node.js 风格的文件系统到 compiler 对象，以方便后续的文件寻找和读取                                                                      |
| entry-options    | 读取配置的`Entrys`,为每个`Entry`实例化一个对应的 EntryPlugin, 为后面的该 Entry 的递归解析工作做准备                                              |
| after-plugins    | 调用完所有内置的和配置的插件的 apply 方法                                                                                                        |
| after-resolvers  | 根据配置初始化 resolver，resolver 负责在文件系统中寻找指定路径的文件                                                                             |

4. webpack 编译阶段

-   编译阶段

| 事件名        | 解释                                                                                                                                                                                                          |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| run           | 启动一次新的编译                                                                                                                                                                                              |
| watch-run     | 和 run 类似，区别在于它是在监听模式下启动编译，在这个事件中可以获取是哪些文件发生了变化从而导致重新启动一次新的编译                                                                                           |
| compile       | 该事件告诉插件一次新的编译将要启动，同时会给插件带上 compiler 对象                                                                                                                                            |
| compilation   | 当 webpack 以开发模式运行时，每当检测到文件的变化，便有一次新的 compilation 被创建。一个 compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。compilation 对象也提供了很多事件回调给插件进行扩展 |
| make          | 一个新的 Compilation 创建完毕，即将从 Entry 开始读取文件，根据文件的类型和配置的 loader 对文件进行编译，编译完成后再找出该文件依赖的文件，递归地编译和解析                                                    |
| after-compile | 一次 Compilation 执行完成                                                                                                                                                                                     |
| invalid       | 当遇到文件不存在、文件编译错误等异常时会触发该事件，该事件不会导致 webpack 退出                                                                                                                               |

-   Compilation 阶段发生的小事件

| 事件名               | 解释                                                                                                                                                                |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| build-module         | 使用对应的 loader 去转换一个模块                                                                                                                                    |
| normal-module-loader | 在用 loader 转换完一个模块后，使用 acorn 解析转换后的内容，输出对应的抽象语法树（AST）,以方便 Webpack 在后面对代码进行分析                                          |
| program              | 从配置的入口模块开始，分析其 AST，当遇到 require 等导入其他模块的语句时，便将其加入依赖的模块列表中，同时对新找出的依赖模块递归分析，最终弄清楚所有的模块的依赖关系 |
| seal                 | 所有的模块及其依赖的模块都通过 loader 转换完成，根据依赖关系开始生成 Chunk                                                                                          |

5. webpack 输出阶段

| 事件名      | 解释                                                                                                            |
| :---------- | :-------------------------------------------------------------------------------------------------------------- |
| should-emit | 所有需要输出的文件已经生成，询问插件有哪些文件需要输出，有哪些不需要输出                                        |
| emit        | 确定好要输出哪些文件后，执行文件输出，可以在这里获取和修改输出的内容                                            |
| after-emit  | 文件输出完毕                                                                                                    |
| done        | 成功完成一次完整的编译和输出流程                                                                                |
| failed      | 如果在编译和输出的流程中遇到异常，导致 webpack 退出，就会直接跳转到本步骤，插件可以在本事件中获取具体的错误原因 |

6. 输出文件分析

    1. **webpack_require**.e 加载需要异步加载的 Chunk 对应的文件, 和 require 相似
    2. webpackJsonp 用于从异步加载的文件中安装模块
    3. modules 为存放所有模块的数组，数组中的每个元素都是函数
    4. moduleId 为要加载模块在数组中 index
    5. bundle.js 就是一个立即执行函数

    ```js
    (function (modules) {
        // 模拟require语句
        function __webpack_require__() {}

        // 执行存放所有模块数组中的第0个模块
        __webpack_require__(0);
    });
    ```

#### 2. loader

1. loader 的职责是单一的
2. loader 都会链式的顺序执行
3. 简单的 loader 源码

```js
const sass = require("node-sass");
const loaderUtils = require("loader-utils");

module.exports = function (source) {
    // 获取当前loader传入的options
    const options = loaderUtils.getOptions(this);
    return sass(source);
};
```

4. loader 返回除了内容之外的东西

```js
module.exports = function(source) {
    // 通过this.callback告诉webpack返回的结果
    this.callback(null, source, sourceMaps);
    return;
}

// this.callback传参
this.callback(
    err: Error | null,
    content: string | Buffer,
    sourceMap?: SourceMap // 用于通过转换后的内容得出原内容的source map, 方便调试
    // 返回AST语法树
    abstractSyntaxTree?: AST
)
```

5. loader 异步处理

```js
module.exports = function (source) {
    var callback = this.async();
    someAsyncOperation(source, function (err, result, sourceMaps, ast) {
        // 通过callback返回异步执行后的结果
        callback(err, result, sourceMaps, ast);
    });
};
```

6. Loader API

-   `this.context`: 当前处理的文件所在的目录，loader 处理的文件为/src/main.js, this.context 为/src
-   `this.resource`: 当前处理的文件的完整请求路径，包括 querystring, 例如/src/main.js?name=1
-   `this.resourcePath`: 当前处理的文件的路径，例如/src/main.js
-   `this.resourceQuery`: 当前处理的文件的 querystring
-   `this.target`: 等于 webpack 配置中的 target
-   `this.loadModule`: `this.loadModule(request: string, callback: function(err, source, sourceMap, nodule))`获取 request 对应的文件的处理结果
-   `this.resolve`: 像 require 语句一样获得指定文件的完整路径，使用方法为`resolve(context: string, request: string, callback: function(err, result: string))`
-   `this.addDependency`: 为当前处理的文件添加其依赖的文件，以便依赖的文件发生变化时，重新调用 Loader 处理该文件，使用方法为`addDependency(file: string)`
-   `this.addContextDependency`: 为当前处理的文件添加其依赖的文件目录，使用方法为`addContextDependency(directory: string)`
-   `this.clearDependencies`: 清除当前正在处理的文件的所有依赖，使用方法为`clearDependencies()`
-   `this.emitFile`: 输出一个文件，使用方法为`emitFile(name: string, content: Buffer|string, sourceMap: {...})`

7. 加载本地 loader
    1. 方法 1: npm link
        1. 在本地的 Npm 模块根目录下执行`npm link`, 将本地模块注册到全局
        2. 在项目根目录，执行`npm link loader-name`, 将注册到全局的本地 npm 模块链接到项目的 node_modules 下，loader-name 是指本地 NPM 模块的`package.json`文件中配置的模块名称
    2. 方法 2: resolveLoader
        ```js
        // webpack.config.js
        module.exports = {
            resolveLoader: {
                // 去哪些目录下寻找loader
                modules: ["node_modules", "./loaders/"],
            },
        };
        ```
8. 手写 loader

    ```js
    // txt文件
    test loader output from [name]
    ```

    ```js
    // webpack.config.js
    module.exports = {
        module: {
            rules: [
                {
                    test: /\.txt$/,
                    use: {
                        loader: path.resolve(__dirname, "./txt-loader.js"),
                        options: {
                            name: "txt-loader",
                        },
                    },
                },
            ],
        },
    };
    ```

    ```js
    // txt-loader.js
    const utils = require("loader-utils");

    module.exports = function (source) {
        const options = utils.getOptions(this);
        source = source.replace(/\[name\]/g, options.name);

        const content = JSON.stringify({
            content: source,
            filename: this.resourcePath,
        });
        return `export default ${content}`;
    };
    ```

    ```js
    import test from "./test.txt";

    // {
    //     content: 'test loader output from txt-loader',
    //     filename: "/Users/xx/test-loader/src/test.txt"
    // }
    test;
    ```

#### 3.编写 Plugin

1. compiler, 包含 options, loaders, plugins 等 webpack 环境的所有配置信息
2. compilation, 包含当前的模块资源、编译生成资源、变化的文件，每次文件发生变化，就有新的 compilation 被创建
3. `compiler.hooks`上存在 webpack 本身的事件钩子
4. plugin 基础代码

```js
// BasicPlugin.js
class BasicPlugin {
    // 在构造函数中获取用户为该插件传入的配置
    constructor(options) {}

    // webpack会调用BasicPlugin实例的apply方法为插件实例传入compiler对象
    apply(compiler) {
        compiler.hooks.compilation.tap("BasicPlugin", (compilation) => {});
    }
}
module.exports = BasicPlugin;
```

```js
// webpack.config.js
const BasicPlugin = require("./BasicPlugin.js");
module.exports = {
    plugins: [
        // 初始化1个BasicPlugin并获得其实例
        // 调用basicPlugin.apply(compiler)为插件实例传入compiler对象
        // 通过compiler.plugin监听广播的事件
        new BasicPlugin(options),
    ],
};
```

4. 编写一个页面加载前的 loading

```js
class LoadingPlugin {
    constructor(options) {}
    apply(compiler) {
        compiler.hooks.compilation.tap("LoadingPlugin", (compilation) => {
            const [HtmlWebpackPlugin] = compiler.options.plugins.filter(
                (plugin) => plugin.constructor.name === "HtmlWebpackPlugin",
            );
            const hook =
                HtmlWebpackPlugin.constructor.getHooks(compilation).beforeEmit;

            hook.tapAsync(
                "html-webpack-plugin-before-html-processing",
                (htmlData, callback) => {
                    htmlData.html = htmlData.html.replace(`<div>loading</div>`);
                    callback(null, htmlData);
                },
            );
        });
    }
}
module.exports = LoadingPlugin;
```

```js
// webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const LoadingPlugin = require("./LoadingPlugin");

module.exports = {
    plugins: [new HtmlWebpackPlugin({}), new LoadingPlugin()],
};
```

5. 其他

```js
class TestPlugin {
    constructor(options) {}
    apply(compiler) {
        compiler.hooks.compilation.tap("TestPlugin", (compilation) => {
            compilation.plugin("finishModules", (data, callBack) => {
                console.log("all modules complete!");
            });
        });
    }
}
module.exports = TestPlugin;
```
