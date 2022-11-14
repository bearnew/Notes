# NodeJs模块混用
1. `package.json`中`"type": "module"`
    - `.js`的文件只能使用`es module`
    - `.mjs`的文件只能使用`es module`
    - `.cjs`的文件只能使用`commonjs module`
2. `package.json`中`"type": "commonjs"`
    - `.js`的文件只能使用`commonjs module`
    - `.mjs`的文件只能使用`es module`
    - `.cjs`的文件只能使用`commonjs module`
3. 模块混用
- `import`来自`exports.a`的文件(`commonjs1`)
    ```js
    // a.js
    const a = () => {
        console.log("test a b c");
    };
    exports.a = a;
    ```
    ```js
    import { a } from "./a.js";
    console.log(a);
    a();
    ```
- `import`来自`module.exports`的文件(`commonjs2`)
    ```js
    // a.j
    const a = () => {
    console.log("test a b c");
    };
    module.exports = a;
    ```
    ```js
    // test.mjs
    import a from "./a.js";
    a(); // test a b c
    ```
- `require`来自`export const`的文件，在`node`中不行，`webpack`支持
    ```js
    // a.js
    export const a = () => {
        console.log("test a b c");
    };
    ```
    ```js
    // test.js
    const { a } = require('a.js');
    a(); // test a b c
    ```
- `require`来自`export default`的文件，在`node`中不行，`webpack`支持
    ```js
    // a.js
    const a = () => {
        console.log("test a b c");
    };
    export default a;
    ```
    ```js
    // test.js
    const a = require('a.js').default;
    a(); // test a b c
    ```
4. `commonjs`特性
    1. `CommonJS` 模块由 `JS` 运行时实现。
        ```js
        // 包装成自执行函数
        (function(exports,require,module,__filename,__dirname) {
            const sayName = require('./hello.js')
            module.exports = function say() {
                return {
                    name:sayName(),
                    author:'我不是外星人'
                }
            }
        })
        ```
        ```js
        // 通过runInThisContext执行
        runInThisContext(modulefunction)(module.exports, require, module, __filename, __dirname)
        ```
    2. `CommonJs` 是单个值导出，本质上导出的就是 `exports` 属性。
    3. `CommonJS` 是可以动态加载的，对每一个加载都存在缓存，可以有效的解决循环引用问题。
        ```js
        // require的缓存实现
        // id 为路径标识符
        function require(id) {
            /* 查找  Module 上有没有已经加载的 js  对象*/
            const  cachedModule = Module._cache[id]
            
            /* 如果已经加载了那么直接取走缓存的 exports 对象  */
            if(cachedModule){
                return cachedModule.exports
            }
            
            /* 创建当前模块的 module  */
            const module = { exports: {} ,loaded: false , ...}

            /* 将 module 缓存到  Module 的缓存属性中，路径标识符作为 id */  
            Module._cache[id] = module
            /* 加载文件 */
            runInThisContext(wrapper('module.exports = "123"'))(module.exports, require, module, __filename, __dirname)
            /* 加载完成 *//
            module.loaded = true 
            /* 返回值 */
            return module.exports
        }
        ```
        ```js
        // 循环引用，可能造成变量未获取到

        // a.js
        const getMes = require('./b');
        console.log('我是 a 文件');
        exports.nameA = '文件A';
        ```
        ```js
        // b.js
        const say = require('./a');

        console.log('我是 b 文件');
        console.log('打印 a 模块', say);
        ```
        ```js
        // main.js
        const a = require('./a');
        const b = require('./b');

        console.log('node 入口文件');
        ```
        ```js
        // node main.js
        我是 b 文件
        打印 a 模块 {}
        我是 a 文件
        node 入口文件
        ```
    4. `CommonJS` 模块同步加载并执行模块文件。
    5. `require`支持动态加载
        ```js
        console.log('我是 a 文件')
        exports.say = function(){
            const getMes = require('./b')
            const message = getMes()
            console.log(message)
        }
        ```
    6. 不能直接给`exports`赋值
        ```js
        // a.js
        // 给引用重新赋值是无效的
        exports = {
            name:'《React进阶实践指南》',
            author:'我不是外星人',
            say(){
                console.log(666)
            }
        }
        ```
        ```js
        const a = require('./a');
        a; // {}
        ```
5. `ES module`的特性
    1. `ES6 Module` 静态的，不能放在块级作用域内，代码发生在编译时。
        - ES6 模块提前加载并执行模块文件，ES6 模块在预处理阶段分析模块依赖，在执行阶段执行模块
        ```js
        // a.js
        import b from './b.js';
        console.log('a模块加载');
        export default function say() {
            console.log('hello , world');
        }
        ```
        ```js
        // b.js
        console.log('b模块加载');
        export default function sayhello() {
            console.log('hello,world');
        }
        ```
        ```js
        // main.js
        console.log('main.js开始执行');
        import say from './a.js';
        import say1 from './b.js';
        say();
        console.log('main.js执行完毕');
        ```
        ```js
        // node main.js
        b模块加载
        a模块加载
        main.js开始执行
        hello , world
        main.js执行完毕
        ```
    2. `ES6 Module` 的值是动态绑定的，可以通过导出方法修改，可以直接访问修改结果。
        ```js
        import {  num , addNumber } from './a'

        console.log(num) // num = 1
        addNumber()
        console.log(num) // num = 2
        ```
    3. `ES6 Module` 可以导出多个属性和方法，可以单个导入导出，混合导入导出。
    4. `ES6` 模块提前加载并执行模块文件
    5. `ES6 Module` 的特性可以很容易实现 Tree Shaking 和 Code Splitting。
