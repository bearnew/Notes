#### 1，使用save会在package.json中自动添加。
```
npm install node-sass --save-dev
npm install sass-loader --save-dev
```
#### 2，在webpack.config文件中添加配置
```
{
    test: /\.scss$/,
    loaders: ["style", "css", "sass"]
},
```