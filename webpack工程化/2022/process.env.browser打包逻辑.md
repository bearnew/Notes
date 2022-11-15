1. 定义环境变量
```js
new webpack.DefinePlugin({
    'process.env': {
        BROWSER: JSON.stringify('false')
    }
})
```
2. 会打包进B组件
```js
let Test = require('./A').default;
if (String(process.env.BROWSER)) {
    Test = require('./B').default;
}
```
3. 不会打包进B组件
```js
let Test = require('./A').default;
if (process.env.BROWSER === 'true') {
    Test = require('./B').default;
}
```