## 你不知道的javascript读后感
### 1.作用域
1. 全局作用域
    * 生命周期存在于整个程序之内
    * 全局变量会挂载在window对象上
2. 函数作用域
    * 函数作用域是封闭的，函数外层的作用域无法访问函数内部的作用域
    * 可以通过闭包访问函数内部的作用域
3. 块级作用域
   * 使用let const实现块级作用域
    ```js
    for(var i = 0; i < 5; i++) {}
    for(let j = 0; j < 5; j++) {}

        console.log(i)				// 5
        console.log(j)              // ReferenceError: j is not defined
    ``` 
4. 词法作用域（静态作用域）
    * 作用域在词法分析阶段(函数定义的时候)就确定了，不会改变
    ```js
        var testValue = 'outer';

        function foo() {
            console.log(testValue);		// "outer"
        }

        function bar() {
            var testValue = 'inner';
            foo();
        }

        bar();
    ``` 
    ```js
        var scope = "global scope";
        function checkscope(){
            var scope = "local scope";
            function f(){
                return scope;
            }
            return f();
        }
        checkscope(); // local scope
    ```
5. 动态作用域
    * 运行时根据程序的流程信息(函数调用的时候)来动态确定的
    * 通过改变this的引用，实现动态作用域
### 2.提升
1. 函数声明和变量声明都会提升，函数提升会优先
### 3.this
1. 函数
    * 具名函数
    ```js
    function foo() {
        foo.count = 4;
    }
    ``` 
    * 匿名函数
    ```js
    setTimeout(function() {

    }, 10)
    ```
    使用arguments.callee引用当前正在运行的函数对象，但是arguments.callee已被废弃
2. this的指向取决于函数的调用方式
    1. 隐式绑定（调用位置是否有上下文对象）
        ```js
        // 对象属性引用链上，只有最顶层（最近的一层影响调用位置）
        function foo() {
            console.log( this.a );
        }
        var obj2 = {
            a: 42,
            foo: foo
        };
        var obj1 = {
            a: 2,
            obj2: obj2
        };
        obj1.obj2.foo(); // 42
        ```
    2. this的调用取决于调用的函数，与函数的引用无关系
        ```js
        function foo() {
            console.log( this.a );
        }
        var obj = {
            a: 2,
            foo: foo
        };
        var bar = obj.foo; // 函数别名！
        var a = "oops, global"; // a 是全局对象的属性
        bar(); // "oops, global"
        ```
        参数传递，是隐式赋值
        ```js
        function foo() {
            console.log( this.a );
        }
        function doFoo(fn) {
            // fn 其实引用的是foo
            fn(); // <-- 调用位置！
        }
        var obj = {
            a: 2,
            foo: foo
        };
        var a = "oops, global"; // a 是全局对象的属性
        doFoo( obj.foo ); // "oops, global"
        ```
        回调函数丢失this绑定
        ```js
        function foo() {
            console.log( this.a );
        }
        var obj = {
            a: 2,
            foo: foo
        };
        var a = "oops, global"; // a 是全局对象的属性
        setTimeout( obj.foo, 100 ); // "oops, global"

        // setTimeout的内部实现
        function setTimeout(fn, delay) {
            // 等待delay毫秒
            fn();
        }
        ```
3. 显式绑定
   1. 使用call(...), apply(...), bind(...)方法
    ```js
        function foo() {
            console.log( this.a );
        }
        var obj = {
            a:2
        };
        var bar = function() {
            foo.call( obj );
        };
        bar(); // 2
        setTimeout( bar, 100 ); // 2
        // 硬绑定的bar 不可能再修改它的this
        bar.call( window ); // 2
    ```
   2. API第2个参数context，作用与bind一样
    ```js
        function foo(el) {
            console.log( el, this.id );
        }
        var obj = {
            id: "awesome"
        };
        // 调用foo(..) 时把this 绑定到obj
        [1, 2, 3].forEach( foo, obj );
        // 1 awesome 2 awesome 3 awesome
    ```  
4. new绑定
    * 创建（构造）一个全新的对象
    * 新对象被执行原型连接
    * 新对象绑定到函数调用的this
    * new 表达式中的函数会自动返回这个新对象
    ```js
        function foo(a) {
            this.a = a;
        }
        var bar = new foo(2);
        console.log( bar.a ); // 2
    ``` 
5. new的绑定比隐式优先级高
    ```js
        function foo(something) {
            this.a = something;
        }
        var obj1 = {
            foo: foo
        };
        var obj2 = {};
        obj1.foo( 2 );
        console.log( obj1.a ); // 2
        obj1.foo.call( obj2, 3 );
        console.log( obj2.a ); // 3
        var bar = new obj1.foo( 4 );
        console.log( obj1.a ); // 2
        console.log( bar.a ); // 4
    ```
6. new修改了显示绑定的this指向
    ```js
        function foo(something) {
            this.a = something;
        }
        var obj1 = {};
        var bar = foo.bind( obj1 );
        bar( 2 );
        console.log( obj1.a ); // 2
        var baz = new bar(3);
        console.log( obj1.a ); // 2
        console.log( baz.a ); // 3
    ``` 
7. bind改变this的实现
    ```js
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                // 与 ECMAScript 5 最接近的
                // 内部 IsCallable 函数
                throw new TypeError(
                    "Function.prototype.bind - what is trying " +
                    "to be bound is not callable"
                );
            }
            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function () { },
                fBound = function () {
                    return fToBind.apply(
                        (
                            this instanceof fNOP &&
                                oThis ? this : oThis
                        ),
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                }
            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();
            return fBound;
        };
    ```
8. new改变this的优先级最高
    ```js
        function foo(p1,p2) {
            this.val = p1 + p2;
        }
        // 之所以使用 null 是因为在本例中我们并不关心硬绑定的 this 是什么
        // 反正使用 new 时 this 会被修改
        var bar = foo.bind( null, "p1" );
        var baz = new bar( "p2" );
        baz.val; // p1p2
    ```
9. 手写一个new
    ```js
        function New(f) {
            //返回一个func
            return function () {
                var o = Object.create(f.prototype);
                f.apply(o, arguments);//继承父类的属性

                return o; //返回一个Object
            }
        }

        function foo(something) {
            this.a = something;
        }

        var baz = New(foo)(3);
        console.log(baz.a); // 3
    ```
10. 间接引用
    ```js
        function foo() {
            console.log(this.a);
        }
        var a = 2;
        var o = { a: 3, foo: foo };
        var p = { a: 4 };
        o.foo(); // 3
        (p.foo = o.foo)(); // 2
    ```
11. 软绑定
    ```js
        if (!Function.prototype.softBind) {
            Function.prototype.softBind = function (obj) {
                var fn = this;
                // 捕获所有 curried 参数
                var curried = [].slice.call(arguments, 1);
                console.log(curried)
                var bound = function () {
                    return fn.apply(
                        (!this || this === (window || global)) ? obj : this,
                        curried.concat.apply(curried, arguments)
                    );
                };
                bound.prototype = Object.create(fn.prototype);
                return bound;
            };
        }

        function foo() {
            console.log("name: " + this.name);
        }
        var obj = { name: "obj" },
            obj2 = { name: "obj2" },
            obj3 = { name: "obj3" };
        var fooOBJ = foo.softBind(obj);
        fooOBJ(); // name: obj
        obj2.foo = foo.softBind(obj);
        obj2.foo(); // name: obj2 <---- 看！！！
        fooOBJ.call(obj3); // name: obj3 <---- 看！
        setTimeout(obj2.foo, 10);
            // name: obj <---- 应用了软绑定
    ```
12. 箭头函数的this绑定无法被修改(new 也不行)
> 根据外层（函数或者全局）作用域来决定 this
 
    ```js
    function foo() {
        // 返回一个箭头函数
        return (a) => {
            //this 继承自 foo()
            console.log( this.a );
        };
    }
    var obj1 = {
        a:2
    };
    var obj2 = {
        a:3
    };
    var bar = foo.call( obj1 );
    bar.call( obj2 ); // 2, 不是 3 ！
    ```
    ```js
    function foo() {
        var self = this; // lexical capture of this
        setTimeout( function(){
            console.log( self.a );
        }, 100 );
    }
    var obj = {
        a: 2
    };
    foo.call( obj ); // 2
    ```
13. this优先级（1-4, 从高到低）
    * 1.存在new绑定，this指向新创建的对象
    ```js
        var bar = new Foo();
    ``` 
    * 2.函数通过call, apply, bind绑定，this指向绑定的对象
    ```js
        var bar = foo.call(obj);
    ``` 
    * 3.函数在上下文对象中调用，this指向调用的最近的上下文对象
    ```js
        var bar = obj1.foo();
    ``` 
    * 4.默认绑定，严格模式，绑定到undefined,否则绑定到全局对象
    ```js
        var bar = foo();
    ``` 
阅读至 101页
