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
