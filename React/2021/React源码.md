# React源码
## 1.Virtual DOM（虚拟dom）
1. `Virtual Dom`是一种编程概念，UI以理想化的，或者说“虚拟化”表现形式保存在内存中，并通过`ReactDOM`等类库使之与真实的DOM同步，这一过程叫做协调。
2. `React`使用`fibers`的内部对象来存放组件树的附加信息。
3. 虚拟Dom能够将开发者从属性操作、事件处理、手动DOM更新等操作解放出来
4. 使用js对象来描述真实的dom节点
5. 原生dom节点对象很大，Dom操作很慢，轻量的操作都可能导致页面重新排列，非常耗性能，相对于DOM对象，js对象处理起来更快，更简单。通过diff算法对比新旧vdom之间的差异，可以批量的、最小化的执行dom操作，从而提高性能。
6. `React`中用jsx语法描述视图，该函数将生成`vdom`来描述真实的`dom`，状态变化，`vdom`将做出相应变化，再通过`diff`算法对比新老`vdom`区别从而做出最终`dom`操作。
## 2.JSX
1. 什么是`jsx`
    * 语法糖
    * `React`中使用`jsx`来代替常规的`javascript`
    * `jsx`是一个看起来像`XML`的`javascript`语法扩展
2. 为什么使用`jsx`
    * 开发效率：使用`jsx`编写语法模版简单快速
    * 执行效率：`jsx`编译为`javascript`代码后进行了优化，执行更快
    * 类型安全：在编译过程中就能发现错误
3. `React 16`原理：`babel-loader`会预编译`jsx`为`React.createElement(...)`
4. `React 17`原理：`React 17`中的转换不会将`jsx`转换为`React.createElement(...)`, 而是自动从`React`的`package`中引入新的入口函数并调用。另外此次升级不会改变`jsx`语法，旧的`jsx`转换也将继续工作。
```js
function App() {
  return <h1>Hello World</h1>;
}

// 转换后
// 由编译器引入（禁止自己引入！）
import {jsx as _jsx} from 'react/jsx-runtime';

function App() {
  return _jsx('h1', { children: 'Hello world' });
}
```
5. 与`vue`的异同
    * react中的虚拟`dom`+`jsx`是一开始就有，`vue`则是演进过程中才出现的。
    * `jsx`本来就是`js`扩展，转换过程简单直接得多，`vue`把`template`编译为`render`函数的过程需要复杂的编译器转换字符串-ast-js函数字符串