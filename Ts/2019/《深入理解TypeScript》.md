# 深入理解 TypeScript

> https://jkchao.github.io/typescript-book-chinese/

## 1.typescript 编译原理

1. 扫描器, sourceCode => Token 流
2. 解析器, Token 流 => AST
3. 绑定器, AST => Symbols（符号）
4. 检查器, AST + Symbols（符号）=> 类型验证
5. 发射器, AST + 检查器 => JavaScript 代码

## 2.type 和 interface 区别

> 能用 interface 就使用 interface，否则使用 type

- 相同点

  - 都可以描述对象或者函数

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

  - 都允许扩展
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
      name: string,
    };
    type User = Name & { age: number };
    ```
    ```js
    type Name = {
      name: string,
    };
    interface User extends Name {
      age: number;
    }
    ```
    ```js
    interface Name {
      name: string;
    }
    type User = Name & {
      age: number,
    };
    ```

- 不同点

  - `type` 可以声明基本类型别名，联合类型，元组等类型

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

  - type 语句中还可以使用 typeof 获取实例的 类型进行赋值

  ```js
  // 当你想获取一个变量的类型时，使用 typeof
  let div = document.createElement("div");
  type B = typeof div;
  ```

  - interface 可以声明合并

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

- 类型声明空间

```js
class Foo {}
interface Bar {}
type Bas = {};

// 类型注解
let foo: Foo;
let bar: Bar;
let bas: Bas;
```

- 变量声明空间

```js
class Foo {}
const someVar = Foo;
const someOtherVar = 123;
```

## 4.模块

- 全局模块

```js
// foo.ts
const foo = 123;

// bar.ts
// foo是全局变量
const bar = foo; // allowed
```

- 文件模块
  > 使用 import 或者 export 会在这个文件中创建一个本地作用域

```js
// foo.ts
export const foo = 123;

// bar.ts
import { foo } from "./foo";
const bar = foo; // allow
```

- 文件模块详情
  - `AMD`, 只能在浏览器中工作
  - `SystemJS`, 已经被 ES 模块代替
  - `ES`, 浏览器还没准备好，一般需要编译
  - `commonjs`，一般使用它
- 使用`export`关键字导出一个变量（或者类型）

```js
// foo.ts
export const someVar = 123;
export type someType = {
  foo: string,
};
```

## 5.命名空间

1. js 中的命名空间

```js
// 确保something不泄漏到全局中
(function (something) {
  something.foo = 123;
})(something || (something = {}));

console.log(something); // { foo: 123 }

(function (something) {
  something.bar = 456;
})(something || (something = {}));

console.log(something); // { foo: 123, bar: 456 }
```

2. ts 中的命名空间（命名空间支持嵌套）

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

- 动态导入

```js
import(/* webpackChunkName: "momentjs" */ "moment")
  .then((moment) => {
    // 懒加载的模块拥有所有的类型，并且能够按期工作
    // 类型检查会工作，代码引用也会工作 :100:
    const time = moment().format();
    console.log("TypeScript >= 2.4.0 Dynamic Import Expression:");
    console.log(time);
  })
  .catch((err) => {
    console.log("Failed to load moment", err);
  });
```

- 使用 "module": "esnext" 选项:TypeScript 为 Webpack Code Splitting 生成 import() 语句。

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
  first: string,
  second: string,
};
```

## 8.特殊类型

- `any`，ts 关闭类型检测
- `null`和`undefined`，可赋值给任意类型的变量

```js
let num: number;
let str: string;

// 这些类型能被赋予
num = null;
str = undefined;
```

- `void`，表示一个函数没有返回值

```js
function log(message: string): void {
  console.log(message);
}
```

## 9.泛型

- 约束传参与返回的参数一致

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
reversed[0] = "1"; // Error reversed = ['1', '2']; // Error
```

## 10.联合类型

```js
function formatCommandline(command: string[] | string) {
  let line = "";
  if (typeof command === "string") {
    line = command.trim();
  } else {
    line = command.join(" ").trim();
  }
  // Do stuff with line: string
}
```

## 11.交叉类型

- 从两个对象中创建一个新对象，新对象拥有着两个对象所有的功能

```ts
function extend<T extends object, U extends object>(
  first: T,
  second: U
): T & U {
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

const x = extend({ a: "hello" }, { b: 42 });

// 现在 x 拥有了 a 属性与 b 属性
const a = x.a;
const b = x.b;
```

## 12.元组

```ts
let nameNumber: [string, number];
nameNumber = ["Jenny", 322134];

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

## 16.导入额外的非 js 资源

```js
declare module '*.css';
declare module '*.html';
```

```js
import * as foo from "./some/file.css";
```

## 17. @types

- `@types`支持全局和模块类型定义

```js
import * as $ from "jquery";
```

- 控制全局

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

- `declare`告诉`typescript`，正在试图表述一个其他地方已经存在的代码
- 建议把声明放入 .d.ts 里(可以从一个命名 为 globals.d.ts 或者 vendor.d.ts 文件开始)

## 19.接口

- 接口可以轻松的将成员添加到`myPoint`的现有声明中

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

- `implements` 限制了类实例的结构

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

- 可以使用 new 调用某些内容

```js
interface Crazy {
  new(): {
    hello: number,
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

- `enum + namespace` 的声明的方式向枚举类型添加静态方法

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

1. 安装 TypeScript 时，会顺带安装`lib.d.ts`等声明文件，此文件包含了`JavaScript`运行时以及`DOM`中存在各种常见的环境声明
2. `lib.d.ts`的作用：
   - 它自动包含在 TypeScript 项目的编译上下文中
   - 它能让你快速开始书写经过类型检查的 JavaScript 代码
3. 通过指定 --noLib 的编译器命令行标志(或者在 tsconfig.json 中指定选项 noLib: true)从上下文中排除此文件

## 22.lib.d.ts 的使用示例

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

## 23.lib.d.ts 内部

1. lib.d.ts 的内容主要是一些变量声明(如:window、document、math)和一些类似的接口声明 (如: Window 、 Document 、 Math )。

```ts
declare var window: Window;

interface Window extends EventTarget, WindowTimers, WindowSessionStorage, WindowLocalStorage, WindowConsole, Glo animationStartTime: number;
    applicationCache: ApplicationCache;
    clientInformation: Navigator;
    closed: boolean;
    crypto: Crypto;
    // so on and so forth...
}
```

2. 创建`globals.d.ts`, 修改原始类型

```ts
interface Window {
  helloWorld(): void;
}

// Add it at runtime
window.helloWorld = () => console.log("hello world");
// Call it
window.helloWorld();
// 滥用会导致错误
window.helloWorld("gracius"); // Error: 提供的参数与目标不匹配
```

```ts
declare var Math: Math;

interface Math {
  E: number;
  LN10: number; // others ...
}

interface Math {
  seedrandom(seed?: string): void;
}

Math.seedrandom();
Math.seedrandom("Any string you want");
```

3. `day.js`在`Date`的全局变量以及`Date`实例上同时添加了成员

```ts
// DateJS 公开的静态方法
interface DateConstructor {
  /** Gets a date that is set to the current date. The time is set to the start of the day (00:00 or 12:00 AM) **/
  today(): Date;
  // ... so on and so forth
}

// DateJS 公开的实例方法
interface Date {
  /** Adds the specified number of milliseconds to this instance. */
  addMilliseconds(milliseconds: number): Date;
  // ... so on and so forth
}
```

```ts
// 用法
const today = Date.today();
const todayAfter1second = today.addMilliseconds(1000);
```

## 24.--lib 选项

- 使用 --lib 选项可以将任何 lib 与 --target 解偶
- 你可以通过命令行或者在 tsconfig.json 中提供此选项(推荐)

```ts
// 编译目标是 --target es5，环境库支持是es6
tsc --target es5 --lib dom,es6
```

```json
// config.json
"compilerOptions": {
      "lib": ["dom", "es6"]
}
```

- lib 分类
  - `JavaScript` 功能
    - es5
    - es6
    - es2015
    - es7
    - es2016
    - es2017
    - esnext
  - 运行环境
    - dom
    - dom.iterable
    - webworker
    - scripthost
  - `ESNext` 功能选项
    - es2015.core
    - es2015.collection
    - es2015.generator
    - es2015.iterable
    - es2015.promise
    - es2015.proxy
    - es2015.reflect
    - es2015.symbol
    - es2015.symbol.wellknown
    - es2016.array.include
    - es2017.object
    - es2017.sharedmemory
    - esnext.asynciterable
- 没有指定--lib，则会导入默认库
  - --target 选项为 es5 时，会导入 es5, dom, scripthost。
  - --target 选项为 es6 时，会导入 es6, dom, dom.iterable, scripthost。
  - 个人推荐
  ```ts
  "compilerOptions": {
      "target": "es5",
      "lib": ["es6", "dom"]
  }
  ```
  - 使用 Symbol 的 ES5 使用例子
  ```ts
  "compilerOptions": {
      "target": "es5",
      "lib": ["es5", "dom", "scripthost", "es2015.symbol"]
  }
  ```

## 25.在旧的 JavaScript 引擎时使用 Polyfill

- 安装`core-js`，在项目中使用它

```js
import "core-js";
```

## 26.可调用

```ts
// 表示一个可被调用的类型注解
interface ReturnString {
  (): string;
}
```

- 多种调用签名，用以特殊的函数重载

```ts
interface Overloaded {
  (foo: string): string;
  (foo: number): number;
}
```

## 27.可实例化

- 使用 new 做为前缀。它意味着你需用使用 new 关键字去调用它

```ts
interface CallMeWithNewToGetString {
  new (): string;
}
// 使用
declare const Foo: CallMeWithNewToGetString;
const bar = new Foo(); // bar 被推断为 string 类型
```

## 28.类型断言

- 类型断言被认为是有害的

```ts
const foo = {};
foo.bar = 123; // Error: 'bar' 属性不存在于 ‘{}’
foo.bas = "hello"; // Error: 'bas' 属性不存在于 '{}'
```

```ts
interface Foo {
  bar: number;
  bas: string;
}
const foo = {} as Foo;
foo.bar = 123;
foo.bas = "hello";
```

## 29.双重断言

- 使用类型断言来提供代码的提示

```ts
function handler(event: Event) {
  const mouseEvent = event as MouseEvent;
}
```

```ts
function handler(event: Event) {
  const element = event as HTMLElement; // Error: 'Event' 和 'HTMLElement' 中的任何一个都不能赋值给另外一个
}
```

```ts
function handler(event: Event) {
  const element = (event as any) as HTMLElement; // ok
}
```

## 30.类型保护

- `typeof`

```ts
function doSome(x: number | string) {
  if (typeof x === "string") {
    // 在这个块中，TypeScript 知道 `x` 的类型必须是 `string`
    console.log(x.subtr(1)); // Error: 'subtr' 方法并没有存在于 `string` 上
    console.log(x.substr(1)); // ok
  }
  x.substr(1); // Error: 无法保证 `x` 是 `string` 类型
}
```

- `instanceof`

```ts
class Foo {
  foo = 123;
}
class Bar {
  bar = 123;
}

function doStuff(arg: Foo | Bar) {
  if (arg instanceof Foo) {
    console.log(arg.foo); // ok
    console.log(arg.bar); // Error
  } else {
    // 这个块中，一定是 'Bar'
    console.log(arg.foo); // Error
    console.log(arg.bar); // ok
  }
}

doStuff(new Foo());
doStuff(new Bar());
```

- `in`

```ts
interface A {
  x: number;
}
interface B {
  y: string;
}

function doStuff(q: A | B) {
  if ("x" in q) {
    // q: A
  } else {
    // q: B
  }
}
```

## 31.字面量类型保护

```ts
type Foo = {
  kind: "foo"; // 字面量类型 foo: number;
};
type Bar = {
  kind: "bar"; // 字面量类型 bar: number;
};

function doStuff(arg: Foo | Bar) {
  if (arg.kind === "foo") {
    console.log(arg.foo); // ok
    console.log(arg.bar); // Error
  } else {
    // 一定是 Bar
    console.log(arg.foo); // Error
    console.log(arg.bar); // ok
  }
}
```

## 32.字符串字面量

- 使用字符串或者`boolean`或者`number`的字面量类型

```js
type CardinalDirection = "North" | "East" | "South" | "West";
function move(distance: number, direction: CardinalDirection) {
  // ...
}
move(1, "North"); // ok
move(1, "Nurth"); // Error

type OneToFive = 1 | 2 | 3 | 4 | 5;
type Bools = true | false;
```

- 推断

```js
function iTakeFoo(foo: "foo") {}
type Test = {
  someProp: "foo",
};
const test: Test = {
  // 推断 `someProp` 永远是 'foo'
  someProp: "foo",
};

iTakeFoo(test.someProp); // ok
```

## 33.readonly

```js
function foo(config: { readonly bar: number, readonly bas: number }) {
    // ..
}
const config = { bar: 123, bas: 123 };
foo(config);
// 现在你能够确保 'config' 不能够被改变了
```

```js
type Foo = {
    readonly bar: number;
    readonly bas: number;
};
// 初始化
const foo: Foo = { bar: 123, bas: 456 };
// 不能被改变
foo.bar = 456; // Error: foo.bar 为仅读属性
```

- 你也能指定一个类的属性为只读，然后在声明时或者构造函数中初始化它们

```ts
class Foo {
  readonly bar = 1; // OK
  readonly baz: string;
  constructor() {
    this.baz = "hello"; // OK
  }
}
```

## 34.readonly 映射类型

```js
type Foo = {
  bar: number,
  bas: number,
};
type FooReadonly = Readonly<Foo>;
const foo: Foo = { bar: 123, bas: 456 };
const fooReadonly: FooReadonly = { bar: 123, bas: 456 };
foo.bar = 456; // ok
fooReadonly.bar = 456; // Error: bar 属性只读
```

## 35.readonly 与 const 的区别

- const
  - 用于变量
  - 变量不能重新赋值给其他事物
- readonly
  _ 用于属性
  _ 用于别名，可以修改属性 \* readonly 能确保“我”不能修改属性，但是当你把这个属性交给其他并没有这种保证的使用者(允许出于类型兼容性的原因)，他 们能改变它

```ts
const foo: {
  readonly bar: number;
} = {
  bar: 123,
};
function iMutateFoo(foo: { bar: number }) {
  foo.bar = 456;
}
iMutateFoo(foo);
console.log(foo.bar); // 456
```

```ts
interface Foo {
  readonly bar: number;
}
let foo: Foo = {
  bar: 123,
};
function iTakeFoo(foo: Foo) {
  foo.bar = 456; // Error: bar 属性只读
}
iTakeFoo(foo);
```

## 36.泛型

- 提供有意义的约束
  - 类的实例方法
  - 类的方法
  - 函数参数
  - 函数返回值
- 简单的泛型使用
  ```js
  class Utility {
    reverse<T>(items: T[]): T[] {
      const toreturn = [];
      for (let i = items.length; i >= 0; i--) {
        toreturn.push(items[i]);
      }
      return toreturn;
    }
  }
  ```
- 用泛型封装请求

```ts
// 请求接口数据
export interface ResponseData<T = any> {
  /**
   * 状态码
   * @type { number } */
  code: number;

  /**
   * 数据
   * @type { T } */
  result: T;

  /**
   * 消息
   * @type { string } */
  message: string;
}
```

```ts
// 在 axios.ts 文件中对 axios 进行了处理，例如添加通用配置、拦截器等 import Ax from './axios';
import { ResponseData } from "./interface.ts";

export function getUser<T>() {
  return Ax.get<ResponseData<T>>("/somepath")
    .then((res) => res.data)
    .catch((err) => console.error(err));
}
```

```ts
interface User {
  name: string;
  age: number;
}

async function test() {
  // user 被推断出为
  // {
  //     code: number,
  //     result: { name: string, age: number },
  //     message: string
  // }
  const user = await getUser<User>();
}
```

## 37.类型推断

- TypeScript 能根据一些简单的规则推断(检查)变量的类型
- 定义变量
  ```ts
  let foo = 123; // foo 是 'number'
  let bar = "hello"; // bar 是 'string'
  foo = bar; // Error: 不能将 'string' 赋值给 `number`
  ```
- 函数返回类型（推断函数返回一个数字）
  ```ts
  function add(a: number, b: number) {
    return a + b;
  }
  ```
- 赋值（函数参数类型/返回值也能通过赋值来推断）
  ```ts
  type Adder = (a: number, b: number) => number;
  let foo: Adder = (a, b) => a + b;
  ```
  ```ts
  type Adder = (a: number, b: number) => number;
  let foo: Adder = (a, b) => {
    a = "hello"; // Error:不能把 'string' 类型赋值给 'number' 类型
    return a + b;
  };
  ```
- 结构化
  ```ts
  const foo = {
    a: 123,
    b: 456,
  };
  foo.a = "hello"; // Error:不能把 'string' 类型赋值给 'number' 类型
  ```
- 类型注解，函数参数也就能被推断(a，b 都能被推断为 number 类型)
  ```ts
  type TwoNumberFunction = (a: number, b: number) => void;
  const foo: TwoNumberFunction = (a, b) => {
    /* do something */
  };
  ```
- noImplicitAny
  - 选项 noImplicitAny 用来告诉编译器，当无法推断一个变量时发出一个错误(或者只能推断为一个隐式的 any 类型)
  - 通过显式添加 :any 的类型注解，来让它成为一个 any 类型;
  - 通过一些更正确的类型注解来帮助 TypeScript 推断类型。

## 38.Never

1. `never`类型是`typescript`的底层类型
2. `never`会自然被分配给下列场景
   1. 一个从来不会有返回值的函数
   2. 一个总是会抛出错误的函数（如：function foo() { throw new Error('Not Implemented') }，foo 的返回类型是 never）
3. `never`可以用作类型注解，但是`never`类型仅能被赋值给另外一个`never`

## 39.捕获键的名称

1. `keyof`操作符能捕获一个类型的键名称

```ts
const colors = {
    red: 'red',
    blue: 'blue'
}

typeof Colors = keyof typeof colors;
let color: Colors; // color 的类型是 'red' | 'blue'
color = 'red'; // ok
color = 'blue'; // ok
color = 'anythingElse'; // Error
```

## 40.异常处理

1. `js`有一个`Error`类，用于处理异常

```ts
try {
  throw new Error("Something bad happened");
} catch (e) {
  console.log(e);
}
```

2. 额外的内置错误子类型，继承自`Error`类
3. `RangeError`
   - 当数字类型变量或者参数超出其有效范围时，出现 `RangeError` 的错误提示
   ```ts
   // 使用过多参数调用 console
   // RangeError: 数组长度无效
   console.log.apply(console, new Array(1000000000));
   ```
4. `ReferenceError`
   - 当引用无效时，会出现 `ReferenceError` 的错误提示
   ```ts
   "use strict";
   console.log(notValidVar); // ReferenceError: notValidVar 未定义
   ```
5. `SyntaxError`
   - 当解析无效 `JavaScript` 代码时，会出现 `SyntaxError` 的错误提示
   ```ts
   1 *** 3 // SyntaxError: 无效的标记 *
   ```
6. `TypeError`
   - 变量或者参数不是有效类型时，会出现 TypeError 的错误提示
   ```ts
   "1.2".toPrecision(1); // TypeError: '1.2'.toPrecision 不是函数。
   ```
7. `URIError`
   - 当传入无效参数至 `encodeURI()` 和 `decodeURI()` 时，会出现 `URIError` 的错误提示
   ```ts
   decodeURI("%"); // URIError: URL 异常
   ```
8. 不不需需要要 `throw` 抛抛出出一一个个错错误, 使用 `Error` 对象的基本好处是，它能自动跟踪堆栈的属性构建以及生成位置

## 41.命名空间

1. 使用命名空间来进行分组管理

```ts
namespace Tools {
  const TIMEOUT = 100;

  export class Ftp {
    constructor() {
      setTimeout(() => {
        console.log("Ftp");
      }, TIMEOUT);
    }
  }

  export class Http {
    constructor() {
      console.log("Http");
    }
  }

  export function parseURL() {
    console.log("parseURL");
  }
}
```

```ts
Tools.TIMEOUT; // 报错, Tools上没有这个属性
Tools.parseURL(); // 'parseURL'
```

2. 引入写好的命名空间
   1. 通过 "/// <reference path='xxx.ts'/>" 导入
   2. 通过`import`导入
      ```ts
      namespace Food {
        export interface Fruits {
          taste: string;
          hardness: number;
        }
      }
      ```
      ```ts
      // yyy.ts
      import { Food } from "./xxx"; // 使用import导入
      let meat: Food.Meat;
      let fruits: Food.Fruits;
      ```

## 42.HTML 标签

1. 一个`HTML`标签 foo 被标记为 JSX.IntrinsicElements.foo 类型
2. 已经安装的 react-jsx.d.ts 中定义了所有主要的标签类型

```ts
declare namespace JSX {
  interface IntrinsicElements {
    a: React.HTMLAttributes;
    abbr: React.HTMLAttributes;
    div: React.HTMLAttributes;
    span: React.HTMLAttributes;
    // 其他
  }
}
```

## 43.函数式组件

```ts
type Props = {
  foo: string;
};

const myComponent: React.FunctionComponent<Props> = (props) => {
  return <span>{props.foo}</span>;
};

<MyComponent foo="bar" />;
```

## 43.类组件

```ts
type Props = {
  foo: string;
};

class MyComponent extends React.Component<Props, {}> {
  render() {
    return <span>{this.props.foo}</span>;
  }
}
<MyComponent foo="bar" />;
```

## 44.接收组件实例

```ts
class MyAwesomeComponent extends React.Component {
  render() {
    return <div>Hello</div>;
  }
}
const foo: React.ReactElement<MyAwesomeComponent> = <MyAwesomeComponent />; // Okay
const bar: React.ReactElement<MyAwesomeComponent> = <NotMyAwesomeComponent />; // Error!
```

## 45.React jsx

1. 类型 `React.Component<Props>` 是 `React.ComponentClass<P>` 与 `React.StatelessComponent<P>` 的组合

```js
const X: React.Component<Props> = foo; // from somewhere
// Render X with some props:
<X {...props} />;
```

2. React JSX Tip: 可可渲渲染染的的接接口口

```js
type Props = { header: React.ReactNode, body: React.ReactNode };
class MyComonent extends React.Component<Props, {}> {
  render() {
    return (
      <div>
        {" "}
        {this.props.header} {this.props.body}{" "}
      </div>
    );
  }
}
<MyComponent foo="bar" />;
```

3. 泛型组件

```ts
// 一个泛型组件
type SelectProps<T> = { items: T[] };
class Select<T> extends React.Component<SelectProps<T>, any> {}
// 使用
const Form = () => <Select<string> items={["a", "b"]} />;
```

4. 泛型函数

```ts
function foo<T>(x: T): T {
  return x;
}
```

```ts
// 箭头函数
const foo = <T>(x: T) => T; // Error: T 标签没有关闭
const foo = <T extends {}>(x: T) => x; // correct
```

5. 默认`props`

```ts
class Hello extends React.Component<{
    /*** @default 'TypeScript' */
    compiler?: string; 
    framework: string; 
}> {
    static defaultProps = {
        compiler: 'TypeScript'
    };
    
    render() { 
        const compiler = this.props.compiler!; 
        return ( 
            <div> 
                <div>{compiler}</div> 
                <div>{this.props.framework}</div> 
            </div> 
        );
    }
}
```
## 46.Ts中尽量不要使用export default
1. `export default`可发现性差，不能被编辑器智能的识别
2. `commonjs`互用性差
    ```ts
    // 导出的是export default
    const { default } = require('module/foo');
    // export const
    const { Foo } = require('module/foo')
    ```
3. 在动态的`import`中，默认导出会以`default`的名字暴露自己
    ```ts
    const HighChart = await import('https://code.highcharts.com/js/es-modules/masters/highcharts.src.js'); 
    Highcharts.default.chart('container', { ... }); // Notice `.default`
    ```
## 47.创建数组  
```ts
const foo: string[] = new Array(3).fill('');
console.log(foo); // 会输出 ['','','']
```
## 48.单例模式
```ts
// 传统的单例模式
class Singleton {
    private static instance: Singleton; 
    private constructor() {
        // .. 
    }
    public static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }
    someMethod() {} 
}

// Error: constructor of 'singleton' is private
let someThing = new Singleton();
// do some thing with the instance
let instacne = Singleton.getInstance();
```
```ts
// 直接初始化
namespace Singleton {
    // .. 其他初始化的代码 
    export function someMethod() {} 
}
// 使用 
Singleton.someMethod();
```
## 49.函数参数使用对象
```ts
function foo(flagA: boolean, flagB: boolean) {
    // 函数主体 
}

function foo(
    config: {
        flagA: boolean;
        flagB: boolean;
    }
) {
    const { flagA, flagB } = config;
}
```
## 50.使用!!获取明确的布尔值
* 第一个!用来将其转换成布尔值，但是其取反后的值
* 第二个取反得到真正的值
## 51. 