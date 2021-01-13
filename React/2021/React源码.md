# React源码
## 1.Virtual DOM（虚拟dom）
1. `Virtual Dom`是一种编程概念，UI以理想化的，或者说“虚拟化”表现形式保存在内存中，并通过`ReactDOM`等类库使之与真实的DOM同步，这一过程叫做协调。
2. `React`使用`fibers`的内部对象来存放组件树的附加信息。
3. 虚拟Dom能够将开发者从属性操作、事件处理、手动DOM更新等操作解放出来