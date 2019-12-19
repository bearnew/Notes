## babel学习
1. babel的工作流程
    1. 解析
        * 将代码解析成抽象语法树（AST）,每个JS引擎都有自己的AST解析器
        * 词法分析和语法分析
            * 词法分析将字符串的形式转换成令牌流（AST节点）
            * 语法分析将令牌流转换成AST
        ```js
        {
            "type": "Program",
            "start": 0,
            "end": 52,
            "body": [...]
        }
        ```
    2. 转换
        * babel接受得到AST并通过`babel-traverse`对其进行深度优先遍历，在此过程中对节点进行添加、更新及移除操作
    3. 生成
        * 将AST通过`babel-generator`转换成js代码
2. babel自定义插件
    * 可以使用 [astexplorer.net](https://astexplorer.net/#/KJ8AjD6maa) 创建1个插件
    * 可以使用 [generator-babel-plugin](https://github.com/babel/generator-babel-plugin) 生成1个插件模板
    ```js
    // 一个插件就是一个函数
    export default function ({types: t}) {
        return {
            visitor: {
                Identifier(path) {
                    let name = path.node.name; // reverse the name: JavaScript -> tpircSavaJ
                    path.node.name = name.split('').reverse().join('');
                }
            }
        };
    }
    ```
3. babel配置
    ```js
    module.exports = function (api) {
        api.cache(true);

        // presets的执行顺序是从后往前执行的
        const presets = ["pluginA", ["pluginA"], ["pluginA", {}]];
        // plugins的执行顺序是从前往后执行的
        const plugins = [ ... ];

        return {
            presets,
            plugins
        };
    }
    ```
4. `preset`是`babel`插件的组合
    1. stage
        * Stage-0, 设想
        * Stage-1, 建议
        * Stage-2, 草案
        * Stage-3, 候选
        * Stage-4, 完成
    2. Babel 提供了 "loose" 选项，用以在特定的转换情况下在符合规范、文件大小和速度之间做折中。
        ```js
        {
            "presets": [
                ["@babel/preset-env", {
                "loose": true,
                "modules": false
                }]
            ]
        }
        ``` 
5. `@babel/polyfill`
    1. 用于业务项目中，而非库/工具中
    2. 使用`babel-node`时，`polyfill`将被自动加载
    3. `polyfill`会被添加到全局作用域中，以及原生prototype上
    4. 应该用`@babel/preset-env`和`useBuiltIns options`来使用`polyfill`
    5. `useBuiltIns`
        * usage
            * 不需要在`webpack.config.js`的`entry`和源码的文件顶部引入`@babel/polyfill`
        * entry
            * 需要在入口文件的顶部引入`@babel/polyfill`
        * false
            * 需要在`webpack.config.js`的入口文件中引入`@babel/polyfill`
    6. 
6. `transform-runtime`
7. `register`

## babel实战
* 对es6+语法以及api的编译只需要用到```@babel/preset-env```
* babel的`preset`只是针对语法，对于函数、方法的babel，需要使用`babel-polyfill`（core-js2.0）或者`core-js@3`
* 用react加上```@babel/preset-react```
    ```js
    {
        "presets": [
            [
                '@babel/preset-env',
                {
                    modules: 'commonjs',
                    targets: 'since 2016',
                    useBuiltIns: 'usage',
                    corejs: 3
                }
            ],
            '@babel/preset-react'
        ]
    }
    ```
* plugin只有```@babel/plugin-transform-runtime```是必须的
    * 需要安装```@babel/runtime```用于生产环境
    * ```transform-runtime```会把辅助函数放到一个单独的模块```babel-runtime```中，减少项目大小
    * ```@babel/polyfill```是会修改原型链，因此会污染全局作用域
    * ```transform-runtime```会生成一个别名，抽取成单独的模块，并通过模块导入的方式引入,避免了对全局作用域的修改
    * 
* 使用```react```,并且需要```css-module```
    ```js
    plugins: [
        [
            'react-css-modules',
            {
            generateScopedName: '[local]-[hash:base64:10]',
            filetypes: {
                '.scss': {
                syntax: 'postcss-scss'
                }
            }
            }
        ]
    ]
    ```
* 使用`babel-plugin-react-css-modules`方便`css`的书写
    ```js
    // css modules
    import styles from './styles.css';
    <div className={ styles.title }>something</div>
    ```
    ```js
    // babel-plugin-react-css-modules
    import './styles.css';
    <div styleName="title">something</div>
    ```
* ```node```环境```babel``` 
  * ```babel-polyfill```
  * ```babel-register```
  * ```babel-node```
* `?cacheDirectory`不支持`babel`中的`react-css-module`的`generateScopedName`使用函数