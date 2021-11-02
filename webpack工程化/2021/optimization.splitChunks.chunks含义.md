# optimization.splitChunks.chunks含义
1. `initial`
    - 入口点中直接引入的模块、模块中引入的模块进行拆解并单独打包（注：这里提到的模块均指直接引入的模块））
2. `async`
    - 在`async`场景下，`webpack`会对那些按需引入的模块进行优化。
    ```js
    import('../modules/module.js').then(add => {
        console.log('index', add(1, 2))
    })
    ```
3. `all`
    - `all` 这个场景表示无论是按需引入的模块，还是直接引入的模块，都会被用于优化。