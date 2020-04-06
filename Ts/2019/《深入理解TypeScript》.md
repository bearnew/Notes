# 深入理解TypeScript
> https://jkchao.github.io/typescript-book-chinese/
## 1.typescript编译原理
1. 扫描器, sourceCode => Token流
2. 解析器, Token流 => AST
3. 绑定器, AST => Symbols（符号）
4. 检查器, AST + Symbols（符号）=> 类型验证
5. 发射器, AST + 检查器 => JavaScript 代码
## 2.type和interface区别
> 能用interface就使用interface，否则使用type
* 相同点
    * 都可以描述对象或者函数
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
    * 都允许扩展
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
        type User = Name & { age: number  };
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
        interface Name { 
            name: string; 
        }
        type User = Name & { 
            age: number; 
        }
        ```
* 不同点
    * `type` 可以声明基本类型别名，联合类型，元组等类型
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
    * type 语句中还可以使用 typeof 获取实例的 类型进行赋值
    ```js
    // 当你想获取一个变量的类型时，使用 typeof
    let div = document.createElement('div');
    type B = typeof div
    ```
    * interface可以声明合并
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