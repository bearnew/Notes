## 1.类型保护
```js
export function isDate(val: any): val is Date {
    return Object.prototype.toString.call(val) === '[object Date]';
}
```
## 2.type和interface的区别
* 相同点
    * 都可以描述一个对象或者函数
    ```js
    interface User {
        name: string
        age: number
    }

    interface SetUser {
        (name: string, age: number): void;
    }
    ``` 
    ```js
    type User = {
        name: string
        age: number
    };

    type SetUser = (name: string, age: number): void;
    ```
    * `interface`可以通过`extends`来扩展，`type`可以用&来扩展
    ```js
    interface Name {
        name: string;
    }
    interface User extends Name {
        age: number;
    }
    ```
    ```js
    type Name = {
        name: string;
    }
    interface User extends Name {
        age: number;
    }
    ```
    ```js
    type Name = {
        name: string;
    }
    type User = Name & { age: number  };
    ```
    ```js
    interface Name {
        name: string;
    }
    type User = Name & {
        age: number;
    }
    ``` 
* 不同点
    * type 可以声明基本类型别名，联合类型，元组等类型
    ```ts
    // 基本类型别名
    type Name = string

    // 联合类型
    interface Dog {
        wong();
    }
    interface Cat {
        miao();
    }

    type Pet = Dog | Cat

    // 具体定义数组每个位置的类型
    type PetList = [Dog, Pet]
    ```
    * type 语句中还可以使用 typeof 获取实例的 类型进行赋值
    ```ts
    // 当你想获取一个变量的类型时，使用 typeof
    let div = document.createElement('div');
    type B = typeof div
    ```
    * interface 能够声明合并
    ```js
    interface User {
        name: string
        age: number
    }

    interface User {
        sex: string
    }

    /*
    User 接口为 {
        name: string
        age: number
        sex: string
    }
    */

    ```
## 3.tsconfig
1. `strictNullChecks`, 严格空值检查模式
    ```ts
    // 使用 --strictNullChecks 选项编译
    let x: number;
    let y: number | undefined;
    let z: number | null | undefined;
    x = 1;  // 正确
    y = 1;  // 正确
    z = 1;  // 正确
    x = undefined;  // 错误
    y = undefined;  // 正确
    z = undefined;  // 正确
    x = null;  // 错误
    y = null;  // 错误
    z = null;  // 正确
    x = y;  // 错误
    x = z;  // 错误
    y = x;  // 正确
    y = z;  // 错误
    z = x;  // 正确
    z = y;  // 正确
    ```
2. `moduleResolution`, 模块解析策略
    * `Classic`, 编译器则会从包含导入文件的目录开始依次向上级目录遍历，尝试定位匹配的声明文件
        * 有一个对moduleB的非相对导入import { b } from "moduleB"，它是在/root/src/folder/A.ts文件里，会以如下的方式来定位"moduleB"：
            1. /root/src/folder/moduleB.ts
            2. /root/src/folder/moduleB.d.ts
            3. /root/src/moduleB.ts
            4. /root/src/moduleB.d.ts
            5. /root/moduleB.ts
            6. /root/moduleB.d.ts
            7. /moduleB.ts
            8. /moduleB.d.ts 
    * `Node`, Node.js会根据 require的是相对路径还是非相对路径做出不同的行为
        * 假设有一个文件路径为 /root/src/moduleA.js，包含了一个导入var x = require("./moduleB"); Node.js以下面的顺序解析这个导入：
            1. 检查/root/src/moduleB.js文件是否存在。
            2. 检查/root/src/moduleB目录是否包含一个package.json文件，且package.json文件指定了一个"main"模块。 在我们的例子里，如果Node.js发现文件 /root/src/moduleB/package.json包含了{ "main": "lib/mainModule.js" }，那么Node.js会引用/root/src/moduleB/lib/mainModule.js。
            3. 检查/root/src/moduleB目录是否包含一个index.js文件。 这个文件会被隐式地当作那个文件夹下的"main"模块。
3. `esModuleInterop`, 支持在 CommonJs 模块下使用 import d from 'cjs'
    * 命名空间导入 (即： import * as foo from "foo")现在会被正确标记为不可调用，调用就会报错。
    * 支持从 CommonJS/AMD/UMD 默认导入，并且可以正常工作。
4. `noImplicitAny`, 在表达式和声明上有隐含的 any类型时报错。
5. `target`, 指定ECMAScript目标版本 "ES3"（默认）， "ES5"， "ES6"/ "ES2015"， "ES2016"， "ES2017"或 "ESNext"。 
## 4.高阶组件定义类型
```ts
interface Styles {
    [key: string]: string;
}

declare module 'isomorphic-style-loader/withStyles' {
    function withStyles(
        ...styles: Styles[]
    ): <T>(component: T) => T;

    export = withStyles;
}
``` 