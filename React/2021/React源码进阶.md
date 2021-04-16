# React 源码进阶

> https://xiaochen1024.com/article_item/600ac6afecf02e002e6db56b

## 1.React 模型

1. `React`核心

```js
const state = reconcile(update);
const UI = commit(state);
```

2. `React`模块
   - `Scheduler(调度器)`：排序优先级，让优先级高的任务先进行`reconcile`
     - `Scheduler`的作用是调度任务，`React15`中没有`Scheduler`这部分，所以任务没有优先级，也不能中断，只能同步执行。
   - `Reconciler(协调器)`：找出节点的变化，并打上不同的`tag`
     - `Reconciler`发生在`render`阶段，`render`阶段会分别为节点执行`beginWork`和`completeWork`，或者计算`State`,对比节点的差异，为节点赋值相应的`effectTag`(对应`dom`节点的增删改)
   - `Renderer(渲染器)`：将`Reconciler`中打好标签的节点渲染到视图中
     - `Renderer`发生在`commit`阶段，`commit`阶段遍历`effectList`执行对应`dom`操作或部分生命周期
   - ![react_flow_1](https://github.com/bearnew/picture/blob/master/markdown_v2/2021/react%E6%BA%90%E7%A0%81/react_flow_1.png?raw=true)
   - ![react_flow_2](https://github.com/bearnew/picture/blob/master/markdown_v2/2021/react%E6%BA%90%E7%A0%81/react_flow.png?raw=true)
3. `React17`
   - `React15`的`reconciler`同步执行，js 执行线程和 GUI 浏览器绘制线程是互斥的，js 执行时间过长就会卡顿，
   - `React17`带了全新的`concurrent mode`，一类功能的合集（如`fiber scheduler lane suspense`），其核心是实现了一套异步可中断、带优先级的更新，以提高应用的响应速度
   - 浏览器的`fps`是 60Hz，每`16.6ms`会刷新一次，`React`会在刷新的每一帧分配一个时间（时间片）给`js`执行，如果`16.6ms`时间内 js 还没执行完，就会暂停他的执行，等下一帧再继续执行，先把执行权交回给浏览器去绘制。
   - ![react_js_excute]()
   - 未开启`concurrent`
   - 开启`concurrent`
4. `Fiber`双缓存
   1. `Fiber（Virtual dom）`是内存中用来描述`dom`阶段的对象
   2. `Fiber`上保存了节点的属性、类型、`dom`等，`Fiber`通过`child`、`sibling`、`return（指向父节点）`来形成`Fiber`树，还保存了更新状态用于计算`state`的`updateQueue`，`updateQueue`是一种链表结构，上面可能存在多个未计算的`update`，`update`也是一种数据结构，上面包含了更新的数据、优先级等。
   3. 双缓存是指两颗`Fiber`树，`current fiber`树描述当前呈现的`dom`树，`workInProgress Fiber`描述正在更新的`Fiber`树，这个两颗`Fiber`树都是内存中运行的，在`workInProgress fiber`构建完成后会将他作为`current fiber`应用到`dom`上。
   4. 在`mount`时（首次渲染），会根据 jsx 对象（`Class Component`或的`render`函数者`Function Component`的返回值），构建`Fiber`对象，形成`Fiber`树，然后这颗 Fiber 树会作为`current Fiber`应用到真实 dom 上，在 update（状态更新时如 setState）的时候，会根据状态变更后的 jsx 对象和`current Fiber`做对比形成新的`workInProgress Fiber`，然后`workInProgress Fiber`切换成`current Fiber`应用到真实 dom 就达到了更新的目的，而这一切都是在内存中发生的，从而减少了对 dom 耗性能的操作。
5. `Reconciler`(`render`阶段中)
   - 协调器是在`render`阶段工作的，简单一句话概括就是`Reconciler`会创建或者更新`Fiber`节点。在`mount`的时候会根据 jsx 生成 Fiber 对象，在`update`的时候会根据最新的 state 形成的 jsx 对象和`current Fiber`树对比构建`workInProgress Fiber`树，这个对比的过程就是 diff 算法。`reconcile`时会在这些`Fiber`上打上 Tag 标签，在`commit`阶段把这些标签应用到真实 dom 上，这些标签代表节点的增删改，如
   ```js
   export const Placement = /*             */ 0b0000000000010;
   export const Update = /*                */ 0b0000000000100;
   export const PlacementAndUpdate = /*    */ 0b0000000000110;
   export const Deletion = /*              */ 0b0000000001000;
   ```
   - `render`阶段遍历 Fiber 树类似 dfs 的过程，‘捕获’阶段发生在`beginWork`函数中，该函数做的主要工作是创建 Fiber 节点，计算`state`和`diff`算法，‘冒泡’阶段发生在 completeWork 中，该函数主要是做一些收尾工作，例如处理节点的 props、和形成一条`effectList`的链表，该链表是被标记了更新的节点形成的链表
6. `Renderer`(commit 阶段中)
   - `Renderer`是在`commit`阶段工作的，`commit`阶段会遍历`render`阶段形成的`effectList`，并执行真实 dom 节点的操作和一些生命周期，不同平台对应的`Renderer`不同，例如浏览器对应的就是`react-dom`。
   - `commit`阶段发生在`commitRoot`函数中，该函数主要遍历`effectList`，分别用三个函数来处理`effectList上`的节点，这三个函数是`commitBeforeMutationEffects`、`commitMutationEffects`、`commitLayoutEffects`
7. `diff`算法
   - `diff`算法发生在`render`阶段的`reconcileChildFibers`函数中，`diff`算法分为单节点的`diff`和多节点的`diff`（例如一个节点中包含多个子节点就属于多节点的 diff），单节点会根据节点的 key 和`type`，`props`等来判断节点是复用还是直接新创建节点，多节点 diff 会涉及节点的增删和节点位置的变化，详细见第 10 章。
8. `Scheduler`
   - 我们知道了要实现异步可中断的更新，需要浏览器指定一个时间，如果没有时间剩余了就需要暂停任务，`requestIdleCallback`貌似是个不错的选择，但是它存在兼容和触发不稳定的原因，`react17`中采用`MessageChannel`来实现。
   ```js
   function workLoopConcurrent() {
     while (workInProgress !== null && !shouldYield()) {
       //shouldYield判断是否暂停任务
       workInProgress = performUnitOfWork(workInProgress);
     }
   }
   ```
   - 在`Scheduler`中的每的每个任务的优先级使用过期时间表示的，如果一个任务的过期时间离现在很近，说明它马上就要过期了，优先级很高，如果过期时间很长，那它的优先级就低，没有过期的任务存放在`timerQueue`中，过期的任务存放在`taskQueue`中，`timerQueue`和`timerQueue`都是小顶堆，所以 peek 取出来的都是离现在时间最近也就是优先级最高的那个任务，然后优先执行它。
9. `lane`
   - `react`之前的版本用`expirationTime`属性代表优先级，该优先级和 IO 不能很好的搭配工作（io 的优先级高于 cpu 的优先级），现在有了更加细粒度的优先级表示方法`Lane`，`Lane`用二进制位表示优先级，二进制中的 1 表示位置，同一个二进制数可以有多个相同优先级的位，这就可以表示‘批’的概念，而且二进制方便计算。
   - 这好比赛车比赛，在比赛开始的时候会分配一个赛道，比赛开始之后大家都会抢内圈的赛道（`react`中就是抢优先级高的`Lane`），比赛的尾声，最后一名赛车如果落后了很多，它也会跑到内圈的赛道，最后到达目的地（对应`react`中就是饥饿问题，低优先级的任务如果被高优先级的任务一直打断，到了它的过期时间，它也会变成高优先级）
10. `jsx`

    - `jsx`是`ClassComponent`的`render`函数或者`FunctionComponent`的返回值，可以用来表示组件的内容，在经过`babel`编译之后，最后会被编译成`React.createElement`，这就是为什么`jsx`文件要声明`import React from 'react'`的原因，你可以在 `babel`编译`jsx `站点查看`jsx`被编译后的结果
    - `React.createElement`的源码中做了如下几件事

      - 处理`config`，把除了保留属性外的其他`config`赋值给`props`
      - 把`children`处理后赋值给`props.children`
      - 处理`defaultProps`
      - 调用`ReactElement`返回一个 jsx 对象

      ```js
      export function createElement(type, config, children) {
        let propName;

        const props = {};

        let key = null;
        let ref = null;
        let self = null;
        let source = null;

        if (config != null) {
          //处理config，把除了保留属性外的其他config赋值给props
          //...
        }

        const childrenLength = arguments.length - 2;
        //把children处理后赋值给props.children
        //...

        //处理defaultProps
        //...

        return ReactElement(
          type,
          key,
          ref,
          self,
          source,
          ReactCurrentOwner.current,
          props
        );
      }

      const ReactElement = function (
        type,
        key,
        ref,
        self,
        source,
        owner,
        props
      ) {
        const element = {
          $$typeof: REACT_ELEMENT_TYPE, //表示是ReactElement类型

          type: type, //class或function
          key: key, //key
          ref: ref, //useRef的ref对象
          props: props, //props
          _owner: owner,
        };

        return element;
      };
      ```

    - `$$typeof`表示的是组件的类型，例如在源码中有一个检查是否是合法`Element`的函数，就是根`object.$$typeof === REACT_ELEMENT_TYPE`来判断的
      ```js
      export function isValidElement(object) {
        return (
          typeof object === "object" &&
          object !== null &&
          object.$$typeof === REACT_ELEMENT_TYPE
        );
      }
      ```
    - 如果组件是`ClassComponent`则`type`是`class`本身，如果组件是`FunctionComponent`创建的，则`type`是这个`function`，源码中用`ClassComponent.prototype.isReactComponent`来区别二者。注意`class`或者`function`创建的组件一定要首字母大写，不然后被当成普通节点，type 就是字符串。
    - `jsx`对象上没有优先级、状态、`effectTag`等标记，这些标记在`Fiber`对象上，在`mount`时`Fiber`根据 jsx 对象来构建，在`update`是根据最新状态的 jsx 和`current Fiber`对比，形成新的`workInProgress Fiber`，最后`workInProgress Fiber`切换成`current Fiber`

## 2.Fiber(内存中的 dom)

1. `react15`在`render`阶段的`reconcile`是不可打断的，这会在进行大量`dom`的`reconcile`时产生卡顿，因为浏览器所有的时间都交给了 js 执行，并且 js 的执行时单线程。为此`react16`之后就有了`scheduler`进行时间片的调度，给每个 task 一定的时间，如果在这个时间内没执行完，也要交出执行权给浏览器进行绘制和重排，所以异步可中断的更新需要一定的数据结构在内存中来保存 dom 的信息，这个数据结构就是`Fiber`（虚拟 dom）。
2. `Fiber`双缓存
   - `Fiber`可以保存真实的`dom`，真实`dom`对应在内存中的`Fiber`节点会形成`Fiber`树，这颗 Fiber 树在 react 中叫`current Fiber`，也就是当前 dom 树对应的 Fiber 树，而正在构建 Fiber 树叫`workInProgress Fiber`，这两颗树的节点通过`alternate`相连.
3. 在`mount`时：会创建`fiberRoot`和`rootFiber`，然后根据 jsx 对象创建 Fiber 节点，节点连接成`current Fiber`树。
4. 在`update`时：会根据新的状态形成的 jsx（`ClassComponent`的`render`或者`FuncComponent`的返回值）和`current Fiber`对比形（diff 算法）成一颗叫`workInProgress`的 Fiber 树，然后将`fiberRoot`的 current 指向`workInProgress`树，此时 workInProgress 就变成了`current Fiber`。
5. `fiberRoot`：指整个应用的根节点，只存在一个
6. `rootFiber`：`ReactDOM.render`或者`ReactDOM.unstable_createRoot`创建出来的应用的节点，可以存在多个。
7. 我们现在知道了存在`current Fiber`和`workInProgress Fiber`两颗 Fiber 树，Fiber 双缓存指的就是，在经过`reconcile（diff）`形成了新的`workInProgress Fiber`然后将`workInProgress Fiber`切换成`current Fiber`应用到真实 dom 中，存在双 Fiber 的好处是在内存中形成视图的描述，在最后应用到 dom 中，减少了对 dom 的操作。

## 3.入口

1. `React` 有 3 种模式
   - **`legacy`模式**： `ReactDOM.render(<App />, rootNode)`。这是当前`React app`使用的方式。当前没有计划删除该模式，但是这个模式可能不支持这些新功能。
   - **`blocking`**: `ReactDOM.createBlockingRoot(rootNode).render()`。目前正在实验中，作为迁移到`concurrent`的第一步
   - **`concurrent`模式**: `ReactDOM.createRoot(rootNode).render(<App />)`，目前正在实验中，未来稳定后，作为`React`的默认开发版本，该版本包含所有的新功能。
2. 特性对比

|                            feature                            | legacy 模式 | blocking 模式 | concurrent 模式 |
| :-----------------------------------------------------------: | :---------: | :-----------: | :-------------: |
|                          String Refs                          |     ✅      |      🚫       |       🚫        |
|                        Leagcy Context                         |     ✅      |      🚫       |       🚫        |
|                          findDOMNode                          |     ✅      |      🚫       |       🚫        |
|                           Suspense                            |     ✅      |      ✅       |       ✅        |
|                         SuspenseList                          |     🚫      |      ✅       |       ✅        |
|                   Suspense SSR + Hydration                    |     🚫      |      ✅       |       ✅        |
|               Progressive Hydration(渐进式注水)               |     🚫      |      ✅       |       ✅        |
|                      Selective Hydration                      |     🚫      |      🚫       |       ✅        |
|           Cooperative Multitasking(协同多任务处理)            |     🚫      |      🚫       |       ✅        |
| Automatic batching of multiple setStates(自动批处理 setState) |     🚫      |      ✅       |       ✅        |
|        Priority-based Rendering(根据优先级分割 state)         |     🚫      |      🚫       |       ✅        |
|           Interruptible Prerendering(可中断的渲染)            |     🚫      |      🚫       |       ✅        |
|                         useTransition                         |     🚫      |      🚫       |       ✅        |
|                 useDeferredValue(延迟 1 个值)                 |     🚫      |      🚫       |       ✅        |
|     Suspense Reveal “Train”(较低的延迟换取更少的布局变化)     |     🚫      |      🚫       |       ✅        |

3. 不同模式对比

- `legacy`模式是我们常用的，它构建 dom 的过程是同步的，所以在`render`的`reconciler`中，如果 diff 的过程特别耗时，那么导致的结果就是 js 一直阻塞高优先级的任务(例如用户的点击事件)，表现为页面的卡顿，无法响应。

4. concurrent Mode 是 react 未来的模式，它用时间片调度实现了异步可中断的任务，根据设备性能的不同，时间片的长度也不一样，在每个时间片中，如果任务到了过期时间，就会主动让出线程给高优先级的任务。这部分将在第 11 节 scheduler&lane 模型 这章会具体讲解 react 是如何实现异步可中断的任务，以及任务的优先级和高优先级是如果插队的。

## 4.state 更新流程

1. 在`react`中触发状态更新的方式
   - `ReactDOM.render`，是异步操作，返回组件实例
   - `this.setState`
   - `this.forceUpdate`
   - `useState`
   - `useReducer`
2. `this.setState`内调用`this.updater.enqueueSetState`
   ```js
   Component.prototype.setState = function (partialState, callback) {
     if (
       !(
         typeof partialState === "object" ||
         typeof partialState === "function" ||
         partialState == null
       )
     ) {
       {
         throw Error(
           "setState(...): takes an object of state variables to update or a function which returns an object of state variables."
         );
       }
     }
     this.updater.enqueueSetState(this, partialState, callback, "setState");
   };
   ```
3. `this.forceUpdate`和`this.setState`一样，只是会让 tag 赋值`ForceUpdate`

   ```js
   enqueueForceUpdate(inst, callback) {
       const fiber = getInstance(inst);
       const eventTime = requestEventTime();
       const suspenseConfig = requestCurrentSuspenseConfig();
       const lane = requestUpdateLane(fiber, suspenseConfig);

       const update = createUpdate(eventTime, lane, suspenseConfig);

       //tag赋值ForceUpdate
       update.tag = ForceUpdate;

       if (callback !== undefined && callback !== null) {
           update.callback = callback;
       }

       enqueueUpdate(fiber, update);
       scheduleUpdateOnFiber(fiber, lane, eventTime);
   };

   ```

4. 如果标记`ForceUpdate`，`render`阶段组件更新会根据`checkHasForceUpdateAfterProcessing`，和`checkShouldComponentUpdate`来判断，如果`Update`的`tag`是`ForceUpdate`，则`checkHasForceUpdateAfterProcessing`为 true，当组件是`PureComponent`时，`checkShouldComponentUpdate`会浅比较 state 和 props，所以当使用`this.forceUpdate`一定会更新
   ```js
   const shouldUpdate =
     checkHasForceUpdateAfterProcessing() ||
     checkShouldComponentUpdate(
       workInProgress,
       ctor,
       oldProps,
       newProps,
       oldState,
       newState,
       nextContext
     );
   ```
5. `enqueueForceUpdate`之后会经历创建`update`，调度`update`等过程，接下来就来讲这些过程

   ```js
   enqueueSetState(inst, payload, callback) {
       const fiber = getInstance(inst);//fiber实例

       const eventTime = requestEventTime();
       const suspenseConfig = requestCurrentSuspenseConfig();

       const lane = requestUpdateLane(fiber, suspenseConfig);//优先级

       const update = createUpdate(eventTime, lane, suspenseConfig);//创建update

       update.payload = payload;

       if (callback !== undefined && callback !== null) {  //赋值回调
           update.callback = callback;
       }

       enqueueUpdate(fiber, update);//update加入updateQueue
       scheduleUpdateOnFiber(fiber, lane, eventTime);//调度update
   }
   ```

6. 状态更新流程
   - ![update_flow](https://github.com/bearnew/picture/blob/master/markdown_v2/2021/react%E6%BA%90%E7%A0%81/update_flow.png?raw=true)
7. 创建 update

   ```js
   // lane：优先级
   // tag：更新的类型，例如UpdateState、ReplaceState
   // payload：ClassComponent的payload是setState第一个参数，HostRoot的payload是ReactDOM.render的第一个参数
   // callback：setState的第二个参数
   // next：连接下一个Update形成一个链表，例如同时触发多个setState时会形成多个Update，然后用next 连接
   export function createUpdate(eventTime: number, lane: Lane): Update<*> {
     //创建update
     const update: Update<*> = {
       eventTime,
       lane,

       tag: UpdateState,
       payload: null,
       callback: null,

       next: null,
     };
     return update;
   }
   ```

8. `updateQueue`
   - 对于`HostRoot`或者`ClassComponent`会在`mount`的时候使用`initializeUpdateQueue`创建`updateQueue`，然后将`updateQueue`挂载到`fiber`节点上
   - example
   ```js
   // baseState：初始state，后面会基于这个state，根据Update计算新的state
   // firstBaseUpdate、lastBaseUpdate：Update形成的链表的头和尾
   // shared.pending：新产生的update会以单向环状链表保存在shared.pending上，计算state的时候会剪开这个环状链表，并且链接在lastBaseUpdate后
   // effects：calback不为null的update
   export function initializeUpdateQueue<State>(fiber: Fiber): void {
     const queue: UpdateQueue<State> = {
       baseState: fiber.memoizedState,
       firstBaseUpdate: null,
       lastBaseUpdate: null,
       shared: {
         pending: null,
       },
       effects: null,
     };
     fiber.updateQueue = queue;
   }
   ```
9. 调度
   - 在`ensureRootIsScheduled`中，`scheduleCallback`会以一个优先级调度`render`阶段的开始函数`performSyncWorkOnRoot`或者`performConcurrentWorkOnRoot`
   - example
   ```js
   if (newCallbackPriority === SyncLanePriority) {
     // 任务已经过期，需要同步执行render阶段
     newCallbackNode = scheduleSyncCallback(
       performSyncWorkOnRoot.bind(null, root)
     );
   } else {
     // 根据任务优先级异步执行render阶段
     var schedulerPriorityLevel = lanePriorityToSchedulerPriority(
       newCallbackPriority
     );
     newCallbackNode = scheduleCallback(
       schedulerPriorityLevel,
       performConcurrentWorkOnRoot.bind(null, root)
     );
   }
   ```
10. 状态更新
    - 初始时`fiber.updateQueue`单链表上有`firstBaseUpdate（update1）`和`lastBaseUpdate（update2）`，以`next`连接
    - `fiber.updateQueue.shared`环状链表上有`update3`和`update4，`以`next`连接互相连接
    - 计算`state`时，先将`fiber.updateQueue.shared`环状链表‘剪开’，形成单链表，连接在`fiber.updateQueue`后面形成`baseUpdate`
    - 然后遍历按这条链表，根据`baseState`计算出`memoizedState`
11. 带优先级的状态更新

    - 通过`ReactDOM.render`创建的应用没有优先级的概念，类比 git 提交，相当于先 commit，然后提交 c3
    - 在`concurrent`模式下，类似`git rebase`，先暂存之前的代码，在`master`上开发，然后`rebase`到之前的分支上
      - 在第一次 render 的时候，低优先级的 update 会跳过，所以只有 c1 和 c3 加入状态的计算
      - 在第二次 render 的时候，会以第一次中跳过的 update（c2）之前的 update（c1）作为 baseState，跳过的 update 和之后的 update（c2，c3，c4）作为 baseUpdate 重新计算
      - 在在`concurrent`模式下，`componentWillMount`可能会执行多次，和之前的版本不一致
      - `fiber.updateQueue.shared`会同时存在于`workInprogress Fiber`和`current Fiber`，目的是为了防止高优先级打断正在进行的计算而导致状态丢失，这段代码也是发生在`processUpdateQueue`中

## 5.render 阶段

1. `render`阶段的入口

- `render` 阶段的主要工作是构建 `Fiber` 树和生成 `effectList`，在第 5 章中我们知道了 `react` 入口的两种模式会进入 `performSyncWorkOnRoot` 或者 `performConcurrentWorkOnRoot`，而这两个方法分别会调用 `workLoopSync` 或者 `workLoopConcurrent`

```js
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

- 这两函数的区别是判断条件是否存在 `shouldYield` 的执行，如果浏览器没有足够的时间，那么会终止 `while` 循环，也不会执行后面的 `performUnitOfWork` 函数，自然也不会执行后面的 `render` 阶段和 `commit` 阶段，

  - `workInProgress`：新创建的`workInProgress fiber`
  - `performUnitOfWork：workInProgress fiber`和会和已经创建的`Fiber`连接起来形成`Fiber`树。这个过程类似深度优先遍历，我们暂且称它们为‘捕获阶段’和‘冒泡阶段’。执行的过程大概如下

    ```js
    function performUnitOfWork(fiber) {
      if (fiber.child) {
        performUnitOfWork(fiber.child); //beginWork
      }

      if (fiber.sibling) {
        performUnitOfWork(fiber.sibling); //completeWork
      }
    }
    ```

2. 捕获阶段

- 从根节点 `rootFiber` 开始，遍历到叶子节点，每次遍历到的节点都会执行 `beginWork`，并且传入当前 `Fiber`节点，然后创建或复用它的子 `Fiber` 节点，并赋值给 `workInProgress.child`。

3. 冒泡阶段

- 在捕获阶段遍历到子节点之后，会执行 completeWork 方法，执行完成之后会判断此节点的兄弟节点存不存在，如果存在就会为兄弟节点执行 completeWork，当全部兄弟节点执行完之后，会向上‘冒泡’到父节点执行 completeWork，直到 rootFiber。

4. `beginwork`

- `beginWork` 主要的工作是创建或复用子`fiber`节点

* 参数中有 `current Fiber`，也就是当前真实 `dom `对应的 `Fiber` 树，在之前介绍 Fiber 双缓存机制中，我们知道在首次渲染时除了 `rootFiber` 外，`current` 等于 null，因为首次渲染 dom 还没构建出来，在 update 时 current 不等于 null，因为 update 时 dom 树已经存在了，所以 beginWork 函数中用 current === null 来判断是 mount 还是 update 进入不同的逻辑
* `mount`：根据 fiber.tag 进入不同 fiber 的创建函数，最后都会调用到 `reconcileChildren` 创建子 `Fiber`
* `update`：在构建 `workInProgress` 的时候，当满足条件时，会复用 `current Fiber` 来进行优化，也就是进入 `bailoutOnAlreadyFinishedWork` 的逻辑，能复用 `didReceiveUpdate` 变量是 `false`，复用的条件是
* 为 `Fiber` 打上 `effectTag` 之后在 `commit` 阶段会被执行对应 dom 的增删改
* `completeWork`主要工作是处理`fiber`的`props`、创建`dom`、创建`effectList`
* update 时（除了判断 current===null 外还需要判断 workInProgress.stateNode===null），调用 updateHostComponent 处理 props（包括 onClick、style、children ...），并将处理好的 props 赋值给 updatePayload,最后会保存在 workInProgress.updateQueue 上
* mount 时 调用 createInstance 创建 dom，将后代 dom 节点插入刚创建的 dom 中，调用 finalizeInitialChildren 处理 props（和 updateHostComponent 处理的逻辑类似）

​ 之前我们有说到在 beginWork 的 mount 时，rootFiber 存在对应的 current，所以他会执行 mountChildFibers 打上 Placement 的 effectTag，在冒泡阶段也就是执行 completeWork 时，我们将子孙节点通过 appendAllChildren 挂载到新创建的 dom 节点上，最后就可以一次性将内存中的节点用 dom 原生方法反应到真实 dom 中。

## 6.commit 阶段(听说 renderer 帮我们打好标记了,映射真实节点吧)

- `render` 阶段的末尾会调用 `commitRoot(root)`;进入 `commit` 阶段，这里的 `root` 指的就是 `fiberRoot`，然后会遍历 `render` 阶段生成的 `effectList`，`effectList` 上的 `Fiber` 节点保存着对应的 `props` 变化。之后会遍历 `effectList` 进行对应的 `dom` 操作和生命周期、`hooks` 回调或销毁函数
- `commit`步骤

  - `mutation`前

    - 调用`flushPassiveEffects`执行完所有`effect`的任务
    - 初始化相关变量
    - 赋值`firstEffect`给后面遍历`effectList`用

  - `mutation` 阶段
    - 遍历 `effectList` 分别执行三个方法 `commitBeforeMutationEffects`、`commitMutationEffects`、`commitLayoutEffects` 执行对应的 dom 操作和生命周期
    - 我们在构建完 `workInProgress Fiber` 树之后会将 `fiberRoot`的 `current` 指向 `workInProgress Fiber`，让 `workInProgress Fiber` 成为 `current`，这个步骤发生在 `commitMutationEffects`函数执行之后，`commitLayoutEffects` 之前，因为 `componentWillUnmount` 发生在 `commitMutationEffects` 函数中，这时还可以获取之前的 Update，而 `componentDidMount` 和 `componentDidUpdate` 会在 `commitLayoutEffects` 中执行，这时已经可以获取更新后的真实 dom 了
    - **`commitBeforeMutationEffects`**
      - 执行`getSnapshotBeforeUpdate`
      - 调度`useEffect`
    - **`commitMutationEffects`**
      - 调用 `commitDetachRef` 解绑 `ref`
      - 根据`effectTag`执行对应的`dom`操作
      - `useLayoutEffect`销毁函数在`UpdateTag`时执行
  - `mutation`后
    - 根据`rootDoesHavePassiveEffects`赋值相关变量
    - 执行 `flushSyncCallbackQueue` 处理 `componentDidMount` 等生命周期或者 `useLayoutEffect` 等同步任务
  - 操作`dom`的几个函数

    - `commitPlacement`插入节点
    - `commitWork` 更新节点
    - `commitDeletion`删除节点

      - 如果是 `ClassComponent` 会执行 `componentWillUnmount`，删除 fiber，如果是 FunctionComponent 会删除 `ref`、并执行 `useEffect` 的销毁函数，具体可在源码中查看 unmountHostComponents、commitNestedUnmounts、detachFiberMutation 这几个函数

    - `commitLayoutEffects`
      - 在 `commitMutationEffects` 之后所有的 `dom` 操作都已经完成，可以访问 `dom`
      - 会执行 `useLayoutEffect` 的回调，然后调度 `useEffect`，`ClassComponent` 会执行 `componentDidMount` 或者 `componentDidUpdate`，`this.setState` 第二个参数也会执行，`HostRoot` 会执行 `ReactDOM.render` 函数的第三个参数，

## 7.diff 算法

1. 在 `render` 阶段更新 `Fiber` 节点时，我们会调用 `reconcileChildFibers` 对比 `current Fiber` 和 jsx 对象构建 `workInProgress Fiber`，这里 `current Fiber` 是指当前 `dom` 对应的 `fiber` 树，jsx 是 `class` 组件 `render` 方法或者函数组件的返回值。
2. 普通的两棵树 diff 复杂度是`O(n3)`
3. `React`的`diff`

   1. 最对同级比较，跨层级的 `dom` 不会进行复用
   2. 不同类型节点生成的 `dom` 树不同，此时会直接销毁老节点及子孙节点，并新建节点
   3. 可以通过 `key` 来对元素 `diff` 的过程提供复用的线索

4. 单节点`diff`

   1. `key` 和 `type` 相同表示可以复用节点
   2. `key`不同直接标记删除节点，然后新建节点
   3. `key` 相同 `type` 不同，标记删除该节点和兄弟节点，然后新创建节点

5. 多节点`diff`
   1. 多节点 diff 会经历三次遍历， 第一次遍历处理节点的更新（包括 props 更新和 type 更新和删除），第二次遍历处理其他的情况（节点新增），其原因在于在大多数的应用中，节点更新的频率更加频繁，第三次处理位节点置改变
   2. **第一次遍历:**
      1. `key` 不同，第一次循环结束
      2. `newChildren` 或者 `oldFiber` 遍历完，第一次循环结束
      3. `key` 同 `type` 不同，标记 `oldFiber` 为 `DELETION`
      4. `key` 相同 `type`相同则可以复用
      5. `newChildren`遍历完，`oldFiber`没遍历完，在第一次遍历完成之后将`oldFiber`中没遍历完的节点标记为`DELETION`，即删除的`DELETION Tag`
   3. **第二次遍历:**
      1. `newChildren`和`oldFiber`都遍历完：多节点`diff`过程结束
      2. `newChildren`没遍历完，`oldFiber`遍历完，将剩下的`newChildren`的节点标记为`Placement`，即插入的 Tag
      3. `newChildren`和`oldFiber`没遍历完，则进入节点移动的逻辑
   4. **第三次遍历:**
      1. 主要逻辑在 `placeChild` 函数中，例如更新前节点顺序是 `ABCD`，更新后是 `ACDB`
      2. `newChild` 中第一个位置的 `D` 和 `oldFiber` 第一个位置的 `A`，`key` 不相同不可复用，将 `oldFiber` 中的 `ABCD` 保存在 `map` 中，`lastPlacedIndex=0`
