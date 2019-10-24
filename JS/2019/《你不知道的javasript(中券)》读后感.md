## 你不知道的javasript
1. 内置类型
    * 空值(null)
    * 未定义(undefined)
    * 布尔值(boolean)
    * 数字(number)
    * 字符串(string)
    * 对象(object)
    * 符号(symbol)
2. typeof运算符
    ```js
    typeof undefined === 'undefined'; // true
    typeof true === 'boolean'; // true
    typeof 42 === 'number'; // true
    typeof '42' === 'string'; // true
    typeof { life: 42 } === 'object'; // true
    typeof Symbol() === 'symbol'; // true

    typeof null === 'object'; // true
    ```
    ```js
    // 判断null
    var a = null;
    (!a && typeof a === 'object'); // true
    ```
    ```js
    // function（函数）时object的子类型
    typeof function a(){ /* .. */ } === "function"; // true

    // function也拥有属性,函数声明了2个参数，所有length为2
    function a(b, c) {}
    a.length; // 2
    ```
    ```js
    // 数组也是object的子类型
    typeof [1,2,3] === "object"; // true
    ```
3. 变量没有类型，值才有类型
    ```js
    var a = 42;
    typeof a; // "number"

    a = true;
    typeof a; // "boolean"

    typeof typeof 42; // "string"
    ```
4. undefined(未定义), undeclared(未声明)
    ```js
    var a;
    a; // undefined
    b; // ReferenceError: b is not defined

    typeof a; // undefined
    // typeof有一个特殊的安全防范机制
    typeof b; // undefined
    ```
5. typeof用于写polyfill
    ```js
    if (typeof atob === "undefined") {
        // 不使用var声明变量，因为var会使atob提升到最顶层，即使if条件不成立
        atob = function() { /*..*/ };
    }
    ```
6. 数组
    * 稀疏数组（sparse array, 即含有空白或空缺单元的数组）
        ```js
        var a = []
        a['13'] = 42;
        a.length; // 14
        ```
    * 数组转换
        ```js
        function foo() {
            var arr = Array.prototype.slice.call(arguments);
            arr.push("bam");
            console.log(arr);
        }
        foo("bar", "baz"); // ["bar","baz","bam"]
        ```
    * ES6数组转换
        ```js
        var arr = Array.from(arguments);
        ```
7. 字符串
    * 字符串经常被当成字符数组
        ```js
        var a = "foo";
        var c = a.concat( "bar" ); // "foobar"
        a.charAt(0); // f
        ```
    * 借助数组的方法处理字符串
        ```js
        var c = Array.prototype.join.call( a, "-" );
        var d = Array.prototype.map.call( a, function(v){
            return v.toUpperCase() + ".";
        } ).join( "" );
        c; // "f-o-o"
        d; // "F.O.O."
        ```
    * 字符串不支持数组的reverse方法
        ```js
        var a = "foo";
        var c = a
        // 将a的值转换为字符数组
        .split( "" )
        // 将数组中的字符进行倒转
        .reverse()
        // 将数组中的字符拼接回字符串
        .join( "" );

        c; // "oof"
        ``` 
8. 数字
    * js使用的是双精度格式，没有真正意义上的整数
    * toFixed：指定小数位数的显示位数
        ```js
        // 无效语法：因为42.被当成了一部分
        42.toFixed( 3 ); // SyntaxError
        // 下面的语法都有效：
        (42).toFixed( 3 ); // "42.000"
        0.42.toFixed( 3 ); // "0.420"
        42..toFixed( 3 ); // "42.000"
        ```
    * toPrecision
        ```js
        var a = 42.59;
        a.toPrecision( 1 ); // "4e+1"
        a.toPrecision( 2 ); // "43"
        a.toPrecision( 3 ); // "42.6"
        a.toPrecision( 4 ); // "42.59"
        a.toPrecision( 5 ); // "42.590"
        a.toPrecision( 6 ); // "42.5900"
        ``` 
    * 二进制浮点数问题
        ```js
        // 0.1 + 0.2 = 0.30000000000000004
        0.1 + 0.2 === 0.3; // false
        ```
    * 使用Number.EPSILON判断2个值是否相等
        ```js
        if (!Number.EPSILON) {
            Number.EPSILON = Math.pow(2,-52);
        }

        // 在指定的误差范围内，则认为两个数字相等
        function numbersCloseEnoughToEqual(n1,n2) {
            return Math.abs( n1 - n2 ) < Number.EPSILON;
        }
        var a = 0.1 + 0.2;
        var b = 0.3;
        numbersCloseEnoughToEqual( a, b ); // true
        numbersCloseEnoughToEqual( 0.0000001, 0.0000002 ); // false
        ``` 
    * 最大值
        ```js
        Number.MAX_VALUE // 1.798e+308
        ``` 
    * 最小值
        ```js
        Number.MIN_VALUE // 5e-324, 无限接近于0
        ```
    * 整数的安全范围
        ```js
        Number.MAX_SAFE_INTEGER // 2^53 - 1，即 9007199254740991, 远远小于Number.MAX_VALUE
        ``` 
    * 整数检测
        ```js
        // es6方法
        Number.isInteger(42); // true
        Number.isInteger(42.000); // true
        Number.isInteger(42.3); // false
        ```
        ```js
        // Number.isInteger实现
        if (!Number.isInteger) {
            Number.isInteger = function(num) {
                return typeof num === 'number' && num % 1 == 0;
            }
        }
        ```
    * 检测是否是安全的整数
        ```js
        Number.isSafeInteger( Number.MAX_SAFE_INTEGER ); // true
        Number.isSafeInteger( Math.pow( 2, 53 ) ); // false, 2的53次幂
        Number.isSafeInteger( Math.pow( 2, 53 ) - 1 ); // true
        ```
        ```js
        if (!Number.isSafeInteger) {
            Number.isSafeInteger = function(num) {
                return Number.isInteger( num ) && Math.abs( num ) <= Number.MAX_SAFE_INTEGER;
            };
        }
        ```
    * NaN(无效数值)
        ```js
        var a = 2 / "foo"; // NaN
        typeof a === "number"; // true
        a == NaN; // false
        a === NaN; // false
        NaN === NaN; // false
        NaN != NaN; // true
        ```
    * isNaN(判断一个数值是否是NaN)
      ```js
        var a = 2 / "foo";
        a; // NaN
        window.isNaN( a ); // true
      ``` 
      ```js
        // 检测不是数字，也不是NaN的时候存在bug
        var b = "foo";
        b; "foo"
        window.isNaN( b ); // true——晕！
      ```
    * Number.isNaN(..)
        ```js
            // Number.isNaN实现1
            if (!Number.isNaN) {
                Number.isNaN = function(n) {
                    return typeof n === 'number' && window.isNaN(n);
                }
            }
            // Number.isNaN实现2
            if (!Number.isNaN) {
                Number.isNaN = function(n) {
                    return n !== n;
                }
            }

            var a = 2 / "foo";
            var b = "foo";
            Number.isNaN( a ); // true
            Number.isNaN( b ); // false——好！
        ``` 
9. undefined
    * 没有赋值
    * 使用void运算符可得到undefined, void并无改变表达式的结果，只是让表达式不返回值               
10. 无穷数
    ```js
        var a = 1 / 0; // Infinity
        var b = -1 / 0; // -Infinity

        var c = Number.MAX_VALUE; // 1.7976931348623157e+308
        c + c; // Infinity
        Infinity / Infinity; // NaN
    ```
11. 零值
    ```js
        var a = 0 / -3; // -0
        var b = 0 * -3; // -0

        a.toString(); // '0'
        a + ''; // '0'
        String(a); // '0'
        JSON.string(a); // '0'

        + '-0'; // -0
        Number('-0'); // -0
        JSON.parse('-0'); // -0 
    ```
    ```js
        function isNegZero(n) {
            n = Number( n );
            return (n === 0) && (1 / n === -Infinity);
        }
        isNegZero( -0 ); // true
        isNegZero( 0 / -3 ); // true
        isNegZero( 0 ); // false
    ```
12. Object.is(...), 判断2个值是否完全相同
    ```js
        var a = 2 / "foo"; // NaN
        var b = -3 * 0;  // -0

        Object.is( a, NaN ); // true
        Object.is( b, -0 ); // true
        Object.is( b, 0 ); // false

        if (!Object.is) {
            Object.is = function(v1, v2) {
                // 判断是否是-0
                if (v1 === 0 && v2 === 0) {
                    return 1 / v1 === 1 / v2;
                }
                // 判断是否是NaN
                if (v1 !== v1) {
                    return v2 !== v2;
                }
                // 其他情况
                return v1 === v2;
            }
        }
    ```
13. 值和引用
    * 简单值通过值传递的方式来赋值
        * null
        * undefined
        * 字符串
        * 数字
        * 布尔
        * symbol
        ```js
            var a = 2;
            var b = a; // b是a的值的一个副本
            b++;
            a; // 2
            b; // 3
        ``` 
    * 复合值(对象和函数)通过引用赋值的方式来赋值
        ```js
            var c = [1,2,3];
            var d = c; // d是[1,2,3]的一个引用
            d.push( 4 );
            c; // [1,2,3,4]
            d; // [1,2,3,4]
            // c, d都是指向[1, 2, 3],并非持有，所以它们更改的是同一个值，随后它们指向更改后的新值
        ``` 
    * 引用指向的是值本身，一个引用更改，无法更改另一个引用指向
        ```js
            d = [4, 5, 6];
            c; // [1, 2, 3, 4]
            d; // [4, 5, 6]
        ``` 
    * 函数传参只是传的引用，引用的指向不能被更改，只能修改引用指向的值
        ```js
            function foo(x) {
                x.push( 4 );
                x; // [1,2,3,4]
                // 然后
                x = [4,5,6];
                x.push( 7 );
                x; // [4,5,6,7]
            }
            var a = [1,2,3];
            foo( a );
            a; // 是[1,2,3,4]，不是[4,5,6,7]
        ``` 
    * 修改复合值，只能修改引用的指向
        ```js
            function foo(x) {
                x.push( 4 );
                x; // [1,2,3,4]
                // 然后
                x.length = 0; // 清空数组, 不是创建新数组，而是更改当前数组
                x.push( 4, 5, 6, 7 );
                x; // [4,5,6,7]
            }
            var a = [1,2,3];
            foo( a );
            a; // 是[4,5,6,7]，不是[1,2,3,4]
        ``` 
    * 可以用通过`slice`创建一个副本，这样传递的就不是原始值
        ```js
            foo(a.slice())
        ```
    * 将基本类型封装在复合值中，通过引用复制的方式传递，修改基本类型
        ```js
            function foo(wrapper) {
                wrapper.a = 42;
            }
            var obj = {
                a: 2
            };
            foo( obj );
            obj.a; // 42
        ```
    * 函数传参并不会改变简单类型的值
        ```js
        function foo(x) {
            x = x + 1;
            x; // 3
        }
        var a = 2;
        var b = new Number(a); // Object(a)也一样
        var c = a;
        foo(b);
        foo(c);
        console.log(b); // 是Number {2}，不是3
        console.log(c); // 2
        ``` 
14. 简单基本类型只能通过值来赋值/传递
15. 复合值通过引用来赋值/传递
16. 内建函数（原生函数）
    * `String()`
        ```js
            var a = new String( "abc" ); // 创建的是abc的封装对象，而非基本类型值'abc'
            typeof a; // object
            a instanceof String; // true
            Object.prototype.toString.call( a ); // ['object', 'String']
        ``` 
    * `Number()`
    * `Boolean()`
    * `Array()`
    * `Object()`
    * `Function()`
    * `RegExp()`
    * `Date()`
    * `Error()`
    * `Symbol()`
17. 所有`typeof`返回值为`object`的对象都包含一个内部属性`[[class]]`,通过`Object.prototype.toString.call()`来查看
    ```js
        Object.prototype.toString.call( [1,2,3] ); // "[object Array]"
        Object.prototype.toString.call( /regex-literal/i ); // "[object RegExp]"
        Object.prototype.toString.call( null ); // "[object Null]"
        Object.prototype.toString.call( undefined ); // "[object Undefined]"
        Object.prototype.toString.call( true ); // "[object Boolean]"
    ```
18. 封装对象
    ```js
        var a = "abc";
        var b = new String( a );
        var c = Object( a );
        typeof a; // "string"
        typeof b; // "object"
        typeof c; // "object"
        b instanceof String; // true
        c instanceof String; // true
        Object.prototype.toString.call( b ); // "[object String]"
        Object.prototype.toString.call( c ); // "[object String]"
    ```
19. 拆封
    * 使用`valueOf()`得到封装对象的基本类型
        ```js
            var a = new String( "abc" );
            var b = new Number( 42 );
            var c = new Boolean( true );
            a.valueOf(); // "abc"
            b.valueOf(); // 42
            c.valueOf(); // true
        ``` 
    * 通过隐式转换得到基本类型值
        ```js
            var a = new String( "abc" );
            var b = a + ""; // b的值为"abc"
            typeof a; // "object"
            typeof b; // "string"
        ``` 
20. Array(永远不要使用空数组单元)
    ```js
        // Array会自动补上new, 与new Array效果一致 
        var a = new Array(1, 2, 3);
        var b = Array(1, 2, 3);
    ```
    ```js
        // Array传1个参数，该参数被当成数组的预设长度
        var a = new Array( 3 );
        var b = [ undefined, undefined, undefined ];
        var c = [];
        c.length = 3; 
    ```
    ```js
        var a = new Array(3);
        var b = [undefined, undefined, undefined];
        var c = [];
        c.length = 3;

        var x = a.map(function (v, i) { return i; }); //  [empty × 3]
        var y = b.map(function (v, i) { return i; }); // [ 0, 1, 2 ]

        var z = Array.apply(null, { length: 3 }); // [ undefined, undefined, undefined ]
    ```
21. 尽量不要使用Object(), Function(), RegExp()
    * 使用构造函数定义会更麻烦，且执行效率更低
    ```js
        var c = new Object();
        c.foo = 'bar';
        c; // { foo: 'bar' }
        var d = { foo: 'bar' }
        d; // { foo: 'bar' }

        var e = new Function('a', 'return a * 2');
        var f = function(a) { return a * 2 };
        function g(a) { return a * 2 };

        var h = new RegExp('^a*b+', 'g');
        var i = /^a*b+/g;
    ```
22. RegExp可以用来动态定义正则表达式
    ```js
        var name = "Kyle";
        var namePattern = new RegExp( "\\b(?:" + name + ")+\\b", "ig" );
        var matches = someText.match( namePattern );
    ```
23. Date(...)
    ```js
        // Date.now()获取当前unix的时间戳
        if (!Date.now) {
            Date.now = function() {
                return (new Date()).getTime();
            }
        }
    ```
24. Error(...)
    ```js
        // 创建错误对象
        function foo(x) {
            if (!x) {
            throw new Error( "x wasn’t provided" );
            }
            // ..
        }
    ```
25. Symbol
    * 具有唯一性的特殊值
    * 是简单标量的基本类型
    * 可作为属性名
    * 不能使用new关键字来构造
    * 主要用于私有或特殊属性
    * 
    ```js
        var mysym = Symbol( "my own symbol" );
        mysym; // Symbol(my own symbol)
        mysym.toString(); // "Symbol(my own symbol)"
        typeof mysym; // "symbol"
        var a = { };
        a[mysym] = "foobar";
        // getOwnPropertySymbols可以公开获得对象上的所有符号
        Object.getOwnPropertySymbols( a );
        // [ Symbol(my own symbol) ]
    ```
26. 原生原型
    * `indexOf`
        ```js
        'Hello'.indexOf('H'); // 0
        ``` 
    * `charAt`
        ```js
        'Hello'.charAt(1); // e
        ``` 
    * `substr`,
        ```js
        // start-起始位置，可以为负数
        // length-需要截取的字符数
        stringObject.substr(start, length);
        ```
    * `substring`
        ```js
        // start-起始位置，非负整数
        // stop-结束位置，非负整数，省略该参数，返回的子串会一直到字符串的结尾
        stringObject.substring(start,stop)
        ```
    * `slice`
        ```js
        // 不会修改数组
        // start-可以为负数
        // end-可以为负数，省略该参数，切分的数组从start到结束
        arrayObject.slice(start,end)
        ```
    * `toUpperCase`, 字符串转换成大写
    * `toLowerCase`, 字符串转换成小写
    * `trim`
        ```js
        // 去掉字符串的前后空格
        ' a b '.trim(); // 'a b'
        ```
    * 以上方法都不会改变原字符串的值, 而是返回一个新的字符串
    * 原生原型并非普通对象
        ```js
        typeof Function.prototype; // function
        Function.prototype(); // 空函数

        RegExp.prototype.toString(); // "/(?:)/"——空正则表达式
        "abc".match(RegExp.prototype); // [""]

        Array.isArray( Array.prototype ); // true
        Array.prototype.push( 1, 2, 3 ); // 3
        Array.prototype; // [1,2,3]
        // 需要将Array.prototype设置回空，否则会导致问题！
        Array.prototype.length = 0;
        ``` 
27. 值类型转换
    ```js
        var a = 42;
        var b = a + ''; // '42', 隐式强制类型转换
        var c = String(a); // '42', 显式强制类型转换 
    ```
28. ToString
    * 处理非字符串到字符串的强制类型转换
    * 对象有自己的`toString`方法，字符串会调用该方法，并使用其返回值
    * 数组默认的`toString`方法经过了重新定义，将所有的单元字符串用`,`连接起来
        ```js
            var a = [1, 2, 3];
            a.toString(); // "1, 2, 3"
        ```
    * `JSON.stringify`将`JSON`对象序列化为字符串时，也用到了`toString()`
    * 对简单值来说，`JSON.stringify`和`tostring`的效果相同
        ```js
            JSON.stringify(42); // "42"
            JSON.stringify("42"); // ""42""
            JSON.stringify(null); // "null"
            JSON.stringify(true); // "true"
        ```
    * `JSON.stringify`在对象中遇到`undefined`, `function`, `symbol`会将其忽略，在数组中则会返回`null`
        ```js
            JSON.stringify(undefined); // undefined
            JSON.stringify(function(){}); // undefined
            JSON.stringify([1, undefined, function(){}, 4]); // "[1, null, null, 4]"
            JSON.stringify({a: 2, b: function(){}}) // "{"a": 2}"
        ```
    * 对包含循环引用的对象使用`JSON.stringify()`会报错
    * 如果对象中定义了`toJSON()`的方法，`JSON`字符串化时会首先调用该方法
        ```js
        var o = {};
        var a = {
            b: 42,
            c: o,
            d: function() {}
        };
        o.e = a;
         
        JSON.stringify(a); // 有循环引用，报错
        a.toJSON = function() {
            return {
                b: this.b
            }
        }

        JSON.stringify(a); // "{"b": 42}"
        ``` 
    * `JSON.stringify`第2个参数可传递`replacer`, 可以是数组或者函数
        ```js
        var a = {
            b: 42,
            c: "42",
            d: [1, 2, 3]
        }

        JSON.stringify(a, ["b", "c"]); // "{"b": "42", "c": "42"}"

        // 字符串时递归的，数组[1, 2, 3]的每个元素都会通过val传给replacer
        // val是1, 2, 3, key是0, 1, 2
        JSON.stringify(a, function(key, val) {
            if (key !== "c") return val;
        })
        // "{"b": 42, "d": [1, 2, 3]}"
        ```
    * `JSON.stringify`第3个参数可传递`space`，用于指定输出的缩进格式, 也可传字符串, 此时，前面的字符串被用于每1级的缩进
    * 
29. ToNumber
    1. 先检查值有没有`valueOf`方法，有则返回基本类型
    2. 没有`valueOf`, 则检查`toString`, 再用返回值来进行强制类型转换
    3. 如果`valueOf`和`toString`均不返回基本类型，则会产生`typeError`错误
    4. `Object.create(null)`创建对象的`prototype`属性为`Null`, 并且没有`valueOf`和`toString`方法, 因此无法进行强制转换
    5. example
        ```js
        // 非数字值转换成数字
        true; // 1
        false; // 0
        undefined; //NaN
        null; // 0
        ```
        ```js
        var a = {
            valueOf: function() {
                return '42';
            }
        }
        var b = {
            toString: function() {
                return '42';
            }
        }
        var c = [4, 2];
        c.toString = function() {
            return this.join(''); // 42
        }

        Number(a); // 42
        Number(b); // 42
        Number(c); // 42
        Number(''); // 0
        Number([]); // 0
        Number(['abc']); // NaN
        ```
30. ToBoolean
    1. 假值，可以被强制类型转换成`false`的值
        * undefined
        * null
        * false
        * +0, -0, NaN
        * ''
    2. 其他，被强制类型转换成`true`的值
    3. 假值对象
        ```js
        var a = new Boolean(false);
        var b = new Number(0);
        var c = new String('');

        var d = a && b && c; // String{''}
        var e = Boolean(a && b && c); // true
        var f = 0 && 1; // 0
        var g = 1 && 2 && 3; // 3
        ```
    4. 真值
        ```js
        var a = false;
        var b = 0;
        var c = '';

        var d = a && b && c; // false
        var e = Boolean(d); // true
        ``` 
        ```js
        var a = [];
        var b = {};
        var c = function () { };

        var d = a && b && c; // function() {}
        var e = Boolean(a && b && c); // true
        ```
31. 显式强制类型转换
    1. 字符串和数字之间的显示转换
        ```js
        var a = 42;
        String(a); // '42'
        a.toString(); // '42'
        ```
        ```js
        var a = '3.14';
        Number(a); // 3.14
        + a; // 3.14
        ```
    2. 
    3. 
32. 
阅读至45页