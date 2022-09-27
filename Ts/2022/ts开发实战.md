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
