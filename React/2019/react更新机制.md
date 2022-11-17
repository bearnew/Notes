## React Batch Update

#### 1.react 的更新是批量更新的

```js
// 合成事件中的setState都会批量更新，最终只会render一次
handleClick = () => {
    this.setState(
        {
            count: this.state.count + 1,
        },
        () => {
            console.log("1111", this.state.count); // 1111 1
        }
    );
    console.log(this.state.count); // 0
    this.setState(
        {
            count: this.state.count + 1,
        },
        () => {
            console.log("2222", this.state.count); // 2222 1
        }
    );
    console.log(this.state.count); // 0
};
```

#### 2.setTimeout 和 ajax 请求中 和 原生事件，setState 是同步的, 并且不会批量更新

```js
setTimeout(() => {
    this.setState({ count: 1 });
    console.log(this.state.count); // 1

    this.setState({ count: 2 });
    console.log(this.state.count); // 2
});
```

```js
fetch("/").then(() => {
    this.setState({ val: 1 });
    console.log(this.state.val); // 1

    this.setState({ val: 2 });
    console.log(this.state.val); // 2
});
```

```js
componentDidMount() {
    const btn1 = document.getElementById('native-event');
    btn1?.addEventListener('click', this.nativeCallback);
}
nativeCallback = () => {
    // s1 s2 s3 都是 1
    const { s1, s2, s3 } = this.state;
    this.setState({ s1: s1 + 1 });
    this.setState({ s2: s2 + 1 });
    this.setState({ s3: s3 + 1 });
    // 输出2，页面渲染render3次
    console.log('after setState s1:', this.state.s1);
};
```

#### 3.componentWillMount 中的 ajax 请求

-   componentWillMount 中的异步代码不会阻塞渲染
-   但是 js 单线程执行，如果 render 中的 UI 耗时过长，会阻塞获取请求返回值
-   获取到请求返回值后，setState 后会重新 render

#### 4.setState isBatchingUpdates

> https://hateonion.me/posts/19jan14/

1. `isBatchingUpdates: true`
    - 暂存 state 进队列, 最后进行批量更新
    - 每次 render 都会完整的执行一次批量更新流程，调用一次 diff 算法，使用批量更新减少性能损耗
    - 生命周期和合成函数调用`setState`，是异步
    - `setState`异步会处在一个大的事务中
2. `isBatchingUpdates: false`
    - 直接更新 state
    - `setTimeout`、原生事件、`async`函数中调用`setState`是同步
    - 由于`EventLoop`, setState 一定是在上一次`batch update`完成之后执行, `isBatchingUpdate`为 false, 从而同步更新

#### 5.react18 中的并发更新没有同步 setState

```js
// 启用并发渲染模式
// 内部组件的setTimeout、ajax、原生事件还是会异步setState
ReactDom.createRoot(document.getElementById('root')!).render(<App />)
```

#### 6.setState 调用页面就会重新渲染

```js
// s4未在render中使用，页面也会重新渲染
this.setState({ s4: s4 + 1 });
// setState空，页面也会重新渲染
this.setState({});

// 页面不会重新渲染
this.state.s4 = 4;
this.s5 = 5;
```

#### 7.将需要修改的属性放到一次 setState 中，避免重复渲染

#### 8.类组件中设置相同的值会 render，函数组件不会

```js
// 调用sameState不会render
const [s1, setS1] = useState(1);
const sameState = () => {
    setS1((i) => i);
};
```
