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
        // 对象属性引用链上，只有最顶层（最近的一层影响调用位置）,如果最近的对象无该属性，则为undefined
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
14. 关键点总结
    1. 箭头函数的this, 指向外层函数的作用域（如果无外层函数，则为全局）
    2. 箭头函数的this绑定无法被修改
    3. function函数this的指向，取决于调用的环境，与函数的引用无关
> https://juejin.im/post/59aa71d56fb9a0248d24fae3 
15. 类型
    * 简单基本类型
      * string
      * number
      * boolean
      * null
        ```js
        // 原理: 不同的对象在底层都表示为二进制，在JavaScript 中二进制前三位都为0 的话会被判断为object 类型，
        // null 的二进制表示是全0，自然前三位也是0，所以执行typeof 时会返回“object”。
        typeof null // object
        ``` 
      * undefined
    * 复杂基本类型
      * object
        * 函数是一等公民
16. 内置对象
    * String
        ```js
        var strPrimitive = "I am a string";
        typeof strPrimitive; // "string"
        strPrimitive instanceof String; // false
        var strObject = new String( "I am a string" );
        typeof strObject; // "object"
        strObject instanceof String; // true
        // 检查sub-type 对象
        Object.prototype.toString.call( strObject ); // [object String]
        ``` 
    * Number
        ```js
        42.359.toFixed(2) // 引擎会自动将42转换成new Number(42)
        ``` 
    * Boolean
    * Object
    * Function
    * Array
    * Date
      * 只有构造形式，没有文字形式
    * RegExp
    * Error
    * null和undefined没有构造形式，只有文字形式
17. 对象访问
    ```js
    var myObject = {
        a: 2
    };
    myObject.a; // 属性访问
    myObject["a"]; // 键访问
    ```
    ```js
    var obj = {};
    obj[obj] = 123;
    obj[obj] // 123
    obj['[object Object]'] // 123
    ```
18. 数组
    * 数组的每个下标都是整数，但是仍然可以给数组添加属性
    * 如果数组的属性名看起来像一个数字，那它就变成了数值下标
    ```js
    var myArray = ['foo', 42, 'bar'];
    myArray.baz = 'baz';
    
    myArray.length; // 3
    myArray.baz; // 'baz'

    myArray['3'] = 'xx';
    myArray.length; // 4
    myArray[3]; // 'xx'
    ```
19. 属性描述符
    * writable
      * 决定是否可以修改属性的值
    * enumerable
      * 控制属性是否出现在对象的属性枚举中
    * configurable
      * 只要属性是可配置的，就可以使用defineProperty(...)方法来修改属性描述符
      * configureable: false还会禁止删除这个属性
        ```js
        var myObject = {
            a:2
        };
        myObject.a; // 2
        delete myObject.a;
        myObject.a; // undefined
        ``` 
    ```js
    var myObject = {
        a:2
    };
    Object.getOwnPropertyDescriptor( myObject, "a" );
    // {
    // value: 2,
    // writable: true, 
    // enumerable: true,
    // configurable: true
    // }
    ```
20. 对象定义
    * 对象常量
        ```js
        var myObject = {};
        Object.defineProperty(myObject, "FAVORITE_NUMBER", {
            value: 42,
            writable: false,
            configurable: false
        });
        ```
    * 禁止扩展
        ```js
        var myObject = {
            a:2
        };
        Object.preventExtensions(myObject);
        myObject.b = 3;
        myObject.b; // undefined
        ```
    * 密封
        * 密封之后，不能添加新属性，也不能重新配置或删除现有属性, 可以修改属性的值
        * 原理: 现有对象上调用Object.preventExtensions(..) 并把所有现有属性标记为configurable:false
        ```js
        var myObject = {
            a:2
        };
        Object.seal(myObject);
        ``` 
    * 冻结
      * 实际上会在一个现有对象上调用Object.seal(..) 并把所有“数据访问”属性标记为writable:false
      ```js
        var myObject = {
            a:2
        };
        Object.freeze(myObject);
      ``` 
21. Getter和Setter
    ```js
    var myObject = {
        // 给 a 定义一个getter
        get a() {
            return this._a_;
        },
        // 给 a 定义一个setter
        set a(val) {
            this._a_ = val * 2;
        }
    };
    myObject.a = 2;
    myObject.a; // 4
    ```
22. hasOwnProperty(..) 只会检查属性是否在myObject 对象中，不会检查[[Prototype]] 链。
    ```js
    var myObject = {
        a:2
    };

    myObject.hasOwnProperty( "a" ); // true
    ```
23. 遍历
    * forEach(...)遍历数组中所有值，并忽略回调函数的返回值
    * every(...)运行到回调函数返回false
    * some(...)运行到回调函数返回true
    * for...of
        ```js
        var myArray = [ 1, 2, 3 ];
        for (var v of myArray) {
            console.log( v );
        }
        // 1
        // 2
        // 3
        ``` 
    * iterator
        ```js
        var myArray = [ 1, 2, 3 ];
        var it = myArray[Symbol.iterator]();
        it.next(); // { value:1, done:false }
        it.next(); // { value:2, done:false }
        it.next(); // { value:3, done:false }
        it.next(); // { done:true }
        ``` 
24. 面向类的设计模式：
    * 封装
      * 类
      * 构造函数
    * 继承
    * 重载
      * 通过arguments参数个数实现重载
      * 通过参数类型实现重载 
    * 对态
        * 同一个实体同时具有多种形式
        * 一般通过子类重写父类方法实现多态
            ```js
            class Vehicle {
                engines = 1
                ignition() {
                    output( "Turning on my engine." );
                }
                drive() {
                    ignition();
                    output( "Steering and moving forward!" )
                }
            }
            class Car inherits Vehicle {
                wheels = 4
                drive() {
                    inherited:drive()
                    output( "Rolling on all ", wheels, " wheels!" )
                }
            }
            ```
        * 通过不同的传参实现多态
            ```js
            var makeSound = function(animal) {
                animal.sound();
            }
            
            var Duck = function(){}
            Duck.prototype.sound = function() {
                console.log('嘎嘎嘎')
            }
            var Chiken = function() {};
            Chiken.prototype.sound = function() {
                console.log('咯咯咯')
            }
            
            makeSound(new Chicken());
            makeSound(new Duck());
            ``` 
25. 原型
    1. Object.create(...)
        创建一个对象，并把对象的prototype关联到指定对象
        ```js
        var anotherObject = {
            a:2
        };

        // 创建一个关联到anotherObject 的对象
        var myObject = Object.create( anotherObject );
        console.log(myObject) // {}

        // 会一直查找对象的原型链Prototype
        for (var k in myObject) {
        console.log("found: " + k); // found: a
        }

        ("a" in myObject); // true
        ```
    2. 所有Prototype链最终都会指向内置的Object.prototype
        * Object.prototype上有toString, valueOf, hasOwnProperty, isPrototypeOf等方法
    3. 
26. constructor
    ```js
    function Foo() {
        // ...
    }
    Foo.prototype.constructor === Foo; // true
    var a = new Foo();
    a.constructor === Foo; // true
    ```

    Foo.prototype的.constructor属性是Foo函数声明时的默认属性，如果创建一个对象替换掉了.prototype对象引用，新对象不会获取.constructor属性。
    ```js
    function Foo() {}
    Foo.prototype = {}; // 创建一个新原型对象

    var a1 = new Foo();
    a1.constructor === Foo; // false
    // a1无.constructor属性
    // 委托Prototype链上的Foo.prototype
    // Foo.prototype被替换过，也无constructor属性
    // 继续委托给Object.prototype
    // Object.prototype.constructor指向内置的Object(...)函数
    a1.constructor === Object; // true
    ```
27. Object.create
    ```js
    // 创建一个新的Bar.prototype对象，并把它关联到Foo.prototype
    Bar.prototype = Object.create(Foo.prototype);
    ```
    ```js
    // 直接相等，容易修改到Foo.prototype
    Bar.prototype = Foo.prototype;
    Bar.prototype.myLable = ''; // Foo.prototype也被修改了
    ```
    ```js
    // ES6使用setPrototypeOf来把Bar.prototype关联到Foo.prototype
    Object.setPrototypeOf(Bar.prototype, Foo.prototype);
    ```
    ```js
    // Object.create的实现
    if (!Object.create) {
        Object.create = function(o) {
            function F(){}
            F.prototype = o;
            return new F();
        }
    }
    ```
28. instanceof
    ```js
    var a = new Foo();
    // 查找a的整条[[prototype]]链上是否有指向Foo.prototype的对象
    a instanceof Foo; // true
    ```
29. isPrototypeOf
    ```js
    var a = new Foo();
    Foo.prototype.isPrototypeOf(a); // true
    ```
30. 其他获取对象原型链的方法
    ```js
    Object.getPrototypeOf(a) === Foo.prototype; // true
    a.__proto__ === Foo.prototype; // true
    ```
31. __proto__
    > __proto__和其它常用函数（toString(), isPrototypeOf()）一样，存在内置的Object.prototype中
    ```js
    // __proto__实现
    Object.defineProperty(Object.prototype, '__proto__', {
        get: function() {
            return Object.getPrototypeOf(this);
        },
        set: function(o) {
            Object.setPrototypeOf(this, o);
            return o;
        }
    })
    ```
    