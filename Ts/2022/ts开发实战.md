# ts 开发实战

## 1.类型

1. TS 的作用
    - 类型检查
    - 语言扩展(支持最新的语法)
    - 工具属性(编译成标准的 js)
2. 语言象限
    - 强类型+动态类型：`Python`
    - 弱类型+动态类型：`Javascript` `PHP`
    - 强类型+静态类型：`Java` `C#`
    - 弱类型+静态类型： `C` `C++`
3. 使用`tsc --init`生成`tsconfig`文件

## 2.类与接口

1. implements

-   类实现接口，必须实现接口中的所有属性
-   接口只能约束类的公有成员
-   接口可实现接口
-   ![implements_extends](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/ts%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/implements_extends.PNG?raw=true)

```js
interface Human {
    name: string;
    eat(): void;
}

class Asian implements Human {
    name: string;
    eat() {}
    sleep() {}
}

interface Man extends Human {
    run(): void;
}

interface Child {
    cry(): void;
}

// 接口可继承接口
interface Boy extends Man, Child {}

let boy: Boy = {
    name: "",
    run() {},
    eat() {},
    cry() {},
};

// 接口可继承类，不能包含私有成员
class Auto {
    state = 1;
    private state2 = 0;
}

interface AutoInterface extends Auto {}

class C implements AutoInterface {
    state = 1;
}

class Bus extends Auto implements AutoInterface {

}
```

## 3.泛型

1. 泛型：不预先确定的数据类型，具体类型在使用的时候确定

```js
type Log = <T>(value: T) => T;
let myLog: Log = log;

interface Log2 {
    <T>(value: T): T;
}

interface Log3<T = string> {
    (value: T): T;
}
let myLog3: Log3<number> = (value) => {};
```

2. 泛型继承

```js
interface Length {
    length: number;
}

// 必须传入带有length属性的值
function log<T extends Length>(value: T): T {
    return value.length;
}

log([1]);
log('123');
log({ length: 1 });
```

3. 泛型的优点
    - 函数和类轻松的支持多种类型，增强程序扩展性
    - 不必写多余函数重载，冗长的联合类型声明，增强代码可读性
    - 灵活控制类型之间的约束

## 4.deprecate

1. `depracate`废弃属性
2. `depracate`废弃方法

```js
interface TestOptions {
    (stock: string): void;

    /** @deprecated
     * Use string instead
     * */
    (stock: number): void;
}

const deprecatedTest: TestOptions = (options: number | string) => {};
deprecatedTest(1); // 会被下划线掉
deprecatedTest("1");
```

## 5.类型检查

1. 类型检查机制
    - 类型推断
    - 类型兼容性
    - 类型保护
2. 类型推断
    - 基础类型推断
    - 最佳通用类型推断
    - 上下文类型推断
3. 使用类型断言

```ts
interface Foo {
    bar: number;
}
let foo = {} as Foo;
foo.bar = 1;
```

4. 函数类型兼容

-   结构之间兼容，成员少的兼容成员多的，
-   函数之间兼容，参数多的兼容参数少的，参数变多会报错
-   目标函数的参数个数多余调用 函数参数个数

```js
type Handler = (a: number; b: number) => void;
function hof(handler: Handler) {
    return handler;
}

let handler1 = (a: number) => {};
hof(handler1); // correct

let handler2 = (a: number; b: number; c: number) => {};
hof(handler2); // error
```

-   可选参数不兼容固定参数和剩余参数

```js
// tsconfig.json中的strictFunctionTypes为true，为false则可选参数兼容固定参数和剩余参数
// 可选参数和剩余参数
let a = (p1: number; p2: number) => {};
let b = (p1?: number; p2?: number) => {};
let c = (...args: number[]) => {};

a = b; // correct
a = c; // correct
b = c; // error
b = a; // error

```

-   参数多的能兼容参数少的

```js
// tsconfig.json strictFunctionTypes
interface Point3D {
    x: number;
    y: number;
    z: number;
}
interface Point2D {
    x: number;
    y: number;
}
let p3d = (point: Point3D) => {};
let p2d = (point: Point2D) => {};
p3d = p2d; // correct
p2d = p3d; // error
```

-   返回值类型必须与目标函数相同，或者为其子类型

```js
let f = () => ({ name: "Alice" });
let g = () => ({ name: "Alice", location: "Beijing" });
f = g; // correct
g = f; // error
```

-   重载目标函数的参数需要多余原函数的参数

```ts
function overload(a: number, b: number): number;
function overload(a: string, b: string): string; // correct
function overload(a: any, b: any, c: any): any; // error
```

-   枚举和 number 相互兼容，枚举之间不兼容

```js
enum Fruit { Apple, Banana };
enum Color { Red, Yellow };
let fruit: Fruit.Apple = 3; // correct
let no: number = Fruit.Apple; // correct
let color: Color.Red = Fruit.Apople; // error
```

-   类兼容，静态成员和构造函数不参与比较

```js
class A {
    constructor(p: number, q: number) {}
    id: number = 1;
}
class B {
    static s = 1;
    constructor(p: number) {}
    id: number = 2;
}
let aa = new A(1, 2);
let bb = new B(1);
aa = bb; // correct，如果A和B有私有成员，则为error
bb = aa; // correct，如果A和B有私有成员，则为error

class C extends A {}
let cc = new C(1, 2);
cc = aa; // correct，A有私有成员，也兼容
```

-   泛型兼容

```js
interface Empty<T> {}
let obj1: Empty<number> = {};
let obj2: Empty<string> = {};
obj1 = obj2; // correct

interface Empty<T> {
    value: T;
}
let obj1: Empty<number> = {}; // error
let obj2: Empty<string> = {}; // error
obj1 = obj2; // error
```

-   类型保护

```js
enum Type { Strong, Week };

class Java {
    helloJava() {
        console.log('Hello Java');
    },
    java: any;
}

class JavaScript {
    helloJavaScript() {
        console.log('Hello JavaScript');
    },
    javascript: any;
}

function getLanguage(type: Type, x: string | number) {
    let lang = type === Type.Strong ? new Java() : new Javascript();

    // 使用instanceOf
    if (lang instanceof Java) {
        lang.helloJava();
    } else {
        lang.helloJavaScript();
    }

    // in
    if ('java' in lang) {
        lang.hellowJava();
    } else {
        lang.helloJavaScript();
    }

    // typeof
    if (typeof x === 'string') {
        x.length;
    } else {
        x.toFixed(2);
    }

    // 类型保护函数
    function isJava(lang: Java | JavaScript): lang is Java {
        return (lang as Java).helloJava !== undefined;
    }

    if (isJava(lang)) {
        lang.helloJava();
    } else {
        lang.helloJavaScript();
    }

    return lang;
}


```

## 6.交叉类型和联合类型

```js
interface DogInterface {
    run(): void;
}
interface CatInterface {
    jump(): void;
}

// 交叉类型
let pet: DogInterface & CatInterface = {
    run() {},
    jump() {},
};

// 联合类型
let a: number | string = "a";
let b: "a" | "b" | "c";
let c: 1 | 2 | 3;

// 可区分的联合类型
interface Square {
    kind: "square";
    size: number;
}

interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}

interface Circle {
    kind: "circle";
    r: number;
}

type Shape = Square | Rectangle | Circle;
function area(s: Shape): number {
    // 利用共用属性，创建类型保护区块
    switch (s.kind) {
        case "square":
            return s.size * s.size;
        case "rectangle":
            return s.height * s.width;
        default:
            // never表示永远不会走到，此处缺少circle，会报错
            return ((e: never) => throw new Error(e))(s);
    }
}
```

## 7.索引类型

```ts
// keyof T
interface Obj {
    a: number;
    b: string;
}

function getValues<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
    return keys.map((key) => obj[key]);
}

getValues(obj, ["a", "b"]);
```

## 8.映射类型

```ts
interface Obj {
    a: string;
    b?: number;
}

// type Readonly<T> = {
//     readonly [P in keyof T]: T[P];
// }
type ReadonlyObj = Readonly<Obj>;

// type Partial<T> = {
//     [P in keyof T]?: T[P];
// }
type PartialObj = Partial<Obj>;

// type Required<T> = {
//     [P in keyof T]-?: T[P];
// }
type RequiredObj = Required<Obj>; // 可选变成必填，b变成必填

// type Pick<T, K extends keyof T> = {
//     [P in K]: T[P];
// }
type PickObj = Pick<Obj, "a">;

type RecordObj = Record<"x" | "y", Obj>;
```

## 9.条件类型

```ts
// T extends U ? X : Y
type TypeName<T> = T extends string ? "string" : "object";

type T1 = TypeName<string>;
type T2 = TypeName<string[]>;
type T3 = TypeName<string | string[]>;

// 从类型T中过滤掉可以继承类型U的类型
// Exclude<T, U>
type Diff<T, U> = T extends U ? never : T;

// nerver | "b" | "c"
// "b" | "c"
type T4 = Diff<"a" | "b" | "c", "a" | "e">;

// 过滤掉非空(非undefined 非null)属性
// NonNullable<T>
type NotNull<T> = Diff<T, undefined | null>;
type TS = NotNull<string | number | undefined | null>;

// Extract<T, U> 抽取T中可以继承类型U的类型
// 'a'
type T6 = Extract<"a" | "b" | "c", "a" | "e">;

// ReturnType<T>
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

type T7 = ReturnType<{} => string> // string

function getInt(a: string) {
    return parseInt(a);
}
type T8 = ReturnType<typeof getInt>; // number
```

## 10.命名空间

```ts
// a.ts
namespace Shape {
    const pi = Math.PI;
    export function circle(r: number) {
        return pi * r ** 2;
    }
}
```

```ts
// b.ts
/// <reference path="a.ts" />
namespace Shape {
    export function square(x: number) {
        return x * x;
    }
}

console.log(Shape.circle(1));
console.log(Shape.square(1));
```

## 11.声明合并

```ts
interface A {
    x: number;
    // y: string; // ts error
    foo(bar: number): number; // 优先级-4
}
interface A {
    y: number;
    foo(bar: string): string; // 优先级-2
    foo(bar: number[]): number[]; // 优先级-3
    foo(bar: "b"): number; // 优先级-1
}

// a必须具备x和y
let a: A = {
    x: 1,
    y: 1,
};
```

## 12.声明文件

> https://juejin.cn/post/6844904034621456398

1. 安装`@types/lodash`声明文件包
2. 全局类库声明文件

```ts
declare function globalLib(options: globalLib.Options): void;

declare namespace globalLib {
    const version: string;
    function doSomething(): void;
    interface Options {
        [key: string]: any;
    }
}
```

3. 模块声明文件

```ts
interface Options {
    [key: string]: any;
}

declare function moduleLib(options: Options): void;

declare namespace moduleLib {
    const version: string;
    function doSomething(): void;
}

export = moduleLib;
```

## 13.tsconfig 配置

1. 文件相关选项

```json
{
    "files": [
        "src/a.ts" // 编译器需要编译的单个文件的列表
    ],
    "include": [
        "src", // 编译器编译src目录下的所有文件
        "src1/*", // 只会编译src1一级目录的文件
        "src2/*/*" // 只会编译src2二级目录的文件
    ],
    "exclude": [
        "src/lib" // 排除src/lib文件
    ],
    "extends": "./tsconfig.base", // 继承基础配置
    "exclude": [], // 覆盖extends继承的文件
    "compileOnSave": true // 保存文件时自动编译，VSCode不支持，Atom支持
}
```

2. 编译相关的选项

```json
{
    "compilerOptions": {
        "incremental": true, // 增量编译，用于提速
        "tsBuildInfoFile": "./buildFile", // 增量编译文件的存储位置
        "diagnostics": true, // 打印编译诊断信息

        "target": "es5", // 目标语言版本
        "module": "commonjs", // 要生成的代码模块标准
        "outFile": "./app.js", // 将多个相互依赖的文件生成一个文件，可以用在AMD模块中

        "lib": [], // TS需要引用的库，及声明文件，es5默认 "dom" "es5" "scripthost"(activeX控件等)

        "allowJs": true, // 允许编译JS文件（js jsx）
        "checkJs": true, // 允许在JS文件中报错，通常和allowJs一起使用
        "outDir": "./out", // 指定输出目录
        "rootDir": "./", // 指定输入文件目录，默认为当前目录

        "declaration": true, // 生成声明文件
        "declarationDir": "./a", // 声明文件的路径
        "emitDeclarationOnly": true, // 只生成声明文件，没有生成js文件
        "sourceMap": true, // 生成目标文件的 sourceMap
        "inlineSourceMap": true, // 生成目标文件的inline sourceMap的格式
        "declarationMap": true, // 生成声明文件的sourceMap
        "typeRoots": [], // 声明文件目录，默认node_modules/@types，会从这里取加载types
        "types": [], // 声明文件包，需要加载的声明文件的包

        "removeComments": true, // 清除注释

        "noEmit": true, // 不输出文件
        "noEmitOnError": true, // 发生错误时不输出文件

        "noEmitHelpers": true, // 不生成helper函数，需额外安装ts-helpers
        "importHelpers": true, // 通过tslib引入helper函数，文件必须是模块(文件必须有export导出, 文件会自动去引用tslib文件)

        "downlevelIteration": true, // 降级遍历器的实现(es3/5)

        "strict": true, // 开启所有严格的类型检查，以下类型都会为true
        /**-----------------strict: true-----------------------*/
        "alwaysStrict": true, // 在代码中注入"use strict";
        "noImplicitAny": true, // 不允许隐式的any类型
        "strictNullChecks": true, // 不允许把null undefined赋值给其他类型变量
        "strictFunctionTypes": true, // 不允许函数参数双向协变
        "strictPropertyInitialization": true, // 类的实例属性必须初始化
        "strictBindCallApply": true, // 严格的bind/call/apply检查
        "noImplicitThis": false, // 不允许this有隐式的any类型
        /**-----------------strict: true-----------------------*/

        "noUnusedLocals": true, // 检查只声明，未使用的局部变量
        "noUnusedParameters": true, // 检查未使用的函数参数
        "noFallthroughCasesInSwitch": true, // 防止switch语句贯穿（分支没有break语句的情况）
        "noImplicitReturns": true, // 每个分支都要有返回值

        "esModuleInterop": true, // 允许export = 导出，由import from 导入
        "allowUmdGlobalAccess": true, // 允许在模块中访问UMD全局变量
        // "moduleResolution": "classic", // 模块解析策略（AMD System ES2015）
        "moduleResolution": "node", // 模块解析策略(默认, 能解析的文件更多)
        "baseUrl": "./", // 解析非相对模块的地址
        "paths": {
            // 路径映射，相当于 baseUrl
            "jquery": ["node_modules/jquery/dist/jquery.slim.min.js"]
        },
        "rootDirs": ["src", "out"], // 将多个目录放在一个虚拟目录下，用于运行时不报错
        "listEmittedFiles": true, // 终端打印输出的文件
        "listFiles": true // 终端打印编译的文件（包括引用的声明文件）
    }
}
```

3. 工程引用（将大项目拆成小项目）

```json
{
    "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "strict": true,
        "composite": true, // 允许项目被引用
        "declaration": true
    }
}
```

```json
{
    "extends": "../../tsconfig.json",
    "compilerOptions": {
        "outDir": "../../dist/server"
    },
    "references": [
        { "path": "../common" } // 依赖common工程
    ]
}
```

## 13.从ts-loader到babel
1. `ts-loader`
```js
{
    loader: 'ts-loader',
    options: {
        transpileOnly: true // 只做代码编译，不做类型检查
    }
}
```
2. `fork-ts-checker-webpack-plugin`
- 在独立的进程进行类型检查
3. `awesome-typescript-loader`
- 更适合`Babel`记成，使用`Babel`的转义和缓存
- 不需要安装额外的插件，就可以把类型检查放在独立进程中进行
- 但是`ts-loader`编译时间更短
4. `babel`编译
- 设置`tsconfig.json`为`noEmit: true`，不输出文件
- 检测脚本
```js
{
    "script": {
        "type-check": "tsc --watch"
    }
}
```
- `babel`无法编译的语法（添加`@babel/preset-typescript`可编译）
    - `namespace`
    - `as`
    - `enum`
    - `export = s`(默认导出)
