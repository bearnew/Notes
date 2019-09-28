## webpack性能优化

### webpack打包分析

1. webpack-bundle-analyzer（分析打包组成，资源大小）
```js
// eg.分析打包效果
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
new BundleAnalyzerPlugin(
    {
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8889,
        reportFilename: 'report.html',
        defaultSizes: 'parsed',
        openAnalyzer: true,
        generateStatsFile: false,
        statsFilename: 'stats.json',
        statsOptions: null,
        logLevel: 'info'
    }
)
```
2. speed-measure-webpack-plugin（分析编译耗时）
```js
// eg.
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const smp = new SpeedMeasurePlugin()


module.exports = smp.wrap(YourWebpackConfig);
```

### webpack优化

1. happypack（多线程打包）
```js
// eg.
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

module.exports = {
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                exclude: path.resolve(__dirname, '../src/assets/common.css'),
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader // 生产环境采用此方式解耦CSS文件与js文件
                    },
                    {
                        loader: 'happypack/loader?id=css-module'
                    }
                ]
            }
        ]
    },
    plugins: {
        new HappyPack({
            id: 'css-module',
            threadPool: happyThreadPool,
            loaders: [
                {
                    loader: 'css-loader', // CSS加载器
                    options: {
                        modules: false,
                        sourceMap: true,
                        localIdentName: '[name]__[local]___[hash:base64:5]'
                    }
                },
                {
                    loader: 'postcss-loader'
                },
                {
                    loader: 'sass-loader'
                }
            ]
        }),
    }
}
```
2. dllplugin（提前打包第三方依赖）
```js
// webpack.config.dll.js
const path = require('path')
const webpack = require('webpack')
const pkg = require('../package.json')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

function filterTypes() {
    const tpsReg = /(^@|react-redux)/i
    return Object.keys(pkg.dependencies).filter(item => {
        return !tpsReg.test(item)
    })
}

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        vendor: filterTypes()
    },
    output: {
        path: resolve('dist'),
        filename: '[name].js',
        library: '[name]_dll', // 全局变量名，其他模块会从此变量上获取里面模块
        publicPath: '../static/'
    },
    // manifest是描述文件
    plugins: [
        new webpack.DllPlugin({
            name: '[name]_dll',
            path: resolve('dist/manifest.json'),
            context: path.resolve(__dirname, '../')
        })
    ]
}

// wepack.config.dev.js
module.exports = {
    plugins: [
        new webpack.DllReferencePlugin({
            context: path.resolve(__dirname, '../'),
            manifest: require('../dist/manifest.json')
        }),
    ]
}
```
3. terser-webpack-plugin(多进程压缩js文件)
```js
// webpack.config.json
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [new TerserPlugin(
      parallel: true   // 多线程
    )],
  },
};
```
4. thread-loader
5. splitChunks抽取公共模块
### 其他
> https://juejin.im/post/5b652b036fb9a04fa01d616b
6. cache-loader
    * 大部分`loader`都支持缓存
    * 如果不支持，请使用`cache-loader`
    * 