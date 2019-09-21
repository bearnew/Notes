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