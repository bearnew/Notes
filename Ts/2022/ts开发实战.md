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
