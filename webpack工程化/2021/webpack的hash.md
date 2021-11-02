# webpack的hash
1. `hash`受所有代码影响，只要有变化，`hash`就变了
    - 2个入口文件`app.js`和`main.js`
    - `app.js`文件改变，`main.js`的`hash`值也会变化
2. `chunkhash`，受到它自身`chunk`内容的影响，以及`chunkId moduleId`的影响
    - `app.css`文件改变，`main.js`的`chunkhash`不变，`app.js`的`chunkhash`改变
3. `contenthash`,受到它自身文件内容的影响，以及`chunkId moduleId`的影响
    - `app.css`文件改变，`app.js`的`chunkhash`不变
4. `module.id` 会默认地基于解析顺序(`resolve order`)进行增量
    - 当解析顺序发生变化，ID 也会随之改变，极其不稳定
    - 使用`NamedModulesPlugin` 插件来固定`moduleId`
5. `Webpack` 内部维护了一个自增的 `id`
    - `entry`新增或者减少入口文件时，也会导致 `contenthash`变化
    - 固定`chunkId`。使用`HashedModuleIdsPlugin`插件
6. 固定`moduleId`和`chunkId`
    ```js
    {
        optimization: {
            chunkIds: 'named',
            moduleIds: 'named',
        }
    }
    ```