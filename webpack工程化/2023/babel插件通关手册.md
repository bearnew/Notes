# babel 插件通关手册

#### 1.babel 的编译流程

- `parse`: 通过 `parser` 把源码转成抽象语法树（`AST`）
- `transform`: 遍历 `AST`，调用各种 `transform` 插件对 `AST` 进行增删改
- `generate`: 把转换后的 `AST` 打印成目标代码，并生成 `sourcemap`

#### 2.babel 的 AST

> https://astexplorer.net/

1. 字面量`Literal`

   - ![20230708171143-2023-07-08](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230708171143-2023-07-08.png)

2. 标识符`Identifier`

   - 变量名、属性名、参数名等各种声明和引用的名字，都是 Identifer。
   - `Identifier`词法的特点：只能包含字母、数字、下划线("\_")、美元符号("$")，且不能以数字开头

3. 语句`Statement`
   - 每一条可以独立执行的代码都是语句
   - `break continue debugger return if while for`、声明语句、表达式语句
   ```js
   break;
   continue;
   return;
   debugger;
   throw Error();
   {}
   try {} catch(e) {} finally{}
   for (let key in obj) {}
   for (let i = 0;i < 10;i ++) {}
   while (true) {}
   do {} while (true)
   switch (v){case 1: break;default:;}
   label: console.log();
   with (a){}
   ```
4. 声明`Declaration`

   - 在作用域内声明一个变量、函数、class、import、export

   ```js
   const a = 1;
   function b() {}
   class C {}

   import d from "e";

   export default e = 1;
   export { e };
   export * from "e";
   ```

5. 表达式`Expression`
   - 执行完成后有返回值
   ```js
   [1,2,3]
   a = 1
   1 + 2;
   -1;
   function(){};
   () => {};
   class{};
   a;
   this;
   super;
   a::b;
   ```
6. Class
   ```js
   class Guang extends Person {
     name = "guang";
     constructor() {}
     eat() {}
   }
   ```
7. `Modules`
   - `import`
   - `export`
8. `Program & Directive`
   - `use strict`
9. `File & Comment`
   - `babel` 的 `AST` 最外层节点是 `File`，它有 `program`、`comments`、`tokens` 等属性，分别存放 `Program` 程序体、注释、`token` 等

#### 3.babel 的 API

> https://www.babeljs.cn/docs/babel-parser

1.  `babel parser` 默认只能 `parse js` 代码，`jsx`、`flow`、`typescript` 这些非标准的语法的解析需要指定语法插件。
2.  parse 的内容

    - `plugins`： 指定`jsx、typescript、flow` 等插件来解析对应的语法
    - `allowXxx`： 指定一些语法是否允许，比如函数外的 `await`、没声明的 `export`等
    - `sourceType`:
      - `module`：解析 `es module` 语法
      - `script`：不解析 `es module` 语法
      - `unambiguous`：根据内容是否有 import 和 export 来自动设置 module 还是 script
    - 一般指定`sourceType`为`unambiguous`

    ```js
    const parser = require("@babel/parser");

    const ast = parser.parse("代码", {
      sourceType: "unambiguous",
      plugins: ["jsx"],
    });
    ```

3.  `@babel/traverse`

    1. `parse`出的 AST 由`@babel/traverse`来遍历和修改

    ```js
    function traverse(parent, opts)
    ```

    2. `visitor`是指定对什么`AST`做处理的函数，`babel`会在遍历到对应的`AST`时回调它们
    3. `visitor`可以指定刚开始遍历`enter`和遍历结束`exit`两个阶段的回调函数

    ```js
    traverse(ast, {
      FunctionDeclaration: {
        enter(path, state) {}, // 进入节点时调用
        exit(path, state) {}, // 离开节点时调用
      },
    });
    ```

    4. `visitor`如果只指定一个函数，那就是`enter`阶段会调用

    ```js
    traverse(ast, {
      FunctionDeclaration(path, state) {}, // 进入节点时调用
    });
    ```

    5.`enter`是调用在遍历当前节点子节点前调用，`exit`是调用遍历完成当前节点的子节点后调用

    - ![20230718110432-2023-07-18](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230718110432-2023-07-18.png)

    6. 同 1 个`visitor`可以用于多个`AST`节点的处理

    ```js
    // 进入 FunctionDeclaration 和 VariableDeclaration 节点时调用
    traverse(ast, {
      "FunctionDeclaration|VariableDeclaration"(path, state) {},
    });
    ```
