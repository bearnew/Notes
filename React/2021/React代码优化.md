# React 代码优化

1. 使用`babel-plugin-jsx-control-statements`优化条件语句
2. `React.Profiler`用于开发阶段性能检测
3. `React.StrictMode`用于检测 React 项目中潜在的问题
4. `createElement` 把我们写的 `jsx`，变成 `element` 对象; 而 `cloneElement` 的作用是以 `element` 元素为样板克隆并返回新的 `React` 元素。返回元素的 `props` 是将新的 `props` 与原始元素的 `props` 浅层合并后的结果。
5. `unstable_batchedUpdate`

```js
// 只会渲染一次
handerClick = () => {
  Promise.resolve().then(() => {
    ReactDOM.unstable_batchedUpdates(() => {
      this.setState({ numer: this.state.numer + 1 });
      console.log(this.state.numer);
      this.setState({ numer: this.state.numer + 1 });
      console.log(this.state.numer);
      this.setState({ numer: this.state.numer + 1 });
      console.log(this.state.numer);
    });
  });
};
```

6. `flushSync`将回调函数中的更新任务，放在一个较高的优先级中

```js
/* flushSync */
// 依次打印0 3 4 1（2和4被批量更新成4）
import ReactDOM from "react-dom";
class Index extends React.Component {
  state = { number: 0 };
  handerClick = () => {
    setTimeout(() => {
      this.setState({ number: 1 });
    });
    this.setState({ number: 2 });
    ReactDOM.flushSync(() => {
      this.setState({ number: 3 });
    });
    this.setState({ number: 4 });
  };
  render() {
    const { number } = this.state;
    console.log(number); // 打印什么？？
    return (
      <div>
        <div>{number}</div>
        <button onClick={this.handerClick}>测试flushSync</button>
      </div>
    );
  }
}
```

7. `unmountComponentAtNode`

- 从 DOM 中卸载组件，会将其事件处理器和 state 一并清除。 如果指定容器上没有对应已挂载的组件，这个函数什么也不会做。如果组件被移除将会返回 true ，如果没有组件可被移除将会返回 false 。

```js
function Text() {
  return <div>hello,world</div>;
}

class Index extends React.Component {
  node = null;
  constructor(props) {
    super(props);
    this.state = {
      numer: 1,
    };
  }
  componentDidMount() {
    /*  组件初始化的时候，创建一个 container 容器 */
    ReactDOM.render(<Text />, this.node);
  }
  handerClick = () => {
    /* 点击卸载容器 */
    const state = ReactDOM.unmountComponentAtNode(this.node);
    console.log(state);
  };
  render() {
    return (
      <div style={{ marginTop: "50px" }}>
        <div ref={(node) => (this.node = node)}></div>
        <button onClick={this.handerClick}>click me</button>
      </div>
    );
  }
}
```

8. https://blog.csdn.net/qiwoo_weekly/article/details/116213394
