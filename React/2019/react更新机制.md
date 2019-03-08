## React Batch Update

#### 1.react 的更新是批量更新的

```js
handleClick = () => {
  this.setState(
    {
      count: this.state.count + 1
    },
    () => {
      console.log("1111", this.state.count); // 1111 1
    }
  );
  console.log(this.state.count); // 0
  this.setState(
    {
      count: this.state.count + 1
    },
    () => {
      console.log("2222", this.state.count); // 2222 1
    }
  );
  console.log(this.state.count); // 0
};
```

#### 2.setTimeout 和 ajax 请求中，setState 是同步的, 并且不会批量更新

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
