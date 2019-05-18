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
4. 