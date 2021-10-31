# dynamic import配置
1. `babel`设置`@babel/preset-env`的`modules: false`
2. `babel`给`plugins`添加`@babel/plugin-syntax-dynamic-import`
3. 设置`splitChunks.chunks`为`false`