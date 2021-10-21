# webpack 配置支持 ES6

1. 把 `webpack.config.js` 改名成 `webpack.config.babel.js` 就行
   - 这是一个 `Webpack` 支持，但文档里完全没有提到的特性 （应该马上就会加上）。只要你把配置文件命名成 `webpack.config.[loader].js` ，`Webpack` 就会用相应的 `loader` 去转换一遍配置文件。所以要使用这个方法，你需要安装 `babel-loader` 和 `babel-core` 两个包。
