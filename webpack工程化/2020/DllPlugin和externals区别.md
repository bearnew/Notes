# DllPlugin和externals区别
1. `DllPlugin`
    * 符合模块化规范
    * 需要配置相应的`plugin config`
    * 外部依赖发生变更，dll需要重新构建
    * `dll`比`externals`更智能
2. `externals`
    * 不符合模块化规范，在全局环境下可访问
    * 需要将外部库打包成所需要的格式，并在运行态使用
    ```js
    // dll不会打包createClass
    // externals会打包createClass
    import AA from 'react/lib/createClass'
    ``` 