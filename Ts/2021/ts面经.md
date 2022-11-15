## TS 面经

1. TS 的访问修饰符
    - `public`: 任何地方
    - `private`: 只能在类的内部访问
    - `protected`: 能在类的内部访问和子类中访问
    - `readonly`: 属性设置为只读
2. `const`和`readonly`的区别
    - `const`用于变量，`readonly`用于属性
    - `const`在运行时检查，`readonly`在编译时检查
    - 使用`const`保存的数组，可以使用`push`，`pop`等方法，使用`ReadonlyArray<number>`声明的数组不能使用`push`和`pop`
3. 枚举和常量枚举(`const`枚举)的区别
    - 枚举会被编译时编译成一个对象，可以被当作对象使用
    - `const`枚举会在`ts`编译期间被删除，避免额外的性能开销
    ```ts
    // 普通枚举
    enum Witcher {
        Ciri = "Queen",
        Geralt = "Geralt of Rivia",
    }
    function getGeraltMessage(arg: { [key: string]: string }): string {
        return arg.Geralt;
    }
    getGeraltMessage(Witcher); // Geralt of Rivia
    ```
    ```ts
    // const枚举
    const enum Witcher {
        Ciri = "Queen",
        Geralt = "Geralt of Rivia",
    }
    const witchers: Witcher[] = [Witcher.Ciri, Witcher.Geralt];
    // 编译后
    // const witchers = ['Queen', 'Geralt of Rivia'
    ```
4. `interface`给`Function`/`Array`/`Class`做声明

    ```ts
    // 函数类型
    interface SearchFunc {
        (source: string, subString: string): boolean;
    }
    let mySearch: SearchFunc;
    mySearch = function (source: string, subString: string) {
        let result = source.search(subString);
        return result > -1;
    };
    ```

    ```ts
    // Array
    interface StringArray {
        [index: number]: string;
    }

    let myArray: StringArray;
    myArray = ["Bob", "Fred"];
    ```

    ```ts
    // Class, constructor存在于类的静态部分，所以不会检查
    interface ClockInterface {
        currentTime: Date;
        setTime(d: Date);
    }

    class Clock implements ClockInterface {
        currentTime: Date;
        setTime(d: Date) {
            this.currentTime = d;
        }
        constructor(h: number, m: number) {}
    }
    ```

5. ts 中枚举联合类型的 key

    ```ts
    type Name = { name: string };
    type Age = { age: number };
    type Union = Name | Age;

    type UnionKey<P> = P extends infer P ? keyof P : never;

    type T = UnionKey<Union>;
    ```

6. ts 中 `?.、??、!.、\_、\*\*` 等符号的含义？

    - `?.` 可选链
    - `??` 类似与短路或，`??`避免了一些意外情况 `0`，`NaN` 以及`""`,`false` 被视为 `false` 值。只有 `undefind`,`null` 被视为 `false` 值。
    - `!` 在变量名后添加`!`，可以断言排除`undefined`和`null`类型
    - `_`, 声明该函数将被传递一个参数，但您并不关心它
    - `**` 求幂
    - `!:`，待会分配这个变量，ts 不要担心

    ```ts
    // ??
    let x = foo ?? bar();
    // 等价于
    let x = foo !== null && foo !== undefined ? foo : bar();

    // !.
    let a: string | null | undefined;
    a.length; // error
    a!.length; // ok
    ```

7. 什么是抗变、双变、协变和逆变？
    - `Covariant` 协变，TS 对象兼容性是协变，父类 <= 子类，是可以的。子类 <= 父类，错误。
    - `contravariant` 逆变，禁用 `strictFunctionTypes` 编译，函数参数类型是逆变的，父类 <= 子类，是错误。子类 <= 父类，是可以的。
    - `Bivariant` 双向协变，函数参数的类型默认是双向协变的。父类 <= 子类，是可以的。子类 <= 父类，是可以的。
8. ts 中同名的 interface 或者同名的 interface 和 class 可以合并吗？
    - `interface` 会合并
    - `class` 不可以合并
9. 如何使 ts 项目引入并识别编译为 js 的 npm 库包？
    - `npm install @types/xxxx`
    - 自己添加描述文件
10. ts 如何自动生成库包的声明文件？
    - 可以配置 `tsconfig.json` 文件中的 `declaration` 和 `outDir`
    - `declaration: true`, 将会自动生成声明文件
    - `outDir: ''`, 指定目录
11. 泛型
    - 泛型就是把类型当成参数
12. `const`断言
    ```ts
    // type '"hello"'
    let x = "hello" as const;
    // type 'readonly [10, 20]'
    let y = [10, 20] as const;
    // type '{ readonly text: "hello" }'
    let z = { text: "hello" } as const;
    ```
13. `type` 和 `interface` 的区别
    - `type`可以为任何类型引入名称。例如基本类型，联合类型等
    - `type`不支持继承
    - `type`不会创建一个真正的名字
    - `type`无法被实现(implements)，而接口可以被派生类实现
    - `type`重名时编译器会抛出错误，接口重名时会产生合并
14. `implements` 与 `extends` 的区别
    - `extends`, 子类会继承父类的所有属性和方法。
    - `implements`，使用`implements`关键字的类将需要实现需要实现的类的所有属性和方法。
15. 枚举和 object 的区别
    - 枚举可以通过枚举的名称，获取枚举的值。也可以通过枚举的值获取枚举的名称。
    - `object` 只能通过 `key` 获取 `value`
    - 数字枚举在不指定初始值的情况下，枚举值会从 `0` 开始递增。
    - 虽然在运行时，枚举是一个真实存在的对象。但是使用 `keyof` 时的行为却和普通对象不一致。必须使用 `keyof typeof` 才可以获取枚举所有属性名。
16. never, void 的区别
    - `never`，`never`表示永远不存在的类型。比如一个函数总是抛出错误，而没有返回值。或者一个函数内部有死循环，永远不会有返回值。函数的返回值就是`never`类型。
    - `void`, 没有显示的返回值的函数返回值为`void`类型。如果一个变量为`void`类型，只能赋予`undefined`或者`null`。
17. `unknown`, `any` 的区别
    - `unknown`类型和`any`类型类似。与`any`类型不同的是。`unknown`类型可以接受任意类型赋值，但是`unknown`类型赋值给其他类型前，必须被断言
    - `any`会放弃类型检查
    - `unknown`类型的变量只能赋值给`any`或者`unknown`
    - `unknow`配合类型收缩使用
    ```js
    let uncertain: any = 'Hello world'!;
    uncertain = 5;
    uncertain = { hello: () => 'Hello world!' };

    // any不会做任何类型检测
    const uncertain1: any = 'Hello world!';
    uncertain1.hello();


    let uncertain2: unknown = 'Hello'!;
    uncertain2 = 12;
    uncertain2 = { hello: () => 'Hello!' };

    // 只能将unknown类型变量赋值给unknown和any
    let notSure: unknown = uncertain2;
    let notSure2: any = uncertain;


    function getDog() {
        return '22'
    }

    // unknown会进行类型推断
    const dog: unknown = getDog();
    dog.hello(); // Object is of type 'unknown'

    const dog1: any = getDog();
    dog1.hello();


    const getDogName = () => {
        let x: unknown;
        return x;
    };

    // 类型收缩-typeof
    const dogName = getDogName();
    if (typeof dogName === 'string') {
        console.log(dogName.toLowerCase());
    }

    // 类型收缩-instanceof
    class Dog {
        name: string
    };

    const getAnimal = () => {
        return {
            name: 'animal'
        }
    }

    const dog2 = getAnimal();
    
    if (dog instanceof Dog) {
        console.log(dog.name.toLowerCase());
    }
    ```
18. 在`window`中扩展类型
    ```ts
    declare global {
        interface Window {
            myCustomFn: () => void;
        }
    }
    ```
19. `implements`与`extends`的定位

-   `implements`: 实现，一个新的类，从父类或者接口实现所有的属性和方法，同时可以重写属性和方法，包含一些新的功能
-   `extends`: 继承，一个新的接口或者类，从父类或者接口继承所有的属性和方法，不可以重写属性，但可以重写方法

```js
// 接口不能实现接口或者类，所以实现只能用于类身上,即类可以实现接口或类
// 接口可以继承接口或类
// 类不可以继承接口，类只能继承类
// 可多继承或者多实现
interface IPerson {
    age: number;
    name: string;
}

interface IPeoPle extends IPerson {
    sex: string;
}

class User implements IPerson {
    age: number;
    name: string;
}
interface IRoles extends User {}
class Roles extends User {}
```
20. 使用ts严格模式，让ts更合理、安全、严谨
```ts
{
    "compilerOptions": {
        "strict": true
    }
}
```
21. `??`比`||`更加严格

-   `||`左边是空字符串、`false`、`0`
-   `??`必须左侧是`null`或者`undefined`
