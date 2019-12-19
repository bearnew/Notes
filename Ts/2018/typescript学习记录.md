## TypeScript

> https://jkchao.github.io/typescript-book-chinese/#why

### 1.typescript

javascript 的超集，遵循 ES6

### 2.typescript 优势

- 遵循 ES6 规范
- 强大的 IDE 支持
  - 提示能用的变量，方法，类
  - 方便重构，修改变量/类/方法，IDE 自动修改所有引用的地方

### 3.typescript 基础类型

1. 布尔值

```js
let isDone: boolean = false;
```

2. 数字

```js
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
```

3. 字符串

```js
let name: string = "bob";
name = "smith";
```

4. 数组

```js
let list: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3];
```

5. 元组 Tuple

```js
let x: [string, number];
x = ["hello", 10]; // OK
```

6. 枚举

```js
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
```

7. Any

```js
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```

8. void
   函数无返回值，其返回值类型 void

```js
function warnUser(): void {
  console.log("This is my warning message");
}
```

void 类型的变量只能用于赋予 undefined 和 null

```js
let unusable: void = undefined;
```

9. Null 和 Undefined

```js
// Not much else we can assign to these variables!
let u: undefined = undefined;
let n: null = null;
```

10. Never
    never 类型表示的是那些永不存在的值的类型

```js
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
  return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
  while (true) {}
}
```

11. Object
    除 number，string，boolean，symbol，null 或 undefined 之外的类型。

```js
declare function create(o: object | null): void;
```

12. 类型断言

- 尖括号语法

```js
let someValue: any = 'this is a string';
let strLength: number = (<string>someValue).length;
```

- as 语法（jsx 中，只有 as 语法断言被允许）

```js
let someValue: any = 'this is a string';
let strLength: number = (someValue as string).length;
```

### 4.typescript 接口

1. 可选属性

```js
interface SquareConfig {
  color?: string;
  width?: number;
}
```

2. 只读属性

```js
interface Point {
    readonly x: number;
    readonly y: number;
}

let p1: Point = { x: 10, y: 20 };
p1.x = 5; // error!
```

3. 函数类型

```js
interface SearchFunc {
  (source: string, subString: string): boolean;
}
```
