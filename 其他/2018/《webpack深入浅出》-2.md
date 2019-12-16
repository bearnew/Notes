## 一、webpack实战
#### 1.Babel
1. Babel是一个js编译器，能将ES6代码转换成ES5代码
2. Babel编译时会从根目录的`.babelrc`文件读取配置
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
    1. 按照ECMAScript草案来划分
        * ES2015
        * ES2016
        * ES2017
        * Env(包含所有ECMAScript标准里的最新特性)
    2. 被社区提出的，未被写入ECMASCript的特性
        * stage0, 美好激进的想法，不确定是否会被定为标准
        * stage1, 值得被纳入标准的特性
        * stage2, 特性已经被起草，将来会被纳入标准
        * stage3, 已经被定稿
        * stage4, 接下来的一年内将会加入到标准
    3. 用于一些特定应用场景下的语法特性，例如`babel-preset-react`支持react开发里面的JSX语法
    4. 使用babel
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
                        use: ['babel-loader']
                    }
                ]
            }
        }
        ```
#### 2.使用TypeScript
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
2. 集成webpack
    ```js
    module.exports = {
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'awesome-typescript-loader'
                }
            ]
        }
    }
    ```
3. Flow
    1. Flow是1个facebook开源的一个javascript静态类型检测器, 是js语言的超集
    2. 将`babel-preset-flow`与`babel`集成
        ```js
        // .babelrc
        "presets": [
            ...[],
            "flow"
        ]
        ```
4. 使用scss语言
    1. `sass-loader`将scss源码转换成css代码，再将css代码交给css-loader处理
    2. `css-loader`找出css中@import和url()这样的导入语句，告诉webpack依赖这些资源,
        同时支持css modules, 压缩css等功能, 处理完成后，交割style-loader
    3. `style-loader`将css转换成字符串，通过js向dom增加样式，如果需要提取到单独的文件，使用`ExtractTextPlugin`
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
                        use: ['style-loader', 'css-loader', 'sass-loader']
                    }
                ]
            }
        }
        ``` 
5. postcss
    1. postcss是一个css处理工具，可以通过插件机制灵活的扩展其支持的特性
    2. Postcss和scss就像babel和typescript的关系
    3. 会从根目录下的postcss.config.js读取配置
    ```js
    npm i -D postcss-loader css-loader style-loader
    npm i -D postcss-cssnext
    ```
    ```js
    // postcss.config.js
    module.exports = {
        plugins: [
            // 需要使用的插件列表
            require('postcss-cssnext')
        ]
    }
    ```
    ```js
    // webpack
    module.exports = {
        module: {
            rules: [
                {
                    // 使用postcss处理css文件
                    test: /\.css/,
                    use: ['style-loader', 'css-loader', 'postcss-loader']
                }
            ]
        }
    }
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
7. typescript配合react
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
                    loader: 'awesome-typescript-loader'
                }
            ]
        }
    }
    ```
8. 使用vue
    1. `vue-loader`,解析和转换.vue文件，提取出其中的逻辑代码script, 样式代码style,
        以及HTMl模板template，再分别将它们交给对应的Loader处理
    2. `css-loader`, 加载由vue-loader提取出的css
    3. `vue-template-compiler`, 将vue-loader提取出的HTMl模板编译成对应的可执行的js代码
9. 使用typescript编写vue
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
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                    options: {
                        // 让ts处理vue
                        appendTsSuffixTo: [/\.vue$/]
                    }
                }
            ]
        }
    }
    ```
10. 生成HTML
    1. 为单页应用生成html
        ```js
        module.exports = {
            plugins: [
                // 1个webPlugin对应1个HTML文件
                new WebPlugin({
                    template: './template.html', // HTML模板文件所在的文件路径
                    filename: 'index.html' // 输出的HTML的文件名称
                })
            ]
        }
        ```
    2. 多个单页应用
        ```js
        // webpack
        const { AutoWebPlugin } = require('web-webpack-plugin');

        // 自动寻找pages下的所有目录，将每一个目录当作1个单页应用
        const autoWebPlugin = new AutoWebPlugin('pages', {
            template: './template.html', // html模板文件所在的文件路径
            postEntrys: ['./common.css'], // 所有页面都依赖的css样式
            commonChunk: {
                name: 'common' // 提取公共代码的chunk名称
            }
        })

        module.exports = {
            entry: autoWebPlugin.entry({
                // 这里可加入我们额外需要的chunk入口
            }),
            plugins: [
                autoWebPlugin
            ]
        }
        ``` 
#### 3.构建同构应用
> 同构应用是写一份代码同时在浏览器和服务器中运行的应用
1. 客户端渲染的缺点
    1. 搜索引擎无法收录网页，爬虫无法获取数据
    2. 低端设备用户会有性能问题
2. 虚拟DOM的优点
    1. 减少dom树操作，优化网页性能
    2. 能将虚拟dom用在服务端渲染，也能渲染成手机原生UI组件
    3. react-dom渲染虚拟dom
        1. 通过`render()`函数去操作浏览器DOM树来展示出结果
        2. 通过`renderToString()`计算虚拟DOM的HTML形式的字符串
3. 同构应用注意:
    1. 不能包含浏览器环境的API
    2. 不能包含css, 渲染css会增加计算量，影响服务端的性能
    3. 不能将node.js原生模块和node_modules第三方模块打包进去，需要通过commonjs规范引入
    4. 通过CommonJs规范导出1个渲染函数，在HTTP服务器中执行这个渲染函数，渲染出HTML的内容返回
    ```js
    // webpack.server.config.js
    module.exports = {
        context: path.resolve(__dirname, '../src'),
        entry: './main_server.js', // js入口文件
        target: 'node', // 为了不将node.js内置的模块打包进输出文件中
        externals: [nodeExternals()], // 为了不将node_modules下的第三方模块打包进输出文件中
        output: {
            libraryTarget: 'commonjs2', // 为了被node.js编写的http服务调用
            filename: 'bundle_server.js', // 将要在node.js运行的代码输出到bundle_server.js中
            path: path.resolve(__dirname, './dist')
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: ['babel-loader'],
                    exclude: path.resolve(__dirname, 'node_modules')
                },
                {
                    test: /\.css/,
                    use: ['ignore-loader'] // 忽略css文件
                }
            ]
        },
        devtool: 'source-map'
    }
    ```
    ```js
    // main_server.js
    import React from 'react';
    import { renderTostring } from 'react-dom/server';

    export function render() {
        return renderTostring(<hl >Hello,Webpack</hl>)
    }
    ```
    ```js
    // http_server.js
    const express = require('express');
    const { render } = require('./dist/bundle_server');
    const app = express();

    app.get('/', function (req, res) {
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
        `)
    })

    app.use(express.static('.'));
    app.listen(3000, function () {
        console.log('app listening on port 3000!')
    })
    ``` 
#### 4.electron
1. 用web技术开发跨平台的桌面端应用
2. 用Chromium浏览器显示web界面作为应用的GUI, 通过Node.js和操作系统交互
3. Atom和VsCode就是使用Electron开发的
4. 优点
    * 降低开发门槛，大量web开发技术和现成库可以复用于Electron
    * Chromium浏览器和Node.js都是跨平台，Electron能做到不同的操作系统运行一份代码
5. Electron一个窗口对应一个网页

#### 5.构建npm模块
1. npm
    1. 每个模块根目录下都有1个package.json文件
    2. 模块文件以js为主，但同时可包括css 图片 文件
    3. NPM仓库目前广泛支持的是commonjs规范
2. 使用webpack构建npm模块
    ```js
    // webpack.config.js
    const path = require('path');
    const ExtractTextPlugin = require('extract-text-webpack-plugin');

    module.exports = {
        entry: './src/index.js',
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'lib'), // lib放发布npm仓库的最终代码
            libraryTarget: 'commonjs2' // 输出的代码符合CommonJs模块化规范，供其他模块导入使用
        },
        // 注册在运行环境中的全局变量访问，不能被打包进输出代码中，防止出现多次
        externals: /^(react|babel-runtime)/,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: ['babel-loader'],
                    exclude: path.resolve(__dirname, 'node_modules')
                },
                {
                    test: /\.css/,
                    use: ExtractTextPlugin.extract({
                        use: ['css-loader']
                    })
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin({
                filename: 'index.css' // 输出的css文件名称
            })
        ],
        devtool: 'source-map'
    }
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
    3. AppCache, 已被web标准废弃
    4. Service Workers, 是web worker的一部分，通过拦截网络请求实现离线缓存，是构建PWA应用的关键技术
2. Service Workers
    1. Service Workers是一个在浏览器后台运行的脚本，生命周期完全独立于网页
    2. 无法直接访问dom, 可通过postMessage接口发送消息来和UI进程通信
    3. Service Workders可拦截网络请求，离线缓存，编译响应，过滤响应
    4. 判断浏览器是否支持Service Workers
        ```js
        // main.js
        if (navigator.serviceWorker) {
            window.addEventListener('DOMContentLoaded',function() {
                // 调用 serviceWorker.register 注册，参数 /sw.js 为脚本文件所在的 URL 路径
                navigator.serviceWorker.register('sw.js');
            });
        }
        ```
    5. 注册Service Workers
        ```js
        // sw.js
        var serviceWorkerOption = {
            "assets": [
                "/app.js",
                "/app.css",
                "/index.html"
            ]
        };

        var cacheKey = new Date().toISOString();

        // 当前缓存白名单，在新脚本的 install 事件里将使用白名单里的 key
        var cacheWhitelist = [cacheKey];

        // 需要被缓存的文件的 URL 列表
        var cacheFileList = global.serviceWorkerOption.assets;

        // 监听 install 事件
        self.addEventListener('install', function (event) {
            // 等待所有资源缓存完成时，才可以进行下一步
            event.waitUntil(
                caches.open(cacheKey).then(function (cache) {
                // 要缓存的文件 URL 列表
                return cache.addAll(cacheFileList);
                })
            );
        });

        // 拦截网络请求
        self.addEventListener('fetch', function (event) {
            event.respondWith(
                // 去缓存中查询对应的请求
                caches.match(event.request).then(function (response) {
                // 如果命中本地缓存，就直接返回本地的资源
                if (response) {
                    return response;
                }
                // 否则就去用 fetch 下载资源
                return fetch(event.request);
                }
                )
            );
        });

        // 新 Service Workers 线程取得控制权后，将会触发其 activate 事件
        self.addEventListener('activate', function (event) {
            event.waitUntil(
                caches.keys().then(function (cacheNames) {
                return Promise.all(
                    cacheNames.map(function (cacheName) {
                    // 不在白名单的缓存全部清理掉
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // 删除缓存
                        return caches.delete(cacheName);
                    }
                    })
                );
                })
            );
        });
        ```
    6. 搭建webpack
        ```js
        // webpack.config.js
        const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

        module.exports = {
            plugins: [
                new ServiceWorkerWebpackPlugin({
                    // 自定义的 sw.js 文件所在路径
                    // ServiceWorkerWebpackPlugin 会把文件列表注入到生成的 sw.js 中
                    entry: path.join(__dirname, 'sw.js'),
                }),
            ],
            devServer: {
                // Service Workers 依赖 HTTPS，使用 DevServer 提供的 HTTPS 功能。
                https: true
            }
        }
        ```
    7. 启动chrome需忽略证书验证
        ```js
        chrome.exe --user-data-dir=./tmp --ignore-certificate-errors --unsafely-treat-insecure-origin-as-secure=https://localhost:8080
        ```
#### 7.npm script
1. npm script的底层原理是通过shell去运行脚本命令
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
4. 使用husky为项目接入git hook
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
#### 9.DevServer的实现原理
1. webpack-dev-middlerware实现devServer
2. webpack-hot-middleware实现模块热替换
```js
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');

// 从webpack.config.js中读取配置
const config = require('./webpack.config.js');
const app = express();

// 用读取到的webpack配置实例化一个compiler
const compiler = webpack(config);
// 为app注册webpackMiddleware中间件
app.use(webpackMiddleware(compiler));
app.use(require('webpack-hot-middleware')(compiler));
app.listen(3000);
```
#### 10.加载图, 文件
1. `file-loader`可以将js和css中导入图片的语句换成正确的地址，同时将文件输出到对应的位置
```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.png$/,
                use: ['file-loader']
            }
        ]
    }
}
``` 
2. `url-loader`可以将文件内容经过`base64`编码后注入js或css中
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
6. 使用`raw-loader`将文件内容读取出来，注入到js中
7. `svg-inline-loader`将文件内容读取出来，压缩后注入到js中
#### 11.source map
1. devtool的选项列表 
| devtool                 | 含义                                                                        |
| :---------------------- | :-------------------------------------------------------------------------- |
| 空                      | 不生成source map                                                            |
| eval                    | 每个module会封装在eval里包裹起来执行                                        |
| source-map              | 额外生成一个单独的source map文件                                            |
| hidden-source-map       | 和source-map类似，但不会在js文件的末尾追加/# sourcemappingurl=bundle.js.map |
| inline-source-map       | 将source map转成base64编码内嵌到js中                                        |
| eval-source-map         | 将source map转换成base64编码内嵌到eval语句中                                |
| cheap-source-map        | 生成的source map没有列信息，生成速度更快                                    |
| cheap-module-source-map | 和cheap-source-map类似，但会包含loader生成的source map                      |

## 二、webpack优化
#### 1.缩小文件搜索范围
1. 优化loader配置
    1. 配置test, include, exclude三个配置缩小命中范围，让尽可能少的文件被loader处理
2. 优化resolve.modules配置
    1. 指明存放第三方模块的绝对路径，减少寻找
    ```js
    module.exports = {
        resolve: {
            // __dirname表示当前工作目录，也就是项目根目录
            modules: [path.resolve(__dirname, 'node_modules')]
        }
    }
    ``` 
3. 优化resolve.mainFields配置
    1. 固定mainFields入口文件描述字段，减少搜索步骤
    ```js
    module.exports = {
        resolve: {
            mainFields: ['main']
        }
    }
    ```
4. 优化resolve.alias配置
    1. 配置alias，减少耗时的递归解析操作
    2. 配置了alias，会影响tree-sharking去除无效代码
    ```js
    module.exports = {
        resolve: {
            alias: {
                'react': path.resolve(__dirname, './node_modules/react/dist/react.min.js')
            }
        }
    }
    ``` 
5. 优化resolve.extensions配置
    1. extensions中的配置列表要尽可能的少
    2. 出现频率高的文件后缀要优先放前面
    3. 导入语句要尽可能的带上后缀
6. 优化module.noParse配置
    1. 配置noParse忽略对该文件的递归解析处理
    2. 被忽略的文件不应该包含import, require, define等语句
    ```js
    module.exports = {
        module: {
            noParse: [/react\.min\.js$/]
        }
    }
    ``` 
#### 2.使用DLLPlugin
1. DLL
    1. 将依赖的基础模块抽离出来，打包到一个个单独的动态链接库中，在一个动态链接库中可以包含多个模块
    2. 动态链接库只会被编译一次
2. 接入webpack
    1. DLLPlugin, 构建出动态链接库文件
        ```js
        // webpack.dll.config.js
        const DllPlugin = require('webpack/lib/DllPlugin');
        module.exports = {
            output: {
                filename: '[name].dll.js',
                path: path.resolve(__dirname, 'dist'),
                // 存放动态链接库的全局变量名称
                library: '_dll_[name]'
            },
            plugins: [
                new DllPlugin({
                    name: '_dll_[name]', // 动态链接库的全局变量名称
                    path: path.join(__dirname, 'dist', '[name].manifest.json')
                })
            ]
        }
        ```
    2. DLLReferencePlugin, 使用动态链接库文件
        ```js
        // webpack.config.js
        const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
        module.exports = {
            // dllreferencePlugin会从manifest.json文件中读取name的值
            plugins: new DllReferencePlugin({
                // 描述react动态链接库的内容
                manifest: require('./dist/react.manifest.json')
            })
        }
        ``` 
#### 3.使用happyPack
1. 多进程处理loader，较少构建时间
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
#### 4.使用ParallelUglifyPlugin
1. 开启多个子进程，对文件进行压缩
```js
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = {
    plugins: [
        new ParallelUglifyPlugin({
            uglifyJS: {
                output: {

                },
                compress: {

                }
            }
        })
    ]
}
```  
#### 5.使用自动刷新
1. webpack自带的文件监听
```js
module.exports = {
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300, // 监听文件变化后300ms再去执行操作，截流
        poll: 1000 // 每秒轮询1000次
    }
}
```
2. webpack-dev-server负责刷新浏览器
    * 通过关闭inline, 让网页只注入一个代理客户端
    ```js
    webpack-dev-server --inline false
    ``` 
3. 开启热模块替换
    ```js
    webpack-dev-server --hot
    ```
    ```js
    // webpack.config.js
    const NameModulesPlugin = require('webpack/lib/NameModulesPlugin');

    module.exports = {
        plugins: [
            // 显示出被替换模块的名称
            new NameModulesPlugin()
        ]
    }
    ```
#### 6.区分环境
```js
module.exports = {
    plugins: [
        // 定义当前config文件NODE_ENV环境变量为production
        new DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
}
```
#### 7.压缩
1. 使用`ParallelUglifyPlugin`
```js
const UglifyJSPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

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
                reduce_vars: true
            },
            output: {
                // 不保留空格和制表符
                beautify: false,
                // 删除所有的注释
                comments: false
            }
        })
    ]
}
```
2. 开启`css-loader`的`minimize`选项压缩css
```js
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.css/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader?minimize']
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: `[name]_[contenthash:8].css`
        })
    ]
}
```
#### 8.CDN加速
1. CDN是将资源部署到世界各地，使用户访问时按就近原则从最近的服务器获取资源，加快获取资源的速度
2. 业界使用CDN的正确方式
    1. 针对HTML文件，不使用CDN服务，同时关闭自己服务器上的缓存
    2. 针对js, css, 图片，开启CDN和缓存，用hash值判断文件内容是否变化
    3. 浏览器对同一域名的资源请求有限制（大概4个），将静态资源分散到不同的CDN服务上
3. Webpack接入CDN
    1. 在output.publicPath中设置js的地址
    2. 在css-loader.publicPath中设置css中导入的资源的地址
    3. 在webplugin.stylePublicPath设置css文件的地址
    ```js
    const ExtractTextPlugin = require('extract-text-webpack-plugin');
    const { WebPlugin } = require('web-webpack-plugin');

    module.exports = {
        output: {
            filename: '[name]_[chunkhash:8].js',
            path: path.resolve(__dirname, './dist'),
            // 指定js文件的CDN目录URL
            publicPath: '//js.cdn.com/id/'
        },
        module: {
            rules: [
                {
                    test: '/\.css/',
                    use: ExtractTextPlugin.extract({
                        use: ['css-loader?minimize'],
                        // 指定存放css中导入的资源（图片）的CDN目录的URL
                        publicPath: '//img.cdn.com/id/'
                    })
                }
            ]
        },
        plugins: [
            new WebPlugin({
                template: './template.html',
                filename: 'index.html',
                // 指定存放css文件的CDN目录的URL
                stylePublicPath: '//css.cdn.com/id/'
            })
        ]
    }
    ```
#### 9.使用tree shaking
1. 用来剔除js中用不上的死代码，依赖ES6的模块化语法
2. 接入webpack
    1. 关闭babel中的模块转换功能
    2. 配置第三方包采用ES6模块化语法
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
            mainFields: ['jsnext:main', 'browser', 'main']
        }
    }
    ```
#### 10.提取公共代码
1. 提取公共代码的优点
    1. 减少网络传输流量，降低服务器成本
    2. 第一次打开网站得不到优化，之后访问其他页面的速度将大大提升
2. webpack提取公共代码
```js
module.exports = {
    optimization: {
        splitChunks: {
            // 缓存组
            cacheGroups: {
                vendors: {
                    test: /react/,
                    name: 'vendors'
                },
                common: {
                    // chunks(chunk){
                    //     return chunk.name.includes('common')
                    // }
                    chunks: 'all',
                    minSize: 0, // 压缩前的最小模块大小
                    minChunks: 6, // 被引用的次数
                    name: 'common'
                }
            }
        }
    }
}
```
#### 11.分割代码按需加载
1. 按需加载原因
    1. 将网站分割成一个个小功能
    2. 将每一类合并成Chunk, 按需加载对应的Chunk
    3. 对不依赖大量代码的功能点进行按需加载，例Chart.js, flv.js
2. webpack按需加载
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
            main: './main.js'
        },
        output: {
            // 为entry中配置生成的chunk配置输出文件的名称
            filename: '[name].js',
            // 为动态加载的chunk配置输出文件的名称
            chunkFilename: '[name].js'
        }
    }
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
    import React, { PureComponent, createElement } from 'react';

    // 异步加载组件
    function getAsyncComponent(load) {
        return class AsyncComponent extends PureComponent {
            componentDidMount() {
                load().then(({ default: component }) => {
                    this.setState({
                        component
                    })
                }) 
            }

            render() {
                const { component } = this.state || {};

                // component是React.Component类型，需要React.createElement生产一个组件实例
                return component ? createElement(component) : null;
            }
        }
    }
    ```
#### 12.使用prepack
1. prepack是激进的方法，会改变源代码的运行逻辑，输出性能更好的js代码
2. prepack实际是一个部分求值器，编译代码时会提前将计算结果放到编译后的代码中，而不是在代码中运行时才去求值
3. prepack还不能识别DOM API和部分Node.js API
4. 接入webpack
```js
const PrepackWebpackPlugin = require('prepack-webpack-plugin').default;

module.exports = {
    plugins: [
        new PrepackWebpackPlugin()
    ]
}
```
#### 13.开启Scope Hoisting(作用域提升)
1. Scope Hoisting的好处
    1. 代码体积更小，因为函数声明语句会产生大量的代码
    2. 函数作用域变少了，内存开销变小了
3. 接入webpack
    ```js
    const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');

    module.exports = {
        plugins: [
            // 开启scope hoisting，依赖源码时需采用ES6模块化语法
            new ModuleConcatenationPlugin()
        ],
        resolve: {
            // 第三方模块优先使用ES6模块化语法
            mainFields: ['jsnext:main', 'browser', 'main']
        }
    }
    ``` 
#### 14.输出分析
1. 使用官方的webpack Analyse, 是一个在线的web应用
2. 使用webpack-bundle-analyzer

## 二、原理

#### 1. webpack
1. __webpack_require__.e 加载需要异步加载的Chunk对应的文件
2. webpackJsonp 用于从异步加载的文件中安装模块

#### 2. loader
1. loader的职责是单一的
2. loader都会链式的顺序执行
3. 简单的loader源码
```js
const sass = require('node-sass');
const loaderUtils = require('loader-utils');

module.exports = function(source) {
    // 获取当前loader传入的options
    const options = loaderUtils.getOptions(this);
    return sass(source);
}
```
4. loader返回除了内容之外的东西
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
5. loader异步处理
```js
module.exports = function(source) {
    var callback = this.async();
    someAsyncOperation(source, function(err, result, sourceMaps, ast) {
        // 通过callback返回异步执行后的结果
        callback(err, result, sourceMaps, ast);
    })
}
```
6. Loader API
* `this.context`: 当前处理的文件所在的目录，loader处理的文件为/src/main.js, this.context为/src
* `this.resource`: 当前处理的文件的完整请求路径，包括querystring, 例如/src/main.js?name=1
* `this.resourcePath`: 当前处理的文件的路径，例如/src/main.js
* `this.resourceQuery`: 当前处理的文件的querystring
* `this.target`: 等于webpack配置中的target
* `this.loadModule`: `this.loadModule(request: string, callback: function(err, source, sourceMap, nodule))`获取request对应的文件的处理结果
* `this.resolve`: 像require语句一样获得指定文件的完整路径，使用方法为`resolve(context: string, request: string, callback: function(err, result: string))`
* `this.addDependency`: 为当前处理的文件添加其依赖的文件，以便依赖的文件发生变化时，重新调用Loader处理该文件，使用方法为`addDependency(file: string)`
* `this.addContextDependency`: 为当前处理的文件添加其依赖的文件目录，使用方法为`addContextDependency(directory: string)`
* `this.clearDependencies`: 清除当前正在处理的文件的所有依赖，使用方法为`clearDependencies()`
* `this.emitFile`: 输出一个文件，使用方法为`emitFile(name: string, content: Buffer|string, sourceMap: {...})`

7. 加载本地loader
    1. 方法1: npm link
        1. 在本地的Npm模块根目录下执行`npm link`, 将本地模块注册到全局
        2. 在项目根目录，执行`npm link loader-name`, 将注册到全局的本地npm模块链接到项目的node_modules下，loader-name是指本地NPM模块的`package.json`文件中配置的模块名称
    2. 方法2: resolveLoader
        ```js
        // webpack.config.js
        module.exports = {
            resolveLoader: {
                // 去哪些目录下寻找loader
                modules: ['node_modules', './loaders/']
            }
        }
        ```
8. 手写loader
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
                        loader: path.resolve(__dirname, './txt-loader.js'),
                        options: {
                            name: 'txt-loader'
                        }
                    }
                }
            ]
        }
    }
    ```
    ```js
    // txt-loader.js
    const utils = require('loader-utils');

    module.exports = function(source) {
        const options = utils.getOptions(this);
        source = source.replace(/\[name\]/g, options.name);

        return `export default ${JSON.stringify({
            content: source,
            filename: this.resourcePath
        }) }
        }`
    }
    ```
    ```js
    import test from './test.txt';

    // {
    //     content: 'test loader output from txt-loader',
    //     filename: "/Users/xx/test-loader/src/test.txt"
    // }
    test;
    ```
3. 编写Plugin
    1. compiler, 包含options, loaders, plugins等webpack环境的所有配置信息
    2. compilation, 包含当前的模块资源、编译生成资源、变化的文件，每次文件发生变化，就有新的compilation被创建
    3. plugin基础代码
    ```js
    // BasicPlugin.js
    class BasicPlugin {
        // 在构造函数中获取用户为该插件传入的配置
        constructor(options) {

        }

        // webpack会调用BasicPlugin实例的apply方法为插件实例传入compiler对象
        apply(compiler) {
            compiler.plugin('compilation', function(compilation) {

            })
        }
    }
    module.exports = BasicPlugin;
    ```
    ```js
    // webpack.config.js
    const BasicPlugin = require('./BasicPlugin.js');
    module.exports = {
        plugins: [
            // 初始化1个BasicPlugin并获得其实例
            // 调用basicPlugin.apply(compiler)为插件实例传入compiler对象
            // 通过compiler.plugin监听广播的事件
            new BasicPlugin(options)
        ]
    }
    ```
    4. 编写一个页面加载前的loading
    ```js
    class LoadingPlugin {
        constructor(options) {}
        apply(compiler) {
            compiler.plugin('compilation', function(compilation) {
                compilation.plugin('html-webpack-plugin-before-html-processing', (htmlData, callback) => {
                    htmlData.html = htmlData.html.replace(
                        `<div>loading</div>`
                    );
                    callback(null, htmlData);
                })
            })
        }
    }
    module.exports = LoadingPlugin;
    ```
    ```js
    class TestPlugin {
        constructor(options) {}
        apply(compiler) {
            compiler.plugin('compilation', function(compilation) {
                compilation.plugin('after-optimize-chunks', (chunks) => {
                    console.log('2222', chunks.length)
                })
            })
        }
    }
    module.exports = TestPlugin;
    ```
    ```js
    // webpack.config.js
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const LoadingPlugin = require('./LoadingPlugin');

    module.exports = {
        new HtmlWebpackPlugin({}),
        plugins: [
            new HtmlWebpackPlugin({}),
            new LoadingPlugin(),
            new TestPlugin()
        ]
    }
    ```
