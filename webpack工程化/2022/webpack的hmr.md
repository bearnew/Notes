# webpack hmr

## 1.hmr 原理

-   https://juejin.cn/post/6973825927708934174

1. `devServer`将变更文件编译后的`hash`通过`web socket`发给`client`
2. `client`的`webpack`会`check`是否有更新，有更新发起请求
3. `client`的`webpack`会删除过期的模块和对应的依赖，添加新的模块和依赖
4. 热更新完成

## 2.实践

1. 注释 `new webpack.HotModuleReplacementPlugin()`
2. 使用`@pmmmwh/react-refresh-webpack-plugin`插件
3. `babel-loader`的`plugins`引入`react-refresh/babel`
4. 静态`js css`不要走`proxy`代理
5. 不要使用`react_webpack_runtime`
