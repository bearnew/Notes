## babel学习
1. babel的工作流程
    1. 解析
        * 将代码解析成抽象语法树（AST）,每个JS引擎都有自己的AST解析器
        * 词法分析和语法分析
            * 词法分析将字符串的形式转换成令牌流（AST节点）
            * 语法分析将令牌流转换成AST
        ```js
        {
            "type": "Program",
            "start": 0,
            "end": 52,
            "body": [...]
        }
        ```
    2. 转换
        * babel接受得到AST并通过`babel-traverse`对其进行深度优先遍历，在此过程中对节点进行添加、更新及移除操作
    3. 生成
        * 将AST通过`babel-generator`转换成js代码
2. babel自定义插件
    * 可以使用 [astexplorer.net](https://astexplorer.net/#/KJ8AjD6maa) 创建1个插件
    * 可以使用 [generator-babel-plugin](https://github.com/babel/generator-babel-plugin) 生成1个插件模板
    ```js
    // 一个插件就是一个函数
    // 函数接收一个babel对象
    // 返回一个包含visitor的对象，visitor内的函数接收path
    export default function ({types: t}) {
        return {
            visitor: {
                // path是指AST上的节点
                // state是用户自定义的options
                Identifier(path, state) {
                    let name = path.node.name; // reverse the name: JavaScript -> tpircSavaJ
                    path.node.name = name.split('').reverse().join('');
                }
            }
        };
    }
    ```
3. babel配置
    * 安装`@babel/core`和`@babel/cli`
    ```js
    module.exports = function (api) {
        api.cache(true);

        // presets的执行顺序是从后往前执行的
        const presets = ["pluginA", ["pluginA"], ["pluginA", {}]];
        // plugins的执行顺序是从前往后执行的
        const plugins = [ ... ];

        return {
            presets,
            plugins
        };
    }
    ```
4. `preset`是`babel`插件的组合
    1. Babel 提供了 "loose" 选项，用以在特定的转换情况下在符合规范、文件大小和速度之间做折中。
        ```js
        {
            "presets": [
                ["@babel/preset-env", {
                "loose": true,
                "modules": false
                }]
            ]
        }
        ```
    2. options
        * targets
            * 定义项目需要支持的环境, 使用[browserlist](https://github.com/browserslist/browserslist) 参数
                ```js
                {
                    "targets": "> 0.25%, not dead"
                }
                {
                    "targets": {
                        "chrome": "58",
                        "ie": "11"
                    }
                }
                ```
            * `targets.esmodules`, 指定该属性，browsers属性将被忽略, 只支持支持ES模块的浏览器
                ```js
                {
                    "presets": [
                        [
                            "@babel/preset-env",
                            {
                                "targets": {
                                "esmodules": true
                                }
                            }
                        ]
                    ]
                }
                ```
            * `targets.node`, string|"current"|true
                * 根据当前node版本编译
            * `targets.safari`, "tp"
                * 编译支持safari的开发版本
        * spec
            * 默认false, 编译出更符合规范的代码，但是编译速度会变慢
        * loose
            * 默认false, 是否开启松散转换
        * modules
            * 'amd'|'umd'|'systemjs'|'commonjs'|'cjs'|'auto'|false
            * 默认为auto
            * 设置为false不会对模块进行转换
        * debug
            * 默认为false, 将targets和plugins的相关信息通过console.log输出
        * include
            * 需要包含的插件数组
        * exclude
            * 需要排除的插件数组
        * useBuiltIns
            * 'usage'|'entry'|false
        * forceAllTransforms
            * 默认false, 是否对所有的运行代码进行转换
        * configPath
            * string, 默认process.cwd()
            * 从哪个路径开始查找 browserslist的配置文件
        * ignoreBrowserslistConfig
            * boolean, 默认false
            * 是否使用browsersList的配置文件
        * shippedProposals
            * boolean, 默认false
            * 是否启用对浏览器中提供的内置函数/功能提议进行支持
    3. 自定义`presets`
        ```js
        // presets
        module.exports = function() {
            return {
                plugins: [
                "pluginA",
                "pluginB",
                "pluginC",
                ]
            };
        }
        ```
        ```js
        // 自定义的presets可以包含另外的presets
        module.exports = () => ({
            presets: [
                require("@babel/preset-env"),
            ],
            plugins: [
                [require("@babel/plugin-proposal-class-properties"), { loose: true }],
                require("@babel/plugin-proposal-object-rest-spread"),
            ],
        });
        ```
        ```js
        // 使用
        {
            "presets": ["./myProject/myPreset"]
        }
        // 或者发布到了npm包
        {
            "presets": [
                "myPreset",
                "babel-preset-myPreset" // equivalent
            ]
        }
        ```
5. `@babel/polyfill`
    1. 用于业务项目中，而非库/工具中
    2. 使用`babel-node`时，`polyfill`将被自动加载
    3. `polyfill`会被添加到全局作用域中，以及原生prototype上
    4. 应该用`@babel/preset-env`和`useBuiltIns options`来使用`polyfill`
    5. `useBuiltIns`
        * usage
            * 不需要在`webpack.config.js`的`entry`和源码的文件顶部引入`@babel/polyfill`
        * entry
            * 需要在入口文件的顶部引入`@babel/polyfill`
        * false
            * 需要在`webpack.config.js`的入口文件中引入`@babel/polyfill`
6. `transform-runtime`
    1. `@babel/plugin-transform-runtime`
        1. 通过复用帮助函数来减少包的大小
        2. 创建1个沙盒环境，不会污染全局变量
        ```js
        // 原始js
        var sym = Symbol();
        var promise = Promise.resolve();
        var check = arr.includes("yeah!");
        console.log(arr[Symbol.iterator]());
        ```
        ```js
        // 被transform-runtime编译后的js
        import _getIterator from "@babel/runtime-corejs3/core-js/get-iterator";
        import _includesInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/includes";
        import _Promise from "@babel/runtime-corejs3/core-js-stable/promise";
        import _Symbol from "@babel/runtime-corejs3/core-js-stable/symbol";

        var sym = _Symbol();
        var promise = _Promise.resolve();
        var check = _includesInstanceProperty(arr).call(arr, "yeah!");
        console.log(_getIterator(arr));
        ```
    2. installation
        * transform-runtime只运行在开发环境
            `npm install --save-dev @babel/plugin-transform-runtime`
        * runtime运行在部署环境, 将被编译到代码中
            `npm install --save @babel/runtime`
    3. usage
        * corejs

        |corejs option | install command | size|
        |:-------------|:----------------|:----|
        |false(default)|npm install --save @babel/runtime| 2k|
        |2|npm install --save @babel/runtime-corejs2|14k|
        |3|npm install --save @babel/runtime-corejs3|22k|

        * helpers
            * true(default), 是否使用helpers对方法名进行替换
            ```js
            // 源码
            class Person {}
            ```
            ```js
            "use strict";

            var _classCallCheck2 = require("@babel/runtime/helpers/classCallCheck");
            var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            var Person = function Person() {
                (0, _classCallCheck3.default)(this, Person);
            };
            ```
        * regenerator
            * true(default), 是否使用`regenerator runtime`对generator函数进行转换
            ```js
            function* foo() {}
            ```
            ```js
            var _regenerator = require("@babel/runtime/regenerator");
            var _regenerator2 = _interopRequireDefault(_regenerator);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }

            var _marked = [foo].map(_regenerator2.default.mark);

            function foo() {
                return _regenerator2.default.wrap(
                    function foo$(_context) {
                    while (1) {
                        switch ((_context.prev = _context.next)) {
                        case 0:
                        case "end":
                            return _context.stop();
                        }
                    }
                    },
                    _marked[0],
                    this
                );
            }
            ```
        * useESModules
            * false(default)
            ```js
            // false
            exports.__esModule = true;
            exports.default = function(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            };
            ```
            ```js
            export default function(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
            ```
        * absoluteRuntime
            * 是否开启绝对路径引用Runtime, 允许用户在整个项目中使用runtime
            * 包括npm link的模块，或者用于项目外的模块
        * version
            ```js
            {
                "plugins": [
                    [
                        "@babel/plugin-transform-runtime",
                        {
                            "absoluteRuntime": false,
                            "corejs": 2,
                            "version": "^7.4.4"
                        }
                    ]
                ]
            }
            ``` 
    4. 最佳实践 
        ```js
        {
            "presets": [
                [
                    '@babel/preset-env',
                    {
                        modules: 'commonjs',
                        // targets: 'since 2014',
                        // useBuiltIns: 'usage',
                        // corejs: 3
                    }
                ]
            ],
            "plugins": [
                [
                    "@babel/plugin-transform-runtime",
                    {
                        // 配置corejs-3,不仅实例方法还是全局方法，都不会污染全局环境，还可以动态引入polyfill
                        'corejs': 3, // npm i @babel/runtime-corejs3 --save
                        'helpers': true, // 使用帮助函数
                        'regenerator': true, // 引入regeneratorRuntime, 处理async await
                        'useESModules': false, // 使用 es modules helpers, 减少 commonJS 语法代码
                        'absoluteRuntime': true // 是否跨项目引用 runtime
                    }
                ]
            ]
        }
        ```
7. `register`
    1. `@babel/register`，将自身绑定到node的`require`模块上，并在运行时编译
        ```js
        require('@babel/register');
        ```
    2. node后续通过require进来的.es6, .es, .jsx, .mjs, .js将由babel自动转换

## babel实战
* 对es6+语法以及api的编译只需要用到```@babel/preset-env```
* babel的`preset`只是针对语法，对于函数、方法的babel，需要使用`babel-polyfill`（core-js2.0）或者`core-js@3`
* 用react加上```@babel/preset-react```
    ```js
    {
        "presets": [
            [
                '@babel/preset-env',
                {
                    modules: 'commonjs',
                    targets: 'since 2016',
                    useBuiltIns: 'usage',
                    corejs: 3
                }
            ],
            '@babel/preset-react'
        ]
    }
    ```
* plugin只有```@babel/plugin-transform-runtime```是必须的
    * 需要安装```@babel/runtime```用于生产环境
    * ```transform-runtime```会把辅助函数放到一个单独的模块```babel-runtime```中，减少项目大小
    * ```@babel/polyfill```是会修改原型链，因此会污染全局作用域
    * ```transform-runtime```会生成一个别名，抽取成单独的模块，并通过模块导入的方式引入,避免了对全局作用域的修改
    * 
* 使用```react```,并且需要```css-module```
    ```js
    plugins: [
        [
            'react-css-modules',
            {
            generateScopedName: '[local]-[hash:base64:10]',
            filetypes: {
                '.scss': {
                syntax: 'postcss-scss'
                }
            }
            }
        ]
    ]
    ```
* 使用`babel-plugin-react-css-modules`方便`css`的书写
    ```js
    // css modules
    import styles from './styles.css';
    <div className={ styles.title }>something</div>
    ```
    ```js
    // babel-plugin-react-css-modules
    import './styles.css';
    <div styleName="title">something</div>
    ```
* ```node```环境```babel``` 
  * ```babel-polyfill```
  * ```babel-register```
  * ```babel-node```
* `?cacheDirectory`不支持`babel`中的`react-css-module`的`generateScopedName`使用函数
## 其他
1. `tree shaking`
    1. `tree shaking`的删除工作由`terser-webpack-plugin`或者`uglifyjs-webpack-plugin`来完成
    2. `babel`7编译的`class`会带有`/*#__PURE__*/`，以方便`terser-webpack-plugin`删除class
    ```js
    export class Person {
        constructor(props) {
            this.name = props.name;
        }
        getName() {
            return this.name;
        }
    }
    ``` 
    ```js
    // modules: commonjs
    var Person =
        /*#__PURE__*/
        function () {
        function Person(props) {
            (0, _classCallCheck2["default"])(this, Person);
            this.name = props.name;
        }

        (0, _createClass2["default"])(Person, [{
            key: "getName",
            value: function getName() {
            return this.name;
            }
        }]);
        return Person;
    }();

    exports.Person = Person;
    ```
    ```js
    export var Person =
        /*#__PURE__*/
        function () {
        function Person(props) {
            _classCallCheck(this, Person);

            this.name = props.name;
        }

        _createClass(Person, [{
            key: "getName",
            value: function getName() {
            return this.name;
            }
        }]);

        return Person;
    }();
    ``` 
    3. `package.json`的`sideEffects`属性用于告知`webpack`是否有副作用
    ```js
    // 如果所有代码都不包含 side effect，我们就可以简单地将该属性标记为 false，来告知 webpack，它可以安全地删除未用到的 export。
    {
        "name": "your-project",
        "sideEffects": false
    }
    ```
    4. 常见的存在副作用的行为
        1. 函数调用，`main.js`引入了b文件的方法f，`main.js`没有执行f，但是b文件执行了f
        2. 使用了原型链
        3. 操作window
        4. 立即执行函数引用了外部变量
    5. `tree shaking`用来尽可能的删除没有被使用过的代码和一些被`import`了但其实没有被使用的代码
        * 代码不会被执行
        * 代码执行结果不会被用到
        * 代码只会影响死变量
    6. 存在副作用的代码是不能被删除的，例引入的`@babel/polyfill`
        ```js
        {
            ...,
            "sideEffects": [
                "./src/polyfill.js"
            ],
            ...,
        }
        ```
    7.  
2. `Browserify`和`webpack`一样，打包后使用浏览器加载`Node.js`模块
```js
// 编译后的代码
var _isSupportWebp = _interopRequireDefault(require("../isSupportWebp"));
```