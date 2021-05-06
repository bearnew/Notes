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

4.
