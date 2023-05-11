# dynamic import配置
1. `babel`设置`@babel/preset-env`的`modules: false`
2. `babel`给`plugins`添加`@babel/plugin-syntax-dynamic-import`
3. 设置`splitChunks.chunks`为`all`
4. 设置`output.chunkFilename`为分包的`name`
5. 每个具体分包的`chunks`设置为`initial`, 只对首屏的进行分包
6. `chunks`设置为`async`，第一次加载异步`js`前，加载此公共`chunk`，分包的异步`async_common`的命名为`output`中配置的`chunkFilename`