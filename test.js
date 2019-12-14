const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'lib'), // lib放发布npm仓库的最终代码
        libraryTarget: 'commonjs2' // 输出的代码符合CommonJs模块化规范，供其他模块导入使用
    },
    // 注册在运行环境中的全局变量访问，不能被打包进输出代码中，防止出现多次
    externals: /^(react|babel-runtime)/,
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: path.resolve(__dirname, 'node_modules')
            },
            {
                test: /\.css/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader']
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'index.css' // 输出的css文件名称
        })
    ],
    devtool: 'source-map'
}
