## 1.类型保护
```js
export function isDate(val: any): val is Date {
    return Object.prototype.toString.call(val) === '[object Date]';
}
```
## 2.type和interface的区别
* 相同点
    * 都可以描述一个对象或者函数
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

    type SetUser = (name: string, age: number): void;
    ```
    * `interface`可以通过`extends`来扩展，`type`可以用&来扩展
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
    interface Name {
        name: string;
    }
    type User = Name & {
        age: number;
    }
    ``` 
* 不同点
    * type 可以声明基本类型别名，联合类型，元组等类型
    ```ts
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
    ```ts
    // 当你想获取一个变量的类型时，使用 typeof
    let div = document.createElement('div');
    type B = typeof div
    ```
    * interface 能够声明合并
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