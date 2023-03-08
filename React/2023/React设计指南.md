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
