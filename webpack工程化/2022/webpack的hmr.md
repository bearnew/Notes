# webpack hmr

## 1.hmr 原理

-   https://juejin.cn/post/6973825927708934174

## 2.实践

1. 注释 `new webpack.HotModuleReplacementPlugin()`
2. 使用`@pmmmwh/react-refresh-webpack-plugin`插件
3. `babel-loader`的`plugins`引入`react-refresh/babel`
4. 静态`js css`不要走`proxy`代理
5. 不要使用`react_webpack_runtime`
