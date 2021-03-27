# React源码进阶
> https://xiaochen1024.com/article_item/600ac6afecf02e002e6db56b
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
9. `lane`
    * `react`之前的版本用`expirationTime`属性代表优先级，该优先级和IO不能很好的搭配工作（io的优先级高于cpu的优先级），现在有了更加细粒度的优先级表示方法`Lane`，`Lane`用二进制位表示优先级，二进制中的1表示位置，同一个二进制数可以有多个相同优先级的位，这就可以表示‘批’的概念，而且二进制方便计算。
    * 这好比赛车比赛，在比赛开始的时候会分配一个赛道，比赛开始之后大家都会抢内圈的赛道（`react`中就是抢优先级高的`Lane`），比赛的尾声，最后一名赛车如果落后了很多，它也会跑到内圈的赛道，最后到达目的地（对应`react`中就是饥饿问题，低优先级的任务如果被高优先级的任务一直打断，到了它的过期时间，它也会变成高优先级）
10. `jsx`
    * `jsx`是`ClassComponent`的`render`函数或者`FunctionComponent`的返回值，可以用来表示组件的内容，在经过`babel`编译之后，最后会被编译成`React.createElement`，这就是为什么`jsx`文件要声明`import React from 'react'`的原因，你可以在 `babel`编译`jsx `站点查看`jsx`被编译后的结果
    * `React.createElement`的源码中做了如下几件事
        * 处理`config`，把除了保留属性外的其他`config`赋值给`props`
        * 把`children`处理后赋值给`props.children`
        * 处理`defaultProps`
        * 调用`ReactElement`返回一个jsx对象
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
                props,
            );
            }

            const ReactElement = function(type, key, ref, self, source, owner, props) {
            const element = {
                $$typeof: REACT_ELEMENT_TYPE,//表示是ReactElement类型

                type: type,//class或function
                key: key,//key
                ref: ref,//useRef的ref对象
                props: props,//props
                _owner: owner,
            };

            return element;
            };
        ```
    * `$$typeof`表示的是组件的类型，例如在源码中有一个检查是否是合法`Element`的函数，就是根`object.$$typeof === REACT_ELEMENT_TYPE`来判断的
        ```js
        export function isValidElement(object) {
            return (
                typeof object === 'object' &&
                object !== null &&
                object.$$typeof === REACT_ELEMENT_TYPE
            );
        }
        ```
    * 如果组件是`ClassComponent`则`type`是`class`本身，如果组件是`FunctionComponent`创建的，则`type`是这个`function`，源码中用`ClassComponent.prototype.isReactComponent`来区别二者。注意`class`或者`function`创建的组件一定要首字母大写，不然后被当成普通节点，type就是字符串。
    * `jsx`对象上没有优先级、状态、`effectTag`等标记，这些标记在`Fiber`对象上，在`mount`时`Fiber`根据jsx对象来构建，在`update`是根据最新状态的jsx和`current Fiber`对比，形成新的`workInProgress Fiber`，最后`workInProgress Fiber`切换成`current Fiber`
## 2.Fiber(内存中的dom)
1. `react15`在`render`阶段的`reconcile`是不可打断的，这会在进行大量`dom`的`reconcile`时产生卡顿，因为浏览器所有的时间都交给了js执行，并且js的执行时单线程。为此`react16`之后就有了`scheduler`进行时间片的调度，给每个task一定的时间，如果在这个时间内没执行完，也要交出执行权给浏览器进行绘制和重排，所以异步可中断的更新需要一定的数据结构在内存中来保存dom的信息，这个数据结构就是`Fiber`（虚拟dom）。 
2. `Fiber`双缓存
    * `Fiber`可以保存真实的`dom`，真实`dom`对应在内存中的`Fiber`节点会形成`Fiber`树，这颗Fiber树在react中叫`current Fiber`，也就是当前dom树对应的Fiber树，而正在构建Fiber树叫`workInProgress Fiber`，这两颗树的节点通过`alternate`相连.
3. 在`mount`时：会创建`fiberRoot`和`rootFiber`，然后根据jsx对象创建Fiber节点，节点连接成`current Fiber`树。
4. 在`update`时：会根据新的状态形成的jsx（`ClassComponent`的`render`或者`FuncComponent`的返回值）和`current Fiber`对比形（diff算法）成一颗叫`workInProgress`的Fiber树，然后将`fiberRoot`的current指向`workInProgress`树，此时workInProgress就变成了`current Fiber`。
5. `fiberRoot`：指整个应用的根节点，只存在一个
6. `rootFiber`：`ReactDOM.render`或者`ReactDOM.unstable_createRoot`创建出来的应用的节点，可以存在多个。
7. 我们现在知道了存在`current Fiber`和`workInProgress Fiber`两颗Fiber树，Fiber双缓存指的就是，在经过`reconcile（diff）`形成了新的`workInProgress Fiber`然后将`workInProgress Fiber`切换成`current Fiber`应用到真实dom中，存在双Fiber的好处是在内存中形成视图的描述，在最后应用到dom中，减少了对dom的操作。
## 3.入口
1. `React` 有3种模式
    * __`legacy`模式__： `ReactDOM.render(<App />, rootNode)`。这是当前`React app`使用的方式。当前没有计划删除该模式，但是这个模式可能不支持这些新功能。
    * __`blocking`__: `ReactDOM.createBlockingRoot(rootNode).render()`。目前正在实验中，作为迁移到`concurrent`的第一步
    * __`concurrent`模式__: `ReactDOM.createRoot(rootNode).render(<App />)`，目前正在实验中，未来稳定后，作为`React`的默认开发版本，该版本包含所有的新功能。
2. 特性对比
 
|feature|legacy模式|blocking模式|concurrent模式|
|:--------:|:--------:|:--------:|:--------:|
|String Refs|✅|🚫|🚫|
|Leagcy Context|✅|🚫|🚫|
|findDOMNode|✅|🚫|🚫|
|Suspense|✅|✅|✅|
|SuspenseList|🚫|✅|✅|
|Suspense SSR + Hydration|🚫|✅|✅|
|Progressive Hydration(渐进式注水)|🚫|✅|✅|
|Selective Hydration|🚫|🚫|✅|
|Cooperative Multitasking(协同多任务处理)|🚫|🚫|✅|
|Automatic batching of multiple setStates(自动批处理setState)|🚫|✅|✅|
|Priority-based Rendering(根据优先级分割state)|🚫|🚫|✅|
|Interruptible Prerendering(可中断的渲染)|🚫|🚫|✅|
|useTransition|🚫|🚫|✅|
|useDeferredValue(延迟1个值)|🚫|🚫|✅|
|Suspense Reveal “Train”(较低的延迟换取更少的布局变化)|🚫|🚫|✅|
3. 不同模式对比
* `legacy`模式是我们常用的，它构建dom的过程是同步的，所以在`render`的`reconciler`中，如果diff的过程特别耗时，那么导致的结果就是js一直阻塞高优先级的任务(例如用户的点击事件)，表现为页面的卡顿，无法响应。
4. concurrent Mode是react未来的模式，它用时间片调度实现了异步可中断的任务，根据设备性能的不同，时间片的长度也不一样，在每个时间片中，如果任务到了过期时间，就会主动让出线程给高优先级的任务。这部分将在第11节 scheduler&lane模型 这章会具体讲解react是如何实现异步可中断的任务，以及任务的优先级和高优先级是如果插队的。
## 4.state更新流程
1. 在`react`中触发状态更新的方式
    * `ReactDOM.render`
    * `this.setState`
    * `this.forceUpdate`
    * `useState`
    * `useReducer`
2. `this.setState`内调用`this.updater.enqueueSetState`
    ```js
    Component.prototype.setState = function (partialState, callback) {
        if (!(typeof partialState === 'object' || typeof partialState === 'function' ||         partialState == null)) {
            {
            throw Error( "setState(...): takes an object of state variables to update or a function which returns an object of state variables." );
            }
        }
        this.updater.enqueueSetState(this, partialState, callback, 'setState');
    };
    ``` 
3. `this.forceUpdate`和`this.setState`一样，只是会让tag赋值`ForceUpdate`
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
4. 如果标记`ForceUpdate`，`render`阶段组件更新会根据`checkHasForceUpdateAfterProcessing`，和`checkShouldComponentUpdate`来判断，如果`Update`的`tag`是`ForceUpdate`，则`checkHasForceUpdateAfterProcessing`为true，当组件是`PureComponent`时，`checkShouldComponentUpdate`会浅比较state和props，所以当使用`this.forceUpdate`一定会更新
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
            nextContext,
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
    * ![update_flow](https://github.com/bearnew/picture/blob/master/markdown_v2/2021/react%E6%BA%90%E7%A0%81/update_flow.png?raw=true)
7. 创建update
    ```js
    // lane：优先级
    // tag：更新的类型，例如UpdateState、ReplaceState
    // payload：ClassComponent的payload是setState第一个参数，HostRoot的payload是ReactDOM.render的第一个参数
    // callback：setState的第二个参数
    // next：连接下一个Update形成一个链表，例如同时触发多个setState时会形成多个Update，然后用next 连接
    export function createUpdate(eventTime: number, lane: Lane): Update<*> {//创建update
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
    * 对于`HostRoot`或者`ClassComponent`会在`mount`的时候使用`initializeUpdateQueue`创建`updateQueue`，然后将`updateQueue`挂载到`fiber`节点上
    * example
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
    * 在`ensureRootIsScheduled`中，`scheduleCallback`会以一个优先级调度`render`阶段的开始函数`performSyncWorkOnRoot`或者`performConcurrentWorkOnRoot`
    * example
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
    * 初始时`fiber.updateQueue`单链表上有`firstBaseUpdate（update1）`和`lastBaseUpdate（update2）`，以`next`连接
    * `fiber.updateQueue.shared`环状链表上有`update3`和`update4，`以`next`连接互相连接
    * 计算`state`时，先将`fiber.updateQueue.shared`环状链表‘剪开’，形成单链表，连接在`fiber.updateQueue`后面形成`baseUpdate`
    * 然后遍历按这条链表，根据`baseState`计算出`memoizedState`
11. 带优先级的状态更新
    * 通过`ReactDOM.render`创建的应用没有优先级的概念，类比git提交，相当于先commit，然后提交c3
    * 在`concurrent`模式下，类似`git rebase`，先暂存之前的代码，在`master`上开发，然后`rebase`到之前的分支上
        * 在第一次render的时候，低优先级的update会跳过，所以只有c1和c3加入状态的计算
        * 在第二次render的时候，会以第一次中跳过的update（c2）之前的update（c1）作为baseState，跳过的update和之后的update（c2，c3，c4）作为baseUpdate重新计算
        * 在在`concurrent`模式下，`componentWillMount`可能会执行多次，和之前的版本不一致
        * `fiber.updateQueue.shared`会同时存在于`workInprogress Fiber`和`current Fiber`，目的是为了防止高优先级打断正在进行的计算而导致状态丢失，这段代码也是发生在`processUpdateQueue`中


12. 

