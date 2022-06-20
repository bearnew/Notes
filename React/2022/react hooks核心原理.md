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
