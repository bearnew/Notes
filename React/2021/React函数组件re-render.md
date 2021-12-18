# React 函数组件的 re-render

## 1.re-render 的 3 种情况

1. 组件本身使用 `useState` 或 `useReducer` 更新，引起的 `re-render`；

```js
// 每次点击add，都会re-render
const Counter = () => {
  console.log("counter render");
  const [count, addCount] = useState(0);
  return (
    <div className="counter">
      <div className="counter-num">{count}</div>
      <button
        onClick={() => {
          addCount(count + 1);
        }}
      >
        add
      </button>
    </div>
  );
};
```

```js
// 点击不会引起re-render
// 此处state更新用的原引用对象，导致`Object.is`新老state比较为true，返回不更新
const Counter = () => {
  console.log("counter render");
  const [count, addCount] = useState({ num: 0, time: Date.now() });
  const clickHandler = () => {
    count.num++;
    count.time = Date.now();
    addCount(count);
  };
  return (
    <div className="counter">
      <div className="counter-num">
        {count.num}, {count.time}
      </div>
      <button onClick={clickHandler}>add</button>
    </div>
  );
};
```

```js
// 强制更新
const [, forceUpdate] = useState({});
forceUpdate({});
```

2. 父组件更新引起的 `re-render`；

```js
// 父组件引起的re-render
const Hello = ({ name }) => {
  console.log("hello render");
  return <div>hello {name}</div>;
};

const App = () => {
  console.log("app render");
  const [count, addCount] = useState(0);
  return (
    <div className="app">
      <Hello name="react" />
      <div className="counter-num">{count}</div>
      <button
        onClick={() => {
          addCount(count + 1);
        }}
      >
        add
      </button>
    </div>
  );
};
```

```js
// 1. 将更新组件抽离成单独组件
const App = () => {
  console.log("app render");
  return (
    <div className="app">
      <Hello name="react" />
      <Counter />
    </div>
  );
};
```

```js
// 2. 将不需要re-render部分抽离，以插槽（children）形式渲染
// 2. App 组件预留 children 位
const App = ({ children }) => {
  console.log("app render");
  const [count, addCount] = useState(0);
  return (
    <div className="app">
      {children}
      <div className="counter-num">{count}</div>
      <button
        onClick={() => {
          addCount(count + 1);
        }}
      >
        add
      </button>
    </div>
  );
};

// 使用
<App>
  <Hello name="react" />
</App>;
```

```js
// 3. 以其他属性的方式传入组件，其本质就是传入的变量，所以也不会引起 re-render
```

```js
// 4.对于是否需要 re-render，类组件提供了两种方法：PureComponent 组件和 shouldComponentUpdate 生命周期方法。
// 4.函数组件使用React.memo决定是否re-render
const Hello = React.memo(({ name }) => {
  console.log("hello render");
  return <div>hello {name}</div>;
});

const App = () => {
  console.log("app render");
  const [count, addCount] = useState(0);
  return (
    <div className="app">
      <Hello name="react" />
      <div className="counter-num">{count}</div>
      <button
        onClick={() => {
          addCount(count + 1);
        }}
      >
        add
      </button>
    </div>
  );
};
```

```js
// 5.每次点击计数，都会重新定义 clickHandler 处理函数，这样 shallowEqual 浅比较发现 onClick 属性值不同，于是将会进行 re-render
// 新增 onClick 处理函数
const Hello = memo(({ name, onClick }) => {
  console.log("hello render");
  return <div onClick={onClick}>hello {name}</div>;
});

const App = ({ children }) => {
  console.log("counter render");
  const [count, addCount] = useState(0);

  // 新增处理函数
  const clickHandler = () => {
    console.log("hello click");
  };

  return (
    <div className="counter">
      <Hello name="react" onClick={clickHandler} />
      <div className="counter-num">{count}</div>
      <button
        onClick={() => {
          addCount(count + 1);
        }}
      >
        add
      </button>
    </div>
  );
};
```

```js
// 6.使用 useCallback 将定义的函数缓存起来，如下就不会引起 re-render 了
// 新增处理函数，使用 useCallback 缓存起来
const clickHandler = useCallback(() => {
  console.log("hello click");
}, []);
```

```js
// 7.useCallback 的原理主要是在挂载的时候，将定义的 callback 函数及 deps 依赖挂载该 hook 的 memoizedState，当更新时，将依赖进行对比，如果依赖没变，则直接返回老的 callback 函数，否则则更新新的 callback 函数及依赖：
// 挂载时
function mountCallback(callback, deps) {
  var hook = mountWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  hook.memoizedState = [callback, nextDeps];
  return callback;
}

// 更新时
function updateCallback(callback, deps) {
  var hook = updateWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  var prevState = hook.memoizedState;

  if (prevState !== null) {
    if (nextDeps !== null) {
      var prevDeps = prevState[1];

      // 如果依赖未变，则直接返回老的函数
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }
  // 否则更新新的 callback 函数
  hook.memoizedState = [callback, nextDeps];
  return callback;
}
```

```js
// 8.点击 Hello 组件时，会发现我们打印的 count 还是挂载时候的值，而不是最新的 count 值。其实，这都是是闭包惹得祸
// 新增处理函数，使用 useCallback 缓存起来
// 在 callback 函数中使用 count
const clickHandler = useCallback(() => {
  console.log("count: ", count);
}, []);
```

```js
// 9.当 callback 函数需要使用 state 值时，如果是 state 值更新引起的更新，useCallback 其实是没有任何效果的。
// 新增处理函数，使用 useCallback 缓存起来
// 在 callback 函数中使用 count
// 并将 count 添加进依赖
// 只要 count 更新，callback 函数又将更新，useCallback 就没什么用了
const clickHandler = useCallback(() => {
  console.log("count: ", count);
}, [count]);
```

```js
// 10.通过 useRef 来保存变化的值；通过 useEffect 来更新变化的值；通过 useCallback 来返回固定的 callback。
const App = ({ children }) => {
  console.log("counter render");
  const [count, addCount] = useState(0);

  // 1、创建一个 countRef
  const countRef = useRef(count);

  // 2、依赖改成 countRef
  // 浅对比 countRef 时，将不会引起 callback 函数更新
  // callback 函数又中可以读取到 countRef.current 值，即 count 的最新值
  const clickHandler = useCallback(() => {
    console.log("count: ", countRef.current);
  }, [countRef]);

  // 3、当 count 更新时，更新 countRef 的值
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  return (
    <div className="counter">
      <Hello name="react" onClick={clickHandler} />
      <div className="counter-num">{count}</div>
      <button
        onClick={() => {
          addCount(count + 1);
        }}
      >
        add
      </button>
    </div>
  );
};
```

```js
// 11.useRef 保存值的原理
// 挂载 ref
function mountRef(initialValue) {
  var hook = mountWorkInProgressHook();

  // 创建一个 ref 对象，将值挂在 current 属性上
  var ref = {
    current: initialValue,
  };

  {
    Object.seal(ref);
  }

  // 将 ref 挂到 hook 的 memoizedState 属性上，并返回
  hook.memoizedState = ref;
  return ref;
}

// 更新 ref
function updateRef(initialValue) {
  var hook = updateWorkInProgressHook();
  return hook.memoizedState; // 直接返回 ref
}
```

3. 组件本身使用了 `useContext`，`context` 更新引起的 `re-render`。
