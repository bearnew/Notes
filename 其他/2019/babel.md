## babel
* 对es6+语法以及api的编译只需要用到```@babel/preset-env```
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
* ```node```环境```babel``` 
  * ```babel-polyfill```
  * ```babel-register```
  * ```babel-node```