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
3. `reconciler`会执行对虚拟DOM树（render的时候生成）自上到下的递归算法，对`current tree`和`new tree`做计算
    * 两个不同类型的元素会产生出不同的树
    * 开发者可以通过`key`让diff比较变得高效
    ```js
    //  React 知道只有带着 '2014' key 的元素是新元素，带着 '2015' 以及 '2016' key 的元素仅仅移动了。
    <ul>
        <li key="2015">Duke</li>
        <li key="2016">Villanova</li>
    </ul>

    <ul>
        <li key="2014">Connecticut</li>
        <li key="2015">Duke</li>
        <li key="2016">Villanova</li>
    </ul>
    ``` 
4. `commit`会将`reconciler`获取到的变化应用到真实的DOM树中
5. React Fiber会把diff递归拆分成一系列的小任务，每次检查树上的一小部分
6. React Fiber更新是用队列进行更新
#### 4.基础Tips
1. 事件阻止默认事件必须显式调用`preventDefault`，不能返回`false`
#### 5.代码分割
1. 动态导入
    * 用`babel-plugin-syntax-dynamic-import`配置`Babel`
    * example
        ```js
        import("./math").then(math => {
            console.log(math.add(16, 26));
        });
        ``` 
2. `React.lazy`处理动态引入的组件
    * 接收1个函数，动态调用`import()`
    * 必须返回`Promise`, `Promise`需要resolve一个default export的React组件
    * 在`suspense`中渲染`Lazy`组件
    ```js
    import MyErrorBoundary from './MyErrorBoundary';
    const OtherComponent = React.lazy(() => import('./OtherComponent'));
    const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

    const MyComponent = () => (
        <div>
            <MyErrorBoundary>
            <Suspense fallback={<div>Loading...</div>}>
                <section>
                <OtherComponent />
                <AnotherComponent />
                </section>
            </Suspense>
            </MyErrorBoundary>
        </div>
    );
    ``` 
#### 6.context
1. `React.createContext`
    * React渲染一个订阅了这个Context对象的组件, 组件会从离自身最近的`Provider`读取值
    * 没有匹配到`Provider`，`defaultValue`才生效
    ```js
    const MyContext = React.createContext(defaultValue);
    ```  
2. `Context.Provider`
    * 接收`Value`值，传给消费组件
    * `Value`值变化，内部所有的`consumer`组件都会重新渲染，不受限于`shouldComponentUpdate`
    * 通过新旧值检测来确定变化，使用了与`Object.is`相同的算法
    ```js
    <MyContext.Provider value={/* 某个值 */}>
    ```
3. `Class.contextType`
    * 在class的`contextType`上赋值`React.createContext()`创建的`context`对象
    * 在class组件内的任何生命周期访问到它，包括`render`函数
    ```js
    class MyClass extends React.Component {
        static contextType = MyContext;
        render() {
            let value = this.context;
            /* 基于这个值进行渲染工作 */
        }
    }
    ``` 
4. `Context.Consumer`
    * 函数接收当前的`context`值，返回一个`React`节点
    * 传递给函数的`value`值等同于往上组件树离这个`context`最近的`Provider`提供的`value`值
5. `Context.displayName`
    * `context`对象接受一个名为`displayName`的`property`，类型为字符串
    * `React DevTools` 使用该字符串来确定`context`要显示的内容。
#### 7.Error Boundaries
1. 使用`componentDidCatch()`打印错误信息
2. 使用`static getDerivedStateFromError()`渲染备用 UI