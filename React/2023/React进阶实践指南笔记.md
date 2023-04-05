/\*

-   @Description: undefined
-   @Author: tuoerfu
-   @Date: 2023-03-26 00:33:46
-   @Last Modified by: tuoerfu
-   @Last Modified time: 2023-03-26 00:33:46
    \*/

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

## 5.深入 Props

1. `Props的作用`
    1. `Props`作为一个子组件渲染数据源
    2. `Props`作为一个通知父组件的函数
    3. `Props`作为一个单纯的组件传递
    4. `Props`作为渲染函数
    5. `render props`，放在`children`的属性上
    6. `render component`插槽组件上
2. `props`无法检测出数据更新波及的范围，有了`PureComponent`和`memo`等性能优化方案
3. 监听`props`的变化
    - 类组件: `componentWillReceiveProps` `getDerivedStateFromProps`
    - 函数组件：`useEffect`(`useEffect`初始化会默认执行一次)
4. `render props`模式
    ```js
    <Container>
        {(ContainerProps) => <Children {...ContainerProps} />}
    </Container>
    ```
    ```js
    function Container(props) {
        const ContainerProps = {
            name: "alien",
            mes: "let us learn react",
        };
        return props.children(ContainerProps);
    }
    ```
5. 插槽组件
    ```js
    <Container>
        <Children>
    </Container>
    ```
6. 混合模式

    ```js
    <Container>
        <Children />
        {(ContainerProps) => <Children {...ContainerProps} name={"haha"} />}
    </Container>
    ```

    ```js
    const Children = (props) => (
        <div>
            <div>hello, my name is {props.name} </div>
            <div> {props.mes} </div>
        </div>
    );

    function Container(props) {
        const ContainerProps = {
            name: "alien",
            mes: "let us learn react",
        };
        return props.children.map((item) => {
            if (React.isValidElement(item)) {
                // 判断是 react elment  混入 props
                return React.cloneElement(
                    item,
                    { ...ContainerProps },
                    item.props.children,
                );
            } else if (typeof item === "function") {
                return item(ContainerProps);
            } else return null;
        });
    }

    const Index = () => {
        return (
            <Container>
                <Children />
                {(ContainerProps) => (
                    <Children {...ContainerProps} name={"haha"} />
                )}
            </Container>
        );
    };
    ```

## 6.lifeCycle

1. `React`的 2 个重要阶段
    - `render`阶段: 深度遍历`React Fiber`,发现`diff`
    - `commit`阶段: 创建修改真实的`dom`节点
2. `fiber tag = 1`类组件的更新流程
    1. `instance` 类组件对应实例。
    2. `workInProgress` 树，当前正在调和的 `fiber` 树 ，一次更新中，`React` 会自上而下深度遍历子代 `fiber` ，如果遍历到一个 `fiber` ，会把当前 `fiber` 指向 `workInProgress`。
    3. `current` 树，在初始化更新中，`current = null` ，在第一次 `fiber` 调和之后，会将 `workInProgress` 树赋值给 `current` 树。`React` 来用`workInProgress` 和 `current` 来确保一次更新中，快速构建，并且状态不丢失。
    4. `Component` 就是项目中的 `class` 组件。
    5. `nextProps` 作为组件在一次更新中新的 `props` 。
    6. `renderExpirationTime` 作为下一次渲染的过期时间。
    ```js
    // react-reconciler/src/ReactFiberBeginWork.js
    /* workloop React 处理类组件的主要功能方法 */
    function updateClassComponent() {
        let shouldUpdate;
        const instance = workInProgress.stateNode; // stateNode 是 fiber 指向 类组件实例的指针。
        if (instance === null) {
            // instance 为组件实例,如果组件实例不存在，证明该类组件没有被挂载过，那么会走初始化流程
            constructClassInstance(workInProgress, Component, nextProps); // 组件实例将在这个方法中被new。
            mountClassInstance(
                workInProgress,
                Component,
                nextProps,
                renderExpirationTime,
            ); //初始化挂载组件流程
            shouldUpdate = true; // shouldUpdate 标识用来证明 组件是否需要更新。
        } else {
            shouldUpdate = updateClassInstance(
                current,
                workInProgress,
                Component,
                nextProps,
                renderExpirationTime,
            ); // 更新组件流程
        }
        if (shouldUpdate) {
            nextChildren = instance.render(); /* 执行render函数 ，得到子节点 */
            reconcileChildren(
                current,
                workInProgress,
                nextChildren,
                renderExpirationTime,
            ); /* 继续调和子节点 */
        }
    }
    ```
3. `React`类组件生命周期
    1. `constructor`的执行上方的`constructClassInstance`用来实例化 `React` 组件
    2. 调用`mountClassInstance` 组件初始化
    ```js
    function mountClassInstance(
        workInProgress,
        ctor,
        newProps,
        renderExpirationTime,
    ) {
        const instance = workInProgress.stateNode;
        const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
        if (typeof getDerivedStateFromProps === "function") {
            /* ctor 就是我们写的类组件，获取类组件的静态方法 */
            const partialState = getDerivedStateFromProps(
                nextProps,
                prevState,
            ); /* 这个时候执行 getDerivedStateFromProps 生命周期 ，得到将合并的state */
            const memoizedState =
                partialState === null || partialState === undefined
                    ? prevState
                    : Object.assign({}, prevState, partialState); // 合并state
            workInProgress.memoizedState = memoizedState;
            instance.state =
                workInProgress.memoizedState; /* 将state 赋值给我们实例上，instance.state  就是我们在组件中 this.state获取的state*/
        }
        if (
            typeof ctor.getDerivedStateFromProps !== "function" &&
            typeof instance.getSnapshotBeforeUpdate !== "function" &&
            typeof instance.componentWillMount === "function"
        ) {
            instance.componentWillMount(); /* 当 getDerivedStateFromProps 和 getSnapshotBeforeUpdate 不存在的时候 ，执行 componentWillMount*/
        }
    }
    ```
    3. `getDerivedStateFromProps` 执行
        - 调用组件上的`getDerivedStateFromProps`并传入`props state`，将返回值与与之前的`state`合并生成新的`state`传递给组件
    4. `componentWillMount`
        - 如果存在`getDerivedStateFromProps`和`getSnapshotBeforeUpdate`就不会执行生命周期`componentWillMount`
    5. `mountClassInstance`执行完毕
    6. `render`函数执行，`react`调用`reconcileChildren`方法深度调和`children`
    7. `componentDidMount`
        - `React` 调和完所有的 fiber 节点，就会到 `commit` 阶段，在组件初始化 `commit` 阶段，会调用 `componentDidMount` 生命周期。
        ```js
        function commitLifeCycles(finishedRoot,current,finishedWork){
            switch (finishedWork.tag){                             /* fiber tag 在第一节讲了不同fiber类型 */
                case ClassComponent: {                              /* 如果是 类组件 类型 */
                    const instance = finishedWork.stateNode        /* 类实例 */
                    if(current === null){                          /* 类组件第一次调和渲染 */
                        instance.componentDidMount()
                    }else{                                         /* 类组件更新 */
                        instance.componentDidUpdate(prevProps,prevState，instance.__reactInternalSnapshotBeforeUpdate);
                    }
                }
            }
        }
        ```
4. 生命周期演示图

-   ![20230325205446-2023-03-25](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230325205446-2023-03-25.png)

5. 更新阶段

```js
// react-reconciler/src/ReactFiberClassComponent.js
function updateClassInstance(
    current,
    workInProgress,
    ctor,
    newProps,
    renderExpirationTime,
) {
    const instance = workInProgress.stateNode; // 类组件实例
    const hasNewLifecycles =
        typeof ctor.getDerivedStateFromProps === "function"; // 判断是否具有 getDerivedStateFromProps 生命周期
    if (
        !hasNewLifecycles &&
        typeof instance.componentWillReceiveProps === "function"
    ) {
        if (oldProps !== newProps || oldContext !== nextContext) {
            // 浅比较 props 不相等
            instance.componentWillReceiveProps(newProps, nextContext); // 执行生命周期 componentWillReceiveProps
        }
    }
    let newState = (instance.state = oldState);
    if (typeof getDerivedStateFromProps === "function") {
        ctor.getDerivedStateFromProps(
            nextProps,
            prevState,
        ); /* 执行生命周期getDerivedStateFromProps  ，逻辑和mounted类似 ，合并state  */
        newState = workInProgress.memoizedState;
    }
    let shouldUpdate = true;
    if (typeof instance.shouldComponentUpdate === "function") {
        /* 执行生命周期 shouldComponentUpdate 返回值决定是否执行render ，调和子节点 */
        shouldUpdate = instance.shouldComponentUpdate(
            newProps,
            newState,
            nextContext,
        );
    }
    if (shouldUpdate) {
        if (typeof instance.componentWillUpdate === "function") {
            instance.componentWillUpdate(); /* 执行生命周期 componentWillUpdate  */
        }
    }
    return shouldUpdate;
}
```

6. 更新流程
    1. 执行生命周期 `componentWillReceiveProps`
        - 首先判断 `getDerivedStateFromProps` 生命周期是否存在，如果不存在就执行`componentWillReceiveProps`生命周期。传入该生命周期两个参数，分别是 `newProps` 和 `nextContext` 。
    2. 执行生命周期 `getDerivedStateFromProps`
        - 接下来执行生命周期`getDerivedStateFromProps`， 返回的值用于合并`state`，生成新的`state`。
    3. 执行生命周期 `shouldComponentUpdate`
        - 接下来执行生命周期`shouldComponentUpdate`，传入新的 `props` ，新的 `state` ，和新的 `context` ，返回值决定是否继续执行 `render` 函数，调和子节点。这里应该注意一个问题，`getDerivedStateFromProps` 的返回值可以作为新的 `state` ，传递给 `shouldComponentUpdate` 。
    4. 执行生命周期`componentWillUpdate`
    5. 执行 `render` 函数
        - 接下来会执行 `render` 函数，得到最新的 `React element` 元素。然后继续调和子节点
    6. 执行 `getSnapshotBeforeUpdate`
        - `getSnapshotBeforeUpdate` 的执行也是在 `commit` 阶段，`commit` 阶段细分为 `before Mutation`( `DOM` 修改前)，`Mutation` ( `DOM` 修改)，`Layout`( `DOM` 修改后) 三个阶段，`getSnapshotBeforeUpdate` 发生在`before Mutation` 阶段，生命周期的返回值，将作为第三个参数 `__reactInternalSnapshotBeforeUpdate` 传递给 `componentDidUpdate` 。
        ```js
        // react-reconciler/src/ReactFiberCommitWork.js
        function commitBeforeMutationLifeCycles(current, finishedWork) {
            switch (finishedWork.tag) {
                case ClassComponent: {
                    const snapshot = instance.getSnapshotBeforeUpdate(
                        prevProps,
                        prevState,
                    ); /* 执行生命周期 getSnapshotBeforeUpdate   */
                    instance.__reactInternalSnapshotBeforeUpdate =
                        snapshot; /* 返回值将作为 __reactInternalSnapshotBeforeUpdate 传递给 componentDidUpdate 生命周期  */
                }
            }
        }
        ```
    7. 执行 `componentDidUpdate`
        - 接下来执行生命周期 `componentDidUpdate` ，此时 DOM 已经修改完成。可以操作修改之后的 DOM 。到此为止更新阶段的生命周期执行完毕。
7. 组件更新流程
    - `componentWillReceiveProps`( props 改变) / `getDerivedStateFromProp` -> `shouldComponentUpdate` -> `componentWillUpdate` -> `render` -> `getSnapshotBeforeUpdate` -> `componentDidUpdate`
    - ![20230326003031-2023-03-26](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230326003031-2023-03-26.png)
8. 销毁阶段
    1. 执行生命周期 `componentWillUnmount`
    2. 在一次调和更新中，如果发现元素被移除，就会打对应的 `Deletion` 标签 ，然后在 `commit` 阶段就会调用 `componentWillUnmount` 生命周期，接下来统一卸载组件以及 `DOM` 元素。
    ```js
    // react-reconciler/src/ReactFiberCommitWork.js
    function callComponentWillUnmountWithTimer() {
        instance.componentWillUnmount();
    }
    ```
    3. ![20230326003311-2023-03-26](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230326003311-2023-03-26.png)
9. 生命周期
    - ![20230326003352-2023-03-26](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230326003352-2023-03-26.png)
10. 各生命周期作用
    1. `constructor`
        - 初始化 `state` ，比如可以用来截取路由中的参数，赋值给 `state` 。
        - 对类组件的事件做一些处理，比如绑定 `this` ， 节流，防抖等。
        - 对类组件进行一些必要生命周期的劫持，渲染劫持，这个功能更适合反向继承的`HOC` ，在 `HOC` 环节，会详细讲解反向继承这种模式。
        ```js
        constructor(props){
            super(props)        // 执行 super ，别忘了传递props,才能在接下来的上下文中，获取到props。
            this.state={       //① 可以用来初始化state，比如可以用来获取路由中的
                name:'alien'
            }
            this.handleClick = this.handleClick.bind(this) /* ② 绑定 this */
            this.handleInputChange = debounce(this.handleInputChange , 500) /* ③ 绑定防抖函数，防抖 500 毫秒 */
            const _render = this.render
            this.render = function(){
                return _render.bind(this)  /* ④ 劫持修改类组件上的一些生命周期 */
            }
        }
        /* 点击事件 */
        handleClick(){ /* ... */ }
        /* 表单输入 */
        handleInputChange(){ /* ... */ }
        ```
    2. `getDerivedStateFromProps`
        - 代替 `componentWillMount` 和 `componentWillReceiveProps`
        - 组件初始化或者更新时，将 `props` 映射到 `state`。
        - 返回值与 `state` 合并完，可以作为 `shouldComponentUpdate` 第二个参数 `newState` ，可以判断是否渲染组件。(请不要把 `getDerivedStateFromProps` 和 `shouldComponentUpdate` 强行关联到一起，两者没有必然联系)
    3. `componentWillMount` 和 `UNSAFE_componentWillMount`
        - `UNSAFE_componentWillMount` 的作用还是做一些初始化操作，但是不建议在这个生命周期写，毕竟未来 React 可能完全取缔它。
        - `React` 对于执行 `render` 函数有着像 `shouldUpdate` 等条件制约，但是对于执行在 `render` 之前生命周期没有限制，存在一定隐匿风险，如果 `updateClassInstance` 执行多次，`React` 开发者滥用这几个生命周期，可能导致生命周期内的上下文多次被执行。
    4. `componentWillReceiveProps` 和 `UNSAFE_componentWillReceiveProps`
        - 只要父组件触发 `render` 函数，调用 `React.createElement` 方法，那么 `props` 就会被重新创建，生命周期 `componentWillReceiveProps` 就会执行了。这就解释了即使 props 没变，该生命周期也会执行。
        - `componentWillReceiveProps` 可以用来监听父组件是否执行 `render` 。
        - `componentWillReceiveProps` 可以用来接受 `props` 改变，组件可以根据 `props` 改变，来决定是否更新 `state` ，因为可以访问到 `this` ， 所以可以在异步成功回调(接口请求数据)改变 `state` 。这个是 `getDerivedStateFromProps` 不能实现的。
        - `PureComponent `是在 `componentWillReceiveProps` 执行之后浅比较 `props` 是否发生变化。所以 `PureComponent` 下不会阻止该生命周期的执行。
    5. `componentWillUpdate` 和 `UNSAFE_componentWillUpdate`
        - UNSAFE_componentWillUpdate 可以意味着在更新之前，此时的 DOM 还没有更新,就比如说在一次更新中，保存 DOM 之前的信息(记录上一次位置)。获取组件更新之前的状态。比如 DOM 元素位置等。
        - 但是 React 已经出了新的生命周期 getSnapshotBeforeUpdate 来代替 UNSAFE_componentWillUpdate。
        ```js
        UNSAFE_componentWillUpdate(){
            const position = this.getPostion(this.node) /* 获取元素节点 node 位置 */
        }
        ```
    6. `render`
        - 那么可以在`render`里面做一些,`createElement`创建元素 , `cloneElement` 克隆元素 ，`React.children` 遍历 `children` 的操作。
    7. `getSnapshotBeforeUpdate`
        - 把 `getSnapshotBeforeUpdate` 用英文解释一下 ， `get  snap shot  before  update` ， 中文翻译为 获取更新前的快照，可以进一步理解为 获取更新前 `DOM` 的状态。见名知意，上面说过该生命周期是在 `commit` 阶段的`before Mutation` ( DOM 修改前)，此时 `DOM` 还没有更新，但是在接下来的 `Mutation` 阶段会被替换成真实 `DOM` 。此时是获取 `DOM` 信息的最佳时期，`getSnapshotBeforeUpdate` 将返回一个值作为一个`snapShot`(快照)，传递给 `componentDidUpdate`作为第三个参数。
        ```js
        getSnapshotBeforeUpdate(prevProps,preState){
            const style = getComputedStyle(this.node)
            return { /* 传递更新前的元素位置 */
                cx:style.cx,
                cy:style.cy
            }
        }
        componentDidUpdate(prevProps, prevState, snapshot){
            /* 获取元素绘制之前的位置 */
            console.log(snapshot)
        }
        ```
    8. `componentDidUpdate`
        - `componentDidUpdate` 生命周期执行，此时 `DOM `已经更新，可以直接获取 `DOM` 最新状态。这个函数里面如果想要使用 `setState` ，一定要加以限制，否则会引起无限循环。
        ```js
        componentDidUpdate(prevProps, prevState, snapshot){
            const style = getComputedStyle(this.node)
            const newPosition = { /* 获取元素最新位置信息 */
                cx:style.cx,
                cy:style.cy
            }
        }
        ```
    9. `componentDidMount`
        - `componentDidMount` 生命周期执行时机和 `componentDidUpdate` 一样，一个是在初始化，一个是组件更新。此时 DOM 已经创建完，既然 DOM 已经创建挂载，就可以做一些基于 DOM 操作，DOM 事件监听器。
        ```js
        async componentDidMount(){
            this.node.addEventListener('click',()=>{
                /* 事件监听 */
            })
            const data = await this.getData() /* 数据请求 */
        }
        ```
    10. `shouldComponentUpdate`
        - 这个生命周期，一般用于性能优化，`shouldComponentUpdate` 返回值决定是否重新渲染的类组件。需要重点关注的是第二个参数 `newState` ，如果有 `getDerivedStateFromProps` 生命周期 ，它的返回值将合并到 `newState` ，供 `shouldComponentUpdate` 使用。
        ```js
        shouldComponentUpdate(newProps,newState){
            if(newProps.a !== this.props.a ){ /* props中a属性发生变化 渲染组件 */
                return true
            }else if(newState.b !== this.props.b ){ /* state 中b属性发生变化 渲染组件 */
                return true
            }else{ /* 否则组件不渲染 */
                return false
            }
        }
        ```
    11. `componentWillUnmount`
        - 清除延时器，定时器。
        - 一些基于 DOM 的操作，比如事件监听器。
        ```js
        componentWillUnmount(){
            clearTimeout(this.timer)  /* 清除延时器 */
            this.node.removeEventListener('click',this.handerClick) /* 卸载事件监听器 */
        }
        ```
    12.
11. 函数组件的生命周期

    1. `useEffect`
        - `React` 处理逻辑是采用异步调用 ，对于每一个 `effect` 的 `callback`， `React` 会向 `setTimeout`回调函数一样，放入任务队列，等到主线程任务完成，`DOM` 更新，`js` 执行完成，视图绘制完毕，才执行。所以 `effect` 回调函数不会阻塞浏览器绘制视图。
        - `useEffect` 对 `React` 执行栈来看是异步执行的，而 `componentDidMount` / `componentDidUpdate` 是同步执行的，`useEffect`代码不会阻塞浏览器绘制。在时机上 ，`componentDidMount` / `componentDidUpdate` 和 `useLayoutEffect` 更类似。
    2. `useLayoutEffect`
        - 首先 `useLayoutEffect` 是在 `DOM` 更新之后，浏览器绘制之前，这样可以方便修改 `DOM`，获取 `DOM` 信息，这样浏览器只会绘制一次，如果修改 `DOM` 布局放在 `useEffect` ，那 `useEffect` 执行是在浏览器绘制视图之后，接下来又改 `DOM` ，就可能会导致浏览器再次回流和重绘。而且由于两次绘制，视图上可能会造成闪现突兀的效果。
        - `useLayoutEffect` `callback` 中代码执行会阻塞浏览器绘制。
    3. `useInsertionEffect`

        - `useInsertionEffect` 是在 `React v18` 新添加的 `hooks`
        - `useInsertionEffect` 的执行在 `DOM` 更新前，所以此时使用 `CSS-in-JS` 避免了浏览器出现再次重回和重排的可能，解决了性能上的问题。

        ```js
        export default function Index() {
            React.useInsertionEffect(() => {
                /* 动态创建 style 标签插入到 head 中 */
                const style = document.createElement("style");
                style.innerHTML = `
                    .css-in-js{
                        color: red;
                        font-size: 20px;
                    }
                `;
                document.head.appendChild(style);
            }, []);

            return (
                <div className="css-in-js"> hello , useInsertionEffect </div>
            );
        }
        ```

        ```js
        // useInsertionEffect 执行, DOM 还没有更新
        // useLayoutEffect 执行, DOM 已经更新了
        // useEffect 执行
        React.useEffect(() => {
            console.log("useEffect 执行");
        }, []);

        React.useLayoutEffect(() => {
            console.log("useLayoutEffect 执行");
        }, []);

        React.useInsertionEffect(() => {
            console.log("useInsertionEffect 执行");
        }, []);
        ```

12. 函数组件替代`class`组件中的生命周期

```js
function FunctionLifecycle(props) {
    const [num, setNum] = useState(0);
    React.useEffect(() => {
        /* 请求数据 ， 事件监听 ， 操纵dom  ， 增加定时器 ， 延时器 */
        console.log("组件挂载完成：componentDidMount");
        return function componentWillUnmount() {
            /* 解除事件监听器 ，清除 */
            console.log("组件销毁：componentWillUnmount");
        };
    }, []); /* 切记 dep = [] */
    React.useEffect(() => {
        console.log("props变化：componentWillReceiveProps");
    }, [props]);
    React.useEffect(() => {
        /*  */
        console.log(" 组件更新完成：componentDidUpdate ");
    });
    return (
        <div>
            <div> props : {props.number} </div>
            <div> states : {num} </div>
            <button onClick={() => setNum((state) => state + 1)}>
                改变state
            </button>
        </div>
    );
}

export default () => {
    const [number, setNumber] = React.useState(0);
    const [isRender, setRender] = React.useState(true);
    return (
        <div>
            {isRender && <FunctionLifecycle number={number} />}
            <button onClick={() => setNumber((state) => state + 1)}>
                {" "}
                改变props{" "}
            </button> <br />
            <button onClick={() => setRender(false)}>卸载组件</button>
        </div>
    );
};
```

## 7.多功能 ref

1. 类组件`React.createRef`

```js
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.currentDom = React.createRef(null);
    }
    componentDidMount() {
        console.log(this.currentDom);
    }
    render = () => <div ref={this.currentDom}>ref对象模式获取元素或组件</div>;
}
```

```js
// React.createRef底层逻辑
// react/src/ReactCreateRef.js
export function createRef() {
    const refObject = {
        current: null,
    };
    return refObject;
}
```

2. 函数组件`useRef`

-   函数组件不能使用`React.createRef`，每次组件更新`ref`的值都会被重置
-   `useRef` 产生的 `ref` 对象挂到函数组件对应的 `fiber` 上，函数组件每次执行，只要组件不被销毁，函数组件对应的 `fiber` 对象一直存在，所以`ref` 等信息就会被保存下来。

```js
export default function Index() {
    const currentDom = React.useRef(null);
    React.useEffect(() => {
        console.log(currentDom.current); // div
    }, []);
    return <div ref={currentDom}>ref对象模式获取元素或组件</div>;
}
```

3. 类组件获取`ref`的 3 种方式
    1. `ref`是一个字符串
    ```js
    /* 类组件 */
    class Children extends Component {
        render = () => <div>hello,world</div>;
    }
    /* TODO:  Ref属性是一个字符串 */
    export default class Index extends React.Component {
        componentDidMount() {
            // {currentDom: div, currentComInstance: Children}
            console.log(this.refs);
        }
        render = () => (
            <div>
                <div ref="currentDom">字符串模式获取元素或组件</div>
                <Children ref="currentComInstance" />
            </div>
        );
    }
    ```
    2. `ref`是一个函数
    ```js
    // 等到真实 DOM 创建阶段，执行 callback ，获取的 DOM 元素或组件实例，将以回调函数第一个参数形式传入，
    class Children extends React.Component {
        render = () => <div>hello,world</div>;
    }
    /* TODO: Ref属性是一个函数 */
    export default class Index extends React.Component {
        currentDom = null;
        currentComponentInstance = null;
        componentDidMount() {
            console.log(this.currentDom); // <div>ref模式获取元素或组件</div>
            console.log(this.currentComponentInstance); // Children {props: {}}
        }
        render = () => (
            <div>
                <div ref={(node) => (this.currentDom = node)}>
                    Ref模式获取元素或组件
                </div>
                <Children
                    ref={(node) => (this.currentComponentInstance = node)}
                />
            </div>
        );
    }
    ```
    3. ref 属性是一个 ref 对象
    ```js
    class Children extends React.Component {
        render = () => <div>hello,world</div>;
    }
    export default class Index extends React.Component {
        currentDom = React.createRef(null);
        currentComponentInstance = React.createRef(null);
        componentDidMount() {
            // {current: div}
            console.log(this.currentDom);
            // {current: Children}
            console.log(this.currentComponentInstance);
        }
        render = () => (
            <div>
                <div ref={this.currentDom}>Ref对象模式获取元素或组件</div>
                <Children ref={this.currentComponentInstance} />
            </div>
        );
    }
    ```
4. `forwardRef`转发`ref`
    - `forwardRef` 的初衷就是解决 `ref` 不能跨层级捕获和传递的问题。
5. `forwardRef`跨层级获取`ref`, `forwardRef` 把 `ref` 变成了可以通过 `props` 传递和转发。
    ```js
    // 孙组件
    function Son(props) {
        const { grandRef } = props;
        return (
            <div>
                <div> i am alien </div>
                <span ref={grandRef}>这个是想要获取元素</span>
            </div>
        );
    }
    // 父组件
    class Father extends React.Component {
        constructor(props) {
            super(props);
        }
        render() {
            return (
                <div>
                    <Son grandRef={this.props.grandRef} />
                </div>
            );
        }
    }
    const NewFather = React.forwardRef((props, ref) => (
        <Father grandRef={ref} {...props} />
    ));
    // 爷组件
    class GrandFather extends React.Component {
        constructor(props) {
            super(props);
        }
        node = null;
        componentDidMount() {
            console.log(this.node); // span #text 这个是想要获取元素
        }
        render() {
            return (
                <div>
                    <NewFather ref={(node) => (this.node = node)} />
                </div>
            );
        }
    }
    ```
6. `forwardRef`合并转发`ref`
    ```js
    // 表单组件
    class Form extends React.Component{
        render(){
            return <div>{...}</div>
        }
    }
    // index 组件
    class Index extends React.Component{
        componentDidMount(){
            const { forwardRef } = this.props
            forwardRef.current={
                form:this.form,      // 给form组件实例 ，绑定给 ref form属性
                index:this,          // 给index组件实例 ，绑定给 ref index属性
                button:this.button,  // 给button dom 元素，绑定给 ref button属性
            }
        }
        form = null
        button = null
        render(){
            return <div>
                <button ref={(button)=> this.button = button } >点击</button>
                <Form  ref={(form) => this.form = form }  />
            </div>
        }
    }
    const ForwardRefIndex = React.forwardRef(( props,ref )=> <Index  {...props} forwardRef={ref}  />)
    // home 组件
    export default function Home(){
        const ref = useRef(null)
        useEffect(()=>{
            // {button: button, form: Form, index: Index}
            console.log(ref.current)
        },[])
        return <ForwardRefIndex ref={ref} />
    }
    ```
7. `forwardRef`高阶组件转发`ref`
    ```js
    function HOC(Component) {
        class Wrap extends React.Component {
            render() {
                const { forwardedRef, ...otherprops } = this.props;
                return <Component ref={forwardedRef} {...otherprops} />;
            }
        }
        return React.forwardRef((props, ref) => (
            <Wrap forwardedRef={ref} {...props} />
        ));
    }
    class Index extends React.Component {
        render() {
            return <div>hello,world</div>;
        }
    }
    const HocIndex = HOC(Index);
    export default () => {
        const node = useRef(null);
        useEffect(() => {
            console.log(node.current); /* Index 组件实例  */
        }, []);
        return (
            <div>
                <HocIndex ref={node} />
            </div>
        );
    };
    ```
8. 类组件`ref`获取组件实例，实现组件双向通信
    - 子组件暴露方法 `fatherSay` 供父组件使用，父组件通过调用方法可以设置子组件展示内容。
    - 父组件提供给子组件 `toFather`，子组件调用，改变父组件展示内容，实现父 <-> 子 双向通信。
    ```js
    /* 子组件 */
    class Son extends React.PureComponent {
        state = {
            fatherMes: "",
            sonMes: "",
        };
        fatherSay = (fatherMes) =>
            this.setState({ fatherMes }); /* 提供给父组件的API */
        render() {
            const { fatherMes, sonMes } = this.state;
            return (
                <div className="sonbox">
                    <div className="title">子组件</div>
                    <p>父组件对我说：{fatherMes}</p>
                    <div className="label">对父组件说</div>
                    <input
                        onChange={(e) =>
                            this.setState({ sonMes: e.target.value })
                        }
                        className="input"
                    />
                    <button
                        className="searchbtn"
                        onClick={() => this.props.toFather(sonMes)}>
                        to father
                    </button>
                </div>
            );
        }
    }
    /* 父组件 */
    export default function Father() {
        const [sonMes, setSonMes] = React.useState("");
        const sonInstance = React.useRef(null); /* 用来获取子组件实例 */
        const [fatherMes, setFatherMes] = React.useState("");
        const toSon = () =>
            sonInstance.current.fatherSay(
                fatherMes,
            ); /* 调用子组件实例方法，改变子组件state */
        return (
            <div className="box">
                <div className="title">父组件</div>
                <p>子组件对我说：{sonMes}</p>
                <div className="label">对子组件说</div>
                <input
                    onChange={(e) => setFatherMes(e.target.value)}
                    className="input"
                />
                <button className="searchbtn" onClick={toSon}>
                    to son
                </button>
                <Son ref={sonInstance} toFather={setSonMes} />
            </div>
        );
    }
    ```
9. 函数组件 `forwardRef` + `useImperativeHandle`

    - 第一个参数 ref : 接受 forWardRef 传递过来的 ref 。
    - 第二个参数 createHandle ：处理函数，返回值作为暴露给父组件的 ref 对象。
    - 第三个参数 deps :依赖项 deps，依赖项更改形成新的 ref 对象。
    - ![20230326224158-2023-03-26](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230326224158-2023-03-26.png)

    ```js
    // 父组件用 ref 标记子组件，由于子组件 Son 是函数组件没有实例，所以用 forwardRef 转发 ref。
    // 子组件 Son 用 useImperativeHandle 接收父组件 ref，将让 input 聚焦的方法 onFocus 和 改变 input 输入框的值的方法 onChangeValue 传递给 ref 。
    // 父组件可以通过调用 ref 下的 onFocus 和 onChangeValue 控制子组件中 input 赋值和聚焦。
    // 子组件
    function Son(props, ref) {
        const inputRef = useRef(null);
        const [inputValue, setInputValue] = useState("");
        useImperativeHandle(
            ref,
            () => {
                const handleRefs = {
                    onFocus() {
                        /* 声明方法用于聚焦input框 */
                        inputRef.current.focus();
                    },
                    onChangeValue(value) {
                        /* 声明方法用于改变input的值 */
                        setInputValue(value);
                    },
                };
                return handleRefs;
            },
            [],
        );
        return (
            <div>
                <input
                    placeholder="请输入内容"
                    ref={inputRef}
                    value={inputValue}
                />
            </div>
        );
    }

    const ForwarSon = forwardRef(Son);
    // 父组件
    class Index extends React.Component {
        cur = null;
        handerClick() {
            const { onFocus, onChangeValue } = this.cur;
            onFocus(); // 让子组件的输入框获取焦点
            onChangeValue("let us learn React!"); // 让子组件input
        }
        render() {
            return (
                <div style={{ marginTop: "50px" }}>
                    <ForwarSon ref={(cur) => (this.cur = cur)} />
                    <button onClick={this.handerClick.bind(this)}>
                        操控子组件
                    </button>
                </div>
            );
        }
    }
    ```

10. `ref`用作函数组件缓存数据
    - 第一个能够直接修改数据，不会造成函数组件冗余的更新作用。
    - 第二个 useRef 保存数据，如果有 useEffect ，useMemo 引用 ref 对象中的数据，无须将 ref 对象添加成 dep 依赖项，因为 useRef 始终指向一个内存空间，所以这样一点好处是可以随时访问到变化后的值。
    ```js
    const toLearn = [ { type: 1 , mes:'let us learn React' } , { type:2,mes:'let us learn Vue3.0' }  ]
    export default function Index({ id }){
        const typeInfo = React.useRef(toLearn[0])
        const changeType = (info)=>{
            typeInfo.current = info /* typeInfo 的改变，不需要视图变化 */
        }
        useEffect(()=>{
        if(typeInfo.current.type===1){
            /* ... */
        }
        },[ id ]) /* 无须将 typeInfo 添加依赖项  */
        return <div>
            {
                toLearn.map(item=> <button key={item.type}  onClick={ changeType.bind(null,item) } >{ item.mes }</button> )
            }
        </div>
    ```
11. ref 原理
    ```js
    export default class Index extends React.Component {
        state = { num: 0 };
        node = null;
        render() {
            return (
                <div>
                    <div
                        ref={(node) => {
                            this.node = node;
                            // 第1次打印null
                            // 第2次打印div
                            console.log("此时的参数是什么：", this.node);
                        }}>
                        ref元素节点
                    </div>
                    <button
                        onClick={() =>
                            this.setState({ num: this.state.num + 1 })
                        }>
                        点击
                    </button>
                </div>
            );
        }
    }
    ```
12. 第一阶段：一次更新中，在 commit 的 mutation 阶段, 执行 commitDetachRef，commitDetachRef 会清空之前 ref 值，使其重置为 null。 源码先来看一下。
    ```js
    // react-reconciler/src/ReactFiberCommitWork.js
    function commitDetachRef(current: Fiber) {
        const currentRef = current.ref;
        if (currentRef !== null) {
            if (typeof currentRef === "function") {
                /* function 和 字符串获取方式。 */
                currentRef(null);
            } else {
                /* Ref对象获取方式 */
                currentRef.current = null;
            }
        }
    }
    ```
13. 第二阶段：DOM 更新阶段，这个阶段会根据不同的 effect 标签，真实的操作 DOM 。
14. 第三阶段：layout 阶段，在更新真实元素节点之后，此时需要更新 ref 。
    ```js
    // react-reconciler/src/ReactFiberCommitWork.js
    function commitAttachRef(finishedWork: Fiber) {
        const ref = finishedWork.ref;
        if (ref !== null) {
            const instance = finishedWork.stateNode;
            let instanceToUse;
            switch (finishedWork.tag) {
                case HostComponent: //元素节点 获取元素
                    instanceToUse = getPublicInstance(instance);
                    break;
                default: // 类组件直接使用实例
                    instanceToUse = instance;
            }
            if (typeof ref === "function") {
                ref(instanceToUse); //* function 和 字符串获取方式。 */
            } else {
                ref.current = instanceToUse; /* ref对象方式 */
            }
        }
    }
    ```
15. 只有含有 Ref tag 的时候，才会执行更新 ref
    1. 第一种就是类组件的更新过程中。
    2. 第二种就是更新 HostComponent 的时候，什么是 HostComponent 就不必多说了，比如 <div /> 等元素。
    ```js
    function markRef(current: Fiber | null, workInProgress: Fiber) {
        const ref = workInProgress.ref;
        if (
            (current === null && ref !== null) || // 初始化的时候
            (current !== null && current.ref !== ref) // ref 指向发生改变
        ) {
            workInProgress.effectTag |= Ref;
        }
    }
    ```
16. 每次点击按钮都会更新
    ```js
    // 每一次更新的时候，都给 ref 赋值了新的函数，那么 markRef 中就会判断成 current.ref !== ref，所以就会重新打 Ref 标签，那么在 commit 阶段，就会更新 ref 执行 ref 回调函数了。
    <div
        ref={(node) => {
            this.node = node;
            console.log("此时的参数是什么：", this.node);
        }}>
        ref元素节点
    </div>
    ```
    ```js
    // ref只会更新1次
    export default class Index extends React.Component {
        state = { num: 0 };
        node = null;
        getDom = (node) => {
            this.node = node;
            console.log("此时的参数是什么：", this.node);
        };
        render() {
            return (
                <div>
                    <div ref={this.getDom}>ref元素节点</div>
                    <button
                        onClick={() =>
                            this.setState({ num: this.state.num + 1 })
                        }>
                        点击
                    </button>
                </div>
            );
        }
    }
    ```
17. 更新 ref
    ```js
    // react-reconciler/src/ReactFiberWorkLoop.js
    // commitDetachRef
    function commitMutationEffects() {
        if (effectTag & Ref) {
            const current = nextEffect.alternate;
            if (current !== null) {
                commitDetachRef(current);
            }
        }
    }
    ```
    ```js
    // commitAttachRef
    function commitLayoutEffects() {
        if (effectTag & Ref) {
            commitAttachRef(nextEffect);
        }
    }
    ```
18. 卸载`ref`
    ```js
    // react-reconciler/src/ReactFiberCommitWork.js
    function safelyDetachRef(current) {
        const ref = current.ref;
        if (ref !== null) {
            if (typeof ref === "function") {
                // 函数式 ｜ 字符串
                ref(null);
            } else {
                ref.current = null; // ref 对象
            }
        }
    }
    ```
19. 流程图
    - ![20230326230447-2023-03-26](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230326230447-2023-03-26.png)

## 8.context

1. `createContext`
    ```js
    const ThemeContext = React.createContext(null); //
    const ThemeProvider = ThemeContext.Provider; //提供者
    const ThemeConsumer = ThemeContext.Consumer; // 订阅消费者
    ```
2. 提供者`Provider`
    - `value` 属性传递 `context`，供给 `Consumer` 使用。
    - `value` 属性改变，`ThemeProvider` 会让消费 `Provider value` 的组件重新渲染。
3. 消费者-类组件`contextType`

    - 类组件的静态属性上的 `contextType` 属性，指向需要获取的 `context（ demo 中的 ThemeContext ）`，就可以方便获取到最近一层` Provider` 提供的 `contextValue` 值。
    - 只适用于类组件。

    ```js
    const ThemeContext = React.createContext(null);
    // 类组件 - contextType 方式
    class ConsumerDemo extends React.Component {
        render() {
            const { color, background } = this.context;
            return <div style={{ color, background }}>消费者</div>;
        }
    }
    ConsumerDemo.contextType = ThemeContext;

    const Son = () => <ConsumerDemo />;
    ```

4. 消费者-函数组件`useContext`
    - `useContext` 接受一个参数，就是想要获取的 `context` ，返回一个 `value` 值，就是最近的 `provider` 提供 `contextValue` 值。
    ```js
    const ThemeContext = React.createContext(null);
    // 函数组件 - useContext方式
    function ConsumerDemo() {
        const contextValue = React.useContext(ThemeContext); /*  */
        const { color, background } = contextValue;
        return <div style={{ color, background }}>消费者</div>;
    }
    const Son = () => <ConsumerDemo />;
    ```
5. 消费者-`consumer`的方式

    - Consumer 订阅者采取 render props 方式，接受最近一层 provider 中 value 属性，作为 render props 函数的参数，可以将参数取出来，作为 props 混入 ConsumerDemo 组件，说白了就是 context 变成了 props。

    ```js
    const ThemeConsumer = ThemeContext.Consumer; // 订阅消费者

    function ConsumerDemo(props) {
        const { color, background } = props;
        return <div style={{ color, background }}>消费者</div>;
    }
    const Son = () => (
        <ThemeConsumer>
            {/* 将 context 内容转化成 props  */}
            {(contextValue) => <ConsumerDemo {...contextValue} />}
        </ThemeConsumer>
    );
    ```

6. 动态`context`

    ```js
    // son不会触发render
    // ConsumerDemo 自发的render。
    function ConsumerDemo() {
        const { color, background } = React.useContext(ThemeContext);
        return <div style={{ color, background }}>消费者</div>;
    }
    const Son = React.memo(() => <ConsumerDemo />); // 子组件

    const ThemeProvider = ThemeContext.Provider; //提供者
    export default function ProviderDemo() {
        const [contextValue, setContextValue] = React.useState({
            color: "#ccc",
            background: "pink",
        });
        return (
            <div>
                <ThemeProvider value={contextValue}>
                    <Son />
                </ThemeProvider>
                <button
                    onClick={() =>
                        setContextValue({ color: "#fff", background: "blue" })
                    }>
                    切换主题
                </button>
            </div>
        );
    }
    ```

7. `render`方式
    - 在 `Provider` 里 `value` 的改变，会使引用`contextType`,`useContext` 消费该 `context` 的组件重新 `render` ，同样会使 `Consumer` 的 `children` 函数重新执行
    - `Consumer` 方式，当 `context` 内容改变的时候，不会让引用 `Consumer` 的父组件重新更新。
8. 优化不必要的渲染
    - 第一种就是利用 `memo`，`pureComponent` 对子组件 `props` 进行浅比较处理。
    ```js
    const Son = React.memo(() => <ConsumerDemo />);
    ```
    - 第二种就是 React 本身对 React element 对象的缓存。React 每次执行 render 都会调用 createElement 形成新的 React element 对象，如果把 React element 缓存下来，下一次调和更新时候，就会跳过该 React element 对应 fiber 的更新。
    ```js
    <ThemeProvider value={contextValue}>
        {React.useMemo(
            () => (
                <Son />
            ),
            [],
        )}
    </ThemeProvider>
    ```
9. displayName

    - `React DevTools` 使用该字符串来确定 `context` 要显示的内容

    ```js
    const MyContext = React.createContext(/* 初始化内容 */);
    MyContext.displayName = 'MyDisplayName';

    <MyContext.Provider> // "MyDisplayName.Provider" 在 DevTools 中
    <MyContext.Consumer> // "MyDisplayName.Consumer" 在 DevTools 中
    ```

10. context 与 props 和 react-redux 的对比？
    1. 解决了 `props` 需要每一层都手动添加 `props` 的缺陷。
    2. 解决了改变 `value` ，组件全部重新渲染的缺陷。
11. 嵌套`provider`

    ```js
    const ThemeContext = React.createContext(null); // 主题颜色Context
    const LanContext = React.createContext(null); // 主题语言Context

    function ConsumerDemo() {
        return (
            <ThemeContext.Consumer>
                {(themeContextValue) => (
                    <LanContext.Consumer>
                        {(lanContextValue) => {
                            const { color, background } = themeContextValue;
                            return (
                                <div style={{ color, background }}>
                                    {" "}
                                    {lanContextValue === "CH"
                                        ? "大家好，让我们一起学习React!"
                                        : "Hello, let us learn React!"}{" "}
                                </div>
                            );
                        }}
                    </LanContext.Consumer>
                )}
            </ThemeContext.Consumer>
        );
    }

    const Son = memo(() => <ConsumerDemo />);
    export default function ProviderDemo() {
        const [themeContextValue] = React.useState({
            color: "#FFF",
            background: "blue",
        });
        const [lanContextValue] = React.useState("CH"); // CH -> 中文 ， EN -> 英文
        return (
            <ThemeContext.Provider value={themeContextValue}>
                <LanContext.Provider value={lanContextValue}>
                    <Son />
                </LanContext.Provider>
            </ThemeContext.Provider>
        );
    }
    ```

12. 逐层传递 Provider
    - 一个 context 可以用多个 Provder 传递，下一层级的 Provder 会覆盖上一层级的 Provder
    - React-redux 中 connect 就是用这个良好特性传递订阅器的。
13. `context`实践`example`

    ```js
    const ThemeContext = React.createContext(null); // 主题颜色Context

    const theme = {
        //主题颜色
        dark: {
            color: "#1890ff",
            background: "#1890ff",
            border: "1px solid blue",
            type: "dark",
        },
        light: {
            color: "#fc4838",
            background: "#fc4838",
            border: "1px solid pink",
            type: "light",
        },
    };

    /* input输入框 - useContext 模式 */
    function Input(props) {
        const { color, border } = useContext(ThemeContext);
        const { label, placeholder } = props;
        return (
            <div>
                <label style={{ color }}>{label}</label>
                <input
                    className="input"
                    placeholder={placeholder}
                    style={{ border }}
                />
            </div>
        );
    }
    /* 容器组件 -  Consumer模式 */
    function Box(props) {
        return (
            <ThemeContext.Consumer>
                {(themeContextValue) => {
                    const { border, color } = themeContextValue;
                    return (
                        <div className="context_box" style={{ border, color }}>
                            {props.children}
                        </div>
                    );
                }}
            </ThemeContext.Consumer>
        );
    }

    function Checkbox(props) {
        const { label, name, onChange } = props;
        const { type, color } = React.useContext(ThemeContext);
        return (
            <div className="checkbox" onClick={onChange}>
                <label htmlFor="name"> {label} </label>
                <input
                    type="checkbox"
                    id={name}
                    value={type}
                    name={name}
                    checked={type === name}
                    style={{ color }}
                />
            </div>
        );
    }

    // contextType 模式
    class App extends React.PureComponent {
        static contextType = ThemeContext;
        render() {
            const { border, setTheme, color, background } = this.context;
            return (
                <div className="context_app" style={{ border, color }}>
                    <div className="context_change_theme">
                        <span> 选择主题： </span>
                        <Checkbox
                            label="light"
                            name="light"
                            onChange={() => setTheme(theme.light)}
                        />
                        <Checkbox
                            label="dark"
                            name="dark"
                            onChange={() => setTheme(theme.dark)}
                        />
                    </div>
                    <div className="box_content">
                        <Box>
                            <Input label="姓名：" placeholder="请输入姓名" />
                            <Input label="age：" placeholder="请输入年龄" />
                            <button
                                className="searchbtn"
                                style={{ background }}>
                                确定
                            </button>
                            <button className="concellbtn" style={{ color }}>
                                取消
                            </button>
                        </Box>
                        <Box>
                            <HomeOutlined twoToneColor={color} />
                            <SettingFilled twoToneColor={color} />
                            <SmileOutlined twoToneColor={color} />
                            <SyncOutlined spin twoToneColor={color} />
                            <SmileOutlined twoToneColor={color} rotate={180} />
                            <LoadingOutlined twoToneColor={color} />
                        </Box>
                        <Box>
                            <div
                                className="person_des"
                                style={{ color: "#fff", background }}>
                                I am alien <br />
                                let us learn React!
                            </div>
                        </Box>
                    </div>
                </div>
            );
        }
    }

    export default function () {
        const [themeContextValue, setThemeContext] = React.useState(theme.dark);
        /* 传递颜色主题 和 改变主题的方法 */
        return (
            <ThemeContext.Provider
                value={{ ...themeContextValue, setTheme: setThemeContext }}>
                <App />
            </ThemeContext.Provider>
        );
    }
    ```

## 9.模块化 css

1. 模块化方式
    - `css module`
    - `css in js`
2. css module compose
    ```css
    .text {
        /* 继承基础样式 ，增加额外的样式 backgroundColor */
        composes: base from "./style1.css"; /* base 样式在 style1.css 文件中 */
        background-color: pink;
    }
    ```
3. `css in js`

    ```js
    import React from "react";
    import Style from "./style";

    export default function Index() {
        return (
            <div style={Style.boxStyle}>
                <span style={Style.textStyle}>hi , i am CSS IN JS!</span>
            </div>
        );
    }
    ```

    ```js
    /* 容器的背景颜色 */
    const boxStyle = {
        backgroundColor: "blue",
    };
    /* 字体颜色 */
    const textStyle = {
        color: "orange",
    };

    export default {
        boxStyle,
        textStyle,
    };
    ```

4. style-component
    ```js
    const Button = styled.button`
        background: ${(props) => (props.theme ? props.theme : "#6a8bad")};
        color: #fff;
        min-width: 96px;
        height: 36px;
        border: none;
        border-radius: 18px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        margin-left: 20px !important;
    `;
    export default function Index() {
        return (
            <div>
                <Button theme={"#fc4838"}>props主题按钮</Button>
            </div>
        );
    }
    ```
    ```js
    const NewButton = styled(Button)`
        background: orange;
        color: pink;
    `;
    export default function Index() {
        return (
            <div>
                <NewButton> 继承按钮</NewButton>
            </div>
        );
    }
    ```

## 11.React 渲染

1. React 底层做的优化
    - 设立任务优先级
    - 异步调度
    - diff 算法
    - 时间分片
2. 缓存`React.element`对象
    - `useMemo` 会记录上一次执行 `create` 的返回值，并把它绑定在函数组件对应的 `fiber` 对象上，只要组件不销毁，缓存值就一直存在，但是 `deps` 中如果有一项改变，就会重新执行 `create` ，返回值作为新的值记录到 `fiber` 对象上。
    - 每次执行` render` 本质上 `createElement` 会产生一个新的 `props`，这个 `props` 将作为对应 `fiber` 的 `pendingProps` ，在此 `fiber` 更新调和阶段，`React` 会对比 `fiber` 上老 `oldProps` 和新的 `newProp （ pendingProps ）`是否相等，如果相等函数组件就会放弃子组件的调和更新，从而子组件不会重新渲染；如果上述把 `element` 对象缓存起来，上面 `props` 也就和 `fiber` 上 `oldProps` 指向相同的内存空间，也就是相等，从而跳过了本次更新。
    ```js
    // numberA 改变，重新形成element对象，否则通过 useMemo 拿到上次的缓存值
    export default function Index() {
        const [numberA, setNumberA] = React.useState(0);
        const [numberB, setNumberB] = React.useState(0);
        return (
            <div>
                {useMemo(
                    () => (
                        <Children number={numberA} />
                    ),
                    [numberA],
                )}
                <button onClick={() => setNumberA(numberA + 1)}>
                    改变numberA
                </button>
                <button onClick={() => setNumberB(numberB + 1)}>
                    改变numberB
                </button>
            </div>
        );
    }
    ```
3. `PureComponent`

    - 浅比较 state 和 props 是否相等
    - `shouldComponentUpdate` 的权重，会大于 `PureComponent`

    ```js
    // react/react-reconciler/ReactFiberClassComponent.js
    function checkShouldComponentUpdate() {
        if (typeof instance.shouldComponentUpdate === "function") {
            return instance.shouldComponentUpdate(
                newProps,
                newState,
                nextContext,
            ); /* shouldComponentUpdate 逻辑 */
        }
        if (ctor.prototype && ctor.prototype.isPureReactComponent) {
            return (
                !shallowEqual(oldProps, newProps) ||
                !shallowEqual(oldState, newState)
            );
        }
    }
    ```

    - 避免使用箭头函数。不要给是 PureComponent 子组件绑定箭头函数，因为父组件每一次 render ，如果是箭头函数绑定的话，都会重新生成一个新的箭头函数， PureComponent 对比新老 props 时候，因为是新的函数，所以会判断不想等，而让组件直接渲染，PureComponent 作用终会失效。

    ```js
    class Index extends React.PureComponent {}

    export default class Father extends React.Component {
        render = () => <Index callback={() => {}} />;
    }
    ```

    - PureComponent 的父组件是函数组件的情况，绑定函数要用 useCallback 或者 useMemo 处理。这种情况还是很容易发生的，就是在用 class + function 组件开发项目的时候，如果父组件是函数，子组件是 PureComponent ，那么绑定函数要小心，因为函数组件每一次执行，如果不处理，还会声明一个新的函数，所以 PureComponent 对比同样会失效，如下情况：

    ```js
    class Index extends React.PureComponent {}
    export default function () {
        const callback =
            function handerCallback() {}; /* 每一次函数组件执行重新声明一个新的callback，PureComponent浅比较会认为不想等，促使组件更新  */
        return <Index callback={callback} />;
    }
    ```

    ```js
    // 解决 PureComponent 失效问题
    export default function () {
        const callback = React.useCallback(function handerCallback() {}, []);
        return <Index callback={callback} />;
    }
    ```

    -

4. `shouldComponentUpdate`
    - 如果子组件的 props 是引用数据类型，比如 object ，还是不能直观比较是否相等
    - 对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象, 可以把需要对比的 props 或者 state 数据变成 Immutable 对象，通过对比 Immutable 是否相等，来证明状态是否改变，从而确定是否更新组件。
    ```js
     shouldComponentUpdate(newProp,newState,newContext){
        if(newProp.propsNumA !== this.props.propsNumA || newState.stateNumA !== this.state.stateNumA ){
            return true /* 只有当 props 中 propsNumA 和 state 中 stateNumA 变化时，更新组件  */
        }
        return false
    }
    ```
5. `React.memo`
    1. React.memo: 第二个参数 返回 true 组件不渲染 ， 返回 false 组件重新渲染
    2. memo 当二个参数 compare 不存在时，会用浅比较原则处理 props ，相当于仅比较 props 版本的 pureComponent
    3. memo 同样适合类组件和函数组件
    4. `memo`的原理
    ```js
    // react-reconciler/src/ReactFiberBeginWork.js
    function updateMemoComponent() {
        if (updateExpirationTime < renderExpirationTime) {
            let compare = Component.compare;
            compare = compare !== null ? compare : shallowEqual; //如果 memo 有第二个参数，则用二个参数判定，没有则浅比较props是否相等。
            if (
                compare(prevProps, nextProps) &&
                current.ref === workInProgress.ref
            ) {
                return bailoutOnAlreadyFinishedWork(
                    current,
                    workInProgress,
                    renderExpirationTime,
                ); //已经完成工作停止向下调和节点。
            }
        }
        // 返回将要更新组件,memo包装的组件对应的fiber，继续向下调和更新。
    }
    ```
    5. memo 使用
    ```js
    function TextMemo(props){ / /子组件
        console.log('子组件渲染')
        return <div>hello,world</div>
    }
    const controlIsRender = (pre,next)=>{
        return ( pre.number === next.number ) ||  (pre.number !== next.number && next.number > 5) // number不改变或number 改变但值大于5->不渲染组件 | 否则渲染组件
    }
    const NewTexMemo = memo(TextMemo,controlIsRender)
    ```
    6.
6. 打破渲染限制
    1. 类组件更新如果调用的是 `forceUpdate` 而不是 `setState` ，会跳过 `PureComponent` 的浅比较和 `shouldComponentUpdate` 自定义比较。其原理是组件中调用 `forceUpdate` 时候，全局会开启一个 `hasForceUpdate` 的开关。当组件更新的时候，检查这个开关是否打开，如果打开，就直接跳过 `shouldUpdate` 。
    2. `context`穿透，上述的几种方式，都不能本质上阻断 `context` 改变，而带来的渲染穿透，所以开发者在使用 `Context` 要格外小心，既然选择了消费` context` ，就要承担 `context` 改变，带来的更新作用。
7. 控制渲染流程
    - ![20230331023236-2023-03-31](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230331023236-2023-03-31.png)
8. 无须过分在乎 React 没有必要的渲染
    - render 阶段执行是在 js 当中，js 中运行代码远快于浏览器的 Rendering 和 Painting 的，更何况 React 还提供了 diff 算法等手段，去复用真实 DOM 。
9. 需要注意渲染节流。
    - 第一种情况数据可视化的模块组件（展示了大量的数据）
    - 受控组件的模式去管理表单数据层,表单数据层完全托管于 props 或是 state ，而用户操作表单往往是频繁的，需要频繁改变数据层，所以很有可能让整个页面组件高频率 render 。
    - 第三种情况就是越是靠近 app root 根组件越值得注意，根组件渲染会波及到整个组件树重新 render ，子组件 render ，一是浪费性能，二是可能执行 useEffect ，componentWillReceiveProps 等钩子，造成意想不到的情况发生。
10. 开发细节
    1. 开发过程中对于大量数据展示的模块，开发者有必要用 shouldComponentUpdate ，PureComponent 来优化性能。
    2. 对于表单控件，最好办法单独抽离组件，独自管理自己的数据层，这样可以让 state 改变，波及的范围更小。
    3. 如果需要更精致化渲染，可以配合 immutable.js 。
    4. 组件颗粒化，配合 memo 等 api ，可以制定私有化的渲染空间。

## 12.渲染调优

1. `Suspense`，包裹异步组件
    - 调用 Render => 发现异步请求 => 悬停，等待异步请求完毕 => 再次渲染展示数据。
    ```js
    // 子组件
    function UserInfo() {
        // 获取用户数据信息，然后再渲染组件。
        const user = getUserInfo();
        return <h1>{user.name}</h1>;
    }
    // 父组件
    export default function Index() {
        return (
            <Suspense fallback={<h1>Loading...</h1>}>
                <UserInfo />
            </Suspense>
        );
    }
    ```
2. `React.lazy`
    ```js
    const LazyComponent = React.lazy(() => import("./text"));
    export default function Index() {
        return (
            <Suspense fallback={<div>loading...</div>}>
                <LazyComponent />
            </Suspense>
        );
    }
    ```
3. `Suspense`原理
    - ![20230331231543-2023-03-31](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230331231543-2023-03-31.png)
4. `React.lazy`原理
    - 第一次渲染首先会执行 `init` 方法，里面会执行 `lazy` 的第一个函数，得到一个 `Promise`，绑定 `Promise.then` 成功回调，回调里得到将要渲染组件 `defaultExport` ，这里要注意的是，如上面的函数当第二个 `if` 判断的时候，因为此时状态不是 `Resolved` ，所以会走 `else` ，抛出异常 `Promise`，抛出异常会让当前渲染终止。
    - 这个异常 `Promise` 会被 `Suspense` 捕获到，`Suspense` 会处理 `Promise` ，`Promise` 执行成功回调得到 `defaultExport`（将想要渲染组件），然后 `Susponse` 发起第二次渲染，第二次 `init` 方法已经是 `Resolved` 成功状态，那么直接返回 `result` 也就是真正渲染的组件。这时候就可以正常渲染组件了。
    ```js
    // react/src/ReactLazy.js
    function lazy(ctor) {
        return {
            $$typeof: REACT_LAZY_TYPE,
            _payload: {
                _status: -1, //初始化状态
                _result: ctor,
            },
            _init: function (payload) {
                if (payload._status === -1) {
                    /* 第一次执行会走这里  */
                    const ctor = payload._result;
                    const thenable = ctor();
                    payload._status = Pending;
                    payload._result = thenable;
                    thenable.then((moduleObject) => {
                        const defaultExport = moduleObject.default;
                        resolved._status = Resolved; // 1 成功状态
                        resolved._result =
                            defaultExport; /* defaultExport 为我们动态加载的组件本身  */
                    });
                }
                if (payload._status === Resolved) {
                    // 成功状态
                    return payload._result;
                } else {
                    //第一次会抛出Promise异常给Suspense
                    throw payload._result;
                }
            },
        };
    }
    ```
5. componentDidCatch
    - `error` —— 抛出的错误。
    - `info` —— 带有 `componentStack key` 的对象，其中包含有关组件引发错误的栈信息。 先来打印一下，生命周期 `componentDidCatch` 参数长什么样子？
    ```js
    class Index extends React.Component {
        state = {
            hasError: false,
        };
        componentDidCatch(...arg) {
            uploadErrorLog(arg); /* 上传错误日志 */
            this.setState({
                /* 降级UI */ hasError: true,
            });
        }
        render() {
            const { hasError } = this.state;
            return (
                <div>
                    {hasError ? <div>组件出现错误</div> : <ErrorTest />}
                    <div> hello, my name is alien! </div>
                    <Test />
                </div>
            );
        }
    }
    ```
6. `static getDerivedStateFromError`
    - `React`更期望用 `getDerivedStateFromError` 代替 `componentDidCatch` 用于处理渲染异常的情况。
    - `getDerivedStateFromError` 是静态方法，内部不能调用 `setState`。`getDerivedStateFromError` 返回的值可以合并到 `state`，作为渲染使用。
    ```js
    class Index extends React.Component {
        state = {
            hasError: false,
        };
        static getDerivedStateFromError() {
            return { hasError: true };
        }
        render() {
            /* 如上 */
        }
    }
    ```

## 12.diff children 的流程

1. 遍历新`children`，复用`oldFiber`
    - 第一步对于 React.createElement 产生新的 child 组成的数组，首先会遍历数组，因为 fiber 对于同一级兄弟节点是用 sibling 指针指向，所以在遍历 children 遍历，sibling 指针同时移动，找到与 child 对应的 oldFiber
    - 然后通过调用 updateSlot ，updateSlot 内部会判断当前的 tag 和 key 是否匹配，如果匹配复用老 fiber 形成新的 fiber ，如果不匹配，返回 null ，此时 newFiber 等于 null 。
    - 如果是处于更新流程，找到与新节点对应的老 fiber ，但是不能复用 alternate === null ，那么会删除老 fiber 。
    ```js
    // react-reconciler/src/ReactChildFiber.js
    function reconcileChildrenArray(){
        /* 第一步  */
        for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
            if (oldFiber.index > newIdx) {
                nextOldFiber = oldFiber;
                oldFiber = null;
            } else {
                nextOldFiber = oldFiber.sibling;
            }
            const newFiber = updateSlot(returnFiber,oldFiber,newChildren[newIdx],expirationTime,);
            if (newFiber === null) { break }
            // ..一些其他逻辑
            }
            if (shouldTrackSideEffects) {  // shouldTrackSideEffects 为更新流程。
                if (oldFiber && newFiber.alternate === null) { /* 找到了与新节点对应的fiber，但是不能复用，那么直接删除老节点 */
                    deleteChild(returnFiber, oldFiber);
                }
            }
        }
    }
    ```
2. 统一删除`oldfiber`
    ```js
    if (newIdx === newChildren.length) {
        deleteRemainingChildren(returnFiber, oldFiber);
        return resultingFirstChild;
    }
    ```
3. 同意创建`newFiber`
    ```js
    if (oldFiber === null) {
        for (; newIdx < newChildren.length; newIdx++) {
            const newFiber = createChild(
                returnFiber,
                newChildren[newIdx],
                expirationTime,
            );
            // ...
        }
    }
    ```
4. 第四步：针对发生移动和更复杂的情况
    ```js
    const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
    for (; newIdx < newChildren.length; newIdx++) {
        const newFiber = updateFromMap(existingChildren, returnFiber);
        /* 从mapRemainingChildren删掉已经复用oldFiber */
    }
    ```

## 13.处理海量数据

1. 时间分片

    - 使用`requestIdleCallback`代替`setTimeout`浏览器空闲执行下一帧渲染
    - 通过`renderList`把已经渲染的`element`缓存起来

    ```js
    // TODO: 改造方案
    class Index extends React.Component {
        state = {
            dataList: [], //数据源列表
            renderList: [], //渲染列表
            position: { width: 0, height: 0 }, // 位置信息
            eachRenderNum: 500, // 每次渲染数量
        };
        box = React.createRef();
        componentDidMount() {
            const { offsetHeight, offsetWidth } = this.box.current;
            const originList = new Array(20000).fill(1);
            const times = Math.ceil(
                originList.length / this.state.eachRenderNum,
            ); /* 计算需要渲染此次数*/
            let index = 1;
            this.setState(
                {
                    dataList: originList,
                    position: { height: offsetHeight, width: offsetWidth },
                },
                () => {
                    this.toRenderList(index, times);
                },
            );
        }
        toRenderList = (index, times) => {
            if (index > times) return; /* 如果渲染完成，那么退出 */
            const { renderList } = this.state;
            renderList.push(
                this.renderNewList(index),
            ); /* 通过缓存element把所有渲染完成的list缓存下来，下一次更新，直接跳过渲染 */
            this.setState({
                renderList,
            });
            requestIdleCallback(() => {
                /* 用 requestIdleCallback 代替 setTimeout 浏览器空闲执行下一批渲染 */
                this.toRenderList(++index, times);
            });
        };
        renderNewList(index) {
            /* 得到最新的渲染列表 */
            const { dataList, position, eachRenderNum } = this.state;
            const list = dataList.slice(
                (index - 1) * eachRenderNum,
                index * eachRenderNum,
            );
            return (
                <React.Fragment key={index}>
                    {list.map((item, index) => (
                        <Circle key={index} position={position} />
                    ))}
                </React.Fragment>
            );
        }
        render() {
            return (
                <div className="bigData_index" ref={this.box}>
                    {this.state.renderList}
                </div>
            );
        }
    }
    ```

2. 虚拟列表
    1. 原理
        - ![20230401114623-2023-04-01](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230401114623-2023-04-01.png)
    2. `example`
    ```js
    function VirtualList() {
        const [dataList, setDataList] = React.useState([]); /* 保存数据源 */
        const [position, setPosition] = React.useState([
            0, 0,
        ]); /* 截取缓冲区 + 视图区索引 */
        const scroll = React.useRef(null); /* 获取scroll元素 */
        const box = React.useRef(null); /* 获取元素用于容器高度 */
        const context =
            React.useRef(null); /* 用于移动视图区域，形成滑动效果。 */
        const scrollInfo = React.useRef({
            height: 500 /* 容器高度 */,
            bufferCount: 8 /* 缓冲区个数 */,
            itemHeight: 60 /* 每一个item高度 */,
            renderCount: 0 /* 渲染区个数 */,
        });
        React.useEffect(() => {
            const height = box.current.offsetHeight;
            const { itemHeight, bufferCount } = scrollInfo.current;
            const renderCount = Math.ceil(height / itemHeight) + bufferCount;
            scrollInfo.current = {
                renderCount,
                height,
                bufferCount,
                itemHeight,
            };
            const dataList = new Array(10000)
                .fill(1)
                .map((item, index) => index + 1);
            setDataList(dataList);
            setPosition([0, renderCount]);
        }, []);
        const handleScroll = () => {
            const { scrollTop } = scroll.current;
            const { itemHeight, renderCount } = scrollInfo.current;
            const currentOffset = scrollTop - (scrollTop % itemHeight);
            const start = Math.floor(scrollTop / itemHeight);
            context.current.style.transform = `translate3d(0, ${currentOffset}px, 0)`; /* 偏移，造成下滑效果 */
            const end = Math.floor(scrollTop / itemHeight + renderCount + 1);
            if (end !== position[1] || start !== position[0]) {
                /* 如果render内容发生改变，那么截取  */
                setPosition([start, end]);
            }
        };
        const { itemHeight, height } = scrollInfo.current;
        const [start, end] = position;
        const renderList = dataList.slice(start, end); /* 渲染区间 */
        console.log("渲染区间", position);
        return (
            <div className="list_box" ref={box}>
                <div
                    className="scroll_box"
                    style={{ height: height + "px" }}
                    onScroll={handleScroll}
                    ref={scroll}>
                    <div
                        className="scroll_hold"
                        style={{ height: `${dataList.length * itemHeight}px` }}
                    />
                    <div className="context" ref={context}>
                        {renderList.map((item, index) => (
                            <div className="list" key={index}>
                                {" "}
                                {item + ""} Item{" "}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    ```
    ```css
    .list_box {
        width: 400px;
        height: 500px;
    }
    .list_box .scroll_box {
        width: 400px;
        position: relative;
        overflow-y: scroll;
    }
    .list {
        height: 40px;
        width: calc(100% - 50px);
        padding-left: 23px;
        margin: 5px;
        text-align: left;
        line-height: 40px;
        background-color: salmon;
        border-radius: 40px;
        color: white;
        font-weight: bolder;
    }
    .context {
        position: absolute;
        top: 0;
        width: 400px;
    }
    ```
3. 建议不要在 hooks 的参数中执行函数或者 new 实例
    - 每次`rerender`都会执行`fn`或者`new`一个实例
    - 如果创建的是`dom`元素，没有进行垃圾回收，会造成内存泄漏
    - 在更新阶段，`fn`和`new Fn()`不会被`useRef`接受
    ```js
    const hook1 = useRef(fn());
    const hook2 = useRef(new Fn());
    ```
    ```js
    // 初始化
    function mountRef(initialValue) {
        const hook = mountWorkInProgressHook();
        const ref = { current: initialValue };
        hook.memoizedState = ref;
        return ref;
    }
    ```
    ```js
    // 更新阶段，只会去获取之前创建的hook的memoizedState
    function updateRef(initialValue) {
        const hook = updateWorkInProgressHook();
        return hook.memoizedState;
    }
    ```
    ```js
    // 优化后代码
    const hook = useRef(null);
    if (!hook.current) {
        hook.current = new Fn();
    }
    ```

## 15.事件原理

1. `React`实现了一个兼容全浏览器的框架，抹平不同浏览器对事件处理的差异
2. 冒泡阶段和捕获阶段

```js
export default function Index() {
    const handleClick = () => {
        console.log("模拟冒泡阶段执行");
    };
    const handleClickCapture = () => {
        console.log("模拟捕获阶段执行");
    };
    return (
        <div>
            <button onClick={handleClick} onClickCapture={handleClickCapture}>
                点击
            </button>
        </div>
    );
}
```

3. `React`阻止冒泡

```js
export default function Index() {
    const handleClick = (e) => {
        e.stopPropagation(); /* 阻止事件冒泡，handleFatherClick 事件讲不在触发 */
    };
    const handleFatherClick = () => console.log("冒泡到父级");
    return (
        <div onClick={handleFatherClick}>
            <div onClick={handleClick}>点击</div>
        </div>
    );
}
```

4. 阻止默认行为
    1. 原生事件： e.preventDefault() 和 return false 可以用来阻止事件默认行为
    2. React 事件 在 React 应用中， return false 方法在 React 应用中完全失去了作用。可以用 e.preventDefault() 阻止事件默认行为，这个方法并非是原生事件的 preventDefault ，由于 React 事件源 e 也是独立组建的，所以 preventDefault 也是单独处理的。
5. `React` 的事件不是绑定在元素上的，而是统一绑定在顶部容器上，在 `v17` 之前是绑定在 `document` 上的，在 `v17` 改成了 `app` 容器上。这样更利于一个 `html` 下存在多个应用（微前端）。
6. 绑定事件并不是一次性绑定所有事件，比如发现了 onClick 事件，就会绑定 click 事件，比如发现 onChange 事件，会绑定 [blur，change ，focus ，keydown，keyup] 多个事件。
7. React 事件合成的概念：React 应用中，元素绑定的事件并不是原生事件，而是 React 合成的事件，比如 onClick 是由 click 合成，onChange 是由 blur ，change ，focus 等多个事件合成。
8. `registrationNameModules` 记录了 `React` 事件（比如 `onBlur` ）和与之对应的处理插件的映射

```js
const registrationNameModules = {
    onBlur: SimpleEventPlugin,
    onClick: SimpleEventPlugin,
    onClickCapture: SimpleEventPlugin,
    onChange: ChangeEventPlugin,
    onChangeCapture: ChangeEventPlugin,
    onMouseEnter: EnterLeaveEventPlugin,
    onMouseLeave: EnterLeaveEventPlugin,
    ...
}
```

9. `registrationNameDependencies`保存`react`事件与原生事件的对应关系

```js
{
    onBlur: ['blur'],
    onClick: ['click'],
    onClickCapture: ['click'],
    onChange: ['blur', 'change', 'click', 'focus', 'input', 'keydown', 'keyup', 'selectionchange'],
    onMouseEnter: ['mouseout', 'mouseover'],
    onMouseLeave: ['mouseout', 'mouseover'],
    ...
}
```

10. 事件绑定
    1. onChange 和 onClick 会保存在对应 DOM 元素类型 fiber 对象（ hostComponent ）的 memoizedProps 属性上
    2. ![20230401232653-2023-04-01](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230401232653-2023-04-01.png)
    3. example
    ```js
    export default function Index(){
        const handleClick = () => console.log('点击事件')
        const handleChange =() => console.log('change事件)
        return <div >
            <input onChange={ handleChange }  />
            <button onClick={ handleClick } >点击</button>
        </div>
    }
    ```
    4. 注册事件监听器
    ```js
    // react-dom/src/client/ReactDOMComponent.js
    function diffProperties(){
        /* 判断当前的 propKey 是不是 React合成事件 */
        if(registrationNameModules.hasOwnProperty(propKey)){
            /* 这里多个函数简化了，如果是合成事件， 传入成事件名称 onClick ，向document注册事件  */
            legacyListenToEvent(registrationName, document）;
        }
    }
    ```
    5. legacyListenToEvent 注册事件
    ```js
    // react-dom/src/events/DOMLegacyEventPluginSystem.js
    function legacyListenToEvent(registrationName，mountAt){
        const dependencies = registrationNameDependencies[registrationName]; // 根据 onClick 获取  onClick 依赖的事件数组 [ 'click' ]。
            for (let i = 0; i < dependencies.length; i++) {
            const dependency = dependencies[i];
            //  addEventListener 绑定事件监听器
            ...
        }
    }
    ```
    6. 将参数绑定给`dispatchEvent`
    ```js
    const listener = dispatchEvent.bind(
        null,
        "click",
        eventSystemFlags,
        document,
    );
    /* TODO: 重要, 这里进行真正的事件绑定。*/
    document.addEventListener("click", listener, false);
    ```
    7.
11. 一次点击事件
    ```js
    export default function Index() {
        const handleClick1 = () => console.log(1);
        const handleClick2 = () => console.log(2);
        const handleClick3 = () => console.log(3);
        const handleClick4 = () => console.log(4);
        return (
            <div onClick={handleClick3} onClickCapture={handleClick4}>
                <button onClick={handleClick1} onClickCapture={handleClick2}>
                    点击
                </button>
            </div>
        );
    }
    ```
    1. 批量更新
    ```js
    // react-dom/src/events/ReactDOMUpdateBatching.js
    export function batchedEventUpdates(fn, a) {
        isBatchingEventUpdates = true; //打开批量更新开关
        try {
            fn(a); // 事件在这里执行
        } finally {
            isBatchingEventUpdates = false; //关闭批量更新开关
        }
    }
    ```
    2. 合成事件源
        - 通过 `onClick` 找到对应的处理插件 `SimpleEventPlugin` ，合成新的事件源 `e` ，里面包含了 `preventDefault` 和 `stopPropagation` 等方法。
    3. 事件队列
        - 如果遇到捕获阶段事件 `onClickCapture` ，就会 `unshift` 放在数组前面。以此模拟事件捕获阶段。
        - 如果遇到冒泡阶段事件 `onClick` ，就会 `push` 到数组后面，模拟事件冒泡阶段。
        - 一直收集到最顶端 app ，形成执行队列，在接下来阶段，依次执行队列里面的函数。
        ```js
        while (instance !== null) {
            const { stateNode, tag } = instance;
            if (tag === HostComponent && stateNode !== null) {
                /* DOM 元素 */
                const currentTarget = stateNode;
                if (captured !== null) {
                    /* 事件捕获 */
                    /* 在事件捕获阶段,真正的事件处理函数 */
                    const captureListener = getListener(instance, captured); // onClickCapture
                    if (captureListener != null) {
                        /* 对应发生在事件捕获阶段的处理函数，逻辑是将执行函数unshift添加到队列的最前面 */
                        dispatchListeners.unshift(captureListener);
                    }
                }
                if (bubbled !== null) {
                    /* 事件冒泡 */
                    /* 事件冒泡阶段，真正的事件处理函数，逻辑是将执行函数push到执行队列的最后面 */
                    const bubbleListener = getListener(instance, bubbled); //
                    if (bubbleListener != null) {
                        dispatchListeners.push(bubbleListener); // onClick
                    }
                }
            }
            instance = instance.return;
        }
        ```
    4. 4 个事件执行顺序是这样的
        1. 首先第一次收集是在 button 上，handleClick1 冒泡事件 push 处理，handleClick2 捕获事件 unshift 处理。形成结构 [ handleClick2 , handleClick1 ]
        2. 然后接着向上收集，遇到父级，收集父级 div 上的事件，handleClick3 冒泡事件 push 处理，handleClick4 捕获事件 unshift 处理。[handleClick4, handleClick2 , handleClick1,handleClick3 ]
        3. 依次执行数组里面的事件，所以打印 4 2 1 3。
    5.
12. `react`阻止事件冒泡
    -   假设在上述队列中，handleClick2 中调用 e.stopPropagation()，那么事件源里将有状态证明此次事件已经停止冒泡，那么下次遍历的时候， event.isPropagationStopped() 就会返回 true ，所以跳出循环，handleClick1, handleClick3 将不再执行，模拟了阻止事件冒泡的过程。
    ```js
    // legacy-events/EventBatching.js
    function runEventsInBatch() {
        const dispatchListeners = event._dispatchListeners;
        if (Array.isArray(dispatchListeners)) {
            for (let i = 0; i < dispatchListeners.length; i++) {
                if (event.isPropagationStopped()) {
                    /* 判断是否已经阻止事件冒泡 */
                    break;
                }
                dispatchListeners[i](
                    event,
                ); /* 执行真正的处理函数 及handleClick1... */
            }
        }
    }
    ```
13. v18 之前事件处理
    ```js
    // 老版本事件系统：事件监听 -> 捕获阶段执行 -> 冒泡阶段执行
    // 新版本事件系统：捕获阶段执行 -> 事件监听 -> 冒泡阶段执行
    function Index() {
        const refObj = React.useRef(null);
        useEffect(() => {
            const handler = () => {
                console.log("事件监听");
            };
            refObj.current.addEventListener("click", handler);
            return () => {
                refObj.current.removeEventListener("click", handler);
            };
        }, []);
        const handleClick = () => {
            console.log("冒泡阶段执行");
        };
        const handleCaptureClick = () => {
            console.log("捕获阶段执行");
        };
        return (
            <button
                ref={refObj}
                onClick={handleClick}
                onClickCapture={handleCaptureClick}>
                点击
            </button>
        );
    }
    ```
14. 新老版本事件处理流程
    -   ![20230402000114-2023-04-02](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230402000114-2023-04-02.png)

## 17.调度与时间碎片

1. 为什么采用异步调度
    - 一次更新 `React` 无法知道此次更新的波及范围，所以 `React` 选择从根节点开始 `diff` ，查找不同，更新这些不同
    - 浏览器有绘制任务那么执行绘制任务，在空闲时间执行更新任务，就能解决卡顿问题了
2. 浏览器每次事件循环（一帧）
    1. 处理事件
    2. 执行 js
    3. 调用`requestAnimation`
    4. 布局`layout`
    5. 绘制`Paint`
    6. 一帧执行后，如果没有其他事件，浏览器会进入休息时间
3. requestIdleCallback
    - callback 回调，浏览器空余时间执行回调函数。
    - timeout 超时时间。如果浏览器长时间没有空闲，那么回调就不会执行，为了解决这个问题，可以通过 requestIdleCallback 的第二个参数指定一个超时时间。
    ```js
    requestIdleCallback(callback, { timeout });
    ```
4. `React`中使用`requestIdleCallback`有 5 个优先级
    - `Immediate`，-1 需要立刻执行
    - `UserBlocking`, 250ms 超时时间 250ms，一般指的是用户交互
    - `Normal`，5000ms 超时时间 5s，不需要直观立即变化的任务，比如网络请求。
    - `Low `, 10000ms 超时时间 10s，肯定要执行的任务，但是可以放在最后处理。
    - `Idle `, 一些没有必要的任务，可能不会执行。
5. 模拟 `requestIdleCallback`
    - 实现的这个 `requestIdleCallback` ，可以主动让出主线程，让浏览器去渲染视图。
    - 一次事件循环只执行一次，因为执行一个以后，还会请求下一次的时间片。
6. 递归执行 `setTimeout(fn, 0)` 时，最后间隔时间会变成 4 毫秒左右
    - 每秒 60 帧的频率划分时间片，这样每个时间片就是 16ms
    - 16 毫秒要完成如上 js 执行，浏览器绘制等操作
    - `setTimeout`带来的 4ms 延迟有点浪费了
7. `MessageChannel`

    - 在一次更新中，`React` 会调用 `requestHostCallback` ，把更新任务赋值给 `scheduledHostCallback` ，然后 `port2` 向 `port1` 发起 `postMessage` 消息通知。
    - `port1` 会通过 `onmessage` ，接受来自 `port2` 消息，然后执行更新任务 `scheduledHostCallback` ，然后置空 `scheduledHostCallback` ，借此达到异步执行目的。

    ```js
    let scheduledHostCallback = null;
    /* 建立一个消息通道 */
    var channel = new MessageChannel();
    /* 建立一个port发送消息 */
    var port = channel.port2;

    channel.port1.onmessage = function () {
        /* 执行任务 */
        scheduledHostCallback();
        /* 执行完毕，清空任务 */
        scheduledHostCallback = null;
    };
    /* 向浏览器请求执行更新任务 */
    requestHostCallback = function (callback) {
        scheduledHostCallback = callback;
        if (!isMessageLoopRunning) {
            isMessageLoopRunning = true;
            port.postMessage(null);
        }
    };
    ```

8. workLoopSync

    ```js
    // react-reconciler/src/ReactFiberWorkLoop.js
    // 正常更新，会更新执行每一个待更新的fiber
    function workLoopSync() {
        while (workInProgress !== null) {
            workInProgress = performUnitOfWork(workInProgress);
        }
    }

    // 低优先级异步更新
    // 浏览器没有空余时间，shouldYield为true，会终止循环
    // 避免浏览器一次性遍历大量的fiber，没有时间执行渲染任务，导致页面卡顿
    function workLoopConcurrent() {
        while (workInProgress !== null && !shouldYield()) {
            workInProgress = performUnitOfWork(workInProgress);
        }
    }
    ```

9. `scheduleCallback`
    - `workLoopSync` 和 `workLoopConcurrent`，都是由`scheduleCallback`统一调度的
    ```js
    // 正常更新的任务
    scheduleCallback(Immediate, workLoopSync);
    ```
    ```js
    /* 计算超时等级，就是如上那五个等级 */
    var priorityLevel = inferPriorityFromExpirationTime(
        currentTime,
        expirationTime,
    );
    scheduleCallback(priorityLevel, workLoopConcurrent);
    ```
10. `scheduleCallback `源码

    - 创建一个新的任务 newTask。
    - 过任务的开始时间( startTime ) 和 当前时间( currentTime ) 比较:当 startTime > currentTime, 说明未过期, 存到 timerQueue，当 startTime <= currentTime, 说明已过期, 存到 taskQueue。
    - 如果任务过期，并且没有调度中的任务，那么调度 requestHostCallback。本质上调度的是 flushWork。
    - 如果任务没有过期，用 requestHostTimeout 延时执行 handleTimeout。

    ```js
    // scheduler/src/Scheduler.js
    function scheduleCallback(){
        /* 计算过期时间：超时时间  = 开始时间（现在时间） + 任务超时的时间（上述设置那五个等级）     */
        const expirationTime = startTime + timeout;
        /* 创建一个新任务 */
        const newTask = { ... }
        if (startTime > currentTime) {
            /* 通过开始时间排序 */
            newTask.sortIndex = startTime;
            /* 把任务放在timerQueue中 */
            push(timerQueue, newTask);
            /*  执行setTimeout ， */
            requestHostTimeout(handleTimeout, startTime - currentTime);
        }else{
            /* 通过 expirationTime 排序  */
            newTask.sortIndex = expirationTime;
            /* 把任务放入taskQueue */
            push(taskQueue, newTask);
            /*没有处于调度中的任务， 然后向浏览器请求一帧，浏览器空闲执行 flushWork */
            if (!isHostCallbackScheduled && !isPerformingWork) {
                isHostCallbackScheduled = true;
                requestHostCallback(flushWork)
            }
        }
    }
    ```

11. `requestHostTimeout`

    - `requestHostTimeout` 延时执行 `handleTimeout`，`cancelHostTimeout` 用于清除当前的延时器。

    ```js
    // scheduler/src/Scheduler.js
    requestHostTimeout = function (cb, ms) {
        _timeoutID = setTimeout(cb, ms);
    };

    cancelHostTimeout = function () {
        clearTimeout(_timeoutID);
    };
    ```

12. `handleTimeout`
    - 延时指定时间后，调用的 `handleTimeout` 函数， `handleTimeout` 会把任务重新放在 `requestHostCallback` 调度。
    - 通过 `advanceTimers` 将 `timeQueue` 中过期的任务转移到 `taskQueue` 中。
    - 然后调用 `requestHostCallback` 调度过期的任务。
    ```js
    // scheduler/src/Scheduler.js
    function handleTimeout() {
        isHostTimeoutScheduled = false;
        /* 将 timeQueue 中过期的任务，放在 taskQueue 中 。 */
        advanceTimers(currentTime);
        /* 如果没有处于调度中 */
        if (!isHostCallbackScheduled) {
            /* 判断有没有过期的任务， */
            if (peek(taskQueue) !== null) {
                isHostCallbackScheduled = true;
                /* 开启调度任务 */
                requestHostCallback(flushWork);
            }
        }
    }
    ```
13. advanceTimers
    - 如果任务已经过期，那么将 `timerQueue` 中的过期任务，放入 `taskQueue`。
    ```js
    // scheduler/src/Scheduler.js advanceTimers
    function advanceTimers() {
        var timer = peek(timerQueue);
        while (timer !== null) {
            if (timer.callback === null) {
                pop(timerQueue);
            } else if (timer.startTime <= currentTime) {
                /* 如果任务已经过期，那么将 timerQueue 中的过期任务，放入taskQueue */
                pop(timerQueue);
                timer.sortIndex = timer.expirationTime;
                push(taskQueue, timer);
            }
        }
    }
    ```
14. `flushWork`和`workloop`
    - 第一件是 `React` 的更新任务最后都是放在 `taskQueue` 中的。
    - 第二件是 `requestHostCallback` ，放入 `MessageChannel` 中的回调函数是`flushWork`。
    - flushWork 如果有延时任务执行的话，那么会先暂停延时任务，然后调用 workLoop ，去真正执行超时的更新任务。
    ```js
    // scheduler/src/Scheduler.js flushWork
    function flushWork(){
        if (isHostTimeoutScheduled) { /* 如果有延时任务，那么先暂定延时任务*/
            isHostTimeoutScheduled = false;
            cancelHostTimeout();
        }
        try{
            /* 执行 workLoop 里面会真正调度我们的事件  */
            workLoop(hasTimeRemaining, initialTime)
        }
    }
    ```
15. workLoop
    ```js
    function workLoop() {
        var currentTime = initialTime;
        advanceTimers(currentTime);
        /* 获取任务列表中的第一个 */
        currentTask = peek();
        while (currentTask !== null) {
            /* 真正的更新函数 callback */
            var callback = currentTask.callback;
            if (callback !== null) {
                /* 执行更新 */
                callback();
                /* 先看一下 timeQueue 中有没有 过期任务。 */
                advanceTimers(currentTime);
            }
            /* 再一次获取任务，循环执行 */
            currentTask = peek(taskQueue);
        }
    }
    ```
16. `shouldYield` 中止 `workloop`
    - 在 fiber 的异步更新任务 workLoopConcurrent 中，每一个 fiber 的 workloop 都会调用 shouldYield 判断是否有超时更新的任务，如果有，那么停止 workLoop。
    - 如果存在第一个任务，并且已经超时了，那么 shouldYield 会返回 true，那么会中止 fiber 的 workloop。
    ```js
    // scheduler/src/Scheduler.js unstable_shouldYield
    function unstable_shouldYield() {
        var currentTime = exports.unstable_now();
        advanceTimers(currentTime);
        /* 获取第一个任务 */
        var firstTask = peek(taskQueue);
        return (
            (firstTask !== currentTask &&
                currentTask !== null &&
                firstTask !== null &&
                firstTask.callback !== null &&
                firstTask.startTime <= currentTime &&
                firstTask.expirationTime < currentTask.expirationTime) ||
            shouldYieldToHost()
        );
    }
    ```
17. 调和+调度
    - ![20230403000339-2023-04-03](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230403000339-2023-04-03.png)
    - ![20230403000350-2023-04-03](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230403000350-2023-04-03.png)
18.

## 18.调和和 fiber

1. `Element`,`fiber`,`dom`三种什么关系
    - `element` 是 `React` 视图层在代码层级上的表象，也就是开发者写的 `jsx` 语法，写的元素结构，都会被创建成 `element` 对象的形式。上面保存了 `props` ， `children` 等信息。
    - `DOM` 是元素在浏览器上给用户直观的表象。
    - `fiber` 可以说是是 `element` 和真实 `DOM` 之间的交流枢纽站，一方面每一个类型 `element` 都会有一个与之对应的 `fiber` 类型，`element` 变化引起更新流程都是通过 `fiber` 层面做一次调和改变，然后对于元素，形成新的 `DOM` 做视图渲染。
2. 转换流程
    - ![20230403012828-2023-04-03](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230403012828-2023-04-03.png)
3. `Element`与`fiber`之间的关系
    ```js
    export const FunctionComponent = 0; // 对应函数组件
    export const ClassComponent = 1; // 对应的类组件
    export const IndeterminateComponent = 2; // 初始化的时候不知道是函数组件还是类组件
    export const HostRoot = 3; // Root Fiber 可以理解为跟元素 ， 通过reactDom.render()产生的根元素
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
4. `Fiber`上保存的信息

    ```js
    // react-reconciler/src/ReactFiber.js
    function FiberNode() {
        this.tag = tag; // fiber 标签 证明是什么类型fiber。
        this.key = key; // key调和子节点时候用到。
        this.type = null; // dom元素是对应的元素类型，比如div，组件指向组件对应的类或者函数。
        this.stateNode = null; // 指向对应的真实dom元素，类组件指向组件实例，可以被ref获取。

        this.return = null; // 指向父级fiber
        this.child = null; // 指向子级fiber
        this.sibling = null; // 指向兄弟fiber
        this.index = 0; // 索引

        this.ref = null; // ref指向，ref函数，或者ref对象。

        this.pendingProps = pendingProps; // 在一次更新中，代表element创建
        this.memoizedProps = null; // 记录上一次更新完毕后的props
        this.updateQueue = null; // 类组件存放setState更新队列，函数组件存放
        this.memoizedState = null; // 类组件保存state信息，函数组件保存hooks信息，dom元素为null
        this.dependencies = null; // context或是时间的依赖项

        this.mode = mode; //描述fiber树的模式，比如 ConcurrentMode 模式

        this.effectTag = NoEffect; // effect标签，用于收集effectList
        this.nextEffect = null; // 指向下一个effect

        this.firstEffect = null; // 第一个effect
        this.lastEffect = null; // 最后一个effect

        this.expirationTime = NoWork; // 通过不同过期时间，判断任务是否过期， 在v17版本用lane表示。

        this.alternate = null; //双缓存树，指向缓存的fiber。更新阶段，两颗树互相交替。
    }
    ```

5. 创建`fiberRoot`和`rootFiber`
    - fiberRoot：首次构建应用， 创建一个 fiberRoot ，作为整个 React 应用的根基。
    - rootFiber： 如下通过 ReactDOM.render 渲染出来的，如上 Index 可以作为一个 rootFiber。一个 React 应用可以有多 ReactDOM.render 创建的 rootFiber ，但是只能有一个 fiberRoot（应用根节点）。
    ```js
    ReactDOM.render(<Index />, document.getElementById("app"));
    ```
    ```js
    // react-reconciler/src/ReactFiberRoot.js
    function createFiberRoot(containerInfo, tag) {
        /* 创建一个root */
        const root = new FiberRootNode(containerInfo, tag);
        const rootFiber = createHostRootFiber(tag);
        root.current = rootFiber;
        return root;
    }
    ```
6. `workInProgress`
    - `workInProgress`是：正在内存中构建的 `Fiber` 树称为 `workInProgress Fiber` 树。在一次更新中，所有的更新都是发生在 `workInProgress` 树上。在一次更新之后，`workInProgress` 树上的状态是最新的状态，那么它将变成 `current` 树用于渲染视图。
7. `current`
    - current：正在视图层渲染的树叫做 current 树。
    ```js
    currentFiber.alternate = workInProgressFiber;
    workInProgressFiber.alternate = currentFiber;
    ```
8. 更新
    - 将 `current` 的 `alternate` 作为基础（如图右树），复制一份作为 `workInProgresss` ，然后进行更新。
9. 双缓冲树
    - `canvas` 绘制动画的时候，如果上一帧计算量比较大，导致清除上一帧画面到绘制当前帧画面之间有较长间隙，就会出现白屏。为了解决这个问题，`canvas` 在内存中绘制当前动画，绘制完毕后直接用当前帧替换上一帧画面，由于省去了两帧替换间的计算时间，不会出现从白屏到出现画面的闪烁情况。这种在内存中构建并直接替换的技术叫做双缓存。
    - React 用 workInProgress 树(内存中构建的树) 和 current (渲染树) 来实现更新逻辑。双缓存一个在内存中构建，一个渲染视图，两颗树用 alternate 指针相互指向，在下一次渲染的时候，直接复用缓存树做为下一次渲染树，上一次的渲染树又作为缓存树，这样可以防止只用一颗树更新状态的丢失的情况，又加快了 DOM 节点的替换与更新。
    - ![20230403014823-2023-04-03](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230403014823-2023-04-03.png)
10. `render`

    - `beginWork`：是向下调和的过程。就是由 fiberRoot 按照 child 指针逐层向下调和，期间会执行函数组件，实例类组件，diff 调和子节点，打不同 effectTag。
    - `completeUnitOfWork`：是向上归并的过程，如果有兄弟节点，会返回 `sibling`兄弟，没有返回 `return `父级，一直返回到 fiebrRoot ，期间可以形成`effectList`，对于初始化流程会创建 `DOM` ，对于 DOM 元素进行事件收集，处理 style，className 等。

    ```js
    // react-reconciler/src/ReactFiberWorkLoop.js
    function performUnitOfWork() {
        next = beginWork(current, unitOfWork, renderExpirationTime);
        if (next === null) {
            next = completeUnitOfWork(unitOfWork);
        }
    }
    ```

    ```js
    // react-reconciler/src/ReactFiberBeginWork.js
    function beginWork(current,workInProgress){

        switch(workInProgress.tag){
            case IndeterminateComponent:{// 初始化的时候不知道是函数组件还是类组件
                //....
            }
            case FunctionComponent: {//对应函数组件
                //....
            }
            case ClassComponent:{  //类组件
                //...
            }
            case HostComponent:{
                //...
            }
            ...
        }
    }
    ```

11. `beginWork`的工作
    - 对于组件，执行部分生命周期，执行 render ，得到最新的 children 。
    - 向下遍历调和 children ，复用 oldFiber ( diff 算法)
    - 打不同的副作用标签 effectTag ，比如类组件的生命周期，或者元素的增加，删除，更新。
12. `reconcileChildren`
    ```js
    // react-reconciler/src/ReactFiberBeginWork.js
    function reconcileChildren(current, workInProgress) {
        if (current === null) {
            /* 初始化子代fiber  */
            workInProgress.child = mountChildFibers(
                workInProgress,
                null,
                nextChildren,
                renderExpirationTime,
            );
        } else {
            /* 更新流程，diff children将在这里进行。 */
            workInProgress.child = reconcileChildFibers(
                workInProgress,
                current.child,
                nextChildren,
                renderExpirationTime,
            );
        }
    }
    ```
13. 向上归并 completeUnitOfWork
    - 首先 completeUnitOfWork 会将 effectTag 的 Fiber 节点会被保存在一条被称为 effectList 的单向链表中。在 commit 阶段，将不再需要遍历每一个 fiber ，只需要执行更新 effectList 就可以了。
    - completeWork 阶段对于组件处理 context ；对于元素标签初始化，会创建真实 DOM ，将子孙 DOM 节点插入刚生成的 DOM 节点中；会触发 diffProperties 处理 props ，比如事件收集，style，className 处理，在 15 章讲到过。
14. 调和顺序
    beginWork -> rootFiber
    beginWork -> Index fiber
    beginWork -> div fiber
    beginWork -> hello,world fiber
    completeWork -> hello,world fiber (completeWork 返回 sibling)
    beginWork -> p fiber
    completeWork -> p fiber
    beginWork -> button fiber
    completeWork -> button fiber (此时没有 sibling，返回 return)
    completeWork -> div fiber
    completeWork -> Index fiber
    completeWork -> rootFiber (完成整个 workLoop)
15. `commit`阶段
    - 一方面是对一些生命周期和副作用钩子的处理，比如 componentDidMount ，函数组件的 useEffect ，useLayoutEffect ；
    - 另一方面就是在一次更新中，添加节点（ Placement ），更新节点（ Update ），删除节点（ Deletion ），还有就是一些细节的处理，比如 ref 的处理。
16. commit 细分可以分为：
    - Before mutation 阶段（执行 DOM 操作前）；
    - mutation 阶段（执行 DOM 操作）；
    - layout 阶段（执行 DOM 操作后）
17. Before mutation
    - 因为 Before mutation 还没修改真实的 DOM ，是获取 DOM 快照的最佳时期，如果是类组件有 getSnapshotBeforeUpdate ，那么会执行这个生命周期。
    - 会异步调用 useEffect ，在生命周期章节讲到 useEffect 是采用异步调用的模式，其目的就是防止同步执行时阻塞浏览器做视图渲染。
    ```js
    // react-reconciler/src/ReactFiberWorkLoop.js
    function commitBeforeMutationEffects() {
        while (nextEffect !== null) {
            const effectTag = nextEffect.effectTag;
            if ((effectTag & Snapshot) !== NoEffect) {
                const current = nextEffect.alternate;
                // 调用getSnapshotBeforeUpdates
                commitBeforeMutationEffectOnFiber(current, nextEffect);
            }
            if ((effectTag & Passive) !== NoEffect) {
                scheduleCallback(NormalPriority, () => {
                    flushPassiveEffects();
                    return null;
                });
            }
            nextEffect = nextEffect.nextEffect;
        }
    }
    ```
18. Mutation
    - 置空 ref ，在 ref 章节讲到对于 ref 的处理。
    - 对新增元素，更新元素，删除元素。进行真实的 DOM 操作。
    ```js
    function commitMutationEffects() {
        while (nextEffect !== null) {
            if (effectTag & Ref) {
                /* 置空Ref */
                const current = nextEffect.alternate;
                if (current !== null) {
                    commitDetachRef(current);
                }
            }
            switch (primaryEffectTag) {
                case Placement: {
                } //  新增元素
                case Update: {
                } //  更新元素
                case Deletion: {
                } //  删除元素
            }
        }
    }
    ```
19. `Layout`
    - commitLayoutEffectOnFiber 对于类组件，会执行生命周期，setState 的 callback，对于函数组件会执行 useLayoutEffect 钩子。
    - 如果有 ref ，会重新赋值 ref 。
    ```js
    function commitLayoutEffects(root) {
        while (nextEffect !== null) {
            const effectTag = nextEffect.effectTag;
            commitLayoutEffectOnFiber(
                root,
                current,
                nextEffect,
                committedExpirationTime,
            );
            if (effectTag & Ref) {
                commitAttachRef(nextEffect);
            }
        }
    }
    ```
20. 流程
    - ![20230403015825-2023-04-03](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230403015825-2023-04-03.png)

## 19.hooks 原理

1. `hooks`出现的本质原因
    - 函数组件也能做类组件的事，有状态、能处理副作用、能获取`ref`
    - 解决逻辑复用难的问题
    - 拥抱函数式编程
    - hooks 可以作为函数组件本身和函数组件对应的 fiber 之间的沟通桥梁。
    - ![20230403192709-2023-04-03](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230403192709-2023-04-03.png)
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
7. 对于函数组件 `fiber` ，`updateQueue` 存放每个 `useEffect/useLayoutEffect` 产生的副作用组成的链表。在 `commit` 阶段更新这些副作用。
8. `ReactCurrentDispatcher.current` 中的， `React` 就是通过赋予 `current` 不同的 `hooks` 对象达到监控 `hooks` 是否在函数组件内部调用。
9. hooks 初始化- hooks 如何和 fiber 建立起关系
    ```js
    // react-reconciler/src/ReactFiberHooks.js
    function mountWorkInProgressHook() {
        const hook = {
            memoizedState: null,
            baseState: null,
            baseQueue: null,
            queue: null,
            next: null,
        };
        if (workInProgressHook === null) {
            // 只有一个 hooks
            currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
        } else {
            // 有多个 hooks
            workInProgressHook = workInProgressHook.next = hook;
        }
        return workInProgressHook;
    }
    ```
    - 初始化，每个 hooks 内部执行 mountWorkInProgressHook ，然后每一个 hook 通过 next 和下一个 hook 建立起关联，最后在 fiber 上的结构会变成这样。
    - ![20230403193132-2023-04-03](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230403193132-2023-04-03.png)
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
10. `hooks`更新
    - 更新过程中，如果通过 if 条件语句，增加或者删除 `hooks`，在复用 `hooks` 过程中，会产生复用 `hooks` 状态和当前 `hooks` 不一致的问题
    - ![20230405121345-2023-04-05](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230405121345-2023-04-05.png)
    ```js
    export default function Index({ showNumber }) {
        let number, setNumber;
        showNumber && ([number, setNumber] = React.useState(0)); // 第一个hooks
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
11. useState
    ```js
    // react-reconciler/src/ReactFiberHooks.js
    // 上面的 state 会被当前 hooks 的 memoizedState 保存下来，每一个 useState 都会创建一个 queue 里面保存了更新的信息。
    // 每一个 useState 都会创建一个更新函数，比如如上的 setNumber 本质上就是 dispatchAction，那么值得注意一点是，当前的 fiber 被 bind 绑定了固定的参数传入 dispatchAction 和 queue ，所以当用户触发 setNumber 的时候，能够直观反映出来自哪个 fiber 的更新。
    // 最后把 memoizedState dispatch 返回给开发者使用。
    function mountState(initialState){
        const hook = mountWorkInProgressHook();
        if (typeof initialState === 'function') {initialState = initialState() } // 如果 useState 第一个参数为函数，执行函数得到初始化state
        hook.memoizedState = hook.baseState = initialState;
        const queue = (hook.queue = { ... }); // 负责记录更新的各种状态。
        const dispatch = (queue.dispatch = (dispatchAction.bind(  null,currentlyRenderingFiber,queue, ))) // dispatchAction 为更新调度的主要函数
        return [hook.memoizedState, dispatch];
    }
    ```
12. `dispatchAction`
    - 首先用户每一次调用 dispatchAction（比如如上触发 setNumber ）都会先创建一个 update ，然后把它放入待更新 pending 队列中。
    - 然后判断如果当前的 fiber 正在更新，那么也就不需要再更新了。
    - 反之，说明当前 fiber 没有更新任务，那么会拿出上一次 state 和 这一次 state 进行对比，如果相同，那么直接退出更新。如果不相同，那么发起更新调度任务。这就解释了，为什么函数组件 useState 改变相同的值，组件不更新了。
    - 触发了三次 setNumber，等于触发了三次 dispatchAction ，那么这三次 update 会在当前 hooks 的 pending 队列中，然后事件批量更新的概念，会统一合成一次更新。接下来就是组件渲染，那么就到了再一次执行 useState，此时走的是更新流程。那么试想一下点击 handleClick 最后 state 被更新成 6 ，那么在更新逻辑中 useState 内部要做的事，就是得到最新的 state 。
    ```js
    export default function Index() {
        const [number, setNumber] = useState(0);
        const handleClick = () => {
            setNumber((num) => num + 1); // num = 1
            setNumber((num) => num + 2); // num = 3
            setNumber((num) => num + 3); // num = 6
        };
        return (
            <div>
                <button onClick={() => handleClick()}>点击 {number} </button>
            </div>
        );
    }
    ```
    - 三次 `update` 会在当前 `hooks` 的 `pending` 队列中，然后事件批量更新的概念，会统一合成一次更新
    ```js
    function updateReducer() {
        // 第一步把待更新的pending队列取出来。合并到 baseQueue
        const first = baseQueue.next;
        let update = first;
        do {
            /* 得到新的 state */
            newState = reducer(newState, action);
        } while (update !== null && update !== first);
        hook.memoizedState = newState;
        return [hook.memoizedState, dispatch];
    }
    ```
13. `mountEffect`
    ```js
    // pushEffect 除了创建一个 effect ， 还有一个重要作用，就是如果存在多个 effect 或者 layoutEffect 会形成一个副作用链表，绑定在函数组件 fiber 的 updateQueue 上。
    function mountEffect(create, deps) {
        const hook = mountWorkInProgressHook();
        const nextDeps = deps === undefined ? null : deps;
        currentlyRenderingFiber.effectTag |= UpdateEffect | PassiveEffect;
        hook.memoizedState = pushEffect(
            HookHasEffect | hookEffectTag,
            create, // useEffect 第一次参数，就是副作用函数
            undefined,
            nextDeps, // useEffect 第二次参数，deps
        );
    }
    ```
    ```js
    function updateEffect(create, deps) {
        const hook = updateWorkInProgressHook();
        if (areHookInputsEqual(nextDeps, prevDeps)) {
            /* 如果deps项没有发生变化，那么更新effect list就可以了，无须设置 HookHasEffect */
            pushEffect(hookEffectTag, create, destroy, nextDeps);
            return;
        }
        /* 如果deps依赖项发生改变，赋予 effectTag ，在commit节点，就会再次执行我们的effect  */
        currentlyRenderingFiber.effectTag |= fiberEffectTag;
        hook.memoizedState = pushEffect(
            HookHasEffect | hookEffectTag,
            create,
            destroy,
            nextDeps,
        );
    }
    ```
14. React 就是在 commit 阶段，通过标识符，证明是 useEffect 还是 useLayoutEffect ，接下来 React 会同步处理 useLayoutEffect ，异步处理 useEffect 。
15. useRef
    ```js
    // 创建
    function mountRef(initialValue) {
        const hook = mountWorkInProgressHook();
        const ref = { current: initialValue };
        hook.memoizedState = ref; // 创建ref对象。
        return ref;
    }
    ```
    ```js
    // 更新
    function updateRef(initialValue) {
        const hook = updateWorkInProgressHook();
        return hook.memoizedState; // 取出复用ref对象。
    }
    ```
16. `useMemo`
    ```js
    function mountMemo(nextCreate, deps) {
        const hook = mountWorkInProgressHook();
        const nextDeps = deps === undefined ? null : deps;
        const nextValue = nextCreate();
        hook.memoizedState = [nextValue, nextDeps];
        return nextValue;
    }
    ```
    ```js
    function updateMemo(nextCreate, nextDeps) {
        const hook = updateWorkInProgressHook();
        const prevState = hook.memoizedState;
        const prevDeps = prevState[1]; // 之前保存的 deps 值
        if (areHookInputsEqual(nextDeps, prevDeps)) {
            //判断两次 deps 值
            return prevState[0];
        }
        const nextValue = nextCreate(); // 如果deps，发生改变，重新执行
        hook.memoizedState = [nextValue, nextDeps];
        return nextValue;
    }
    ```

## 22.React-router

1. history ,React-router , React-router-dom 三者关系
    - `history`： history 是整个 React-router 的核心，里面包括两种路由模式下改变路由的方法，和监听路由变化方法等。
    - `react-router`：既然有了 history 路由监听/改变的核心，那么需要调度组件负责派发这些路由的更新，也需要容器组件通过路由更新，来渲染视图。所以说 React-router 在 history 核心基础上，增加了 Router ，Switch ，Route 等组件来处理视图渲染。
    - `react-router-dom`： 在 react-router 基础上，增加了一些 UI 层面的拓展比如 Link ，NavLink 。以及两种模式的根部路由 BrowserRouter ，HashRouter 。
    - ![20230405170934-2023-04-05](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230405170934-2023-04-05.png)
2. 2 种路由方式
    - `history` 模式下：`http://www.xxx.com/home`
    ```js
    import { BrowserRouter as Router } from "react-router-dom";
    function Index() {
        return <Router>{/* ...开启history模式 */}</Router>;
    }
    ```
    - `hash`模式下：`http://www.xxx.com/#/home`
    ```js
    import { HashRouter as Router } from "react-router-dom";
    // 和history一样
    ```
3. `BrowserHistory`模式
    1. `window.history.pushState`
        - `state`：一个与指定网址相关的状态对象， `popstate` 事件触发时，该对象会传入回调函数。如果不需要可填 `null`。
        - `title`：新页面的标题，但是所有浏览器目前都忽略这个值，可填 `null` 。
        - `path`：新的网址，必须与当前页面处在同一个域。浏览器的地址栏将显示这个地址。
        ```js
        // state可以存任何数据
        const state = {
            currentPage: "home",
            isLoggedIn: true,
            user: {
                name: "John Doe",
                email: "johndoe@example.com",
            },
        };
        history.pushState(state, title, path);
        console.log(history.state);
        ```
    2. `history.replaceState`
        - 参数和 `pushState` 一样，这个方法会修改当前的 `history` 对象记录， 但是 `history.length` 的长度不会改变。
        ```js
        history.replaceState(state, title, path);
        ```
    3. 监听路由 `popstate`
        - `popstate` 事件只会在浏览器某些行为下触发, 比如点击后退、前进按钮或者调用 `history.back()`、`history.forward()`、`history.go()`方法。
        ```js
        window.addEventListener("popstate", function (e) {
            /* 监听改变 */
        });
        ```
4. `HashHistory`模式下
    1. 改变路由 `window.location.hash`
    2. 监听路由`onhashchange`
    ```js
    window.addEventListener("hashchange", function (e) {
        /* 监听改变 */
    });
    ```
    3.

## 25.实现 mini-Router

1. 提供路由更新派发——`Router`

```js
import React, {
    useCallback,
    useState,
    useEffect,
    createContext,
    useMemo,
} from "react";
import { createBrowserHistory as createHistory } from "history";

export const RouterContext = createContext();
export let rootHistory = null;

export default function Router(props) {
    /* 缓存history属性 */
    const history = useMemo(() => {
        rootHistory = createHistory();
        return rootHistory;
    }, []);
    const [location, setLocation] = useState(history.location);
    useEffect(() => {
        /* 监听location变化，通知更新 */
        const unlisten = history.listen((location) => {
            setLocation(location);
        });
        return function () {
            unlisten && unlisten();
        };
    }, []);
    return (
        <RouterContext.Provider
            value={{
                location,
                history,
                match: {
                    path: "/",
                    url: "/",
                    params: {},
                    isExact: location.pathname === "/",
                },
            }}>
            {props.children}
        </RouterContext.Provider>
    );
}
```

2. 控制更新——`Route`

```js
import React, { useContext } from "react";
import { matchPath } from "react-router";
import { RouterContext } from "./Router";

function Route(props) {
    const context = useContext(RouterContext);
    /* 获取location对象 */
    const location = props.location || context.location;
    /* 是否匹配当前路由，如果父级有switch，就会传入computedMatch来精确匹配渲染此路由 */
    const match = props.computedMatch
        ? props.computedMatch
        : props.path
        ? matchPath(location.pathname, props)
        : context.match;
    /* 这个props用于传递给路由组件 */
    const newRouterProps = { ...context, location, match };
    let { children, component, render } = props;
    if (Array.isArray(children) && children.length === 0) children = null;
    let renderChildren = null;
    if (newRouterProps.match) {
        if (children) {
            /* 当Router 是 props children 或者 render props 形式。*/
            renderChildren =
                typeof children === "function"
                    ? children(newRouterProps)
                    : children;
        } else if (component) {
            /*  Route有component属性 */
            renderChildren = React.createElement(component, newRouterProps);
        } else if (render) {
            /*  Route有render属性 */
            renderChildren = render(newRouterProps);
        }
    }
    /* 逐层传递上下文 */
    return (
        <RouterContext.Provider value={newRouterProps}>
            {renderChildren}
        </RouterContext.Provider>
    );
}
export default Route;
```

3. 匹配正确路由—— `Switch`

```js
import React, { useContext } from "react";
import { matchPath } from "react-router";

import { RouterContext } from "../component/Router";

export default function Switch(props) {
    const context = useContext(RouterContext);
    const location = props.location || context.location;
    let children, match;
    /* 遍历children Route 找到匹配的那一个 */
    React.Children.forEach(props.children, (child) => {
        if (!match && React.isValidElement(child)) {
            /* 路由匹配并为React.element元素的时候 */
            const path = child.props.path; //获取Route上的path
            children = child; /* 匹配的children */
            match = path
                ? matchPath(location.pathname, { ...child.props })
                : context.match; /* 计算是否匹配 */
        }
    });
    /* 克隆一份Children，混入 computedMatch 并渲染。 */
    return match
        ? React.cloneElement(children, { location, computedMatch: match })
        : null;
}
```

4. 获取`history`对象

```js
import { useContext } from "react";
import { RouterContext } from "../component/Router";
/* 用useContext获取上下文中的history对象 */
export default function useHistory() {
    return useContext(RouterContext).history;
}
```

5. 获取 `location` 对象

```js
import { useContext } from "react";
import { RouterContext } from "../component/Router";
/* 用useContext获取上下文中的location对象 */
export default function useLocation() {
    return useContext(RouterContext).location;
}
```

6. 监听路由改变

```js
import { useEffect } from "react";
import { rootHistory } from "../component/Router";

/* 监听路由改变 */
function useListen(cb) {
    useEffect(() => {
        if (!rootHistory) return () => {};
        /* 绑定路由事件监听器 */
        const unlisten = rootHistory.listen((location) => {
            cb && cb(location);
        });
        return function () {
            unlisten && unlisten();
        };
    }, []);
}
export default useListen;
```

7. 获取路由状态——`withRouter`

```js
import React, { useContext } from "react";
import hoistStatics from "hoist-non-react-statics";

import { RouterContext } from "../component/Router";

export default function withRouter(Component) {
    const WrapComponent = (props) => {
        const { wrappedComponentRef, ...remainingProps } = props;
        const context = useContext(RouterContext);
        return (
            <Component
                {...remainingProps}
                ref={wrappedComponentRef}
                {...context}
            />
        );
    };
    return hoistStatics(WrapComponent, Component);
}
```

8. 入口文件

```js
//component
import Router, { RouterContext } from "./component/Router";
import Route from "./component/Route";
import Switch from "./component/Switch";
//hooks
import useHistory from "./hooks/useHistory";
import useListen from "./hooks/useListen";
import useLocation from "./hooks/useLocation";
//hoc
import withRouter from "./hoc/withRouter";

export {
    Router,
    Switch,
    Route,
    RouterContext,
    useHistory,
    useListen,
    useLocation,
    withRouter,
};
```

9. 示例

```js
import React from "react";
import { Router, Route, useHistory, useListen, Switch } from "./router";

/* 引用业务组件 */
import Detail from "./testPage/detail"; /* 详情页 */
import Home from "./testPage/home"; /* 首页 */
import List from "./testPage/list"; /* 列表页 */
import "./index.scss";

const menusList = [
    {
        name: "首页",
        path: "/home",
    },
    {
        name: "列表",
        path: "/list",
    },
    {
        name: "详情",
        path: "/detail",
    },
];
/**/
function Nav() {
    const history = useHistory();
    /* 路由跳转 */
    const RouterGo = (url) => history.push(url);
    const path = history.location.pathname;
    return (
        <div>
            {menusList.map((item) => (
                <span
                    className={`nav ${item.path === path ? "active" : ""}`}
                    key={item.path}
                    onClick={() => RouterGo(item.path)}>
                    {item.name}
                </span>
            ))}
        </div>
    );
}

function Top() {
    /* 路由监听 */
    useListen((location) => {
        console.log("当前路由是：", location.pathname);
    });
    console.log(111);
    return <div>--------top------</div>;
}
function Index() {
    console.log("根组件渲染");
    return (
        <Router>
            <Top />
            <Nav />
            <Switch>
                <Route component={Home} path="/home"></Route>
                <Route component={Detail} path="/detail" />
                <Route path="/list" render={(props) => <List {...props} />} />
            </Switch>
            <div>--------bottom------</div>
        </Router>
    );
}

export default Index;
```
