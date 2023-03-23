# React 进阶实践指南笔记

## 1.React 里程碑

1. `v16.0`：
    1. 为了解决之前大型`React` 应用一次更新遍历大量虚拟 `DOM` 带来个卡顿问题，`React` 重写了核心模块 `Reconciler` ，启用了 `Fiber` 架构；
    2. 为了在让节点渲染到指定容器内，更好的实现弹窗功能，推出 `createPortal API`；
    3. 为了捕获渲染中的异常，引入 `componentDidCatch` 钩子，划分了错误边界。
2. `v16.2`
    1. 推出 `Fragment` ，解决数组元素问题。
3. `v16.3`
    1. 增加 `React.createRef()` `API`，可以通过 `React.createRef` 取得 `Ref` 对象
    2. 增加 `React.forwardRef()` API，解决高阶组件 `ref` 传递问题
    3. 推出新版本 `context api`，迎接`Provider / Consumer` 时代
    4. 增加 `getDerivedStateFromProps` 和 `getSnapshotBeforeUpdate` 生命周期 。
4. `v16.6`
    1. 增加 `React.memo()` API，用于控制子组件渲染；
    2. 增加 `React.lazy()` API 实现代码分割；
    3. 增加 `contextType` 让类组件更便捷的使用`context`
    4. 增加生命周期 `getDerivedStateFromError` 代替 `componentDidCatch` 。
5. `v16.8`
    1. 全新 `React-Hooks` 支持，使函数组件也能做类组件的一切事情。
6. `v17`
    1. 事件绑定由 `document` 变成 `container` ，移除事件池等。

## 2.JSX

1. createElement
    ```js
    // 第一个参数：如果是组件类型，会传入组件对应的类或函数；如果是 dom 元素类型，传入 div 或者 span 之类的字符串。
    // 第二个参数：一个对象，在 dom 类型中为标签属性，在组件类型中为 props
    // 其他参数：依次为 children，根据顺序排列。
    React.createElement(type, [props], [...children]);
    ```
    ```jsx
    // 编译前
    <div>
        <TextComponent />
        <div>hello,world</div>
        let us learn React!
    </div>
    ```
    ```jsx
    // 编译后
    React.createElement(
        "div",
        null,
        React.createElement(TextComponent, null),
        React.createElement("div", null, "hello,world"),
        "let us learn React!",
    );
    ```
2. 老版本的 `React` 中，为什么写 `jsx` 的文件要默认引入 `React`?
    - 因为 `jsx` 在被 `babel` 编译后，写的 `jsx` 会变成上述 `React.createElement` 形式，所以需要引入 `React`，防止找不到 `React` 引起报错。
3. 在调和阶段，上述 `React element` 对象的每一个子节点都会形成一个与之对应的 `fiber` 对象，然后通过 `sibling`、`return`、`child` 将每一个 `fiber` 对象联系起来。
4. `fiber tag`

```js
export const FunctionComponent = 0; // 函数组件
export const ClassComponent = 1; // 类组件
export const IndeterminateComponent = 2; // 初始化的时候不知道是函数组件还是类组件
export const HostRoot = 3; // Root Fiber 可以理解为根元素 ， 通过reactDom.render()产生的根元素
export const HostPortal = 4; // 对应  ReactDOM.createPortal 产生的 Portal
export const HostComponent = 5; // dom 元素 比如 <div>
export const HostText = 6; // 文本节点
export const Fragment = 7; // 对应 <React.Fragment>
export const Mode = 8; // 对应 <React.StrictMode>
export const ContextConsumer = 9; // 对应 <Context.Consumer>
export const ContextProvider = 10; // 对应 <Context.Provider>
export const ForwardRef = 11; // 对应 React.ForwardRef
export const Profiler = 12; // 对应 <Profiler/ >
export const SuspenseComponent = 13; // 对应 <Suspense>
export const MemoComponent = 14; // 对应 React.memo 返回的组件
```

5.![20230323013413-2023-03-23](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230323013413-2023-03-23.png)

6. `fiber`对应的关系
    - `child`： 一个由父级 `fiber` 指向子级 `fiber` 的指针。
    - `return`：一个子级 `fiber` 指向父级 `fiber` 的指针。
    - `sibling`: 一个 `fiber` 指向下一个兄弟 `fiber` 的指针。
7. `React.cloneElement`
    - `React.createElement`用来创建 `element `
    - `React.cloneElement`用来修改 `element`，并返回一个新的 `React.element` 对象。
8. `Babel` 解析 `JSX` 流程
    - `@babel/plugin-syntax-jsx`: 使用这个插件，能够让 Babel 有效的解析 JSX 语法。
    - `@babel/plugin-transform-react-jsx `: 这个插件内部调用了 `@babel/plugin-syntax-jsx`，可以把 `React JSX` 转化成 `JS` 能够识别的 `createElement` 格式。
9. 新版本`react`编译后
    ```js
    import { jsx as _jsx } from "react/jsx-runtime";
    import { jsxs as _jsxs } from "react/jsx-runtime";
    function Index() {
        return _jsxs("div", {
            children: [
                _jsx("h1", {
                    children: "hello,world",
                }),
                _jsx("span", {
                    children: "let us learn React",
                }),
            ],
        });
    }
    ```
    ```js
    // babel配置
    "presets": [
        ["@babel/preset-react",{
        "runtime": "automatic"
        }]
    ],
    ```
10. `babel`处理`jsx`的流程

    ```js
    // element.js
    import React from "react";

    function TestComponent() {
        return <p> hello,React </p>;
    }
    function Index() {
        return (
            <div>
                <span>模拟 babel 处理 jsx 流程。</span>
                <TestComponent />
            </div>
        );
    }
    export default Index;
    ```

    ```js
    // jsx.js
    const fs = require("fs");
    const babel = require("@babel/core");

    /* 第一步：模拟读取文件内容。 */
    fs.readFile("./element.js", (e, data) => {
        const code = data.toString("utf-8");
        /* 第二步：转换 jsx 文件 */
        const result = babel.transformSync(code, {
            plugins: ["@babel/plugin-transform-react-jsx"],
        });
        /* 第三步：模拟重新写入内容。 */
        fs.writeFile("./element.js", result.code, function () {});
    });
    ```

    ```js
    // 编译后
    import React from "react";

    function TestComponent() {
        return /*#__PURE__*/ React.createElement("p", null, " hello,React ");
    }

    function Index() {
        return /*#__PURE__*/ React.createElement(
            "div",
            null,
            /*#__PURE__*/ React.createElement(
                "span",
                null,
                "\u6A21\u62DF babel \u5904\u7406 jsx \u6D41\u7A0B\u3002",
            ),
            /*#__PURE__*/ React.createElement(TestComponent, null),
        );
    }
    export default Index;
    ```

## 3.Component

1. 如果没有在 constructor 的 super 函数中传递 props，那么接下来 constructor 执行上下文中就获取不到 props
    - 绑定 props 是在父类 Component 构造函数中，执行 super 等于执行 Component 函数，此时 props 没有作为第一个参数传给 super() ，在 Component 中就会找不到 props 参数，从而变成 undefined
    ```js
    /* 假设我们在 constructor 中这么写 */
    constructor(){
        super()
        console.log(this.props) // 打印 undefined 为什么?
    }
    ```
2. 类组件和函数组件
    1. 对于类组件来说，底层只需要实例化一次，实例中保存了组件的 state 等状态。对于每一次更新只需要调用 render 方法以及对应的生命周期就可以了。
    2. 在函数组件中，每一次更新都是一次新的函数执行，一次函数组件的更新，里面的变量会重新声明。
3. 组件通信方式
    1. `props` 和 `callback` 方式
        - 父组件 -> 通过自身 state 改变，重新渲染，传递 props -> 通知子组件
        - 子组件 -> 通过调用父组件 props 方法 -> 通知父组件。
    2. `ref` 方式。
    3. `React-redux` 或 `React-mobx` 状态管理方式。
    4. `context` 上下文方式。
    5. `event bus` 事件总线。
        - 组件之间的状态是未知的
        - 违背了 `React` 数据流向原则
4. 组件强化方式
    1. 类组件继承
    2. 函数组件自定义 `Hooks`
    3. 函数组件自定义 `Hooks`

## 4.State

1.  `setState`
    -   example
    ```js
    /* 第一个参数为object类型 */
    this.setState({ number: 1 }, () => {
        console.log(this.state.number); //获取最新的number
    });
    ```
    -   ![20230324011744-2023-03-24](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230324011744-2023-03-24.png)
2.  限制`state`更新视图
    1. `pureComponent` 可以对 `state` 和 `props` 进行浅比较，如果没有发生变化，那么组件不更新。
    2. `shouldComponentUpdate` 生命周期可以通过判断前后 `state` 变化来决定组件需不需要更新，需要更新返回`true`，否则返回`false`。
3.  `enqueueSetState`
    -   调用 `setState` 方法，实际上是 `React` 底层调用 `Updater` 对象上的 `enqueueSetState` 方法
4.  批量更新
    ```js
    function batchedEventUpdates(fn, a) {
        /* 开启批量更新  */
        isBatchingEventUpdates = true;
        try {
            /* 这里执行了的事件处理函数， 比如在一次点击事件中触发setState,那么它将在这个函数内执行 */
            return batchedEventUpdatesImpl(fn, a, b);
        } finally {
            /* try 里面 return 不会影响 finally 执行  */
            /* 完成一次事件，批量更新  */
            isBatchingEventUpdates = false;
        }
    }
    ```
    -   ![20230324014744-2023-03-24](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230324014744-2023-03-24.png)
    ```js
    // 0, 0, 0, callback1 1 ,callback2 1 ,callback3 1
    export default class index extends React.Component {
        state = { number: 0 };
        handleClick = () => {
            this.setState({ number: this.state.number + 1 }, () => {
                console.log("callback1", this.state.number);
            });
            console.log(this.state.number);
            this.setState({ number: this.state.number + 1 }, () => {
                console.log("callback2", this.state.number);
            });
            console.log(this.state.number);
            this.setState({ number: this.state.number + 1 }, () => {
                console.log("callback3", this.state.number);
            });
            console.log(this.state.number);
        };
        render() {
            return (
                <div>
                    {this.state.number}
                    <button onClick={this.handleClick}>number++</button>
                </div>
            );
        }
    }
    ```
5.  批量更新失效
    -   ![20230324015002-2023-03-24](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230324015002-2023-03-24.png)
    ```js
    // callback1 1 , 1, callback2 2 , 2,callback3 3 , 3
    setTimeout(() => {
        this.setState({ number: this.state.number + 1 }, () => {
            console.log("callback1", this.state.number);
        });
        console.log(this.state.number);
        this.setState({ number: this.state.number + 1 }, () => {
            console.log("callback2", this.state.number);
        });
        console.log(this.state.number);
        this.setState({ number: this.state.number + 1 }, () => {
            console.log("callback3", this.state.number);
        });
        console.log(this.state.number);
    });
    ```
6.  强制开启批量更新
    ```js
    import ReactDOM from "react-dom";
    const { unstable_batchedUpdates } = ReactDOM;
    //  0 , 0 , 0 , callback1 1 , callback2 1 ,callback3 1
    setTimeout(() => {
        unstable_batchedUpdates(() => {
            this.setState({ number: this.state.number + 1 });
            console.log(this.state.number);
            this.setState({ number: this.state.number + 1 });
            console.log(this.state.number);
            this.setState({ number: this.state.number + 1 });
            console.log(this.state.number);
        });
    });
    ```
7.  `flushSync` 可以将回调函数中的更新任务，放在一个较高的优先级中
    -   flushSync 中的 setState > 正常执行上下文中 setState > setTimeout ，Promise 中的 setState。
    -   flushSync 在同步条件下，会合并之前的 setState | useState
    ```js
    // 3 4 1
    handerClick=()=>{
        setTimeout(()=>{
            this.setState({ number: 1  })
        })
        this.setState({ number: 2  })
        ReactDOM.flushSync(()=>{
            this.setState({ number: 3  })
        })
        this.setState({ number: 4  })
    }
    render(){
        console.log(this.state.number)
        return ...
    }
    ```
8.  `useState`
    ```js
    const [number, setNumber] = React.useState(() => {
        /*  props 中 a = 1 state 为 0-1 随机数 ， a = 2 state 为 1 -10随机数 ， 否则，state 为 1 - 100 随机数   */
        if (props.a === 1) return Math.random();
        if (props.a === 2) return Math.ceil(Math.random() * 10);
        return Math.ceil(Math.random() * 100);
    });
    ```
    ```js
    const [number, setNumber] = React.useState(0);
    const handleClick = () => {
        setNumber((state) => state + 1); // state - > 0 + 1 = 1
        setNumber(8); // state - > 8
        setNumber((state) => state + 1); // state - > 8 + 1 = 9
    };
    ```
9.  把 state 作为依赖项传入 useEffect 第二个参数 deps, 监听 state 变化
    ```js
    // 2
    // 监听number变化，此时number是2
    // 1
    // 监听number变化，此时number是1
    // 3
    // 监听number变化，此时number是3
    export default function Index(props) {
        const [number, setNumber] = React.useState(0);
        /* 监听 number 变化 */
        React.useEffect(() => {
            console.log("监听number变化，此时的number是:  " + number);
        }, [number]);
        const handerClick = () => {
            /** 高优先级更新 **/
            ReactDOM.flushSync(() => {
                setNumber(2);
            });
            /* 批量更新 */
            setNumber(1);
            /* 滞后更新 ，批量更新规则被打破 */
            setTimeout(() => {
                setNumber(3);
            });
        };
        console.log(number);
        return (
            <div>
                <span> {number}</span>
                <button onClick={handerClick}>number++</button>
            </div>
        );
    }
    ```
10. 函数 dispatch，在本次函数执行上下文中，是获取不到最新的 state 值的
    -   在函数一次执行过程中，函数内部所有变量重新声明，所以改变的 state ，只有在下一次函数组件执行时才会被更新
    ```js
    // 0 0 0
    const [number, setNumber] = React.useState(0);
    const handleClick = () => {
        ReactDOM.flushSync(() => {
            setNumber(2);
            console.log(number);
        });
        setNumber(1);
        console.log(number);
        setTimeout(() => {
            setNumber(3);
            console.log(number);
        });
    };
    ```
11. 传入相同的`state`，视图不会更新
    -   在 useState 的 dispatchAction 处理逻辑中，会浅比较两次 state ，发现 state 相同，不会开启更新调度任务； demo 中两次 state 指向了相同的内存空间，所以默认为 state 相等，就不会发生视图更新了。
    ```js
    export default function Index() {
        const [state, dispatchState] = useState({ name: "alien" });
        const handleClick = () => {
            // 点击按钮，视图没有更新。
            state.name = "Alien";
            dispatchState(state); // 直接改变 `state`，在内存中指向的地址相同。
        };
        return (
            <div>
                <span> {state.name}</span>
                <button onClick={handleClick}>changeName++</button>
            </div>
        );
    }
    ```
12. 总结
    1. setState 和 useState 更新视图，底层都调用了 scheduleUpdateOnFiber 方法，而且事件驱动情况下都有批量更新规则。
    2. 在不是 pureComponent 组件模式下， setState 不会浅比较两次 state 的值，只要调用 setState，在没有其他优化手段的前提下，就会执行更新。但是 useState 中的 dispatchAction 会默认比较两次 state 是否相同，然后决定是否更新组件。
    3. setState 有专门监听 state 变化的回调函数 callback，可以获取最新 state；但是在函数组件中，只能通过 useEffect 来执行 state 变化引起的副作用
    4. setState 在底层处理逻辑上主要是和老 state 进行合并处理，而 useState 更倾向于重新赋值。
13.

## hooks 原理

1. `hooks`出现的本质原因
    - 函数组件也能做类组件的事，有状态、能处理副作用、能获取`ref`
    - 解决逻辑复用难的问题
    - 拥抱函数式编程
2. `hooks`与`fiber`
    - `function`组件(更新)->`hooks`(更新)->组件对应的`fiber`
    - `function`组件(取值)<-`hooks`(取值)<-组件对应的`fiber`
3. `hooks`的 3 种处理策略
    - `ContextOnlyDispatcher`: 开发者在函数组件外部调用`hooks`会抛出异常
    - `HooksDispatcherOnMount`: 函数组件初始化`mount`,奖励`hooks`和`fiber`之间的桥梁
    - `HooksDispatcherOnUpdate`: 函数组件更新，需要`Hooks`去获取或者更新维护状态
    ```js
    const HooksDispatcherOnMount = { /* 函数组件初始化用的 hooks */
        useState: mountState,
        useEffect: mountEffect,
        ...
    }
    const  HooksDispatcherOnUpdate ={/* 函数组件更新用的 hooks */
        useState:updateState,
        useEffect: updateEffect,
        ...
    }
    const ContextOnlyDispatcher = {  /* 当hooks不是函数内部调用的时候，调用这个hooks对象下的hooks，所以报错。 */
        useEffect: throwInvalidHookError,
        useState: throwInvalidHookError,
        ...
    }
    ```
4. 函数组件触发
    - 用`updateFunctionComponent`更新`fiber`,`updateFunctionComponent`内部就会调用`renderWithHooks`
    ```js
    let currentlyRenderingFiber;
    function renderWithHooks(current, workInProgress, Component, props) {
        currentlyRenderingFiber = workInProgress;
        workInProgress.memoizedState =
            null; /* 每一次执行函数组件之前，先清空状态 （用于存放hooks列表）*/
        workInProgress.updateQueue = null; /* 清空状态（用于存放effect list） */
        ReactCurrentDispatcher.current =
            current === null || current.memoizedState === null
                ? HooksDispatcherOnMount
                : HooksDispatcherOnUpdate; /* 判断是初始化组件还是更新组件 */
        let children = Component(
            props,
            secondArg,
        ); /* 执行我们真正函数组件，所有的hooks将依次执行。 */
        ReactCurrentDispatcher.current =
            ContextOnlyDispatcher; /* 将hooks变成第一种，防止hooks在函数组件外部调用，调用直接报错。 */
    }
    ```
5. 每个` hooks` 内部执行`mountWorkInProgressHook` ，然后每一个` hook` 通过 `next` 和下一个` hook` 建立起关联
    ```js
    export default function Index() {
        const [number, setNumber] = React.useState(0); // 第一个hooks
        const [num, setNum] = React.useState(1); // 第二个hooks
        const dom = React.useRef(null); // 第三个hooks
        React.useEffect(() => {
            // 第四个hooks
            console.log(dom.current);
        }, []);
        return (
            <div ref={dom}>
                <div onClick={() => setNumber(number + 1)}> {number} </div>
                <div onClick={() => setNum(num + 1)}> {num}</div>
            </div>
        );
    }
    ```
6. 函数组件对应 `fiber` 用 `memoizedState` 保存 `hooks` 信息
7. `hooks`更新
    - 更新过程中，如果通过 if 条件语句，增加或者删除 `hooks`，在复用 `hooks` 过程中，会产生复用 `hooks` 状态和当前 `hooks` 不一致的问题
8.
