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

## 3.模拟 class 中的一次性代码执行

```js
import { useRef } from "react";
// 创建一个自定义 Hook 用于执行一次性代码
function useSingleton(callback) {
    // 用一个 called ref 标记 callback 是否执行过
    const called = useRef(false);
    // 如果已经执行过，则直接返回
    if (called.current) return;
    // 第一次调用时直接执行
    callBack();
    // 设置标记为已执行过
    called.current = true;
}
```

```js
import useSingleton from "./useSingleton";
const MyComp = () => {
    // 使用自定义 Hook
    useSingleton(() => {
        console.log("这段代码只执行一次");
    });
    return <div>My Component</div>;
};
```

## 4.useEffect 的回调

1. 在下一次依赖发生变化以及组件销毁之前执行
2. 传统的`componentWillUnmount`只在组件销毁时才会执行
3. `example`

```js
import React, { useEffect } from "react";
import comments from "./comments";
function BlogView({ id }) {
    const handleCommentsChange = useCallback(() => {
        // 处理评论变化的通知
    }, []);
    useEffect(() => {
        // 获取博客内容
        fetchBlog(id);
        // 监听指定 id 的博客文章的评论变化通知
        const listener = comments.addListener(id, handleCommentsChange);
        return () => {
            // 当 id 发生变化时，移除之前的监听
            comments.removeListener(listener);
        };
    }, [id, handleCommentsChange]);
}
```

## 5.hooks 无法实现的生命周期

-   getSnapshotBeforeUpdate
-   componentDidCatch
-   getDerivedStateFromError

## 6.用 hooks 去实现高阶组件

## 7.自定义 Hooks

-   函数内部使用了 hooks，它就是 1 个 hooks
-   封装异步请求 hooks
-   hooks 不仅用于复用，还用于业务逻辑隔离，减少每个组件代码

```js
// useAsync
import { useState } from "react";
const useAsync = (asyncFunction) => {
    // 设置三个异步逻辑相关的 state
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // 定义一个 callback 用于执行异步逻辑
    const execute = useCallback(() => {
        // 请求开始时，设置 loading 为 true，清除已有数据和 error 状态
        setLoading(true);
        setData(null);
        setError(null);
        return asyncFunction()
            .then((response) => {
                // 请求成功时，将数据写进 state，设置 loading 为 false
                setData(response);
                setLoading(false);
            })
            .catch((error) => {
                // 请求失败时，设置 loading 为 false，并设置错误状态
                setError(error);
                setLoading(false);
            });
    }, [asyncFunction]);
    return { execute, loading, data, error };
};
```

```js
import React from "react";
import useAsync from './useAsync';
export default function UserList() {
    // 通过 useAsync 这个函数，只需要提供异步逻辑的实现
    const {
        execute: fetchUsers,
        data: users,
        loading,
        error,
    } = useAsync(async () => {
        const res = await fetch("https://reqres.in/api/users/");
        const json = await res.json();
        return json.data;
    });
    return (
    // 根据状态渲染 UI...
    );
}
```

```js
// useScroll
import { useState, useEffect } from "react";
// 获取横向，纵向滚动条位置
const getPosition = () => {
    return {
        x: document.body.scrollLeft,
        y: document.body.scrollTop,
    };
};
const useScroll = () => {
    // 定一个 position 这个 state 保存滚动条位置
    const [position, setPosition] = useState(getPosition());
    useEffect(() => {
        const handler = () => {
            setPosition(getPosition(document));
        };
        // 监听 scroll 事件，更新滚动条位置
        document.addEventListener("scroll", handler);
        return () => {
            // 组件销毁时，取消事件监听
            document.removeEventListener("scroll", handler);
        };
    }, []);
    return position;
};
```

```js
import React, { useCallback } from "react";
import useScroll from "./useScroll";
function ScrollTop() {
    const { y } = useScroll();
    const goTop = useCallback(() => {
        document.body.scrollTop = 0;
    }, []);
    const style = {
        position: "fixed",
        right: "10px",
        bottom: "10px",
    };
    // 当滚动条位置纵向超过 300 时，显示返回顶部按钮
    if (y > 300) {
        return (
            <button onClick={goTop} style={style}>
                Back to Top
            </button>
        );
    }
    // 否则不 render 任何 UI
    return null;
}
```

## 8.hooks 场景

1. 抽取业务逻辑
2. 封装通用逻辑
3. 监听浏览器状态
4. 拆分复杂组件

## 9.定义自己的 ApiClient

```js
import axios from "axios";
// 定义相关的 endpoint
const endPoints = {
    test: "https://60b2643d62ab150017ae21de.mockapi.io/",
    prod: "https://prod.myapi.io/",
    staging: "https://staging.myapi.io/",
};
// 创建 axios 的实例
const instance = axios.create({
    // 实际项目中根据当前环境设置 baseURL
    baseURL: endPoints.test,
    timeout: 30000,
    // 为所有请求设置通用的 header
    headers: { Authorization: "Bear mytoken" },
});
// 听过 axios 定义拦截器预处理所有请求
instance.interceptors.response.use(
    (res) => {
        // 可以假如请求成功的逻辑，比如 log
        return res;
    },
    (err) => {
        if (err.response.status === 403) {
            // 统一处理未授权请求，跳转到登录界面
            document.location = "/login";
        }
        return Promise.reject(err);
    }
);
export default instance;
```

## 10.事件处理

1.  `useCallback`
    -   事件处理函数传递给原生节点，不写`useCallback`
    -   事件处理函数传递给自定义组件，需要用`useCallback`才会避免重新渲染
2.  React 原生事件的原理：合成事件（`Synthetic Events`）
    -   由于虚拟 DOM 的存在，在 React 中即使绑定一个事件到原生的 DOM 节点，事件也并不是绑定在对应的节点上
    -   而是所有的事件都是绑定在根节点上。然后由 React 统一监听和
        管理，获取事件后再分发到具体的虚拟 DOM 节点上。
    -   在 React 17 之前，所有的事件都是绑定在 document 上的，而从 React 17 开始，所有的事件都绑定在整个 App 上的根节点上，
3.  React 使用合成事件的原因
    1. 虚拟 `DOM render` 的时候， DOM 很可能还没有真实地 `render` 到页面上，所以无法绑定事件。
    2. `React` 可以屏蔽底层事件的细节，避免浏览器的兼容性问题。同时呢，对于 `React Native` 这种不是通过浏览器 `render` 的运行时，也能提供一致的 `API`。
4.  自定义事件（回调行为）

        ```js
        import { useEffect, useState } from "react";
        // 使用 document.body 作为默认的监听节点
        const useKeyPress = (domNode = document.body) => {
            const [key, setKey] = useState(null);
            useEffect(() => {
                const handleKeyPress = (evt) => {
                    setKey(evt.keyCode);
                };
                // 监听按键事件
                domNode.addEventListener("keypress", handleKeyPress);
                return () => {
                    // 接触监听按键事件
                    domNode.removeEventListener("keypress", handleKeyPress);
                };
            }, [domNode]);

            return key;
        };
        ```
        ```jsx
        import useKeyPress from './useKeyPress';

        function UseKeyPressExample() => {
            const key = useKeyPress();
            return (
                <div>
                    <h1>UseKeyPress</h1>
                    <label>Key pressed: {key || "N/A"}</label>
                </div>
            );
        };
        ```
