# react hooks 核心原理

## 1.React 为什么发明 hooks

1. 组件很少使用到`class`的继承
2. 不会在组件外部实例化组件，调用其内部的方法
3. 所有的 UI 都是声明出来的，函数组件时最自然的方式
4. hooks 让函数组件拥有了状态和生命周期
5. hooks 的最大好处：简化了逻辑复用
6. 摒弃高阶组件的难理解、多节点
7. 可以将监听和解绑的业务逻辑聚合在一块

```js
const getSize = () => {
    return window.innerWidth > 1000 ? "large" : "small";
};
const useWindowSize = () => {
    const [size, setSize] = useState(getSize());
    useEffect(() => {
        const handler = () => {
            setSize(getSize());
        };
        window.addEventListener("resize", handler);
        return () => {
            window.removeEventListener("resize", handler);
        };
    }, []);
    return size;
};
```

```js
const Demo = () => {
    // window发生变化，useWindowSize重新执行，size变更，组件重新渲染
    const size = useWindowSize();
    if (size === "small") return <SmallComponent />;
    else return <LargeComponent />;
};
```

## 2.内置 hooks

1.  内置的 hooks: https://zh-hans.reactjs.org/docs/hooks-reference.html

2.  `useEffect`
    1. 每次 render 后执行：不提供第二个依赖项参数。
    ```js
    useEffect(() => {});
    ```
    2. 仅第一次 render 后执行：提供一个空数组作为依赖项
    ```js
    useEffect(() => {}, []);
    ```
    3. 第一次以及依赖项发生变化后执行：提供依赖项数组。
    ```js
    useEffect(() => {}, [deps]);
    ```
    4. 组件 unmount 后执行：返回一个回调函数。
    ```js
    useEffect(() => {
        return () => {};
    }, []);
    ```
3.  `react`使用浅比较依赖项，每次创建新对象，都会认为依赖项发生了变化
    ```js
    function Sample() {
        // 这里在每次组件执行时创建了一个新数组
        const todos = [{ text: "Learn hooks." }];
        useEffect(() => {
            console.log("Todos changed.");
        }, [todos]);
    }
    ```
4.  hooks 的使用规则
    -   只能在函数组件的顶级作用域使用，所有 Hook 必须要被执行到，必须按顺序执行。
    -   只能在函数组件或者其他 Hooks 中使用。
5.  在`class`组件中使用`hooks`

    ```js
    import React from "react";
    import { useWindowSize } from "../hooks/useWindowSize";
    export const withWindowSize = (Comp) => {
        return (props) => {
            const windowSize = useWindowSize();
            return <Comp windowSize={windowSize} {...props} />;
        };
    };
    ```

    ```js
    import React from "react";
    import { withWindowSize } from "./withWindowSize";
    class MyComp {
        render() {
            const { windowSize } = this.props;
            // ...
        }
    }
    // 通过 withWindowSize 高阶组件给 MyComp 添加 windowSize 属性
    export default withWindowSize(MyComp);
    ```

6.  使用`eslint-plugin-react-hooks`检查语法错误

```js
{
    "plugins": [
        // ...
        "react-hooks"
    ],
    "rules": {
        // ...
        // 检查 Hooks 的使用规则
        "react-hooks/rules-of-hooks": "error",
        // 检查依赖项的声明
        "react-hooks/exhaustive-deps": "warn"
    }
}
```

7. `useRef`函数组件之外创建的一个容器空间
    - 可以通过唯一的 current 属设置一个值，从而在函数组件的多次渲染之间共享这个值。
    - useRef 保存的数据一般是和 UI 的渲染无关的，因此当 ref 的值发生变化时，是不会触发组件的重新渲染的
    ```js
    import React, { useState, useCallback, useRef } from "react";
    export default function Timer() {
        // 定义 time state 用于保存计时的累积时间
        const [time, setTime] = useState(0);
        // 定义 timer 这样一个容器用于在跨组件渲染之间保存一个变量
        const timer = useRef(null);
        // 开始计时的事件处理函数
        const handleStart = useCallback(() => {
            // 使用 current 属性设置 ref 的值
            timer.current = window.setInterval(() => {
                setTime((time) => time + 1);
            }, 100);
        }, []);
        // 暂停计时的事件处理函数
        const handlePause = useCallback(() => {
            // 使用 clearInterval 来停止计时
            window.clearInterval(timer.current);
            timer.current = null;
        }, []);
        return (
            <div>
                {time / 10} seconds.
                <br />
                <button onClick={handleStart}>Start</button>
                <button onClick={handlePause}>Pause</button>
            </div>
        );
    }
    ```
8. useContext
    - 为了能够进行数据的绑定。当这个 Context 的数据发生变化时，使用这个数据的组件就能够自动刷新。简单的全局变量，就很难去实现
