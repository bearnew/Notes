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
5.

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
