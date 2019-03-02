## TypeScript
### 1.typescript
javascript的超集，遵循ES6
### 2.typescript优势
* 遵循ES6规范
* 强大的IDE支持
    * 提示能用的变量，方法，类
    * 方便重构，修改变量/类/方法，IDE自动修改所有引用的地方
### 3.typescript基础类型
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
5. 元组Tuple
```js
let x: [string, number];
x = ['hello', 10]; // OK
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