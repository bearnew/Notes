# babel 插件通关手册

#### 1.babel 的编译流程

- `parse`: 通过 `parser` 把源码转成抽象语法树（`AST`）
- `transform`: 遍历 `AST`，调用各种 `transform` 插件对 `AST` 进行增删改
- `generate`: 把转换后的 `AST` 打印成目标代码，并生成 `sourcemap`

#### 2.babel 的 AST

1. 字面量`Literal`

- ![20230708171143-2023-07-08](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230708171143-2023-07-08.png)

2. 标识符`Identifier`

- 变量名、属性名、参数名等各种声明和引用的名字，都是 Identifer。

3.
