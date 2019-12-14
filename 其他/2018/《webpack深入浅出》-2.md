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
11. 