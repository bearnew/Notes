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
