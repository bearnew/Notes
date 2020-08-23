# 深入理解TypeScript
> https://jkchao.github.io/typescript-book-chinese/
## 1.typescript编译原理
1. 扫描器, sourceCode => Token流
2. 解析器, Token流 => AST
3. 绑定器, AST => Symbols（符号）
4. 检查器, AST + Symbols（符号）=> 类型验证
5. 发射器, AST + 检查器 => JavaScript 代码
## 2.type和interface区别
> 能用interface就使用interface，否则使用type
* 相同点
    * 都可以描述对象或者函数
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

        type SetUser = (name: string, age: number)=> void;
        ```
    * 都允许扩展
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
        type User = Name & { age: number  };
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
        interface Name { 
            name: string; 
        }
        type User = Name & { 
            age: number; 
        }
        ```
* 不同点
    * `type` 可以声明基本类型别名，联合类型，元组等类型
    ```js
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
    ```js
    // 当你想获取一个变量的类型时，使用 typeof
    let div = document.createElement('div');
    type B = typeof div
    ```
    * interface可以声明合并
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
## 3.声明空间
* 类型声明空间
```js
class Foo {}
interface Bar {}
type Bas = {};

// 类型注解
let foo: Foo;
let bar: Bar;
let bas: Bas;
```
* 变量声明空间
```js
class Foo {}
const someVar = Foo;
const someOtherVar = 123;
```
## 4.模块
* 全局模块
```js
// foo.ts
const foo = 123;

// bar.ts
// foo是全局变量
const bar = foo; // allowed
```
* 文件模块
> 使用import或者export会在这个文件中创建一个本地作用域
```js
// foo.ts
export const foo = 123;

// bar.ts
import { foo } from './foo';
const bar = foo; // allow
```
* 文件模块详情
    * `AMD`, 只能在浏览器中工作
    * `SystemJS`, 已经被ES模块代替
    * `ES`, 浏览器还没准备好，一般需要编译
    * `commonjs`，一般使用它
* 使用`export`关键字导出一个变量（或者类型）
```js
// foo.ts
export const someVar = 123;
export type someType = {
    foo: string
}
```
## 5.命名空间
1. js中的命名空间
```js
// 确保something不泄漏到全局中
(function(something) {
    something.foo = 123;
})(something || (something = {}));

console.log(something); // { foo: 123 }

(function(something) {
    something.bar = 456;
})(something || (something = {}));

console.log(something); // { foo: 123, bar: 456 }
```
2. ts中的命名空间（命名空间支持嵌套）
```js
namespace Utility {
    export function log(msg) {
        console.log(msg);
    }
    export function error(msg) {
        console.log(msg);
    }
}
// usage
Utility.log('Call me');
Utility.error('maybe');

// 编译后
// 添加属性至 Utility
(function (Utility) {
})(Utility || Utility = {});
```
## 6.动态导入
* 动态导入
```js
import(/* webpackChunkName: "momentjs" */ 'moment').then(moment => {
    // 懒加载的模块拥有所有的类型，并且能够按期工作
    // 类型检查会工作，代码引用也会工作 :100:
    const time = moment().format();
    console.log('TypeScript >= 2.4.0 Dynamic Import Expression:');
    console.log(time);
})
.catch(err => {
    console.log('Failed to load moment', err);
});
```
* 使用 "module": "esnext" 选项:TypeScript 为 Webpack Code Splitting 生成 import() 语句。
```js
// tsconfig.json
{
    "compilerOptions":{
        "target":"es5",
        "module":"esnext",
        "lib":[
            "dom",
            "es5",
            "scripthost",
            "es2015.promise"
        ],
        "jsx":"react",
        "declaration":false,
        "sourceMap":true,
        "outDir":"./dist/js",
        "strict":true,
        "moduleResolution":"node",
        "typeRoots":[
            "./node_modules/@types"
        ],
        "types":[
            "node",
            "react",
            "react-dom"
        ]
    }
}
```
## 7.内联类型
```js
let name: {
    first: string;
    second: string;
};
```
## 8.特殊类型
* `any`，ts关闭类型检测
* `null`和`undefined`，可赋值给任意类型的变量
```js
let num: number;
let str: string;

// 这些类型能被赋予
num = null;
str = undefined;
```
* `void`，表示一个函数没有返回值
```js
function log(message: string): void {
    console.log(message);
}
```
## 9.泛型
* 约束传参与返回的参数一致
```js
function reverse<T>(items: T[]): T[] {
    const toreturn = [];
    for (let i = items.length - 1; i >= 0; i--) {
        toreturn.push(items[i]);
    }
    return toreturn;
}

const sample = [1, 2, 3];
const reversed = reverse(sample);

console.log(reversed); // 3, 2, 1
// Safety
reversed[0] = '1'; // Error reversed = ['1', '2']; // Error
```
## 10.联合类型
```js
function formatCommandline(command: string[] | string) {
    let line = '';
    if (typeof command === 'string') {
        line = command.trim();
    } else {
        line = command.join(' ').trim();
    }
    // Do stuff with line: string
}
```
## 11.交叉类型
* 从两个对象中创建一个新对象，新对象拥有着两个对象所有的功能
```ts
function extend<T extends object, U extends object>(first: T, second: U): T & U {
  const result = <T & U>{};
  for (let id in first) {
    (<T>result)[id] = first[id];
  }
  for (let id in second) {
    if (!result.hasOwnProperty(id)) {
      (<U>result)[id] = second[id];
    }
  }

  return result;
}

const x = extend({ a: 'hello' }, { b: 42 });

// 现在 x 拥有了 a 属性与 b 属性
const a = x.a;
const b = x.b;
```
## 12.元组
```ts
let nameNumber: [string, number];
nameNumber = ['Jenny', 322134];

const [name, num] = nameNumber;
```
## 13.类型别名
```js
type Text = string | { text: string };
type Coordinates = [number, number];
type Callback = (data: string) => void;
```
## 14.快速定义第三方代码
```js
declare type JQuery = any;
declare var $: JQuery;
```
## 15.快速定义一个全局模块
```js
declare module 'jquery';
import * as $ from 'jquery';
```
## 16.导入额外的非js资源
```js
declare module '*.css';
declare module '*.html';
```
```js
import * as foo from './some/file.css'
```
## 17. @types
* `@types`支持全局和模块类型定义
```js
import * as $ from 'jquery';
```
* 控制全局
```js
// tsconfig
// 配置 compilerOptions.types: [ "jquery" ] 后，只允许使用 jquery 的 @types 包
// npm install @types/node，它的全局变量(例如 process)也不会泄漏到你的代码中，直到你将它们添加到 tsconfig.json 类型选项
{
    "compilerOptions": {
      "types" : [
        "jquery"
    ]}
}
```
## 18.声明文件
* `declare`告诉`typescript`，正在试图表述一个其他地方已经存在的代码
* 建议把声明放入 .d.ts 里(可以从一个命名 为 globals.d.ts 或者 vendor.d.ts 文件开始) 
## 19.接口
* 接口可以轻松的将成员添加到`myPoint`的现有声明中
```js
// Sample A, 内敛注解
declare const myPoint: { x: number; y: number };

// Sample B， 接口
interface Point {
    x: number;
    y: number;
}
declare const myPoint: Point;
```
```js
// Lib a.d.ts
interface Point {
    x: number,
    y: number
}

declare const myPoint: Point
// Lib b.d.ts
interface Point {
    z: number
}

// Your code
let myPoint.z // Allowed!
```
* `implements` 限制了类实例的结构 
```ts
// 编译错误
interface Point {
    x: number;
    y: number;
    z: number; // New member
}
class MyPoint implements Point {
    // ERROR : missing member `z`
    x: number;
    y: number;
}
```
* 可以使用 new 调用某些内容
```js
interface Crazy {
    new (): {
        hello: number;
    };
}

class CrazyClass implements Crazy {
    constructor() {
        return { hello: 123 };
    }
}

// Because
const crazy = new CrazyClass(); // crazy would be { hello:123 }
```
## 20.向枚举中添加静态方法
* `enum + namespace` 的声明的方式向枚举类型添加静态方法
```js
enum Weekday {
    Monday,
    Tuseday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday
}

namespace Weekday {
    export function isBusinessDay(day: Weekday) {
        switch (day) {
            case Weekday.Saturday:
            case Weekday.Sunday:
            return false;
        default:
            return true;
        }
    }
}

const mon = Weekday.Monday; 
const sun = Weekday.Sunday;
console.log(Weekday.isBusinessDay(mon)); // true
console.log(Weekday.isBusinessDay(sun));
```
## 21.lib.d.ts
1. 安装TypeScript时，会顺带安装`lib.d.ts`等声明文件，此文件包含了`JavaScript`运行时以及`DOM`中存在各种常见的环境声明
2. `lib.d.ts`的作用：
    * 它自动包含在 TypeScript 项目的编译上下文中
    * 它能让你快速开始书写经过类型检查的 JavaScript 代码
3. 通过指定 --noLib 的编译器命令行标志(或者在 tsconfig.json 中指定选项 noLib: true)从上下文中排除此文件
## 22.lib.d.ts的使用示例
```js
// 运行正常
// lib.d.ts 为所有 JavaScript 对象定义了 toString 方法
const foo = 123;
const bar = foo.toString();
```
```js
// noLib选项下
// Error: 属性 toString 不存在类型 number 上
const foo = 123;
const bar = foo.toString();
```
## 23.lib.d.ts内部
