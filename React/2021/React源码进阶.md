# React源码进阶
## 1.React模型
1. `React`核心
```js
const state = reconcile(update);
const UI = commit(state);
```
2. `React`模块
    * `Scheduler(调度器)`：排序优先级，让优先级高的任务先进行`reconcile`
        * `Scheduler`的作用是调度任务，`React15`中没有`Scheduler`这部分，所以任务没有优先级，也不能中断，只能同步执行。
    * `Reconciler(协调器)`：找出节点的变化，并打上不同的`tag`
        * `Reconciler`发生在`render`阶段，`render`阶段会分别为节点执行`beginWork`和`completeWork`，或者计算`State`,对比节点的差异，为节点赋值相应的`effectTag`(对应`dom`节点的增删改)
    * `Renderer(渲染器)`：将`Reconciler`中打好标签的节点渲染到视图中
        * `Renderer`发生在`commit`阶段，`commit`阶段遍历`effectList`执行对应`dom`操作或部分生命周期
    * ![react_flow_1](https://github.com/bearnew/picture/blob/master/markdown_v2/2021/react%E6%BA%90%E7%A0%81/react_flow_1.png?raw=true) 
    * ![react_flow_2](https://github.com/bearnew/picture/blob/master/markdown_v2/2021/react%E6%BA%90%E7%A0%81/react_flow.png?raw=true)
3. `React17`
    * `React15`的`reconciler`同步执行，js执行线程和GUI浏览器绘制线程是互斥的，js执行时间过长就会卡顿，
    * `React17`带了全新的`concurrent mode`，一类功能的合集（如`fiber scheduler lane suspense`），其核心是实现了一套异步可中断、带优先级的更新，以提高应用的响应速度
    * 浏览器的`fps`是60Hz，每`16.6ms`会刷新一次，`React`会在刷新的每一帧分配一个时间（时间片）给`js`执行，如果`16.6ms`时间内js还没执行完，就会暂停他的执行，等下一帧再继续执行，先把执行权交回给浏览器去绘制。
    * ![react_js_excute]()
    * 未开启`concurrent`
    * 开启`concurrent`
4. 