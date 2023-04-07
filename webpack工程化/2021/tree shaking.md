## `tree shaking`

#### 1. `tree shaking`用来尽可能的删除没有被使用过的代码和一些被`import`了但其实没有被使用的代码

-   代码不会被执行
-   代码执行结果不会被用到
-   代码只会影响死变量

#### 2. `webpack 4`配置了`mode: production`会默认开启`tree shaking`

-   `tree-shaking`是针对静态结构进行分析，`import`和`export`是静态的导入和导出，而`commonjs`有动态导入和导出的功能
-   因此`babel`中需配置`modules: false`关闭默认的模块转换，让`webpack`对模块进行处理

#### 3. `tree shaking`的删除工作由`terser-webpack-plugin`或者`uglifyjs-webpack-plugin`来完成

#### 4. `tree shaking`默认只对函数有效，但`babel`7 编译的`class`会带有`/*#__PURE__*/`，告诉`webpack`此函数无副作用，方便`terser-webpack-plugin`删除 class

#### 5. `mode: production`会默认开启`optimization.usedExports`，对没有使用到的导出成员进行了标记，比如 `/* unused harmony export echoHost */`,以便后续使用 `terser-webpack-plugin` 等插件完成代码优化，删除掉这些未使用的代码片段

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
    (function () {
        function Person(props) {
            (0, _classCallCheck2["default"])(this, Person);
            this.name = props.name;
        }

        (0, _createClass2["default"])(Person, [
            {
                key: "getName",
                value: function getName() {
                    return this.name;
                },
            },
        ]);
        return Person;
    })();

exports.Person = Person;
```

```js
export var Person =
    /*#__PURE__*/
    (function () {
        function Person(props) {
            _classCallCheck(this, Person);

            this.name = props.name;
        }

        _createClass(Person, [
            {
                key: "getName",
                value: function getName() {
                    return this.name;
                },
            },
        ]);

        return Person;
    })();
```

#### 6. `package.json`的`sideEffects`属性用于告知`webpack`是否有副作用

```js
// 如果所有代码都不包含 side effect，我们就可以简单地将该属性标记为 false，来告知 webpack，它可以安全地删除未用到的 export。
{
    "name": "test",
    "sideEffects": false
}
```

```js
// 存在副作用的代码是不能被删除的，例引入的`@babel/polyfill`
// import '@babel/polyfill', 配置了sideEffects，不会删除
{
    ...,
    "sideEffects": [
        "./src/polyfill.js"
    ],
    ...,
}
```

#### 7. 存在副作用的行为，无法进行`tree shaking`

1. 函数调用，`main.js`引入了 b 文件的方法 f，`main.js`没有执行 f，但是 b 文件执行了 f
2. 使用了原型链
3. 操作 window
4. 立即执行函数引用了外部变量
5. 使用`export default { a, b }`，`{a, b}`会被当成一个对象，a 和 b 都会被打包进去，无法支持`tree shaking`
6. 使用`export * from './test'`，支持`tree shaking`

#### 8.import 和 require 的 tree shaking

> require 函数不是静态可分析的，因为它是在程序的执行阶段执行的运行时函数。这意味着不能在编译时确定模块之间的依赖关系，必须在运行时确定

1. `es module`导入，`es module`导出，可以`tree shaking`

    ```js
    // index.ts
    import { a } from "./test.ts";
    a();
    ```

    ```js
    // test.ts
    export const a = () => {
        console.log("aaaaaa");
    };

    export const b = () => {
        console.log("bbbbbb");
    };
    ```

    ```js
    // 编译后代码
    !(function () {
        "use strict";
        console.log("aaaaaa");
    })();
    //# sourceMappingURL=main.9577925b.js.map
    ```

2. `es module`导入，`commonjs`导出，可以`tree shaking`

    ```js
    // index.ts
    import { a } from "./test.ts";
    a();
    ```

    ```js
    // test.ts
    exports.a = () => {
        console.log("aaaaaa");
    };

    exports.b = () => {
        console.log("bbbbbb");
    };
    ```

    ```js
    // 编译后代码
    !(function () {
        var n = {
                719: function (n, o) {
                    o.a = function () {
                        console.log("aaaaaa");
                    };
                },
            },
            o = {};
        function t(r) {
            var a = o[r];
            if (void 0 !== a) return a.exports;
            var e = (o[r] = { exports: {} });
            return n[r](e, e.exports, t), e.exports;
        }
        !(function () {
            "use strict";
            (0, t(719).a)();
        })();
    })();
    //# sourceMappingURL=main.e5baac5a.js.map
    ```

3. `commonjs`导入，`commonsjs`导出，无法`tree shaking`

    ```js
    // index.ts
    const { a } = require("./test.ts");
    a();
    ```

    ```js
    // test.ts
    exports.a = () => {
        console.log("aaaaaa");
    };

    exports.b = () => {
        console.log("bbbbbb");
    };
    ```

    ```js
    !(function () {
        var o = {
                719: function (o, n) {
                    (n.a = function () {
                        console.log("aaaaaa");
                    }),
                        (n.b = function () {
                            console.log("bbbbbb");
                        });
                },
            },
            n = {};
        function a(r) {
            var t = n[r];
            if (void 0 !== t) return t.exports;
            var e = (n[r] = { exports: {} });
            return o[r](e, e.exports, a), e.exports;
        }
        (0, a(719).a)();
    })();
    //# sourceMappingURL=main.229a5f35.js.map
    ```

4. `commonjs`导入，`es module`导出，无法`tree shaking`

    ```js
    // index.ts
    const { a } = require("./test.ts");
    a();
    ```

    ```js
    // test.ts
    export const a = () => {
        console.log("aaaaaa");
    };

    export const b = () => {
        console.log("bbbbbb");
    };
    ```

    ```js
    !(function () {
        var e = {
                719: function (e, o, n) {
                    "use strict";
                    n.r(o),
                        n.d(o, {
                            a: function () {
                                return t;
                            },
                            b: function () {
                                return r;
                            },
                        });
                    var t = function () {
                            console.log("aaaaaa");
                        },
                        r = function () {
                            console.log("bbbbbb");
                        };
                },
            },
            o = {};
        function n(t) {
            var r = o[t];
            if (void 0 !== r) return r.exports;
            var u = (o[t] = { exports: {} });
            return e[t](u, u.exports, n), u.exports;
        }
        (n.d = function (e, o) {
            for (var t in o)
                n.o(o, t) &&
                    !n.o(e, t) &&
                    Object.defineProperty(e, t, { enumerable: !0, get: o[t] });
        }),
            (n.o = function (e, o) {
                return Object.prototype.hasOwnProperty.call(e, o);
            }),
            (n.r = function (e) {
                "undefined" !== typeof Symbol &&
                    Symbol.toStringTag &&
                    Object.defineProperty(e, Symbol.toStringTag, {
                        value: "Module",
                    }),
                    Object.defineProperty(e, "__esModule", { value: !0 });
            }),
            (0, n(719).a)();
    })();
    //# sourceMappingURL=main.ca69ece7.js.map
    ```
