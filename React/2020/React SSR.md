# React SSR
## 1.使用babel-register实时编译服务端代码
```js
function realModule(modulePath) {
    if (modulePath.indexOf('node_modules') !== -1) {
        const lastIndex = modulePath.lastIndexOf('node_modules');
        return modulePath.substr(lastIndex);
    } else {
        return modulePath;
    }
}
const config = Object.assign({
    presets: [
        [
            '@babel/env',
            {
                modules: 'commonjs',
                targets: {
                    node: 'current'
                }
            }
        ],
        '@babel/react',
        "@babel/preset-typescript"
    ],
    plugins: [
        [
            '@babel/plugin-transform-runtime',
            {
                helpers: true
            }
        ],
    ]    
}, {
    ignore: [
        function (filepath) {
            const p = realModule(filepath);
            return p.indexOf('node_modules') > -1 && p.indexOf('middleware') < 0;
        }
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    babelrc: false
});

require('@babel/register')(config);
```
## 2.服务端不加载css
```js
// 服务端忽略以下文件的加载
['.scss', '.css', '.png'].forEach(function (extension) {
    require.extensions[extension] = function () {};
});
```
## 3.ssr热更新
```js
// ssr热更新
const webpack = require('webpack');
const webpackConfig = require('./build/webpack-server.config.js');
const compiler = webpack(webpackConfig);
app.use(
    require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
    })
);

// ssr热更新
app.use(require('webpack-hot-middleware')(compiler));
```