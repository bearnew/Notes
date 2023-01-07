# React 进阶实践指南笔记

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
            secondArg
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
