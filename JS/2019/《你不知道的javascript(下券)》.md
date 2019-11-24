#### 1.深入编程
1. 执行程序
    1. js引擎是动态编译程序，然后立即执行编译后的代码
#### 2.深入javascript
1. 内置类型
    1. `string`
        ```js
        var a = 'hello world';
        typeof a; // "string"
        ```
    2. `number`
        ```js
        a = 42;
        typeof a; // "number"
        ```
    3. `boolean`
        ```js
        a = true;
        typeof a; // "boolean"
        ```
    4. `null`
        ```js
        a = null;
        typeof a; // "object"(js存在已久的bug)
        ```
    5. `undefined`
        ```js
        var a;
        typeof a; // undefined

        b = undefined;
        typeof b; // undefined
        ```
    6. `object`
        ```js
        a = {};
        typeof a; // "object"
        ```
    7. `symbol`
2. js中的假值
    1. 假值列表
        * ''(空字符串)
        * 0, -0, NaN(无效数字)
        * null, undefined
        * false
    2. 任何不在假值列表中的都是真值
3. 字符串中通过字母表规则来比较大小
    ```js
    'bar' < 'foo'; // true
    ```
4. 无效数值都会被转换成NaN, NaN既不大于也不小于任何值
    ```js
    var a = 42;
    var b = "foo";
    a < b; // false
    a > b; // false
    a == b; // false
    ```
5. 变量提升
    ```js
    var a = 2;
    foo(); // 因为foo()而运行
    // 声明是“被提升的”
    function foo() {
        a = 3;
        console.log(a); // 3
        var a; // 声明被提升到foo()的顶端
    }
    console.log(a); // 2
    ```
6. switch语法中的case如果省略了break, 会一直执行到下一个case语句
    ```js
    a = 2;
    switch (a) {
        case 2:
        case 10:
        // 某个很棒的东西
        case 42:
            // 其他东西
            console.log('execute here'); // execute here
            break;
        default:
        // 反馈
    }
    ```
7. 立即声明函数执行
    ```js
    var a = 42;
    (function IIFE(){
        var a = 10;
        console.log( a ); // 10
    })();
    console.log( a ); // 42
    ```
    ```js
    // 立即声明函数也有返回值
    var x = (function IIFE(){
        return 42;
    })();
    x; // 42
    ```
8. 闭包
    1. 记忆内层变量
        ```js
        function makeAdder(x) {
            // 参数x是一个内层变量
            // 内层函数add()使用x，所以它外围有一个“闭包”
            function add(y) {
                return y + x;
            };
            return add;
        }

        var plusOne = makeAdder(1);
        // plusTen获得指向内层add(..)的一个引用
        // 带有闭包的函数在外层makeAdder(..)的x参数上
        var plusTen = makeAdder(10);
        plusOne(3); // 4 <-- 1 + 3
        plusOne(41); // 42 <-- 1 + 41
        plusTen(13); // 23 <-- 10 + 13
        ```
    2. 封装私有变量
    ```js
    function User() {
        var username, password;
        function doLogin(user, pw) {
            username = user;
            password = pw;
            // 执行剩下的登录工作
        }
        var publicAPI = {
            login: doLogin
        };
        return publicAPI;
    }
    // 创建一个User模块实例
    var fred = User();
    fred.login("fred", "12Battery34!");
    ```
9. this
    ```js
    function foo() {
        console.log(this.bar);
    }
    var bar = "global";
    var obj1 = {
        bar: "obj1",
        foo: foo
    };
    var obj2 = {
        bar: "obj2"
    };
    // --------
    foo(); // “全局的”
    obj1.foo(); // "obj1"
    foo.call(obj2); // "obj2"
    new foo(); // undefined, 将this设置为一个全新的空对象
    ```
10. 原型
    ```js
    var foo = {
        a: 42
    };
    // 创建bar并将其链接到foo
    var bar = Object.create( foo );
    bar.b = "hello world";
    bar.b; // "hello world"
    bar.a; // 42 <-- 委托给foo
    ```
11. polyfill
    ```js
    // 兼容旧的js执行环境
    if (!Number.isNaN) {
        Number.isNaN = function isNaN(x) {
            return x !== x;
        };
    }
    ```
12. transpiling
    * Babel
    * Traceur
    ```js
    function foo(a = 2) {
        console.log( a );
    }

    function foo() {
        var a = arguments[0] !== (void 0) ? arguments[0] : 2;
        console.log( a );
    }
    ```
13. 非javascript
    * document被称为宿主对象
    * alert和console是由浏览器提供的
#### 3.ES6+
1. 使用shim兼容旧版浏览器
    ```js
    if (!Object.is) {
        Object.is = function (v1, v2) {
            // 检查-0
            if (v1 === 0 && v2 === 0) {
                return 1 / v1 === 1 / v2;
            }
            // 检查NaN
            if (v1 !== v1) {
                return v2 !== v2;
            }
            // 其余所有情况
            return v1 === v2;
        };
    }
   ```
#### 4.ES6+语法
1. let
    ```js
    console.log( a ); // undefined
    console.log( b ); // ReferenceError!
    var a;
    let b; 
    ```
2. const
    * const声明必须要有显示的初始化
    ```js
    const a = undefined;
    ```
3. spread/rest
    ```js
    function foo(x,y,z) {
        console.log( x, y, z );
    }

    foo( ...[1,2,3] ); // 1 2 3
    foo.apply( null, [1,2,3] ); // 1 2 3
    ```
    ```js
    a = [2, 3, 4]
    console.log([1, ...a, 5]); // [1, 2, 3, 4, 5]
    console.log([1].concat(a, [5])) // [1, 2, 3, 4, 5]
    console.log([1, ...a, 5] === [1].concat(a, [5])) // false
    ```
    ```js
    function foo(...args) {
        console.log( args );
    }
    foo( 1, 2, 3, 4, 5); // [1,2,3,4,5]
    ```
4. 默认参数值
    ```js
    function foo(x = 11, y = 31) {
        console.log( x + y );
    }
    foo(); // 42
    foo( 5, 6 ); // 11
    foo( 0, 42 ); // 42
    foo( 5 ); // 36
    foo( 5, undefined ); // 36 <-- 丢了undefined
    foo( 5, null ); // 5 <-- null被强制转换为0
    foo( undefined, 6 ); // 17 <-- 丢了undefined
    foo( null, 6 ); // 6 <-- null被强制转换为0
    ```
    * 默认表达式是惰性求值的，在需要的时候才运行(在参数省略或者为undefined的时候才运行)
    ```js
    function bar(val) {
        console.log( "bar called!" );
        return y + val;
    }
    function foo(x = y + 3, z = bar( x )) {
        console.log( x, z );
    }
    var y = 5;
    foo(); // "bar called"
    // 8 13
    foo( 10 ); // "bar called"
    // 10 15
    y = 6;
    foo( undefined, 10 ); // 9 10
    ```
    ```js
    var w = 1;
    var z = 2;
    // z+1, z是一个还没有初始化的参数变量，所以永远不会试图从外层作用域寻找z
    function foo( x = w + 1, y = z + 1, z = z + 1 ) {
        console.log( x, y, z );
    }
    foo(); // ReferenceError

    function bar(x = 1, y = w + 1, z = w + 1 ) {
        console.log( x, y, z );
    }
    foo(); // 1 2 2
    ```
5. 解构
    1. 对象赋值模式
        ```js
        var aa = 10, bb = 20;
        var o = { x: aa, y: bb };
        var { x: AA, y: BB } = o;
        console.log(AA, BB); // 10 20
        ```
    2. 不只是声明
        ```js
        var o1 = { a: 1, b: 2, c: 3 },
        a2 = [];
        ( { a: a2[0], b: a2[1], c: a2[2] } = o1 );
        console.log( a2 ); // [1,2,3]
        ```
        ```js
        var a1 = [ 1, 2, 3 ],
        o2 = {};
        [ o2.a, o2.b, o2.c ] = a1;
        console.log( o2.a, o2.b, o2.c ); // 1 2 3
        ```
    3. 解构允许重复赋值
        ```js
        var { a: X, a: Y } = { a: 1 };
        X; // 1
        Y; // 1
        ```
        ```js
        var { a: { x: X, x: Y }, a } = { a: { x: 1 } };
        X; // 1
        Y; // 1
        a; // { x: 1 } 
        ```
    4. 允许丢弃一部分值
        ```js
        var a = [2, 3, 4];
        var [, b, ...c] = a;
        console.log(b); // 3
        console.log(c); // [4]
        ```
    5. 嵌套解构
        ```js
        var App = {
            model: {
                User: function(){ .. }
            }
        };
        // 不用：
        // var User = App.model.User;
        var { model: { User } } = App;
        ```
    6. 解构参数
        ```js
        function foo( { x, y } ) {
            console.log( x, y );
        }
        foo( { y: 1, x: 2 } ); // 2 1
        foo( { y: 42 } ); // undefined 42
        foo( {} ); // undefined undefined
        ```
    7. 解构默认值
        ```js
        function f6({ x = 10 } = {}, { y } = { y: 10 }) {
            console.log( x, y );
        }
        f6(); // 10 10
        f6( undefined, undefined ); // 10 10
        f6( {}, undefined ); // 10 10
        f6( {}, {} ); // 10 undefined
        f6( undefined, {} ); // 10 undefined
        f6( { x: 2 }, { y: 3 } ); // 2 3
        ```
6. 对象字面量扩展
    * 简洁属性
        ```js
        var x = 2, y = 3,
        o = {
            x,
            y
        };
        ```
    * getter, setter
        ```js
        var o = {
            __id: 10,
            get id() { return this.__id++; },
            set id(v) { this.__id = v; }
        }
        o.id; // 10
        o.id; // 11
        o.id = 20;
        o.id; // 20
        // and:
        o.__id; // 21
        o.__id; // 21--保持不变!
        ```
    * prototype
        ```js
        var o1 = {
            // ..
        };

        // 将o2的[[prototype]]连接到o1
        var o2 = {
            __proto__: o1,
            // ..
        };

        // 或者
        var o2 = {
            // ..
        };
        Object.setPrototypeOf( o2, o1 );
        ``` 
    * super
        ```js
        var o1 = {
            foo() {
                console.log("o1:foo");
            }
        };
        var o2 = {
            foo() {
                super.foo();
                console.log("o2:foo");
            }
        };
        Object.setPrototypeOf(o2, o1);
        o2.foo(); // o1:foo // o2:foo
        ``` 
7. 模板字面量
    1. 标签字符串字面量
        ```js
        function foo(strings, ...values) {
            console.log(strings);
            console.log(values);
        }

        var desc = "awesome";
        // ["Everything is ", "!", raw: Array(2)]
        // ["awesome"]
        foo`Everything is ${desc}!`;
        ```
    2. 原始（raw）字符串
        ```js
        function showraw(strings, ...values) {
            console.log( strings );
            console.log( strings.raw );
        }
        showraw`Hello\nWorld`;
        // [ "Hello
        // World" ]
        // [ "Hello\nWorld" ]
        ```
8. 箭头函数
    1. 箭头函数的主要设计目的是以特定的方式改变this的行为特性
        ```js
        var controller = {
            makeRequest: function(..){
                btn.addEventListener( "click", () => {
                    // ..
                    this.makeRequest(..);
                }, false );
            }
        };
        ```
    2. this指向箭头函数的外层
        ```js
        var controller = {
            makeRequest: () => {
                // ..
                this.helper();
            },
            helper: () => {
                // ..
            }
        };
        controller.makeRequest(); //  Uncaught TypeError: this.helper is not a function
        ```
9. for...of循环
    1. for...of循环的值必须是一个iterable
        ```js
        var a = ["a", "b", "c", "d", "e"];
        for (var idx in a) {
            console.log(idx);
        }
        // 0 1 2 3 4
        for (var val of a) {
            console.log(val);
        }
        // "a" "b" "c" "d" "e"
        ```
        ```js
        var a = ["a", "b", "c", "d", "e"];
        for (var val, ret, it = a[Symbol.iterator]();
            (ret = it.next()) && !ret.done;
        ) {
            val = ret.value;
            console.log(val);
        }
        // "a" "b" "c" "d" "e"
        ```
        ```js
        for ({x: o.a} of [ {x: 1}, {x: 2}, {x: 3} ]) {
            console.log( o.a );
        }
        // 1 2 3
        ```
10. 正则表达式
