# typescript 实战技巧

1. 使用`partial`获取类型中的部分属性

```ts
interface Options {
  a: number;
  b: number;
}

// interface partOptions {
//   a?: number;
//   b?: number;
// }
type partOptions = Partial<Options>;
```

2. 获取对象中的`key`值作枚举

```ts
const btnMap = {
  orange: "orange_pic.png",
  green: "green_pic.png",
};

// type btnType = 'orange' | 'green';
type btnType = keyof typeof btnMap;
```

3. 用`ReturnType`获取函数的返回值类型

```ts
function fn(a: number, b: number): number {
  return a + b;
}

let x: ReturnType<typeof fn> = 0;
x = fn(1, 2);
```

4. 字面量类型

```ts
// n1 n2为联合类型
// type为字面量类型
function add(
  n1: number | string,
  n2: number | string,
  type: "number" | "string"
) {
  if (type === "string") {
    return String(n1) + String(n2);
  } else {
    return Number(n1) + Number(n2);
  }
}
```

5. `unknow` 的使用

```ts
function test(x: unknow) {
  if (typeof x === "function") {
    x();
  }
  if (typeof x === "string") {
    x.toUpperCase();
  }
}
```

6. `void`,`undefined`,`never`

```ts
// 默认是void
function test1() {
  console.log("test1");
}

// 函数返回类型undefined，则必须return
function test2(): undefined {
  console.log("test2");
  return;
}

// never表示函数永远执行不完成
function throwError(message: string, errorCode: number): never {
  throw { message, errorCode };
}
throwError("not found", 404);

function whileLoop(): never {
  while (true) {
    console.log("continue");
  }
}
```

7. 类型适配

```ts
let message: any;
message = "abc";

let x = (<string>message).endsWith("c");
let y = (message as string).endsWith("c");
```

8. class 类

```ts
interface IPoint {
  x: number;
  y: number;
  drawPoint: () => void;
  getDistances: (p: IPoint) => number;
}

class Point implements IPoint {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  drawPoint = () => {
    console.log(`x:${this.x},y:${this.y}`);
  };

  getDistances = (p: IPoint) => {
    return Math.pow(p.x - this.x, 2) + Math.pow(p.y - this.y, 2);
  };
}
```
