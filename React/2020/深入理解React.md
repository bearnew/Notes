## React16
#### 1. Jsx
1. js的语法扩展
2. 既可以进行UI展示，也可以进行事件绑定、表达式等逻辑处理
3. jsx在渲染时，会默认进行转义，可以防止XXS攻击
#### 2. 生命周期
1. ![old lifeCycle](https://github.com/bearnew/picture/blob/master/mardown/2020/React/lifeCycle_before.jpg?raw=true)
1. ![new lifeCycle](https://github.com/bearnew/picture/blob/master/mardown/2020/React/lifeCycle.jpg?raw=true)
2. 废除3个生命周期
    * `React16`引入了异步渲染机制，渲染完成前，可以中断任务，中断后不会继续执行生命周期，可能导致`componentWillMount`和`componentWillReceiveProps`以及`componentWillUpdate`可能被中断，导致执行多次，带来意想不到的情况
    * `componentWillMount`
        * `componentWillMount`中的异步请求更新数据逻辑可以直接移动到`constructor`中
        * `componentWillMount`中的事件订阅，在`componentWillUnmount`中取消订阅，但是`componentWillMount`调用后，不一定能保证`componentWillUnmount`一定被调用，事件订阅的逻辑应该放在
        `componentDidMount`中
    * `componentWillReceiveProps`
        * 父组件导致组件重新渲染，即使props没有更改，也会调用此方法
        * 容易破坏`state`的单一数据源，导致组件状态不可预测
        * 将更新`state`和触发回调移动到`getDerivedStateFromProps`和`componentDidMount`中
        ```js
        componentWillReceiveProps(nextProps) {}
        static getDerivedStateFromProps(nextProps, prevState) {}
        componentDidUpdate(prevProps, prevState) {}
        ```
    * `componentWillUpdate`
        * 回调可以直接移动到`componentDidMount`中
        * 和DOM元素相关的移动到`getSnapshotBeforeUpdate`中
        ```js
        class ScrollingList extends React.Component {
            listRef = null;

            getSnapshotBeforeUpdate(prevProps, prevState) {
                // Are we adding new items to the list?
                // Capture the scroll position so we can adjust scroll later.
                if (prevProps.list.length < this.props.list.length) {
                    return (
                        this.listRef.scrollHeight - this.listRef.scrollTop
                    );
                }
                return null;
            }

            componentDidUpdate(prevProps, prevState, snapshot) {
                // If we have a snapshot value, we've just added new items.
                // Adjust scroll so these new items don't push the old ones out of view.
                // (snapshot here is the value returned from getSnapshotBeforeUpdate)
                if (snapshot !== null) {
                    this.listRef.scrollTop = this.listRef.scrollHeight - snapshot;
                }
            }

            render() {
                return (
                <div ref={this.setListRef}>
                    {/* ...contents... */}
                </div>
                );
            }

            setListRef = ref => {
                this.listRef = ref;
            };
        }
        ```
#### 3.React Fiber
1. React Fiber将渲染工作分割成块并将其分散到多个帧中
2. React渲染分为`reconciler`(调度阶段)和`commit`(渲染阶段)
3. `reconciler`会执行对虚拟DOM树自上到下的递归算法，对`current tree`和`new tree`做计算
4. `commit`会将`reconciler`获取到的变化应用到真实的DOM树中
5. React Fiber会把diff递归拆分成一系列的小任务，每次检查树上的一小部分
6. React Fiber更新是用队列进行更新
