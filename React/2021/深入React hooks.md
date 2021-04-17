# React hooks

## 代数效应

- 在函数调用中，将副作用剥离出去

## Hooks 的作用

- 践行代数效应
- 无论`useCommentNum`是同步还是异步，`TotalCommentNum`都能获取到想要的值

```js
import { useEffect } from "react";

function TotalCommentNum({ id1, id2 }) {
  const num1 = useCommentNum(id1);
  const num2 = useCommentNum(id2);

  return num1 + num2;
}

function useCommentNum(id) {
  const [num, updateNum] = useState(0);
  useEffect(() => {
    fetch(`http://test.com?id=${id}`)
      .then((res) => res.json())
      .then(({ num }) => {
        updateNum(num);
      });
  }, [id]);

  return num;
}
```

## Hooks 的实现

```js
let isMount = true;
let workInProgressHook = null;

const fiber = {
  stateNode: App,
  memorizeState: null,
};

function useState(initialState) {
  let hook;

  if (isMount) {
    hook = {
      memorizeState: initialState,
      next: null,
      queue: {
        pending: null,
      },
    };

    if (!fiber.memorizeState) {
      fiber.memorizeState = hook;
      workInProgressHook = hook;
    } else {
      workInProgressHook.next = hook;
    }
    workInProgressHook = hook;
  } else {
    hook = workInProgressHook;
    workInProgressHook = workInProgressHook.next;
  }

  let baseState = hook.memorizeState;
  if (hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next;

    do {
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next;
    } while (firstUpdate !== hook.queue.pending.next);

    hook.queue.pending = null;
  }

  hook.memorizeState = baseState;
  return [baseState, dispatchAction.bind(null, hook.queue)];
}

function dispatchAction(queue, action) {
  const update = {
    action,
    next: null,
  };

  if (queue.pending === null) {
    update.next = update;
  } else {
    // 环状链表
    update.next = queue.pending.next;
    queue.pending.next = update;
  }

  queue.pending = update;

  schedule();
}

// 调度
function schedule() {
  workInProgressHook = fiber.memorizeState;
  const app = fiber.stateNode();
  isMount = false;

  return app;
}

function App() {
  const [num, updateNum] = useState(0);
  const [num1, updateNum1] = useState(10);

  console.log("isMount", isMount);
  console.log("num", num);
  console.log("num1", num1);

  return {
    onClick() {
      updateNum((num) => num + 1);
    },
    onFocus() {
      updateNum1((num) => num + 10);
    },
  };
}

window.app = schedule();

app.onClick();
app.onFocus();
```

## React 实现的 Hook 源码
