## 1.模块化

1. CommonJs
   - 通过`require`同步加载依赖的模块
   - 通过`module.exports`导出需要暴漏的接口
   - Nodejs 采用的 commonJs 方式
   - Npm 发布的第三方模块都采用 CommonJs 规范
   - CommonJs 无法直接运行在浏览器环境，必须通过工具转换成标准的 ES5
   - CommonJs1: `exports.xx = XX`;
   - CommonJs2: `module.exports = XX`;
   - eg
     ```js
     // 导入
     const moduleA = require("./moduleA");
     // 导出
     module.exports = moduleA.someFunc;
     ```
2. AMD

   - 采用异步的方式加载依赖的模块
   - 主要针对浏览器环境的模块化问题
   - 可以不转码，直接运行在浏览器环境和 nodeJs 环境
   - 可异步加载多个依赖
   - 需要依赖 AMD 库，例如: `requirejs`
   - eg

     ```js
     // 定义一个模块
     define("module", ["dep"], function (dep) {
       return exports;
     });
     // 导入和使用
     require(["module"], function (module) {});
     ```

3. ES6 模块化
   - 国际标准化组织提出的 javascript 模块化规范
   - 将逐渐取代 CommonJs 和 AMD 规范，成为浏览器和 nodejs 的通用模块化方案
   - 目前仍然需要转成 ES5 才能运行在大部分的 JS 运行环境
4. scss 模块化
   - eg
     ```scss
     // util.scss
     @mixin absolute {
       position: absolute;
     }
     // main.scss
     @import "util";
     #box {
       @include absolute;
     }
     ```

## 2.打包工具的需求

1. 代码转换：将源代码转成可执行的 javascrip, css, html
2. 文件优化：压缩 javacript, css, html 代码，压缩合并图片
3. 代码分割：提取多个页面共用的公共代码，提取首屏无需加载的代码进行异步加载
4. 模块合并：将依赖的多个模块和文件合并成 1 个文件
5. 自动刷新：监听本地源代码的变化，自动重新构建，刷新浏览器
6. 代码校验：校验代码是否符合规范，以及单元测试是否通过
7. 自动发布：更新代码后，自动构建代码并传输给发布系统

## 3.NPM script

- 使用`scripts`字段定义任务
- 底层实现原理是通过`shell`去运行脚本命令

## 4.其他构建工具

- Grunt
  - 灵活，只负责执行我们定义的任务
  - 大量的可复用插件封装好了常见的构建任务
- Gulp
  - 引入了流的概念，通过插件去处理流，流可以在插件之间传递
  - 可以管理和执行任务
  - 还可以监听和读写文件
- Fis3
  - 内置大量的构建功能, 开箱即用
  - 官方不再维护

## 5.webpack 概念

1. 一个打包模块化的 javascript 工具
2. 通过 Loader 转换文件
3. 通过 plugin 注入钩子

## 6.Rollup

1. 能对 ES6 的源码进行`tree shaking`(webpack 现在已经支持该功能)
2. 打包出来的代码没有 webpack 那段模块的加载、执行和缓存的代码, 因此打包出来的体积更小

## 7.loader

```js
module: {
  rules: [
    {
      // 用正则表达式去匹配用该Loader转换的css文件
      test: /\.css$/,
      use: ["style-loader", "css-loader?minimize"],
    },
  ];
}
```

1. webpack 不支持非 javascript 文件，如要解析 css, 则需要使用 webpack 的 loader 机制
2. loader 是文件转换功能的翻译员
3. loader 通常写在`module.rules`数组中
4. loader 的执行顺序是从后往前的
5. loader 通过 url querystring 的方式传入参数，例如`css-loader?minimize`告诉 css-loader 开启 css 压缩
6. loader 也可以通过在`options`中通过 Object 实现
   ```js
   use: [
     "style-loader",
     {
       loader: "css-loader",
       options: {
         minimize: true,
       },
     },
   ];
   ```
7. 还可以在源码中指定用什么 loader 去处理文件
   ```js
   require("style-loader! css-loader?minimize! ./main.css");
   ```

## 8.style-loader

1. 将 css 用 javascript 里面的字符串存储起来
2. 通过 dom 操作，动态的向 HTML head 标签里插入 HTML style 标签

## 9.plugin

1. 在构建流程中注入钩子实现，扩展`webpack`功能，为`webpack`带来很大的灵活性
2. 使用`ExtractTextPlugin`提取 javascript 中的`css`到 1 个单独的文件
   ```js
   module: {
       rules: [
           {
               test: /\.css$/,
               loaders: ExtractTextPlugin.extract({
                   use: ['css-loader']
               })
           }
       ]
   },
   plugins: [
       new ExtractTextPlugin({
           // 从js中提取出来的css的名称
           filename: `[name]_[contenthash:8].css`
       })
   ]
   ```
3. 将提取出来的 css 文件引入 index.html 中

## 10.Devserver

1. 提供 http 服务
2. 监听文件的变化，并自动刷新网页，做到实时预览
   - `DevServer`和`Webpack`之间通过`WebSocket`通信
   - 通过向网页注入的代理客户端控制网页的刷新
   - 只会监听`entry`入口依赖的文件
3. 支持 sourcemap, 方便调试
   - Source map 就是一个信息文件，里面储存着位置信息。也就是说，转换后的代码的每一个位置，所对应的转换前的位置。
4. 模块热替换
   - 启动`devServer`时带上`--hot`参数
   - 模块热替换不需要重载整个网页，能提供更快的响应和更好的开发体验

## 11.核心概念

- Entry: 入口，输入
- Module: 模块，一个模块对应一个文件，webpack 会从配置的 entry 开始递归找出所有依赖的模块
- Chunk: 打包过程中被操作的代码块，一个 chunk 由多个模块组合而成，用于代码合并与分割（输入的入口文件和输出的出口文件都是 chunk）
- Bundle: 已经加载和编译的最终源文件版本
- Loader: 模块转换器，用于将模块的原内容按照需求转换成新的内容
- Plugin: 扩展插件
- Output: 输出结果

## 12.webpack 配置

- Entry: 配置模块的入口
- Output: 配置如何输出最终想要的代码
- Module: 配置处理模块的规则
- Resolve: 配置寻找模块的规则
- Plugins: 配置扩展插件
- Devserver: 配置 Devserver
- 其他配置项

## 13.Context

- webpack 寻找文件路径时，会以`context`作为根目录
- `context`默认为启动执行 webpack 时所在的工作目录
- `context`必须是 1 个绝对路径的字符串
- `Entry`的路径和依赖的模块路径可能采用相对`context`的路径来描述
- eg.
  ```js
      module.exports = {
          context: path.resolve(__dirname, 'app');
      }
  ```

## 14.Entry

1. Entry 配置
   - `entry`的 3 种配置方法

| type   | example                                                        | description                           |
| :----- | :------------------------------------------------------------- | :------------------------------------ |
| String | './app/entry'                                                  | 文件路径，相对路径                    |
| Array  | ['./app/entryl', './app/entry2']                               | 文件路径，相对路径                    |
| object | { a: './app/entry1', b: ['./app/entry-b1', './app/entry-b2'] } | 配置多个入口，每个入口生成 1 个 chunk |

- 如果是 array 类型，搭配 output.library 配置使用，只有数组的最后一个入口文件的模块被导出

2 .Chunk

- 如果`entry`是 1 个`string`或者`array`, 则只会生成 1 个 chunk, chunk 的名称是 main
- 如果`entry`是 1 个`object`，则可能会出现多个`chunk`,`chunk`的名称是 object 中 key 的值

  3.配置动态 Entry

- entry 不仅能配置成静态，也能配置成动态
- 同步函数
  ```js
  entry: () => {
    return {
      a: "./page/a",
      b: "./page/b",
    };
  };
  ```
- 异步函数
  ```js
  entry: () => {
    return new Promise((resolve) => {
      resolve({
        a: "./page/a",
        b: "./page/b",
      });
    });
  };
  ```

## 15.Output

1. filename
   - output.filename 配置输出文件的名称，为`string`类型
   - 输出 1 个文件，可直接配置成静态
     ```js
     filename: "bundle.js";
     ```
   - 输出多个文件，需配置成动态
     ```js
     filename: "[name].js";
     ```
   - 配置`filename`可使用字符串模板函数，除了内置变量 name,还包括 id, hash, chunkhash

| variable  | decription                  |
| :-------- | :-------------------------- |
| id        | chunk 的唯一标识，从 0 开始 |
| name      | chunk 的名称                |
| hash      | chunk 的唯一标识的 hash 值  |
| chunkhash | chunk 内容的 hash 值        |

    * hash和contenthash的长度的是可指定的，[hash:8]代表8位hash值，默认是20位
    * ExtractTextWebpackPlugin插件使用`contenthash`而不是`chunkhash`, 因为ExtractTextWebpackPlugin提取出来的是代码内容本身，而不是一组模块组成的chunk

2.  chunkFilename
    - `chunkFilename`和`filename`非常相似
    - `chunkFilename`只用于指定在运行过程中生成的 chunk 在输出时的文件名称
    - 运行时生成 chunk 的常见场景：使用`CommonChunkPlugin`, 使用`import('path/to/module')`动态加载
3.  path
    - output.path 配置输出文件存放的本地目录
    - 必须时 string 类型的绝对路径
    - eg.
      ```js
      path: path.resolve(__dirname, "dist_[hash]");
      ```
4.  publicPath
    - output.publicPath 配置发布到线上资源的 url 前缀，为 string 类型
    - 默认值为'', 即使用相对路径
    - `output.path`和`output.publicPath`都支持字符串模板，内置变量只有 1 个, 即 hash
    - eg.
      ```js
          module = {
              output: {
                  filename: '[name]_[chunkhash:8].js'
                  publicPath: 'https://cdn.example.com/assets/'
              }
          }
      ```
      ```html
      <script src="https://cdn.example.com/assets/a_12345678.js"></script>
      ```
5.  crossOriginLoading
    - webpack 异步加载代码块时通过`jsonp`实现的（动态的向 html 插入 1 个<script url="src"></script>标签加载异步资源）
    - output.crossOriginLoading 用于异步插入标签的`crossorigin`的值
    - anonymous(默认)：加载此脚本时，不会带上用户的 Cookies
    - use-credentials, 加载此脚本时，会带上用户的 Cookies
6.  libraryTarget 和 library
    - 用 webpack 构建可以被其他模块导入使用的库时，需要用到 libraryTarget 和 library
7.  libraryTarget
    1. var(默认)
       ```js
       // 配置`output.library = 'LibraryName'`;
       // webpack输出代码
       var LibraryName = lib_code;
       // 使用库的方法
       LibraryName.doSomething();
       // 如果配置output.library = '',则直接输出
       lib_code; // 导出库的代码内容，有返回值的自执行函数
       ```
    2. commonjs
       ```js
       // 配置`output.library = 'LibraryName'`
       // webpakc输出代码
       exports["LibraryName"] = lib_code;
       // 使用库的方法
       // Library-name-in-npm指模块被发布到Npm代码仓库的名称
       require("Library-name-in-npm")["LibraryName"].doSomething();
       ```
    3. commonjs2
       ```js
       // libraryTarget为commonjs2时，output.library将无意义
       // webpack输出代码
       module.exports = lib_code;
       // 使用库的方法
       require("library-name-in-npm").doSomething();
       ```
    4. this
       ```js
       // 编写的库通过this被赋值给通过library指定的名称
       // webpack输出代码
       this["LibraryName"] = lib_code;
       // 使用库的方法
       this.libraryName.doSomething();
       ```
    5. window
       ```js
       // 编写的库将通过window赋值给通过library指定的名称
       // webpack输出代码
       window["LibraryName"] = lib_code;
       // 使用库方法
       window.LibraryName.doSomething();
       ```
    6. global
       ```js
       // 编写的库将通过window赋值给通过library指定的名称
       // webpack输出代码
       global["libraryName"] = lib_code;
       // 使用库的方法
       global.LibraryName.doSomething();
       ```
8.  libraryExport
    - 配置哪些子模块被导出
    - 只有在 output.libraryTarget 被设置成 commonjs 或者 commonjs2 时才有意义
    - eg.
      ```js
      // 需要导出的模块源码
      export const a = 1;
      export default b = 2;
      // webpack配置
      output.libraryExport = a;
      // webpack输出代码
      module.exports = lib_code["a"];
      // 使用库的方法
      require("library-name-in-npm") === 1;
      ```

## 16.Module

1. 配置 loader
   - rules 配置模块的读取和解析规则，通常用来配置 loader
   - 其类型是 1 个数组，数组里面的每 1 项都描述如何处理部分文件
   - 条件匹配：通过 test, include, exclude 来匹配 loader 要应用的规则文件
   - 应用规则：通过 use 配置来应用 loader
   - 重置顺序：1 个 loader 的执行顺序为从右到左，通过 enforce 选项可将 loader 的执行顺序放到最前或最后
   - eg.
     ```js
     module: {
       rules: [
         {
           // 命中javascript文件
           test: /\.js$/,
           // ?cacheDirectory表示传给babel-loader的参数，用于缓存babel的编译结果，加快编译速度
           use: ["babel-loader?cacheDirectory"],
           // 只命中scr目录，加快搜索速度
           include: path.resolve(__dirname, "src"),
         },
         {
           test: /\.scss$/,
           // 由后往前的顺序执行
           use: ["style-loader", "css-loader", "sass-loader"],
           exclude: /node_modules/,
         },
         {
           // 对非文本文件采用file-loader加载
           test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
           use: ["file-loader"],
         },
       ];
     }
     ```
   - 可通过 object 向 loader 传参
     ```js
     use: [
       {
         loader: "babel-loader",
         options: {
           cacheDirectory: true,
         },
         // pre-loader的执行顺序放在最前面，post-loader的执行顺序放在最后面
         enforce: "post",
       },
     ];
     ```
   - 通过数组传参
     ```js
         {
             test: [/\.jsx?$/, /\.tsx?$/],
             include: [
                 path.resolve(__dirname, 'src'),
                 path.resolve(__dirname, 'tests')
             ],
             exclude: [
                 path.resolve(__dirname, 'node_modules'),
                 path.resolve(__dirname, 'brower_modules')
             ]
         }
     ```
2. noParse

   - 忽略对未采用模块化文件的递归解析和处理, 提高构建性能
   - noParse 接收的类型可以是`RegExp`或`function`

   ```js
   // 使用正则
   noParse: /jquery|chartjs/;

   // 使用function, webpack3.0+支持
   noParse: (content) => {
     // content代表模块的文件路径
     // 返回true或者false
     return /jquery|chartjs/.test(content);
   };
   ```

3. parser
   - 更细粒度的配置哪些模块语法被解析，哪些不被解析
   - 支持 AMD, CommonJS, SystemJS, ES6
   ```js
   module: {
     rules: [
       {
         test: /\.js$/,
         use: ["babel-loader"],
         parser: {
           amd: false, // 禁用AMD
           commonjs: false, // 禁用CommonJS
           system: false, // 禁用SystemJS
           harmony: false, // 禁用ES6 import/export
           requireInclude: false, // 禁用require.include
           requireEnsure: false, // 禁用require.ensure
           requireContext: false, // 禁用require.context
           browserify: false, // 禁用browserify
           requireJs: false, // 禁用requirejs
         },
       },
     ];
   }
   ```

## 17.Resolve

1. Resolve 配置 webpack 如何寻找模块所对应的文件
2. alias
   - 将原导入路径映射成新的导入路径
     ```js
     resolve: {
       alias: {
         components: "./src/components/";
       }
     }
     ```
   - 支持以$符号只命中以关键字结尾的导入语句
     ```js
     resolve: {
         alias: {
             'react$': '/path/to/react.min.js'
         }
     }
     ```
3. mainFields

   - 配置决定优先采用哪份代码

     ```json
     // 第三方模块的package.json
     {
       "jsnext:main": "es/index.js", // 采用ES6语法的代码入口文件
       "main": "lib/index.js" // 采用ES5语法的代码入口文件
     }
     ```

     ```js
     // webpack配置，配置到根目录层全局文件生效，配置到rule层，正则表达式匹配的层生效
     resolve: {
       mainFields: ["jsnext:main", "module", "browser", "main"];
     }
     {
        test: /common.js/,
        include: (module) => {

        },
        resolve: {
            mainFields: ['main']
        },
        use: [
            {
                loader: 'thread-loader'
            }
        ]
     }
     ```

4. extensions
   - 配置查找文件时的后缀列表
     ```js
     extensions: [".ts", ".js", ".json"];
     ```
5. modules
   - 默认模块的查找只会去 node_modules 目录下寻找
   - 配置去哪些目录下寻找模块
   ```js
   // 常规导入
   import "../../../components/button";
   ```
   ```js
   // resolve.modules配置
   modules: ["./src/components", "node_modules"];
   // 导入
   import "button";
   ```
6. descriptionFiles
   - 配置描述第三方模块的文件名称
   ```js
   descriptionFiles: ["package.json"];
   ```
7. enforceExtension

   - 配置成 true, 则所有导入的语句都必须带上文件后缀

   ```js
   // 配置前
   import "./foo";

   // 配置后
   import "./foo.js";
   ```

8. enforceModuleExtension
   - 只对 node_modules 下的模块生效
   - enforceExtension 配置成 true 时，enforceModuleExtension 需配置成 false 兼容第三方模块
   - 第三方模块大多数语句都没有带文件后缀

## 18.Plugin

- 用于扩展 webpack 的功能
- Plugin 接收 1 个数组，数组的每一项都是要使用的 Plugin 的实例

```js
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {
  plugins: [
    // 所有页面都会用到的公共代码被提取到 common 代码块中
    new CommonsChunkPlugin({
      name: "common",
      chunks: ["a", "b"],
    }),
  ],
};
```

## 19.DevServer

1. 只有通过 DevServer 启动 Webpack 时，DevServer 里面的配置才生效
2. hot
   - DevServer 默认行为是代码被更新后，自动刷新整个页面
   - 开启 hot 后，将在不刷新整个页面的情况下通过新模块替换老模块做到实时预览
3. inline
   - 开启 inline, DevServer 会在构建变化后的代码时通过代理客户端控制网页刷新
   - 关闭 inline, DevServer 通过 iframe 的方式运行要开发的网页，
     构建完变化后的代码，通过刷新 iframe 实现实时预览，我们可以
     去`http://localhost:8080/webpack-dev-server/`实时预览自己的网页
   - 使用 DevServer 的模块热替换实现实时预览，最方便的方法是开启 inline
4. historyApiFallback
   - `historyApiFallback: true`导致任何请求都会返回`index.html`文件，只能用于只有一个 HTML 文件的应用
   - DevServer 根据不同的请求返回不同的 HTML 文件
     ```js
     historyApiFallback: {
       // 使用正则匹配命中路由
       rewrites: [
         // user开头的都返回user.html
         {
           from: /^\/user/,
           to: "/user.html",
         },
         // game开头的都返回game.html
         {
           from: /^\/game/,
           to: "/game.html",
         },
         // 其他都返回index.html
         {
           from: /./,
           to: "/index.html",
         },
       ];
     }
     ```
5. contentBase
   1. 配置 DevServer HTTP 服务器的文件根目录
      ```js
      devServer: {
        contentBase: path.join(__dirname, "public");
      }
      ```
   2. DevServer 服务器通过 HTTP 服务暴露文件分 2 种
      1. 暴露本地文件
      2. 暴漏 Webpack 构建出的结果，构建出的结果交给 DevServer 处理，不在本地
   3. `contentBase: false`来关闭暴漏本地文件
6. headers
   - 在 DevServer 的 HTTP 响应中，注入一些 HTTP 响应头
   ```js
   devServer: {
       headers: {
           'X-foo': 'bar'
       }
   }
   ```
7. host
   1. 配置 DevServer 服务监听的地址
   2. 配置`host: '0.0.0.0'`, 可以让局域网的其他设备访问自己的本地服务
   3. 默认`host: 127.0.0.1`, 只有本地才可以访问 DevServer 的 HTTP 服务
8. port
   1. 默认监听的端口, 默认为 8080
   2. 默认 8080，被占用，使用 8081, 被占用，使用 8082, 以此类推
9. allowedHosts
   1. 配置一个白名单列表，只有 HTTP 请求 HOST 在列表中的才返回
   ```js
   allowedHosts: [
     // 匹配单个域名
     "host.com",
     "sub.host.com",
     // host2.com和所有的子域名*.host2.com都将匹配
     ".host2.com",
   ];
   ```
10. disableHostCheck
    1. 是否关闭用于 DNS 重新绑定的 HTTP 请求的 HOST 检查
    2. 为了访问时直接通过 IP 地址访问而不是通过 HOST 访问
11. https
    1. 是否使用 https 服务
    2. HTTP2 和 Service Worker 必须运行在 HTTPS 上
    3. DevServer 会自动为我们生成一份 HTTPS 证书
    ```js
    devServer: {
      https: true;
    }
    ```
    4. 也可以使用自己的证书
    ```js
    devServer: {
        https: {
            key: fs.readFileSync('path/to/server.key'),
            cert: fs.readFileSync('path/to/server.crt'),
            ca: fs.readFileSync('path/to/ca.pem')
        }
    }
    ```
12. clientLogLevel
    - 配置客户端的日志等级，枚举值：
      - none
      - error
      - warning
      - info(默认)
13. compress
    - 是否启用 Gzip 压缩，默认为 false
14. open
    - 构建完成后，用默认浏览器打开需要开发的网页
    - devServer.openPage 配置项来打开指定 URL 的网页

## 20.其他配置项

1. Target
   - 构建出针对不同环境的代码
   - `target: 'node'`, 导入 Node.js 的原生模块语句`require('fs')`将会保留，fs 模块不会被打包到 chunk 里

| target 值         | 描述                                             |
| :---------------- | :----------------------------------------------- |
| web               | 针对浏览器（默认），所有代码都集中在一个文件里面 |
| node              | 针对 Node.js, 使用 require 语句加载 Chunk 代码   |
| aync-node         | 针对 Node.js. 异步加载 Chunk 代码                |
| webworker         | 针对 webWorker                                   |
| electron-main     | 针对 Electron 主线程                             |
| electron-renderer | 针对 Electron 渲染线程                           |

2. Devtool
   - 配置 webpack 如何生成 source map
   - 默认值为 false
   ```js
   module.exports = {
     devtool: "source-map",
   };
   ```
3. watch
   - 文件发生变化时，是否重新编译
   - 默认为 false
   ```js
   module.export = {
     watch: true,
   };
   ```
4. watchOptions
   - 通过`watchOptions`配置项去灵活的控制监听模式
   ```js
   module.export = {
     // 只有开启了watch, watchOptions才有意义
     watch: true,
     // 监听模式运行时的参数
     watchOptions: {
       // 不监听的文件或文件夹，支持正则匹配
       ignored: /node_modules/,
       // 监听到变化后等300ms再去执行编译，避免重新编译频率过高
       aggregateTimeout: 300,
       // 每秒轮询1000次去监听变化
       poll: 1000,
     },
   };
   ```
5. Externals
   - 告诉 webpack，运行环境已经内置了哪些全局变量，不必再进行打包
   ```html
   <script src="path/to/jquery.js"></script>
   ```
   ```js
   import $ from "jquery";
   ```
   ```js
   // webpack
   module.export = {
     externals: {
       // 将导入语句的jquery替换成运行环境中的全局变量jQuery
       jquery: "jQuery",
     },
   };
   ```
6. ResolveLoader
   - 加载本地的 loader
   - 根据配置的 loader 包名，去找到 loader 的实际代码，以调用 Loader 去处理源文件
   ```js
   module.exports = {
     resolveLoader: {
       // 去哪个目录下寻找Loader
       modules: ["node_modules"],
       // 入口文件的后缀
       extensions: [".js", ".json"],
       // 指明入口文件位置的字段
       mainFields: ["loader", "main"],
     },
   };
   ```

## 21.多种配置类型

1. 导出一个 Function

   - env
     - 运行 webpack 时的专属环境变量
     - env 是 1 个 Object
     - 例如启动命令是`webpack --env.production --env.bao=foo`, 则 env 的值是`{"production": "true", "bao": "foo"}`
   - argv
     - 启动 webpack 时通过命令行传入的参数
     - 例如--config --env --devtool, 可通过 webpack -h 列出所有的参数

   ```js
   module.exports = function (env = {}, argv) {
       return {
           ...,
           devtool: env['production'] ? undefined : 'source-map'
       }
   }
   ```

2. 导出 1 个 promise 函数
   ```js
   module.exports = function (env = {}, argv) {
       return new Promise((resolve, reject) => {
           ...
       })
   }
   ```
3. 导出多份配置
   - 导出 1 个数组
   - 每份配置都会执行一遍构建
   - 适合需要包含多种模块化格式的代码，例如 CommonJs UMD, 上传到 NPM
   ```js
   module.exports = [
       {
           ...
       },
       function () {
           return {
               ...
           }
       }
   ]
   ```
