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
            },
        ],
        ["babel-plugin-react-css-modules", {
            context: WORKSPACE,
            generateScopedName: "[name]__[local]___[hash:base64:5]",
        }]
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
## 4.自定义编译后的命名
1. 直接命名的缺点
    * 编译后的命名过长
    * 必须确保`babel`和`webpack.config`的`context`一直，来保证`jsx`中的`className`和`css`文件的类名在编译后能够匹配
2. 自定义`className`编译后命名
    ```js
    // babel config
    ["babel-plugin-react-css-modules", {
        generateScopedName: (localName, resourcePath, file) => {
            return generateUniqueCls(resourcePath, localName);
        }
    }]
    ```
    ```js
    module: {
        rules: [
            {
                test: /\.iso\.scss$/,
                enforce: 'pre',
                use: [
                    'isomorphic-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            getLocalIdent: function (context, localIdentName, localName) {
                                return generateUniqueCls(context.resourcePath, localName);
                            }
                        },
                    },
                    {
                        loader: 'sass-loader'
                    },
                ]
            }
        ]
    }
    ```
    ```js
    // generateUniqueCls
    const genericNames = require('generic-names');

    const generate = genericNames('[local]_[hash:base64:2]', {
    context: process.cwd()
    });

    module.exports = {
        generateUniqueCls: function (resourcePath, localName) {
            return generate(localName, resourcePath);
        }
    }
    ```
## 5.接入isomorphic-style-loader