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
4. `Fiber`双缓存
    1. `Fiber（Virtual dom）`是内存中用来描述`dom`阶段的对象
    2. `Fiber`上保存了节点的属性、类型、`dom`等，`Fiber`通过`child`、`sibling`、`return（指向父节点）`来形成`Fiber`树，还保存了更新状态用于计算`state`的`updateQueue`，`updateQueue`是一种链表结构，上面可能存在多个未计算的`update`，`update`也是一种数据结构，上面包含了更新的数据、优先级等。
    3. 双缓存是指两颗`Fiber`树，`current fiber`树描述当前呈现的`dom`树，`workInProgress Fiber`描述正在更新的`Fiber`树，这个两颗`Fiber`树都是内存中运行的，在`workInProgress fiber`构建完成后会将他作为`current fiber`应用到`dom`上。
    4. 在`mount`时（首次渲染），会根据jsx对象（`Class Component`或的`render`函数者`Function Component`的返回值），构建`Fiber`对象，形成`Fiber`树，然后这颗Fiber树会作为`current Fiber`应用到真实dom上，在update（状态更新时如setState）的时候，会根据状态变更后的jsx对象和`current Fiber`做对比形成新的`workInProgress Fiber`，然后`workInProgress Fiber`切换成`current Fiber`应用到真实dom就达到了更新的目的，而这一切都是在内存中发生的，从而减少了对dom耗性能的操作。
5. `Reconciler`(`render`阶段中)
    * 协调器是在`render`阶段工作的，简单一句话概括就是`Reconciler`会创建或者更新`Fiber`节点。在`mount`的时候会根据jsx生成Fiber对象，在`update`的时候会根据最新的state形成的jsx对象和`current Fiber`树对比构建`workInProgress Fiber`树，这个对比的过程就是diff算法。`reconcile`时会在这些`Fiber`上打上Tag标签，在`commit`阶段把这些标签应用到真实dom上，这些标签代表节点的增删改，如
    ```js
    export const Placement = /*             */ 0b0000000000010;
    export const Update = /*                */ 0b0000000000100;
    export const PlacementAndUpdate = /*    */ 0b0000000000110;
    export const Deletion = /*              */ 0b0000000001000;
    ```
    * `render`阶段遍历Fiber树类似dfs的过程，‘捕获’阶段发生在`beginWork`函数中，该函数做的主要工作是创建Fiber节点，计算`state`和`diff`算法，‘冒泡’阶段发生在completeWork中，该函数主要是做一些收尾工作，例如处理节点的props、和形成一条`effectList`的链表，该链表是被标记了更新的节点形成的链表
6. `Renderer`(commit阶段中)
    * `Renderer`是在`commit`阶段工作的，`commit`阶段会遍历`render`阶段形成的`effectList`，并执行真实dom节点的操作和一些生命周期，不同平台对应的`Renderer`不同，例如浏览器对应的就是`react-dom`。
    * `commit`阶段发生在`commitRoot`函数中，该函数主要遍历`effectList`，分别用三个函数来处理`effectList上`的节点，这三个函数是`commitBeforeMutationEffects`、`commitMutationEffects`、`commitLayoutEffects`
7. `diff`算法
    * `diff`算法发生在`render`阶段的`reconcileChildFibers`函数中，`diff`算法分为单节点的`diff`和多节点的`diff`（例如一个节点中包含多个子节点就属于多节点的diff），单节点会根据节点的key和`type`，`props`等来判断节点是复用还是直接新创建节点，多节点diff会涉及节点的增删和节点位置的变化，详细见第10章。
8. `Scheduler`
    * 我们知道了要实现异步可中断的更新，需要浏览器指定一个时间，如果没有时间剩余了就需要暂停任务，`requestIdleCallback`貌似是个不错的选择，但是它存在兼容和触发不稳定的原因，`react17`中采用`MessageChannel`来实现。
    ```js
    function workLoopConcurrent() {
        while (workInProgress !== null && !shouldYield()) {//shouldYield判断是否暂停任务
            workInProgress = performUnitOfWork(workInProgress); 
        }
    }
    ```
    * 在`Scheduler`中的每的每个任务的优先级使用过期时间表示的，如果一个任务的过期时间离现在很近，说明它马上就要过期了，优先级很高，如果过期时间很长，那它的优先级就低，没有过期的任务存放在`timerQueue`中，过期的任务存放在`taskQueue`中，`timerQueue`和`timerQueue`都是小顶堆，所以peek取出来的都是离现在时间最近也就是优先级最高的那个任务，然后优先执行它。
9. 