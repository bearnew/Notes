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
9. 
10. 

阅读至10页，第一章节完