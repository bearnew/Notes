# import 和 require

#### 1. require 可以引入内置模块、本地模块、本地文件

```js
// to use built-in modules
var myVar = require("http");

// to use local modules
var myVar2 = require("./myLocaModule");

// to use local file
// data.json
// {
//   "name": "Freddie Mercury"
// }

var myVar3 = require("./data.json");
console.log(obj.name); // Freddie Mercury
```

#### 2.import 可以引入内置模块\本地模块

```js
<script type="module">var myVac = import("module-name");</script>
```

#### 3. 不同点

1. import 只能运行在顶层，不能包含在条件语句中，`require`可以
2. import 可以通过函数动态导入
3. `require`的同步/异步加载方式

   ```js
   // 异步加载
   require(['../ccc.js']，function(){})
   // 同步加载
   require('../ccc.js')
   ```

4. `import`的写法更加多样

   ```js
   const fs = require("fs");
   exports.fs = fs;
   module.exports = fs;
   ```

   ```js
   import fs from 'fs'
   import {default as fs} from 'fs'
   import * as fs from 'fs'
   import {readFile} from 'fs'
   import {readFile as read} from 'fs'
   import fs, {readFile} from 'fs'

   export default fs
   export const fs
   export function readFile
   export {readFile, read}
   export * from 'fs'
   ```

5. `ES6 Module` 中导入模块的属性或者方法是强绑定的，包括基础类型；而 `CommonJS` 则是普通的值传递或者引用传递。

   ```js
   ➜  test node commonjs.js
   increase count to 1 in counter.js after 500ms
   read count after 1000ms in commonjs is 0
   ➜  test babel-node es6.js
   increase count to 1 in counter.js after 500ms
   read count after 1000ms in es6 is 1

   // counter.js
   exports.count = 0
   setTimeout(function () {
       console.log('increase count to', ++exports.count, 'in counter.js after 500ms')
   }, 500)

   // commonjs.js
   const {count} = require('./counter')
   setTimeout(function () {
       console.log('read count after 1000ms in commonjs is', count)
   }, 1000)

   //es6.js
   import {count} from './counter'
   setTimeout(function () {
       console.log('read count after 1000ms in es6 is', count)
   }, 1000)
   ```

6. `es6`模块导出给`require`引用

   ```js
   // 相等于module.exports，顶级导出，不能有其他导出了
   export = function() {
       console.log('i am default')
   }
   ```

   ```js
   // 配置项为esModuleInterop
   import c4 = require('./test.js');
   import c4 from './test.js';
   c4(); // i am default
   ```

7. `export`导出的是变量，修改有效

   ```js
   var a = 1;
   setTimeout(() => {
     a++;
   }, 500);
   export { a };
   ```

   ```js
   import { a } from "./a.js";
   setTimeout(() => {
     console.log(a); // 2
   }, 1000);
   ```

8. `export default`导出的是值，修改无效

   ```js
   var a = 1;
   setTimeout(() => {
     a++;
   }, 500);
   export { a };
   ```

   ```js
   import a from "./a.js";
   setTimeout(() => {
     console.log(a); // 1
   }, 1000);
   ```

9. `import`值对应的引用，直接修改无效

   ```js
   // test.js
   const testObj = { x: { y: 1 } };
   const x = testObj.x;
   export { x, testObj };
   ```

   ```js
   // 直接修改
   testObj.x = { y: 2 };
   ```

   ```js
   // 直接接收
   console.log("xxx", x); // { y: 1 }
   console.log("yyy", testObj); // { x: { y: 2 } }
   ```

10. `import`值对应的引用，修改上面的属性有效

    ```js
    // 修改引用，都会生效
    x.y = 3;
    testObj.x = { y: 4 };
    ```

    ```js
    // 接受引用
    console.log("xxx", x); // { y: 3 }
    console.log("yyy", testObj); // { x: { y: 4 } }
    ```
