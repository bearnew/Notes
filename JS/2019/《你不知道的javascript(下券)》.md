#### 1.深入编程
1. 执行程序
    1. js引擎是动态编译程序，然后立即执行编译后的代码
#### 1.深入javascript
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
2.  