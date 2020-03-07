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
#### 3.ES6
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
#### 4.ES6语法
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
    bar(); // 1 2 2
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
    1. ES6正则新增y（定点模式）
        ```js
        var re2 = /foo/y; // <-- 注意定点标识y
        var str = "++foo++";

        re2.lastIndex; // 0
        re2.test( str ); // false--0处没有找到"foo"
        re2.lastIndex; // 0

        re2.lastIndex = 2;
        re2.test( str ); // true
        re2.lastIndex; // 5--更新到前次匹配之后位置
        re2.test( str ); // false
        re2.lastIndex; // 0--前次匹配失败后重置
        ```
    2. 正则表达式flags
        ```js
        var re = /foo/ig;
        re.flags; // "gi"
        ```
11. 迭代器
    1. 迭代器
    ```js
    var greeting = "hello world";
    var it = greeting[Symbol.iterator]();
    it.next(); // { value: "h", done: false }
    it.next(); // { value: "e", done: false }
    ..
    ```
    ```js
    var m = new Map();
    m.set("foo", 42);
    m.set({ cool: true }, "hello world");
    var it1 = m[Symbol.iterator]();
    var it2 = m.entries();
    console.log(it1.next()); // { value: [ "foo", 42 ], done: false }
    console.log(it2.next()); // { value: [ "foo", 42 ], done: false } 
    console.log(it2.next()); // { value: [ {cool: true}, "hello world" ], done: false } 
    console.log(it2.next()); // {value: undefined, done: true}
    console.log(it2.next()); // {value: undefined, done: true}
    ```
    2. 迭代器不应该在调用 return(..) 或者 thrown(..) 之后再产生任何值。
12. 生成器
    1. 提前完成
    ```js
    function *foo() {
        yield 1;
        yield 2;
        yield 3;
    }
    var it = foo();
    it.next(); // { value: 1, done: false }
    it.return( 42 ); // { value: 42, done: true }
    it.next(); // { value: undefined, done: true }
    ```
    2. 错误处理
    ```js
    function* foo() {
        try {
            yield 1;
        }
        catch (err) {
            console.log(err);
        }
        yield 2;
        throw "Hello!";
    }
    var it = foo();
    console.log(it.next()); // { value: 1, done: false }
    try {
        it.throw("Hi!"); // Hi!
        console.log("never gets here"); // 不会打印
    } catch (err) {
        console.log(err); // Hello!
    }
    ```
13. 模块
    1. 旧模块方法
        ```js
        var me = (function Hello(name){
            function greeting() {
                console.log( "Hello " + name + "!" ); 
            }
            // public API
            return {
                greeting: greeting
            };
        })( "Kyle" );
        me.greeting(); // Hello Kyle!
        ```
    2. 命名导出
        ```js
        export function foo() {
        // ..
        }
        export var awesome = 42;
        var bar = [1,2,3];
        export { bar };
        ```
        ```js
        function foo() {
        // ..
        }
        var awesome = 42;
        var bar = [1,2,3];
        export { foo, awesome, bar };
        ```
        ```js
        function foo() { .. }
        export { foo as bar };
        ```
        ```js
        var awesome = 42;
        export { awesome };
        // 之后
        awesome = 100;

        // 导入awesome是100，而不是42
        ```
    3. 默认导出
        ```js
        export default function foo(..) {
        // ..
        }
        ```
        ```js
        function foo(..) {
        // ..
        }
        export { foo as default };
        ```
        ```js
        var foo = 42;
        export { foo as default };
        export var bar = "hello world";
        foo = 10;
        bar = "cool";

        // 导入的foo是10， 导入的bar是'cool'
        ```
    4. 导入
        ```js
        import { foo as theFooFunc } from "foo";
        theFooFunc();
        ```
        ```js
        import { default as foo } from "foo";
        ```
    5. 命名空间导入
        ```js
        import * as foo from "foo";
        foo.bar();
        foo.x; // 42
        foo.baz();
        ```
    6. import的声明是提升的
        ```js
        // 在编译过程中确定了foo值是什么
        foo();
        import { foo } from "foo";
        ``` 
14. 模块依赖环
    1. 相互导入，虚拟组合了两个独立
    2. import语义静态加载，可以确保通过 import 相互依赖的 "foo" 和 "bar" 在其中任何一个运行之前，二者都会被加载、解析和编译。
    ```js
    import bar from "B";
    export default function foo(x) {
        if (x > 10) return bar( x - 1 );
        return x * 2;
    }
    ```
    ```js
    import foo from "A";
    export default function bar(y) {
        if (y > 5) return foo( y / 2 );
        return y * 3;
    }
    ```
    ```js
    import foo from "foo";
    import bar from "bar";
    foo( 25 ); // 11
    bar( 25 ); // 11.5
    ```

15. 模块加载器
    ```js
    // 可以加载不符合ES6规范的模块格式，然后转换成ES6的模块
    // 返回1个promise
    // 可以通过promise.all组合多个Reflect.Loader.import
    Reflect.Loader.import( "foo", { address: "/path/to/foo.js" } )
    .then( function(foo){
    // ..
    })
    ```
16. 类class
    1. constructor(..) 指定 Foo(..) 函数的签名以及函数体内容。
    2. function Foo 是“提升的”, class Foo 并不是
    3. class 只是创建了一个同名的构造器函数
    ```js
    class Foo {
        constructor(a,b) {
            this.x = a;
            this.y = b;
        }
        gimmeXY() {
            return this.x * this.y;
        }
    }
    ```
17. extends和super
    1. `super`指向父对象，这里指向`Foo`
    ```js
    class Bar extends Foo {
        constructor(a,b,c) {
            super( a, b ); // 将a, b传给Foo的constructor中
            this.z = c; 
        }
        gimmeXYZ() {
            return super.gimmeXY() * this.z;
        }
    }
    var b = new Bar( 5, 15, 25 );
    b.x; // 5
    b.y; // 15
    b.z; // 25
    b.gimmeXYZ(); // 1875
    ```
    ```js
    // es6前的继承方式
    function Foo() {
        this.a = 1;
    }
    function Bar() {
        this.b = 2;
        Foo.call( this );
    }
    // `Bar` "extends" `Foo`
    Bar.prototype = Object.create( Foo.prototype );
    ```
    2. 不允许在super之前调用this
    ```js
    class Bar extends Foo {
        constructor() {
            this.b = 2; // 不允许在super()之前
            super(); // 要改正的话可以交换这两条语句
        }
    }
    ```
    3. 使用`extends`扩展原生类的方法
    ```js
    class MyCoolArray extends Array {
        first() { return this[0]; }
        last() { return this[this.length - 1]; }
    }
    var a = new MyCoolArray( 1, 2, 3 );
    a.length; // 3
    a; // [1,2,3]
    a.first(); // 1
    a.last(); // 3
    ```
18. new.target(元属性)
    1. new.target指向new直接调用的构造器
    2. 如果new.target时undefined，则证明此函数不是通过new调用的
    ```js
    class Foo {
        constructor() {
            console.log( "Foo: ", new.target.name );
        }
    }
    class Bar extends Foo {
        constructor() {
            super();
            console.log( "Bar: ", new.target.name );
        }
        baz() {
            console.log( "baz: ", new.target );
        }
    }
    var a = new Foo();
    // Foo: Foo
    var b = new Bar();
    // Foo: Bar <-- 遵循new调用点
    // Bar: Bar
    b.baz();
    // baz: undefined
    ```
19. static
    1. `static`方法是直接添加到类的函数对象上，而不是函数对象的`prototype`上
    ```js
    class Foo {
        static cool() { console.log( "cool" ); }
        wow() { console.log( "wow" ); }
    }
    class Bar extends Foo {
        static awesome() {
            super.cool();
            console.log( "awesome" );
        }
        neat() {
            super.wow();
            console.log( "neat" );
        }
    }

    Foo.cool(); // "cool"
    Bar.cool(); // "cool"

    Bar.awesome(); // "cool"
                    // "awesome"

    var b = new Bar();
    b.neat(); // "wow"
                 // "neat"

    // awesome和cool方法都是在对象上，而非原型prototype上
    b.awesome; // undefined
    b.cool; // undefined
    ```
    2. 
20. Promise
21. Map（可以使用任意类型的值作为key）
    1. 无法使用非字符串作为普通对象的key
        ```js
        var m = {};
        var x = { id: 1 },
        y = { id: 2 };

        // x 和 y 两个对象字符串化都是 "[object Object]"，
        m[x] = "foo";
        m[y] = "bar";
        m[x]; // "bar"
        m[y]; // "bar"
        ```
    2. map的API
        ```js
        var m = new Map():
        var x = { id: 1 },
        y = { id: 2 };
        m.set( x, "foo" );
        m.set( y, "bar" );
        m.get( x ); // "foo"
        m.get( y ); // "bar"
        m.delete( y );
        m.clear();
        m.size; // 0
        ```
    3. map的值
        ```js
        var m = new Map();
        var x = { id: 1 },
        y = { id: 2 };
        m.set( x, "foo" );
        m.set( y, "bar" );
        var vals = [ ...m.values() ];
        vals; // ["foo","bar"]
        Array.from( m.values() ); // ["foo","bar"]
        ```
    4. map的键
        ```js
        var m = new Map();
        var x = { id: 1 },
        y = { id: 2 };
        m.set( x, "foo" );
        m.set( y, "bar" );
        var keys = [ ...m.keys() ];
        keys[0] === x; // true
        keys[1] === y; // true

        m.has( x ); // true
        m.has( y ); // false
        ``` 
    5. Map键的对象被丢弃（引用解除），map仍然会保留该项目，无法支持GC, WeakMap可以
22. WeakMap
    1. `WeakMap`弱持有它的键
        ```js
        var m = new WeakMap();
        var x = { id: 1 },
        y = { id: 2 },
        z = { id: 3 },
        w = { id: 4 };

        m.set( x, y );
        x = null; // { id: 1 } 可GC
        y = null; // { id: 2 } 可GC
        // 只因 { id: 1 } 可GC

        m.set( z, w );
        w = null; // { id: 4 } 不可GC
        ```
    2. `WeakMap` 没有 size 属性或 clear() 方法
23. Set
    1. set是1个值的集合，其中的值是唯一
    2. set用add代替了set方法，没有get方法
        ```js
        var s = new Set();
        var x = { id: 1 },
        y = { id: 2 };
        s.add( x );
        s.add( y );
        s.add( x );
        s.size; // 2
        s.delete( y );
        s.size; // 1
        s.clear();
        s.size; // 0

        s.has( x ); // true
        s.has( y ); // false
        ``` 
    3. set的唯一性不允许强制转换
        ```js
        var s = new Set( [1,2,3,4,"1",2,4,"5"] ),
        uniques = [ ...s ];
        uniques; // [1,2,3,4,"1","5"]
        ``` 
24. WeakSet弱持有它的值
    1. WeakSet的值必须是对象，不像set一样可以是原生对象的值
    ```js
    var s = new WeakSet();
    var x = { id: 1 },
    y = { id: 2 };
    s.add( x );
    s.add( y );
    x = null; // x可GC
    y = null; // y可GC
    ```
#### 5.新增API
1. Array
    1. Array.of(...)
        ```js
        // array接收1个参数时，且此参数是数字的话，此参数表示length
        var a = Array( 3 );
        a.length; // 3
        a[0]; // undefined

        var b = Array.of( 3 );
        b.length; // 1
        b[0]; // 3

        var c = Array.of( 1, 2, 3 );
        c.length; // 3
        c; // [1,2,3]
        ```
    2. Array.from
       1. 将类数组转换成数组
        ```js
        var arrLike = {
            length: 3,
            0: "foo",
            1: "bar"
        };
        var arr = Array.prototype.slice.call( arrLike );

        var arr = Array.from( arrLike ); 
        ```
        2. 复制
        ```js
        var arr2 = arr.slice();

        var arrCopy = Array.from( arr );
        ```
        3. `Array.from`永远不会产生空槽位
        ```js
        var a = Array( 4 );
        // 4个空槽位！
        var b = Array.apply( null, { length: 4 } );
        // 4个undefined值

        var c = Array.from( { length: 4 } );
        // 4个undefined值
        ```
        4. `Array.from()`的第2个参数，是1个映射回调
        ```js
        var arrLike = {
            length: 4,
            2: "foo"
        };
        Array.from( arrLike, function mapper(val,idx){
            if (typeof val == "string") {
                return val.toUpperCase();
            }
            else {
                return idx;
            }
        });
        // [ 0, 1, "FOO", 3 ]
        ```
        5. `Array.from`的第3个参数为第2个参数传入的回调指定this绑定，否则，this将会是undefined
        6. 使用`Array.from`和`Array.of`，得到的值都是`Array`的实例
    3. copyWithin(target, start, end)
        1. target要复制到的索引
        2. start开始复制的源索引，包括在内
        3. end复制结束的索引，不包括在内
        ```js
        [1,2,3,4,5].copyWithin( 3, 0 ); // [1,2,3,1,2]
        [1,2,3,4,5].copyWithin( 3, 0, 1 ); // [1,2,3,1,5]
        [1,2,3,4,5].copyWithin( 0, -2 ); // [4,5,3,4,5]
        [1,2,3,4,5].copyWithin( 0, -2, -1 ); // [4,2,3,4,5]
        ```
        ```js
        [1,2,3,4,5].copyWithin( 2, 1 ); // [1,2,2,3,4]
        ``` 
    4. fill(...)填充已存在的数组
       1. fill(content, start, end), start起始位置（包括），end结束位置（不包含）
        ```js
        var a = Array( 4 ).fill( undefined );
        a; // [undefined,undefined,undefined,undefined]
        ```
        ```js
        var a = [ null, null, null, null ].fill( 42, 1, 3 ); 
        a; // [null,42,42,null]
        ```
    5. find(...)
        1. find接收第2个参数，绑定到第1个参数回调的this, 否则this指向undefined
        ```js
        var a = [1,2,3,4,5];
        a.find( function matcher(v){
            return v == "2";
        }); // 2
        a.find( function matcher(v){
            return v == 7; // undefined
        });
        ``` 
    6. findIndex(...)
        1. findIndex接收第2个参数，绑定到第1个参数回调的this, 否则this指向undefined
    7. 原型方法entries(), values(), key()
        ```js
        var a = [1,2,3];
        [...a.values()]; // [1,2,3]
        [...a.keys()]; // [0,1,2]
        [...a.entries()]; // [ [0,1], [1,2], [2,3] ]
        [...a[Symbol.iterator]()]; // [1,2,3]
        ```
        ```js
        var a = [];
        a.length = 3;
        a[1] = 2;
        [...a.values()]; // [undefined,2,undefined]
        [...a.keys()]; // [0,1,2]
        [...a.entries()]; // [ [0,undefined], [1,2], [2,undefined] ]
        ``` 
2. Object
    1. Object.is(...) 
        1. 执行比===更严格的值比较
            ```js
            var x = NaN, y = 0, z = -0;

            // ES6新增了1个Number.isNaN()检测是否是NaN
            x === x; // false
            Object.is( x, x ); // true

            y === z; // true
            Object.is( y, z ); // false
            ``` 
    2. Object.getOwnPropertySymbols(..)
        1. 在对象上获取所有的symbols符号
            ```js
            var o = {
                foo: 42,
                [ Symbol( "bar" ) ]: "hello world",
                baz: true
            };
            Object.getOwnPropertySymbols( o ); // [ Symbol(bar) ]
            ```
    3. Object.setPrototypeOf(..)
        ```js
        var o1 = {
            foo() { console.log( "foo" ); }
        };
        var o2 = {
            // .. o2的定义 ..
        };

        Object.setPrototypeOf( o2, o1 );
        // 委托给o1.foo()
        o2.foo(); // foo
        ```
        ```js
        var o1 = {
            foo() { console.log( "foo" ); }
        };
        var o2 = Object.setPrototypeOf( {
            // .. o2的定义 ..
        }, o1 );
        // 委托给o1.foo()
        o2.foo(); // foo
        ```
    4. Object.assign(...)
        ```js
        var target = {},
        o1 = { a: 1 }, o2 = { b: 2 },
        o3 = { c: 3 }, o4 = { d: 4 };

        Object.assign( target, o1, o2, o3 );
        target.a; // 1
        target.b; // 2
        target.c; // 3 
        ``` 
        ```js
        var o1 = {
            foo() { console.log( "foo" ); }
        };
        var o2 = Object.assign(
            Object.create( o1 ),
            {
            // .. o2的定义 ..
            }
        );
        // 委托给o1.foo()
        o2.foo(); // foo
        ```
3. Math
    ```js
    三角函数：
    cosh(..)
    双曲余弦函数
    acosh(..)
    双曲反余弦函数
    sinh(..)
    双曲正弦函数
    asinh(..)
    双曲反正弦函数
    tanh(..)
    双曲正切函数
    atanh(..)
    双曲反正切函数
    hypot(..)
    平方和的平方根（也即：广义勾股定理）

    算术：
    cbrt(..)
    立方根
    clz32(..)
    计算 32 位二进制表示的前导 0 个数
    expm1(..)
    等价于 exp(x) - 1
    log2(..)
    二进制对数（以 2 为底的对数）
    log10(..)
    以 10 为底的对数
    log1p(..)
    等价于 log(x + 1)
    imul(..)
    两个数字的 32 位整数乘法

    元工具：
    sign(..)
    返回数字符号
    trunc(..)
    返回数字的整数部分
    fround(..)
    向最接近的 32 位（单精度）浮点值取整
    ```
4. Number
    1. 静态属性
        1. `Number.EPSILON`, 任意两个值之间的最小差：2^-52
        2. `Number.MAX_SAFE_INTEGER`, 无歧义“安全”表达的最大整数：2^53 - 1
        3. `Number.MIN_SAFE_INTEGER`, 无歧义“安全”表达的最小整数：-(2^53 - 1) 或 (-2)^53 + 1
    2. Number.isNaN(..)
        ```js
        var a = NaN, b = "NaN", c = 42;

        Number.isNaN( a ); // true
        Number.isNaN( b ); // false--修正了!
        Number.isNaN( c ); // false
        ```
    3. Number.isFinite(..), 检测传入的数是否是有穷数
        ```js
        var a = NaN, b = Infinity, c = 42;
        Number.isFinite( a ); // false
        Number.isFinite( b ); // false
        Number.isFinite( c ); // true
        ```
    4. Number.isInteger(..), 检测是否是整型
        ```js
        Number.isInteger( 4 ); // true
        Number.isInteger( 4.2 ); // false
        ```
        ```js
        function isFloat(x) {
            return Number.isFinite( x ) && !Number.isInteger( x );
        }
        isFloat( 4.2 ); // true
        isFloat( 4 ); // false
        isFloat( NaN ); // false
        isFloat( Infinity ); // false
        ```
5. 字符串
    1. Unicode函数
        1. String.fromCodePoint(..), 静态方法返回使用指定的代码点序列创建的字符串。
            ```js
            // expected output: "☃★♲你"
            console.log(String.fromCodePoint(9731, 9733, 9842, 0x2F804));
            ```
        2. String#codePointAt(..), 返回 一个 Unicode 编码点值的非负整数。
            ```js
            String.fromCodePoint( 0x1d49e ); // " "
            "ab d".codePointAt( 2 ).toString( 16 ); // "1d49e"
            ```
        3. String#normalize(..), 执行 Unicode 规范化
            ```js
            var s2 = s1.normalize();
            s2.length; // 1
            s2 === "\xE9"; // true
            ``` 
    2. String.raw(..), 获取未被转义的原始字符串
        ```js
        var str = "bc";
        String.raw`\ta${str}d\xE9`;
        // "\tabcd\xE9", 而不是" abcdé"
        ```
    3. repeat
        ```js
        "foo".repeat( 3 ); // "foofoofoo"
        ```
    4. 字符串检查函数
        1. startsWith(..)
            ```js
            var palindrome = "step on no pets";
            palindrome.startsWith( "step on" ); // true
            palindrome.startsWith( "on", 5 ); // true 
            ```
        2. endsWidth(..)
            ```js
            var palindrome = "step on no pets";
            palindrome.endsWith( "no pets" ); // true
            palindrome.endsWith( "no", 10 ); // true 
            ```
        3. includes(..)
            ```js
            var palindrome = "step on no pets";
            palindrome.includes( "on" ); // true
            palindrome.includes( "on", 6 ); // false
            ```  
#### 6.元编程
> 代码查看自身，代码修改自身，代码修改默认语言特性
1. 函数名称
    ```js
    var o = {
        foo() { .. }, // name: foo
        *bar() { .. }, // name: bar
        baz: () => { .. }, // name: baz
        bam: function(){ .. }, // name: bam
        get qux() { .. }, // name: get qux
        set fuz() { .. }, // name: set fuz
        ["b" + "iz"]:
        function(){ .. }, // name: biz
        [Symbol( "buz" )]:
        function(){ .. } // name: [buz]
    }; 
    ```
2. 元属性，new.target
    ```js
    class Parent {
        constructor() {
            if (new.target === Parent) {
                console.log( "Parent instantiated" );
            }
            else {
                console.log( "A child instantiated" );
            }
        }
    }

    class Child extends Parent {}
    var a = new Parent();
    // Parent instantiated
    var b = new Child();
    // A child instantiated
    ```
3. 代理
    ```js
    var obj = { a: 1 },
        handlers = {
            get(target, key, context) {
                // 注意：target === obj,
                // context === pobj
                console.log("accessing: ", key);
                return Reflect.get(
                    target, key, context
                );
            }
        },
        pobj = new Proxy(obj, handlers);
    obj.a;
    // 1
    pobj.a;
    // accessing: a
    // 1
    ```
4. 可通过`revocable`创建可取消的代理
   1. 一旦可取消代理被取消，任何对它的访问都会抛出TypeError
    ```js
    var obj = { a: 1 },
        handlers = {
            get(target,key,context) {
                // 注意：target === obj,
                // context === pobj
                console.log( "accessing: ", key );
                return target[key];
            }
        },
        { proxy: pobj, revoke: prevoke } = Proxy.revocable( obj, handlers );
        pobj.a;
        // accessing: a
        // 1
        // 然后：
        prevoke();
        pobj.a;
        // TypeError
    ```
5. 代理在先
    ```js
    var messages = [],
    handlers = {
        get(target, key) {
            // 字符串值？
            if (typeof target[key] == "string") {
                // 过滤掉标点符号
                return target[key]
                    .replace(/[^\w]/g, "");
            }
            // 所有其他的传递下去
            return target[key];
        },
        set(target, key, val) {
            // 设定唯一字符串，改为小写
            if (typeof val == "string") {
                val = val.toLowerCase();
                if (target.indexOf(val) == -1) {
                    target.push(
                        val.toLowerCase()
                    );
                }
            }
            return true;
        }
    },
    messages_proxy = new Proxy(messages, handlers);

    // 其他某处：
    messages_proxy.push(
        "heLLo...", 42, "wOrlD!!", "WoRld!!"
    );

    // Proxy {0: "hello...", 1: "world!!"}
    console.log(messages_proxy);
    // ["hello...", "world!!"]
    console.log(messages);

    // hello world
    messages_proxy.forEach(function (val) {
        console.log(val);
    });

    // hello... world!!
    messages.forEach(function (val) {
        console.log(val);
    });
    ```
6. 通过prototype实现代理在后
    ```js
    var handlers = {
        get(target,key,context) {
            return function() {
                context.speak(key + "!");
            };
        }
    },
    catchall = new Proxy( {}, handlers ),
    greeter = {
        speak(who = "someone") {
            console.log( "hello", who );
        }
    };

    // 设定greeter回退到catchall
    Object.setPrototypeOf( greeter, catchall );
    greeter.speak(); // hello someone
    greeter.speak( "world" ); // hello world
    greeter.everyone(); // hello everyone!
    ```
7. Reflect API
    1. 为操作对象而提供的新API, 确保对象的原生行为能够正常进行
    2. 和`Proxy`的API一致
    3. 将Object报错的情况，改为返回false
        ```js
        try {
            Object.defineProperty(target, property, attributes);
            // success
        } catch (e) {
            // failure
        }
        ```
        ```js
        if (Reflect.defineProperty(target, property, attributes)) {
        // success
        } else {
        // failure
        }
        ```
    4. 让Object的操作变成函数行为
        ```js
        'name' in Object //true
        ```
        ```js
        Reflect.has(Object,'name') //true
        ```
    5. 在Proxy上有的方法，在Reflect上一定有
        ```js
        let target={}
        let handler={
            set(target,proName,proValue,receiver){
                //确认对象的属性赋值成功
                let isSuccess=Reflect.set(target,proName,proValue,receiver)
                if(isSuccess){
                    console.log("成功")
                }
                return isSuccess
            }
        }
        let proxy=new Proxy(target,handler)
        ```
#### 7.ES6+
1. 异步函数async await
2. Object.observe(..)
    1. 建立监听者观察对象的变化，每次变化发生，调用1个回调
    2. 可观察到6种类型
        * add
        * update
        * delete
        * reconfigure
        * setPrototype
        * preventExtensions
    3. Object.defineProperty重新配置对象的属性，会发出`reconfigure`改变事件
    4. Object.seal(..) 和 Object.freeze(..) 都会触发`preventExtensions`改变事件
    5. 对象的`prototype`改变，都会触发`setPrototype`改变事件
    6. eg.
        ```js
        var obj = { a: 1, b: 2 };
        Object.observe(
            obj,
            function(changes){
                for (var change of changes) {
                    console.log( change );
                }
            },
            [ "add", "update", "delete" ]
        );

        obj.c = 3;
        // { name: "c", object: obj, type: "add" }
        obj.a = 42;
        // { name: "a", object: obj, type: "update", oldValue: 1 }
        delete obj.b;
        // { name: "b", object: obj, type: "delete", oldValue: 2 }
        ```   
3. Object.unobserve(..)结束观测
    ```js
    var obj = { a: 1, b: 2 };
    Object.observe(obj, function observer(changes) {
        for (var change of changes) {
            if (change.type == "setPrototype") {
                Object.unobserve(
                    change.object, observer
                );
                break;
            }
        }
    });
    ```
4. 幂运算符
    ```js
    var a = 2;
    a ** 4; // Math.pow( a, 4 ) == 16
    a **= 3; // a = Math.pow( a, 3 )
    a; // 8
    ```
5. 对象扩展符...
    ```js
    var o1 = { b: 2, c: 3, d: 4 };
    var { b, ...o2 } = o1;
    console.log( b, o2.c, o2.d ); // 2 3 4
    ```
6. includes
    ```js
    var vals = [ "foo", "bar", 42, "baz" ];
    if (~vals.indexOf( 42 )) {
    // 找到了!
    }
    ```
    ```js
    var vals = [ "foo", "bar", 42, "baz" ];
    if (vals.includes( 42 )) {
    // 找到了!
    }
    ```
8. WebAssembly (WASM)
    1. 使js成为从其他语言（比如 C/C++、ClojureScript 等）变换 / 交叉编译的目标语言
    2. WASM 为其他语言在浏览器运行时环境中运行提供了一条新路径
