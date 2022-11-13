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