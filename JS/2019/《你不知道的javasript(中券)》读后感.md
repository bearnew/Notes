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

阅读至32页