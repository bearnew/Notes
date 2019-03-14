## 你不知道的javascript读后感
### 作用域
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
