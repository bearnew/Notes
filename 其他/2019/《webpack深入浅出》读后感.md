## 1.模块化
1. CommonJs
    * 通过`require`同步加载依赖的模块
    * 通过`module.exports`导出需要暴漏的接口
    * Nodejs采用的commonJs方式
    * Npm发布的第三方模块都采用CommonJs规范
    * CommonJs无法直接运行在浏览器环境，必须通过工具转换成标准的ES5
    * CommonJs1: `exports.xx = XX`;
    * CommonJs2: `module.exports = XX`;
    * eg
        ```js
        // 导入
        const moduleA = require('./moduleA');
        // 导出
        module.exports = moduleA.someFunc;
        ``` 
2. AMD
    * 采用异步的方式加载依赖的模块
    * 主要针对浏览器环境的模块化问题
    * 可以不转码，直接运行在浏览器环境和nodeJs环境
    * 可异步加载多个依赖
    * 需要依赖AMD库，例如: `requirejs`
    * eg
        ```js
        // 定义一个模块
        define('module', ['dep'], function(dep) {
            return exports;
        })
        // 导入和使用
        require(['module'], function(module) {

        })
        ``` 
3. ES6模块化
    * 国际标准化组织提出的javascript模块化规范
    * 将逐渐取代CommonJs和AMD规范，成为浏览器和nodejs的通用模块化方案
    * 目前仍然需要转成ES5才能运行在大部分的JS运行环境
4. scss模块化
    * eg
        ```scss
        // util.scss
        @mixin absolute {
            position: absolute;
        }
        // main.scss
        @import 'util';
        #box {
            @include absolute;
        }
        ``` 
## 2.打包工具的需求
1. 代码转换：将源代码转成可执行的javascrip, css, html
2. 文件优化：压缩javacript, css, html代码，压缩合并图片
3. 代码分割：提取多个页面共用的公共代码，提取首屏无需加载的代码进行异步加载
4. 模块合并：将依赖的多个模块和文件合并成1个文件
5. 自动刷新：监听本地源代码的变化，自动重新构建，刷新浏览器
6. 代码校验：校验代码是否符合规范，以及单元测试是否通过
7. 自动发布：更新代码后，自动构建代码并传输给发布系统
## 3.NPM script
* 使用`scripts`字段定义任务
* 底层实现原理是通过`shell`去运行脚本命令
## 4.其他构建工具
* Grunt
  * 灵活，只负责执行我们定义的任务
  * 大量的可复用插件封装好了常见的构建任务
* Gulp
  * 引入了流的概念，通过插件去处理流，流可以在插件之间传递
  * 可以管理和执行任务
  * 还可以监听和读写文件
* Fis3
  * 内置大量的构建功能, 开箱即用
  * 官方不再维护
## 5.webpack概念
1. 一个打包模块化的javascript工具
2. 通过Loader转换文件
3. 通过plugin注入钩子
## 6.Rollup
1. 能对ES6的源码进行`tree shaking`(webpack 现在已经支持该功能)
2. 打包出来的代码没有webpack那段模块的加载、执行和缓存的代码, 因此打包出来的体积更小
## 7.loader
```js
module: {
    rules: [
        {
            // 用正则表达式去匹配用该Loader转换的css文件
            test: /\.css$/,
            use: ['style-loader', 'css-loader?minimize']
        }
    ]
}
```
1. webpack不支持非javascript文件，如要解析css, 则需要使用webpack的loader机制
2. loader是文件转换功能的翻译员
3. loader通常写在`module.rules`数组中
4. loader的执行顺序是从后往前的
5. loader通过url querystring的方式传入参数，例如`css-loader?minimize`告诉css-loader开启css压缩
6. loader也可以通过在`options`中通过Object实现
    ```js
    use: [
        'style-loader',
        {
            loader: 'css-loader',
            options: {
                minimize: true
            }
        }
    ]
    ```
7. 还可以在源码中指定用什么loader去处理文件
    ```js
    require ('style-loader! css-loader?minimize! ./main.css');
    ```

## 8.style-loader
1. 将css用javascript里面的字符串存储起来
2. 通过dom操作，动态的向HTML head标签里插入HTML style标签
## 9.plugin
1. 在构建流程中注入钩子实现，扩展`webpack`功能，为`webpack`带来很大的灵活性 
2. 使用`ExtractTextPlugin`提取javascript中的`css`到1个单独的文件
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
3. 将提取出来的css文件引入index.html中
## 10.Devserver
1. 提供http服务
2. 监听文件的变化，并自动刷新网页，做到实时预览
    * `DevServer`和`Webpack`之间通过`WebSocket`通信
    * 通过向网页注入的代理客户端控制网页的刷新
    * 只会监听`entry`入口依赖的文件
3. 支持sourcemap, 方便调试
   * Source map就是一个信息文件，里面储存着位置信息。也就是说，转换后的代码的每一个位置，所对应的转换前的位置。 
4. 模块热替换
    * 启动`devServer`时带上`--hot`参数
    * 模块热替换不需要重载整个网页，能提供更快的响应和更好的开发体验
## 11.核心概念
* Entry: 入口，输入
* Module: 模块，一个模块对应一个文件，webpack会从配置的entry开始递归找出所有依赖的模块
* Chunk: 打包过程中被操作的代码块，一个chunk由多个模块组合而成，用于代码合并与分割（输入的入口文件和输出的出口文件都是chunk）
* Bundle: 已经加载和编译的最终源文件版本
* Loader: 模块转换器，用于将模块的原内容按照需求转换成新的内容
* Plugin: 扩展插件
* Output: 输出结果 
## 12.webpack配置
* Entry: 配置模块的入口
* Output: 配置如何输出最终想要的代码
* Module: 配置处理模块的规则
* Resolve: 配置寻找模块的规则
* Plugins: 配置扩展插件
* Devserver: 配置Devserver
* 其他配置项
## 13.Context
* webpack寻找文件路径时，会以`context`作为根目录
* `context`默认为启动执行webpack时所在的工作目录
* `context`必须是1个绝对路径的字符串
* `Entry`的路径和依赖的模块路径可能采用相对`context`的路径来描述
* eg.
    ```js
        module.exports = {
            context: path.resolve(__dirname, 'app');
        }
    ```
## 14.Entry
1. Entry配置
   * `entry`的3种配置方法
       | type   | example                                                        | description                        |
       | :----- | :------------------------------------------------------------- | :--------------------------------- |
       | string | './app/entry'                                                  | 文件路径，相对路径                 |
       | string | ['./app/entryl', './app/entry2']                               | 文件路径，相对路径                 |
       | object | { a: './app/entry1', b: ['./app/entry-b1', './app/entry-b2'] } | 配置多个入口，每个入口生成1个chunk |
   * 如果是array类型，搭配output.library配置使用，只有数组的最后一个入口文件的模块被导出
 
2 .Chunk
   * 如果`entry`是1个`string`或者`array`, 则只会生成1个chunk, chunk的名称是main
   * 如果`entry`是1个`object`，则可能会出现多个`chunk`,`chunk`的名称是object中key的值
 
3.配置动态Entry
   * entry不仅能配置成静态，也能配置成动态
   * 同步函数
       ```js
       entry: () => {
           return {
               a: './page/a',
               b: './page/b'
           }
       }
       ```
   * 异步函数  
       ```js
       entry: () => {
           return new Promise((resolve) => {
               resolve({
                   a: './page/a',
                   b: './page/b'
               })
           })
       }
       ```
## 15.Output
1. filename
    * output.filename配置输出文件的名称，为`string`类型
    * 输出1个文件，可直接配置成静态
        ```js
        filename: 'bundle.js'
        ``` 
    * 输出多个文件，需配置成动态
        ```js
        filename: '[name].js'
        ``` 
    * 配置`filename`可使用字符串模板函数，除了内置变量name,还包括id, hash, chunkhash
        | variable  | decription               |
        | :-------- | :----------------------- |
        | id        | chunk的唯一标识，从0开始 |
        | name      | chunk的名称              |
        | hash      | chunk的唯一标识的hash值  |
        | chunkhash | chunk内容的hash值        |
    * hash和contenthash的长度的是可指定的，[hash:8]代表8位hash值，默认是20位
    * ExtractTextWebpackPlugin插件使用`contenthash`而不是`chunkhash`, 因为ExtractTextWebpackPlugin提取出来的是代码内容本身，而不是一组模块组成的chunk
2.  chunkFilename
    * `chunkFilename`和`filename`非常相似
    * `chunkFilename`只用于指定在运行过程中生成的chunk在输出时的文件名称
    * 运行时生成chunk的常见场景：使用`CommonChunkPlugin`, 使用`import('path/to/module')`动态加载
3.  path
    * output.path配置输出文件存放的本地目录
    * 必须时string类型的绝对路径
    * eg.
        ```js
            path: path.resolve(__dirname, 'dist_[hash]')
        ``` 
4.  publicPath
    * output.publicPath配置发布到线上资源的url前缀，为string类型
    * 默认值为'', 即使用相对路径
    * `output.path`和`output.publicPath`都支持字符串模板，内置变量只有1个, 即hash
    * eg.
        ```js
            module = {
                output: {
                    filename: '[name]_[chunkhash:8].js'
                    publicPath: 'https://cdn.example.com/assets/'
                }
            }
        ``` 
        ```html
            <script src='https://cdn.example.com/assets/a_12345678.js'></script>
        ```
5.  crossOriginLoading
    * webpack异步加载代码块时通过`jsonp`实现的（动态的向html插入1个<script url="src"></script>标签加载异步资源）
    * output.crossOriginLoading用于异步插入标签的`crossorigin`的值
    * anonymous(默认)：加载此脚本时，不会带上用户的Cookies
    * use-credentials, 加载此脚本时，会带上用户的Cookies
6.  libraryTarget和library
    * 用webpack构建可以被其他模块导入使用的库时，需要用到libraryTarget和library
7.  libraryTarget
    1. var(默认)
        ```js
        // 配置`output.library = 'LibraryName'`;
        // webpack输出代码
        var LibraryName = lib_code;
        // 使用库的方法
        LibraryName.doSomething();
        // 如果配置output.library = '',则直接输出
        lib_code // 导出库的代码内容，有返回值的自执行函数
        ``` 
    2. commonjs
        ```js
        // 配置`output.library = 'LibraryName'`
        // webpakc输出代码
        exports['LibraryName'] = lib_code;
        // 使用库的方法
        // Library-name-in-npm指模块被发布到Npm代码仓库的名称
        require('Library-name-in-npm')['LibraryName'].doSomething();
        ```
    3. commonjs2
        ```js
        // libraryTarget为commonjs2时，output.library将无意义
        // webpack输出代码
        module.exports = lib_code;
        // 使用库的方法
        require('library-name-in-npm').doSomething();
        ```
    4. this
        ```js
        // 编写的库通过this被赋值给通过library指定的名称
        // webpack输出代码
        this['LibraryName'] = lib_code;
        // 使用库的方法
        this.libraryName.doSomething();
        ```
    5. window
        ```js
        // 编写的库将通过window赋值给通过library指定的名称
        // webpack输出代码
        window['LibraryName'] = lib_code;
        // 使用库方法
        window.LibraryName.doSomething();
        ```
    6. global
        ```js
        // 编写的库将通过window赋值给通过library指定的名称
        // webpack输出代码
        global['libraryName'] = lib_code;
        // 使用库的方法
        global.LibraryName.doSomething();
        ``` 
8.  libraryExport
    * 配置哪些子模块被导出
    * 只有在output.libraryTarget被设置成commonjs或者commonjs2时才有意义
    * eg.
        ```js
        // 需要导出的模块源码
        export const a = 1;
        export default b = 2;
        // webpack配置
        output.libraryExport = a;
        // webpack输出代码
        module.exports = lib_code['a'];
        // 使用库的方法
        require('library-name-in-npm') === 1;
        ``` 
## 16.Module
1. 配置loader
    * rules配置模块的读取和解析规则，通常用来配置loader
    * 其类型是1个数组，数组里面的每1项都描述如何处理部分文件
    * 条件匹配：通过test, include, exclude来匹配loader要应用的规则文件
    * 应用规则：通过use配置来应用loader
    * 重置顺序：1个loader的执行顺序为从右到左，通过enforce选项可将loader的执行顺序放到最前或最后
    * eg.
        ```js
        module: {
            rules: [
                {
                    // 命中javascript文件
                    test: /\.js$/,
                    // ?cacheDirectory表示传给babel-loader的参数，用于缓存babel的编译结果，加快编译速度
                    use: ['babel-loader?cacheDirectory'],
                    // 只命中scr目录，加快搜索速度
                    include: path.resolve(__dirname, 'src')
                },
                {
                    test: /\.scss$/,
                    // 由后往前的顺序执行
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                    exclude: /node_modules/
                },
                {
                    // 对非文本文件采用file-loader加载
                    test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
                    use: ['file-loader']
                }
            ]
        }
        ``` 
    * 可通过object向loader传参
        ```js
        use: [
            {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                },
                // pre-loader的执行顺序放在最前面，post-loader的执行顺序放在最后面
                enforce: 'post'
            }
        ]
        ```
    * 通过数组传参
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
2. 