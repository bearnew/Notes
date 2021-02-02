## `tree shaking`
#### 1. `tree shaking`用来尽可能的删除没有被使用过的代码和一些被`import`了但其实没有被使用的代码
* 代码不会被执行
* 代码执行结果不会被用到
* 代码只会影响死变量
#### 2. `webpack 4`配置了`mode: production`会默认开启`tree shaking` 
* `tree-shaking`是针对静态结构进行分析，`import`和`export`是静态的导入和导出，而`commonjs`有动态导入和导出的功能
* 因此`babel`中需配置`modules: false`关闭默认的模块转换，让`webpack`对模块进行处理
#### 3. `tree shaking`的删除工作由`terser-webpack-plugin`或者`uglifyjs-webpack-plugin`来完成
#### 4. `tree shaking`默认只对函数有效，但`babel`7编译的`class`会带有`/*#__PURE__*/`，方便`terser-webpack-plugin`删除class
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
#### 5. `package.json`的`sideEffects`属性用于告知`webpack`是否有副作用
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
#### 6. 存在副作用的行为，无法进行`tree shaking`
1. 函数调用，`main.js`引入了b文件的方法f，`main.js`没有执行f，但是b文件执行了f
2. 使用了原型链
3. 操作window
4. 立即执行函数引用了外部变量
5. 使用`export default { a, b }`，`{a, b}`会被当成一个对象，a和b都会被打包进去，无法支持`tree shaking`
6. 使用`export * from './test'`，支持`tree shaking`