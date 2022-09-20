# tsc 和 babel 编译 ts 的区别

#### 1. `babel`的编译流程

1. 源码经过 Parser 做词法分析和语法分析，生成 token 和 AST。
2. AST 会做语义分析生成作用域信息，然后会调用 Transformer 进行 AST 的转换。
3. 最后会用 Generator 把 AST 打印成目标代码并生成 sourcemap。
4. babel 的 AST 和 token 也可以用 astexplorer.net 可视化的查看：

#### 2.babel 编译的缺陷

1. babel 不会做类型检查，没有 Checker。
2. babel 没有类型信息，不会生成 d.ts。

#### 3.语法支持

1. tsc 默认支持最新的 es 规范的语法和一些还在草案阶段的语法（比如 decorators），想支持新语法就要升级 tsc 的版本。
2. babel 是通过 @babel/preset-env 按照目标环境 targets 的配置自动引入需要用到的插件来支持标准语法，对于还在草案阶段的语法需要单独引入 @babel/proposal-xx 的插件来支持。

#### 4.兼容方式

tsc 生成的代码没有做 polyfill 的处理，需要全量引入 core-js，而 babel 则可以用 @babel/preset-env 根据 targets 的配置来按需引入 core-js 的部分模块，所以生成的代码体积更小。

#### 5.编译区别

1. babel 是每个文件单独编译的，而 tsc 不是，tsc 是整个项目一起编译，会处理类型声明文件，会做跨文件的类型声明合并，比如 namespace 和 interface 就可以跨文件合并。
2. babel 不支持 const enum（会作为 enum 处理），不支持 namespace 的跨文件合并，导出非 const 的值，不支持过时的 export = import = 的模块语法。
3. babel 编译 ts 代码的优点是可以通过插件支持更多的语言特性，而且生成的代码是按照 targets 的配置按需引入 core-js 的，而 tsc 没做这方面的处理，只能全量引入。
4. tsc 因为要做类型检查所以是比较慢的，而 babel 不做类型检查，编译会快很多。
5. 用 tsc --noEmit 来做类型检查，加上 noEmit 选项就不会生成代码了。
6. 如果你要生成 d.ts，也要单独跑下 tsc 编译。
