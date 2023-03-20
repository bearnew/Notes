# React 设计指南

## 1.细粒度更新

```js
// 保存effect调用栈
const effectStack = [];

function subscribe(effect, subs) {
  // 订阅关系建立
  subs.add(effect);
  // 依赖关系建立
  effect.deps.add(subs);
}

function cleanup(effect) {
  // 从该effect订阅的所有state对应的subs中移除该effect
  for (const subs of effect.deps) {
    subs.delete(effect);
  }

  // 将该effect依赖的所有state对应的subs移除
  effect.deps.clear();
}

function useState(value) {
  // 保存订阅该state变化的effect
  const subs = new Set();

  const getter = () => {
    // 获取当前上下文的effect
    const effect = effectStack[effectStack.length - 1];
    if (effect) {
      // 建立订阅发布关系
      subscribe(effect, subs);
    }
    return value;
  };

  const setter = (nextValue) => {
    value = nextValue;
    // 通知所有订阅该state变化的effect执行
    for (const effect of [...subs]) {
      effect.execute();
    }
  };

  return [getter, setter];
}

function useEffect(callback) {
    const execute = () => {
        // 重置依赖
        cleanup(effect);
        // 将当前effect推入栈顶
        effectStack.push(effect);

        try {
            // 执行回调
            callback();
        } finally {
            // effect出栈
            effectStack.pop();
        }
    }

    const effect = {
        execute,
        deps: new Set();
    }

    // 立刻执行一次，建立订阅发布关系
    execute();
}

function useMemo(callback) {
    const [s, set] = useState();
    // 首次执行callback，初始化value
    useEffect(() => set(callback()));
    return s;
}
```

## 2.新架构

- `Scheduler`(调度器): 调度任务的优先级，高优先级任务优先进入`Reconciler`
- `Reconciler`(协调器): `VDOM`的实现，负责根据自变量变化计算出`UI`变化

  - `Reconciler`的更新流程可中断，每次循环都会调用`shouldYield`判断当前`Time Slice`是否有剩余时间，没有剩余时间则暂缓更新流程，将主流程交给渲染流水线，等待下一个宏任务再继续执行，这就是`Time Slice`的实现原理 -核心流程

  ```js
  function workLoopConcurrent() {
    // 一直执行任务，直到任务执行完或中断
    while (workInProgress !== null && !shouldYield()) {
      performUnitOfWork(workInProgress);
    }
  }

  function shouldYield() {
    // 当前时间是否大于过期时间
    // 其中deadline = getCurrentTime() + yieldInterval
    // yieldInterval为调度器预设的时间间隔，默认为5ms
    return getCurrentTime() >= deadline;
  }
  ```

  ```js

  ```

- `Renderer`(渲染器): 负责将`UI`变化渲染到宿主环境

## 3.新架构好处

1. `Reconciler`从同步变为异步，可中断，解决 CPU 瓶颈，多个更新流程并发执行，突破`I/O`瓶颈

## 4.Fiber 架构

1. `React`3 种节点类型

- `React Element`(React 元素)
- `React Component`(React 组件)
- `FiberNode`(组成 Fiber 架构的节点类型)

```js
// App是React Component
const App = () => {
  return <h3>Hello</h3>;
};

// ele是React Element
const ele = <App />;

// 在React运行时内部，包含App对应FiberNode
ReactDom.createRoot(rootNode).render(ele);
```

2. 作为静态的数据结构，每个`FiberNode`对应一个`React`元素，用于保存`React`元素的类型，对应的`DOM`元素等信息
3. 作为动态的工作单元，每个`FiberNode`保存本次更新中`React`元素变化的数据、要执行的工作（增、删、改、更新 Ref、副作用等）
4. `FiberNode`构造函数

```js
// FiberNode构造函数
function FiberNode(tag, pendingProps, key, mode) {
  this.tag = tag;
  this.key = key;
  this.elementType = null;
}
```

5. `Fiber`节点的属性连接

```js
// 指向父FiberNode,子FiberNode及其兄弟FiberNode执行完completeWork后会返回父FiberNode
this.return = null;
// 指向第一个子FiberNode
this.child = null;
// 指向右边的兄弟FiberNode
this.sibling = null;
```

6. 显卡的双缓存

   - 显卡合成图像并写入后缓冲区，后缓冲区被写入图像，前后缓存区就会互换

   - 刷新频率为 60Hz 的显示器，每秒从前缓存区读取 60 次图像，显示到显示器上。

7. React 的双缓存
   - 一颗真实 UI 对应的`Fiber Tree`
   - 正在内存中构建的`Fiber Tree`
   ```js
   // 用于clone fiberNode的方法
   function cloneChildFibers(current, workInProgress) {
     // current是前缓冲区的FiberNode，对应真实UI
     // workInProgress对应构建中的Fiber tree
   }
   ```

## 5.render 阶段

```js
// 同步更新流程
// performSyncWorkOnRoot会执行该方法
function workLoopSync() {
  // workInProgress为null，表示Fiber构建已结束
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}
```

```js
// 并发更新流程
// performConcurrentWorkOnRoot会执行该方法
function workLoopConcurrent() {
  // workInProgress为null，表示Fiber构建已结束
  // shouldYield是否可中断
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

## 6.更新流程

1. beginWork，会根据当前`fiberNode`创建下一级`fiberNode`，在`update`时标记`Placement`(新增、移动)、`ChildDeletion`(删除)

```js
function beginWork(current, workInProgress, renderLanes) {
  if (current !== null) {
    // 是update流程
  } else {
    // 是mount流程
  }

  // 判断tag不同，进入不同处理逻辑
  switch (workInProgress.tag) {
    case IndeterminateComponnet:
    // mount进入的分支
    // mount和update最终都会进入reconcileChildren的方法
    // mount传参shouldTrackSideEffects为false,不追踪副作用
    // update传true，标记flags，方便后续操作
    // ...
    case LazyComponent:
    // ...
    case FunctionComponent:
    // ...
    case ClassComponent:
    // ...
    case HostRoot:
    // ...
    case HostComponent:
    // ...
    case HostText:
    // ...
  }
}
```

2. `completeWork`在`mount`时会构建`DOM Tree`，完成`completeWork`后，`Reconciler`工作流程结束

## 7.commit 阶段(renderer 阶段)

1. `BeforeMutation`阶段
2. `Mutation`阶段
3. `Layout`阶段

## 8.错误处理

1. API

- `getDerivedStateFromError`静态方法，提供一个机会渲染`fallback UI`
- `componentDidCatch`组件实例方法，错误发生后，提供一个机会记录错误信息

2. 不会被捕获的错误

   1. 事件回调中的错误

   ```js
   const B = () => {
     const handleClick = () => {
       throw new Error("错误发生");
     };
     return <div onClick={handleClick}>Hello</div>;
   };
   ```

   2. 异步代码，如`setTimeout`、`requestAnimationFrame`回调
   3. `SSR`, `SSR`不属于`React`流程
   4. `ErrorBoundaries`本身`Component`的错误，`ErrorBoundaries`只会捕获子孙组件的错误

## 9.schedule

1. 执行的动力-`Scheduler`
2. 执行的底层算法-`lane`模型
3. 执行的策略-调度策略
4. 执行的边界情况-饥饿情况
5. 低级特性-`Batched Updates`等
6. 高级特性-各种`Concurrent Feature`

## 10.简易事件系统

```js
class SyntheticEvent {
  constructor(e) {
    this.nativeEvent = e;
  }
  stopPropagation() {
    this._stopPropagation = true;
    if (this.nativeEvent.stopPropagation) {
      this.nativeEvent.stopPropagation();
    }
  }
}

const triggerEventFlow = (paths, type, se) => {
  for (let i = paths.length; i--) {
    const pathNode = paths[i];
    const callback = pathNode[type];
    if (callback) {
      callback.call(null, se);
    }
    if (se._stopPropagation) {
      break;
    }
  }
}

const dispatchEvent = (e, type) => {
  const se = new SyntheticEvent(e);
  const ele = e.target;
  let fiber;
  for (let prop in ele) {
    if (prop.toLowerCase().includes('fiber')) {
      fiber = ele[prop];
    }
  }
  const paths = collectPaths(type, fiber);
  triggerEventFlow(paths, type + "CAPTURE", se);
  if (!se._stopPropagation) {
    triggerEventFlow(paths.reverse(), type, se);
  }
}

const collectPaths = (type, begin) => {
  const paths = [];
  while(begin,tag !== 3) {
    const { memoizedProps, tag } = begin;
    if (tag === 5) {
      const eventName = ("on" + type).toUpperCase();
      if (memoizedProps && Object.keys(memoizedProps).includes(eventName)) {
        const pathNode = {};
        pathNode[type.toUpperCase()] = memoizedProps[eventName];
        paths.push(pathNode);
      }
    }
    begin = begin.return;
  }
  return path;
}

export const addEvent = (container, type) => {
  container.addEventListener(type, e => {
    dispatchEvent(e, type.toUpperCase(), container);
  })
}
```

## 11.Reconcile 流程

1. `React`的`diff`会预设 3 个限制

   1. 只对同级元素进行`diff`,`DOM`元素在前后 2 次更新跨越了层级，`React`不会尝试复用他
   2. 两个不同类型的元素会产生不同的树，如果元素从`DIV`变成`P`，`React`会销毁`DIV`及其子孙元素，并新建`P`及其子孙元素
   3. 开发者可以通过`key`来暗示哪些子元素在不同渲染下能够保持稳定

2. 同级多节点`diff`，属于以下 1 种或多种
   1. 节点位置没有变化
   2. 节点增删
   3. 节点移动
3. diff 算法
   1. 第一轮遍历尝试逐个复用节点
   2. 第二轮遍历处理剩下的节点
4. 简易`diff`算法

```typescript
type NodeList = Node[];
type Flag = "Placement" | "Deletion";

interface Node {
  key: string;
  flag?: Flag;
  index?: number;
}

// diff算法的实现
function diff(before: NodeList, after: NodeList): NodeList {
  let lastPlacedIndex = 0;
  const result: NodeList = [];

  const beforeMap = new Map<string, Node>();
  before.forEach((node, i) => {
    node.index = i;
    beforeMap.set(node.key, node);
  });

  for (let i = 0; i < after.length; i++) {
    const afterNode = after[i];
    afterNode.index = i;
    const beforeNode = beforeMap.get(afterNode.key);

    if (beforeNode) {
      // 复用旧节点
      beforeMap.delete(beforeNode.key);

      const oldIndex = beforeNode.index as number;
      if (oldIndex < lastPlacedIndex) {
        afterNode.flag = "Placement";
        result.push(afterNode);
        continue;
      } else {
        lastPlaceIndex = oldIndex;
      }
    } else {
      // 创建新节点
      afterNode.flag = "Placement";
      result.push(afterNode);
    }
  }

  beforeMap.forEach((node) => {
    node.flag = "Deletion";
    result.push(node);
  });

  return result;
}
```

## 12.useState

```js
declare global {
  interface Window {
    app: any;
  }
}

let callbackNode: number | undefined = undefined;

let workInProgressHook: Hook | undefined;
let isMount = true;

type Action = (key: any) => void;

interface Fiber {
  memoizedState?: Hook;
  stateNode: () => { click: () => void };
}

interface Hook {
  queue: Queue;
  memoizedState: any;
  next?: Hook;
}

interface Update {
  action: Action;
  next?: Update;
}

interface Queue {
  pending?: Update;
}

const fiber: Fiber = {
  memoizedState: undefined,
  stateNode: App
};

function schedule() {
  if (callbackNode) {
    clearTimeout(callbackNode);
  }
  callbackNode = setTimeout(() => {
    workInProgressHook = fiber.memoizedState;
    window.app = fiber.stateNode();
    isMount = false;
  });
}

function dispatchSetState(queue: Queue, action: Action) {
  const update: Update = {
    action,
    next: undefined
  };
  if (!queue.pending) {
    update.next = update;
  } else {
    update.next = queue.pending.next;
    queue.pending.next = update;
  }
  queue.pending = update;

  schedule();
}

function useState(initialState: any) {
  let hook;

  if (isMount) {
    hook = {
      queue: {
        pending: undefined
      },
      memoizedState: initialState,
      next: undefined
    };
    if (!fiber.memoizedState) {
      fiber.memoizedState = hook;
    } else {
      (workInProgressHook as Hook).next = hook;
    }
    workInProgressHook = hook;
  } else {
    hook = workInProgressHook;
    workInProgressHook = (workInProgressHook as Hook).next;
  }

  if (!hook) {
    throw new Error("目标Hook不存在");
  }

  let baseState = hook.memoizedState;
  if (hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next as Update;

    do {
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next as Update;
    } while (firstUpdate !== hook.queue.pending.next);

    hook.queue.pending = undefined;
  }
  hook.memoizedState = baseState;

  return [baseState, dispatchSetState.bind(null, hook.queue)];
}

function App() {
  const [num1, updateNum1] = useState(0);
  const [num2, updateNum2] = useState(100);

  console.log(`${isMount ? "mount" : "update"} `, num1, num2);

  return {
    click() {
      updateNum1((num: number) => num + 1);
      updateNum1((num: number) => num + 1);
      updateNum2((num: number) => num + 100);
      updateNum2((num: number) => num + 100);
    }
  };
}

schedule();

export {};

```
