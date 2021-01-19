# webpack热替换实践
## 1.开启热替换（3种方案，配置一种即可）
1. 在`package.json`命令执行中配置
```js
webpack-dev-server --config build/webpack.dev.config.js --hot
```
2. 在`devServer`中设置`hot`为`true`
```js
const webpackConfig = {
    devServer: {
        // contentBase: path.join(__dirname, 'dist'),
        // compress: true,
        host: '0.0.0.0',
        port: 9000,
        hot: true,
        // https: true
    },
}
```
3. 在`plugins`中使用`HotModuleReplacementPlugin`热替换插件
```js
const webpackConfig = {
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}

```
## 2.配置`react-hot-loader`（实践下来非必需）
1. 在`babel`中配置`react-hot-loader`
```js
// .babelrc
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "loose": true,
        "modules": false,
        "corejs": 3
      }
    ],
    "@babel/preset-react"
  ],
  "plugins": [
    "react-hot-loader/babel",
  ]
}
```
2. 在`webpack`中配置`react-hot-loader`
```js
const webpackConfig = {
    context: path.resolve(__dirname, '../'),
    entry: [
        'react-hot-loader/patch',
        './src/main',
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.scss'],
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
}
```
## 3.使用`react-hot-loader`
```js
import { hot } from 'react-hot-loader';

class App extends Component {}

export default hot(module)(App);
```