## React 进阶

### 一、基础篇

##### 1. React 基础

1. React 简介
    - 引入虚拟 DOM、状态、单向数据流等设计理念，形成以组件为核心，用组件搭建 UI 的开发模式，完美的将数据、组件状态、UI 映射在一起
2. JSX

    - 描述`UI`的`javascript`扩展语法
    - 可以同时存放`UI`描述和`UI`数据
    - 用`JSX`创建界面元素更加清晰简洁
    - JSX 语法只是`React.createElement`的语法糖

    ```js
    // jsx
    const element = <div className="foo">Hello, React</div>;

    // 转换后
    const element = React.createElement(
        "div",
        { className: "foo" },
        "Hello, React",
    );
    ```

3. 通过`PropTypes`对组件进行属性校验

    - `PropTypes.string`
    - `PropTypes.number`
    - `PropTypes.bool`
    - `PropTypes.func`
    - `PropTypes.object`
    - `PropTypes.array`
    - `PropTypes.symbol`
    - `PropTypes.element`, React 元素
    - `PropTypes.node`, 可被渲染的节点

    ```js
    import PropTypes from "prop-types";

    class PostItem extends React.Component {}

    PostItem.propTypes = {
        post: PropTypes.object,
        onVote: PropTypes.func,
        style: PropTypes.shape({
            color: PropTypes.string,
            fontSize: PropTypes.number,
        }),
        sequence: PropTypes.arrayOf(PropTypes.number),
        onVote: PropTypes.func.isRequired,
    };
    ```

4. 定义组件默认属性

    ```js
    function Welcome(props) {
        return <h1>welcome</h1>;
    }

    Welcome.defaultProps = {
        name: "Stranger",
    };
    ```

5. 组件挂载
    1. constructor
        - 调用 super(props)保证 props 被传入组件中
        - 通常用于初始化组件的 state 和绑定事件处理方法
    2. componentWillMount
        - 组件被挂载在 dom 前调用，这里面的方法都可以提前到 constructor 中
        - 在这里面调用 this.setState 不会引起组件的重新渲染
    3. render
        - render 是 1 个纯函数，不能有任何有副作用的操作
    4. componentDidMount
        - 组件被挂载在 DOM 后调用，只会被调用一次
        - 依赖 DOM 的操作放在此方法中
6. 组件更新，依次调用的生命周期为
    1. componentWillReceiveProps(nextProps)
        - 只有 props 变化引起的更新，componentWillReceiveProps 才会调用
    2. shouldComponentUpdate(nextProps, nextState)
        - 方法返回 true,组件继续更新，方法返回 false,组件更新停止
        - 用于减少组件不必要的渲染，优化组件性能
    3. componentWillUpdate(nextProps, nextState)
        - 组件更新前执行的操作，一般很少用到
    4. render
    5. componentDidUpdate(prevProps, prevState)
        - prevProps 和 prevState 代表组件更新前的 props 和 state
7. 组件卸载
    1. componentWillUnmount
        - 清除定时器或者 DOM 元素等操作
8. 列表渲染和 key
    1. React 通过 key 标记列表中的每个元素
    2. 通过 key 知道哪些元素发生变化，提高渲染效率
9. 事件处理

    1. React 中，事件处理采用驼峰式命名而不是 DOM 元素中的小写字母命名，onclick 要写成 onClick
    2. 在 render 中使用箭头函数或者 bind,会导致每次 render 调用，都会重新创建 1 个新的事件处理函数，带来额外的性能开销
        ```js
        <button onClick={event => {}}>Click</button>
        <button onClick={this.handleClick.bind(this)}>click</button>
        ```
    3. 将组件的方法赋值给元素的事件属性，可以避免 render 调用重新创建事件处理函数
        ```js
        <button onClick={this.handleClick}>click</button>
        ```
    4. 使用 bind 可以为函数传参

        ```js
        class MyComponent extends React.component {
            handleClick(item, event) {}
            render() {
                return (
                    <button
                        onClick={this.handleClick.bind(this, "test")}></button>
                );
            }
        }
        ```

10. 表单
    1. 受控组件
        ```js
        class LoginForm extends React.Component {
            handleChange(event) {
                const target = event.target;
                this.setState({
                    [target.name]: target.value,
                });
            }
            render() {
                return (
                    <input
                        type="text"
                        name="name"
                        value={this.state.name}
                        onChange={this.handleChange}
                    />
                );
            }
        }
        ```
        ```js
        <select value={this.state.value} onChange={this.handleChange}></select>
        ```
        ```js
        <input checked={this.state.redux} onChange={this.handleChange} />
        ```
    2. 非受控组件
        - 使用 ref 来获取表单的值
        ```js
        class SimpleForm extends Component {
            handleSubmit(event) {
                console.log(this.input.value);
            }
            render() {
                return (
                    <form onSubmit={this.handleSubmit}>
                        <input
                            defaultValue="something"
                            ref={(input) => (this.input = input)}
                        />
                        <input type="checkbox" defaultChecked={true} />
                    </form>
                );
            }
        }
        ```

##### 2. React 16 特性

1. render
    1. render 支持新的返回类型，数组和字符串
    ```js
    class StringComponent extends Component {
        render() {
            return "just a string";
        }
    }
    ```
    ```js
    class App extends Component {
        render() {
            return [
                <ul>
                    <ListComponent />
                </ul>,
                <StringComponent />,
            ];
        }
    }
    ```
2. 错误处理
    - 错误边界（Error Boundaries）
    - 错误边界是能够捕获子组件的错误并对其做优雅处理的组件
    - 优雅的处理可以是输出错误的日志，显示出错提示等
    - 定义了`componentDidCatch(error, info)`的组件将成为一个错误边界组件
    ```js
    class ErrorBoundary extends React.Component {
        constructor(props) {
            super(props);
            this.state = { hasError: false };
        }
        componentDidCatch(error, info) {
            // 显示错误UI
            this.setState({ hasError: true });
            // 同时输出错误日志
            console.log(error, info);
        }
        render() {
            if (this.state.hasError) {
                return <h1>Oops, something went wrong.</h1>;
            }
            return this.props.children;
        }
    }
    ```
    ```js
    // 在APP中使用ErrorBoundary
    class App extends Component {
        render() {
            // 抛出错误，被ErrorBoundary捕获
            return (
                <ErrorBoundary>
                    <Profile user={null} />
                </ErrorBoundary>
            );
        }
    }
    const Profile = ({ user }) => <div>name: {user.name}</div>;
    ```
3. Portals

    - Portals 特性让我们可以把组件渲染到组件树以外的 DOM 节点上
    - 应用场景是渲染应用的全局弹窗
    - 使用 portals, 任意组件都可以将弹窗组件渲染到根节点上，方便弹窗显示

    ```js
    class Modal extends Component {
        constructor(props) {
            super(props);

            // 根节点下创建1个div
            this.container = document.createElement("div");
            document.body.appendChild(this.container);
        }
        componentWillUnmount() {
            document.body.removeChild(this.container);
        }
        render() {
            // 创建的dom树挂载到this.container指向的div节点下面
            return ReactDOM.createPortal(
                <div className="modal">
                    <span className="close" onClick={this.props.onClose}>
                        close
                    </span>
                    <div className="content">{this.props.children}</div>
                </div>,
                this.container,
            );
        }
    }
    ```

    ```js
    class App extends Component {
        constructor(props) {
            super(props);
            this.state = {
                showModal: true,
            };
        }
        // 关闭弹窗
        closeModal = () => {
            this.setState({
                showModal: false,
            });
        };

        render() {
            return (
                <div>
                    <h2>Dashboard</h2>
                    {this.state.showModal && (
                        <Modal onClose={this.closeModal}>Modal Dialog</Modal>
                    )}
                </div>
            );
        }
    }
    export default App;
    ```

4. 自定义 DOM 属性
    - React16 会把不识别的属性传给 DOM 元素
    ```js
    <div custom-attribute="something" />
    ```
    ```js
    // React16之前
    <div />
    ```
    ```js
    // React 16渲染的DOM节点
    <div custom-attribute="something" />
    ```

### 二、进阶

#### 1. 深入理解组件

1. 不能直接修改 state

    ```js
    // 错误
    this.state.title = "React";

    // 正确
    this.setState({
        title: "React",
    });
    ```

2. state 的更新是异步的

    - React 会把多次 state 的修改合并成一次

    ```js
    // 点击增加数量，就会加1
    this.setState({
        quantity: this.state.quantity + 1,
    });

    // 连续点击2次，等价于
    Object.assign(
        previousState,
        { quantity: this.state.quantity + 1 },
        { quantity: this.state.quantity + 1 },
    );

    // 后面的数量会覆盖前面的操作，最终的数量只会+1
    ```

    ```js
    // 正确的代码
    this.setState((preState, props) => ({
        quantity: preState.quantity + 1,
    }));
    ```

3. state 的更新是 1 个合并的过程

    ```js
    class Example extends React.Component {
        constructor() {
            super();
            this.state = {
                val: 0,
            };
        }

        componentDidMount() {
            // isBatchingUpdates被设置成了true
            this.setState({ val: this.state.val + 1 });
            console.log(this.state.val); // 0

            this.setState({ val: this.state.val + 1 });
            console.log(this.state.val); // 0

            // isBatchingUpdates被设置成了false
            setTimeout(() => {
                this.setState({ val: this.state.val + 1 });
                console.log(this.state.val); // 2

                this.setState({ val: this.state.val + 1 });
                console.log(this.state.val); // 3
            }, 0);
        }

        render() {
            return null;
        }
    }
    ```

4. state 与不可变对象
    1. 状态的类型是不可变类型（number, string, boolean, null, undefined）, 直接赋新值
        ```js
        this.setState({
            count: 1,
            title: "React",
            success: true,
        });
        ```
    2. 状态的类型是数组
        - 使用 concat, slice, filter 方法或者 ES6 的数组扩展语法
        - 不要使用 push, pop, shift, unshift, splice 等方法修改数组类型的状态
        ```js
        this.setState((preState) => {
            books: preState.books.concat(["React Guide"]);
        });
        ```
        ```js
        this.setState((preState) => {
            books: [...preState.books, "React Guide"];
        });
        ```
        ```js
        this.setState((preState) => {
            books: preState.books.slice(1, 3);
        });
        ```
        ```js
        this.setState((preState) => {
            books: preState.books.filter((item) => {
                return item !== "React";
            });
        });
        ```
    3. 状态的类型是普通对象
        ```js
        // 使用ES6的Object.assign方法
        this.setState(preState => ({
            owner: Object.assign({}, preState.owner, {name: 'Jason'});
        }))
        ```
        ```js
        // 使用对象扩展语法
        this.setState(preState => ({
            owner: {...preState.owner, name: 'Jason'};
        }))
        ```
    4. React 推荐组件的状态是不可变对象
        1. 避免修改了原对象而导致的错误
        2. 当组件的状态都是不可变对象时，可以避免不必要的渲染
5. 组件与服务器通信
    1. 组件挂载阶段通信
        1. 一般选择在`componentWillMount`或者`componentDidMount`中通信
        2. componentDidMount 能保证 DOM 处于挂载阶段，操作 DOM 是安全的
        3. 服务端渲染时，`componentWillMount`会被调用 2 次
    2. 组件通信阶段通信
        1. 选择在`componentWillReceiveProps`中通信
        ```js
        componentWillReceiveProps(nextProps) {
            if (nextProps.category !== this.props.category) {
                // 服务器请求代码
            }
        }
        ```
6. 组件通信

    1. 父子组件通信

        1. 父组件向子组件通信

            ```js
            // 父组件通过props传递给子组件
            <UserList users={this.state.users} />;

            // 子组件
            {
                this.props.users.map((user) => <li>user</li>);
            }
            ```

        2. 子组件向父组件通信

            ```js
            // 子组件通过调用回调函数
            handleClik() {
                this.props.onAddUser('test');
            }

            // 父组件
            handleAddUser(name) {
                //
            }
            <UserList onAddUser={this.handleAddUser} />
            ```

    2. 兄弟组件通信
        1. 将状态提升到最近的公共父组件，完成通信
        2. A 组件调用父组件传递的回调函数改变状态，父组件将状态传给 B 组件
    3. context

        ```js
        // theme-context.js
        export const themes = {
            light: {
                background: "#eee",
            },
            dark: {
                background: "#222",
            },
        };

        export const ThemeContext = React.createContext(
            theme.dark, // 默认值
        );
        ```

        ```js
        // theme-button.js
        import { ThemeContext } from "./theme-context";

        class ThemedButton extends React.Component {
            render() {
                let theme = this.context;

                return <button style={{ backgroundColor: theme.background }} />;
            }
        }

        ThemedButton.contextType = ThemeContext;

        export default ThemedButton;
        ```

        ```js
        // app.js
        import { ThemeContext, themes } from './theme-context';
        import ThemedButton from './themed-button';

        // 使用ThemedButton的中间组件
        function Toolbar(props) {
            return (
                <ThemedButton onClick={props.changeTheme}>
                    Change Theme
                </ThemeButton>
            )
        }

        class App extends React.Component {
            constructor(props) {
                super(props);

                this.state = {
                    theme: themes.light
                }

                this.toggleTheme = () => {
                    this.setState(preState => ({
                        theme: preState.theme === thems.dark ? themes.light : thems.dark
                    }))
                }
            }

            render() {
                return (
                    <Page>
                        <ThemeContext.Provider value={this.state.theme}>
                            <Toolbar changeTheme={this.toggleTheme} />
                        </ThemeContext.Provider>
                        <Section>
                            <ThemedButton>
                        </Section>
                    </Page>
                )
            }
        }

        ReactDOM.render(<App />, document.root);
        ```

7. Ref

    1. 在 DOM 元素上使用 Ref

        ```js
        class AutoFocusTextInput extends React.Component {
            componentDidMount() {
                // 通过ref让input自动获取焦点
                this.textInput.focus();
            }

            blur() {
                this.textInput.blur();
            }

            render() {
                return (
                    <div>
                        <input
                            type="text"
                            ref={(input) => {
                                this.textInput = input;
                            }}
                        />
                    </div>
                );
            }
        }
        ```

    2. 在组件上使用 ref(不能在函数组件上使用 ref)
        ```js
        class Container extends React.Component {
            handleClick = () => {
                // 失去焦点
                this.inputInstance.blur();
            };
            render() {
                return (
                    <div>
                        <AutoFocusTextInput
                            ref={(input) => {
                                this.inputInstance = input;
                            }}
                        />
                        <button onClick={this.handleClick}>失去焦点</button>
                    </div>
                );
            }
        }
        ```
    3. 父组件访问子组件的 DOM 节点
        ```js
        function Children(props) {
            return (
                <div>
                    <input ref={props.inputRef} />
                </div>
            );
        }
        ```
        ```js
        class Parent extends React.Component {
            render() {
                return <Children inputRef={(el) => (this.inputElement = el)} />;
            }
        }
        ```

#### 2.虚拟 DOM 和性能优化

1. 虚拟 DOM
    1. 每一次对 DOM 的修改都会引起对浏览器的重新布局和重新渲染
    2. 虚拟 DOM 使用普通的 js 对象来描述 DOM 元素
    3. React 元素本身就是一个虚拟 DOM 节点
    ```js
    // React
    <div className="foo">
        <h1>Hello React</h1>
    </div>
    ```
    ```js
    // 虚拟dom js对象
    {
        type: 'div',
        props: {
            className: 'foo',
            children: {
                type: 'h1',
                props: {
                    children: 'Hello React'
                }
            }
        }
    }
    ```
2. Diff 算法
    1. 每次 render 方法都会返回 1 个新的虚拟 DOM 对象
    2. 每次 render. React 会使用 Diff 算法比较前后 2 次 render 返回的虚拟 DOM 的差异部分，更新到真实 DOM 上
    3. Diff 算法
        1. 当根节点是不同类型时，会把整个虚拟 DOM 树拆掉重建，重建后，将虚拟 DOM 整体更新到真实 DOM 上
            - 旧的 React 组件的实例的`componentWillUnmount`会被调用
            - 新的 React 组件的实例的`componentWillMount`和`componentDidMount`方法会被调用
        2. 当根节点是相同类型的 DOM 元素，只是元素属性发生了变化，React 会更新虚拟 DOM 树和真实 DOM 树中对应节点的这一属性
        3. 当根节点是相同的组件类型, 同步变化的属性到虚拟 DOM 上，然后更新真实 DOM
            - 组件实例会调用`componentWillReceiveProps`和`componentWillUpdate`
        4. React 会根据 Key 匹配子节点，只要子节点的 key 没有变化，React 认为这是同一节点，从而提高 Diff 算法的效率
3. 性能优化

    1. 使用生产环境版本的库
    2. 使用`shouldComponentUpdate`减少不必要的渲染

        1. `React.PureComponent`具有`shouldComponentUpdate`的逻辑
        2. `React.PureComponent`是使用的浅比较，如果直接修改数据，组件不会直接渲染

        ```js
        import React from "react";

        export default class NumberList extends React.PureComponent {
            constructor(props) {
                super(props);
                this.state = {
                    numbers: [1, 2, 3, 4],
                };
                this.handleClick = this.handleClick.bind(this);
            }
            // numbers中新加一个数值
            handleClick() {
                const numbers = this.state.numbers;
                // 直接修改numbers对象
                numbers.push(numbers[numbers.length - 1] + 1);
                this.setState({ numbers: numbers });
            }
            render() {
                // 点击了button，没有重新渲染
                console.log("render");
                return (
                    <div>
                        <button onClick={this.handleClick} />
                        {this.state.numbers.map((item) => (
                            <div>{item}</div>
                        ))}
                    </div>
                );
            }
        }
        ```

4. 使用 key
    - React 根据 key 索引元素，可以减少 DOM 操作，提高 DOM 更新效率
5. `Reac`组件里面尽量不要使用`style={{}}`,内联`style`会被编译为`js`代码，通过`js`代码将样式映射到元素，浏览器花费更多时间执行脚本和渲染 UI
6. 性能检测工具
    - React Developer Tools for Chrome
        - 通过 React Developer Tools 可以看到组件之间的嵌套关系以及每个组件的事件、属性、状态等信息
    - Chrome Performance Tab
        - 观察组件的挂载、更新、卸载过程以及各阶段使用的时间
    - why-did-you-update
        - 打印出 render 方法中不必要的调用

#### 3.高阶组件

> 实现组件逻辑的抽象和复用

1. 基本概念

    - 接收 React 组件作为参数，并返回 1 个新的 React 组件
    - 高阶组件的本质也是 1 个函数
    - 高阶组件的实现方式，本质上是装饰者模式

    ```js
    import React, { Component } from "react";

    function withPersistentData(WrappedComponent) {
        return class extends Component {
            componentWillMount() {
                let data = localStorage.getItem("data");
                this.setState({ data });
            }
            render() {
                return (
                    <WrappedComponent data={this.state.data} {...this.props} />
                );
            }
        };
    }
    ```

    ```js
    class MyComponent extends Component {
        render() {
            return <div>{this.props.data}</div>;
        }
    }
    export default withPersistentData(MyComponent);
    ```

2. 使用场景
    1. 操纵 props
        - 高阶组件可以先拦截 props, 对 props 进行增加、删除、修改的操作，然后将处理后的 props 传递给被包装的组件
    2. 通过 ref 访问组件实例
        - 适用于复用逻辑需要包装组件的方法支持时
        ```js
        function withRef(wrappedComponent) {
            return class extends React.Component {
                someMethod() {
                    this.wrappedInstance.someMethodInWrappedComponent();
                }
                render() {
                    return (
                        <WrappedComponent
                            ref={(instance) => {
                                this.wrappedInstance = instance;
                            }}
                            {...this.props}
                        />
                    );
                }
            };
        }
        ```
    3. 组件状态提升
        ```js
        function withControlledState(WrappedComponent) {
            return class extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        value: "",
                    };
                    this.handleValueChange = this.handleValueChange.bind(this);
                }
                handleValueChange(event) {
                    this.setState({
                        value: event.target.value,
                    });
                }
                render() {
                    // newProps 保存受控组件需要使用的属性和事件处理函数
                    const newProps = {
                        controlledProps: {
                            value: this.state.value,
                            onChange: this.handleValueChange,
                        },
                    };
                    return <WrappedComponent {...this.props} {...newProps} />;
                }
            };
        }
        ```
        ```js
        class SimpleControlledComponent extends React.Component {
            render() {
                //此时的SimpleControlledComponent为无状态组件，状态由高阶组件维护
                return <input name="simple" {...this.props.controlledProps} />;
            }
        }
        const ComponentWithControlledState = withControlledState(
            SimpleControlledComponent,
        );
        ```
    4. 用其他元素包装组件
        ```js
        function withRedBackground(WrappedComponent) {
            return class extends React.Component {
                render() {
                    return (
                        <div style={{ backgroundColor: "red" }}>
                            <WrappedComponent {...this.props} />
                        </div>
                    );
                }
            };
        }
        ```
3. 参数传递

    1. 接收除组件外 1 个额外的参数

        ```js
        function withPersistentData(WrappedComponent, key) {
            return class extends Component {};
        }
        ```

        ```js
        const MyComponent1WithPersistentData = withPersistentData(
            MyComponent,
            "data",
        );
        const MyComponent2WithPersistentData = withPersistentData(
            MyComponent,
            "name",
        );
        ```

    2. 高阶组件外套高阶函数
        ```js
        import React, { Component } from 'react'
        function withPersistentData = (key) => (WrappedComponent) => {
            return class extends Component {
                componentWillMount() {
                    let data = localStorage.getItem(key);
                    this.setState({ data });
                }
                render() {
                    // 通过{...this.props} 把传递给当前组件的属性继续传递给被包装的组件
                    return <WrappedComponent data={this.state.data}
                        {...this.props} />
                }
            }
        }
        class MyComponent extends Component {
            render() {
                return <div>{this.props.data}</div>
            }
        }
        // 获取key=’data’的数据
        const MyComponent1WithPersistentData = withPersistentData('data')(MyComponent);
        // 获取key=’name’的数据
        const MyComponent2WithPersistentData = withPersistentData('name')(MyComponent);
        ```
        ```js
        // react-redux 的connect也是使用这种函数式编程
        connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
        ```

4. 继承方式实现高阶组件
    ```js
    // 通过继承传入的组件实现
    function withAuth(WrappedComponent) {
        return class extends WrappedComponent {
            render() {
                // 当用户处于登录状态，才进行渲染
                if (this.props.loggedIn) {
                    return super.render();
                } else {
                    return null;
                }
            }
        };
    }
    ```
5. 注意事项
    1. 不要在 render 中使用高阶组件，因为每次 render，高阶组件都会卸载然后重新挂载
        ```js
        // 需要将高阶组件定义到组件外部
        render() {
            // 每次render，enhance都会创建一个新的组件，尽管被包装的组件没有变
            const EnhancedComponent = enhance(MyComponent);
            // 因为是新的组件，所以会经历旧组件的卸载和新组件的重新挂载
            return <EnhancedComponent />;
        }
        ```
    2. 高阶组件返回的组件不会返回组件的静态方法
    3. refs 不会被传递给包装组件

### 三、实战

#### 1.React-Router

1. 单页面应用和前端路由
    1. 后端路由
        - 服务器根据 URL 返回 1 个 HTML 页面
        - 1 个 URL 对应 1 个 HTML 页面
        - 1 个 web 应用包含很多 HTML 页面
    2. 前端路由
        - 单页应用，无论 URL 如何变化，对应的 HTML 都是同 1 个
        - 对 SEO 支持不太好
2. React-Router(安装以下 2 个包，会自动依赖 react-router)
    - react-router-dom（在浏览器中使用）
    - react-router-native（在 react-native 中使用）
3. 路由器
    1. React Router 通过 Router 和 Route 两个组件完成路由功能
    2. 一个应用需要 1 个 Router 实例,Router 相当于路由器
    3. Route 定义为 Router 的子组件
    4. Router 的实例
        1. BrowserRouter
            - 使用 HTML5 的`history API`(pushState, replaceState)实现 UI 和 URL 的同步
            - `http://example.com/some/path`
            - 需要配置服务器，让服务器能够处理所有的 URL
            - React Router 中提供的其他组件可以通过 context 获取 history 对象
            - Router 中只能包含唯一的 1 个元素
                ```js
                ReactDOM.render((
                    <BrowserRouter>
                        <App />
                    <BrowserRouter>
                ), document.getElementById('root'))
                ```
        2. HashRouter
            - HashRouter 使用 URL 的 hash 实现应用的 UI 和 URL 的同步
            - `http://example.com/#/some/path`
4. 路由配置

    1. path
        1. 每个 Route 都需要定义 1 个 path 属性
        2. 使用`BrowserRouter`时，path 用来描述 Route 匹配的 URL 的 pathname
            ```js
            // 匹配http://example.com/foo
            // Route中定义的组件会被渲染出来
            <Route path="/foo" />
            ```
        3. 使用`HashRouter`时，path 用来匹配 URL 的 hash
    2. match

        1. URL 和 Route 匹配时，Route 会创建一个 match 对象作为 props 的一个属性传给被渲染的组件
        2. params

            - Route 的 path 可以包含的参数

                ```js
                // Route包含1个参数id
                <Route path='/foo/:id'>

                // params就是从url中解析出的参数
                // params = { id: 1 }
                URL = 'http://example.com/foo/1';
                ```

        3. isExact
            - 当 URL 完全匹配时，值为 true
            - 当 URL 部分匹配时，值为 false
            ```js
            path = "/foo";
            // 完全匹配
            URL = "http://example.com/foo";
            // 部分匹配
            URL = "http://example.com/foo/1";
            ```
        4. path
            - 构建嵌套路由时会使用到
        5. url
            - URL 的匹配部分

    3. Route 渲染组件的方式
        1. component
            - 当 URL 和 Route 匹配时，component 属性定义的组件就会被渲染
            ```js
            // 当URL为http://example.com/foo时，Foo会被渲染
            <Route path='/foo' component={Foo}>
            ```
        2. render
            - render 的值是 1 个函数，函数返回 React 元素
            - 为待渲染的组件传递额外的属性
            ```js
            <Route path='/foo' render={props => (
                <Foo {...props} data={extraProps} />
            )}>
            ```
        3. children
            - 函数返回要渲染的 React 元素
            - 无论匹配是否成功，children 返回的组件都会被渲染
            - 匹配不成功时，match 属性为 null
            ```js
            <Route path='/foo' children={props => (
                <div className={props.match ? 'active' : ''}>
                    <Foo />
                </div>
            )}>
            ```
    4. Switch 和 exact
        - 把 Route 包到 1 个 Switch 组件中，让第 1 个匹配的 Route 渲染
        - 使用 Route 的 exact 属性，URL 和 Route 完全匹配，Route 才渲染
        ```js
        <Router>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/posts" component={Posts} />
                <Route path="/:user" component={User} />
            </Switch>
        </Router>
        ```
    5. 嵌套路由
        - Route 渲染的组件内部，定义新的 Route
        ```js
        const Posts = ({ match }) => {
            return (
                <div>
                    // match.url为/posts
                    <Route path={`${match.url}/:id`} component={PostDetail} />
                    <Route exact path={match.url} component={PostList} />
                </div>
            );
        };
        ```

5. 链接 Link
    - Link 是 React Router 提供的链接组件，1 个 Link 组件定义了点击 Link 时，页面该如何路由
    - to 声明要导航的 url 地址
        ```js
        const Navigation = () => (
            <header>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/posts">Posts</Link>
                        </li>
                    </ul>
                </nav>
            </header>
        );
        ```
    - to 可以是 object 对象，对象可以包含 pathname, search, hash, state
        ```js
        <Link
            to={{
                pathname: "/posts",
                search: "?sort=name",
                hash: "#the-hash",
                state: { fromHome: true },
            }}
        />
        ```
    - 通过 history.push(path, [state])导航，浏览器会新增 1 条记录
      `history.push('/posts')`
    - 通过 history.replace(path, [state])导航，新记录替换当前记录
      `history.push('/posts')`

#### 2.Redux

1. Redux 通过约定的规范将修改应用状态的步骤标准化，让应用状态的管理不再错综复杂
2. Redux 三大原则
    - 唯一数据源
        - 集中式管理应用状态，减少出错可能性
    - 保持应用状态只读
        - 不能直接更改应用状态，只能发送 action 进行更改
    - 应用状态的改变通过纯函数完成
        - reducer 是 1 个纯函数，不能直接修改原来的状态对象，需要创建 1 个新的状态对象返回
3. Redux 主要由 action, reducer, store 这三部分组成

    1. action
        - action 是 store 唯一的信息来源
        - action 发送给 store，必须通过 store 的 dispatch 方法
        - action 必须有 1 个 type 属性描述 action 的类型
        ```js
        export function addTodo(text) {
            return { type: "ADD_TODO", text };
        }
        ```
    2. reducer
        - reducer 是纯函数，接收两个参数，当前 state 和 action, 返回新的 state
        - reducer 返回的 state 需要是新的对象，不能改变原有对象
        ```js
        // Object.assign也行
        function todoApp(state = initialState, action) {
            switch (action.type) {
                case SET_VISIBILITY_FILTER:
                    return { ...state, visibilityFilter: action.filter };
                default:
                    return state;
            }
        }
        ```
        - 可拆分多个 reducer, 使用`combineReducers`合并
        ```js
        import { combineReducers } from "redux";
        const todoApp = combineReducers({
            todos,
            visibilityFilter,
        });
        ```
    3. store

        - store 是 action 和 reducer 之间的桥梁
        - 保存应用状态
        - 通过方法`getState()`访问应用状态
        - 通过方法`dispatch(action)`发送更新状态的意图
        - 通过方法`subscribe(listener)`注册监听函数，监听应用状态的改变

        ```js
        // 监听
        let unsubscribe = store.subscribe(() => {
            console.log(store.getState());
        });
        // 取消监听
        unsubscribe();
        ```

        - 一个 Redux 应用只有 1 个 store，store 保存唯一数据源

        ```js
        import { createStore } from "redux";
        import todoApp from "./reducers";

        let store = createStore(todoApp, initialState);
        ```

        - `store.getState`获取当前应用的状态 state

        ```js
        const state = store.getState();
        ```

        - `store.dispatch`发送 action

        ```js
        function addTodo(text) {
            return {
                type: "ADD_TODO",
                text,
            };
        }

        store.dispatch(addTodo("learn about actions"));
        ```

4. React 中使用 react-redux

    1. 展示组件和容器组件
        - presentational components, 负责应用的 UI 展示
        - container components，负责应用逻辑的处理
    2. connect

        - react-redux 提供了一个 connect 函数，用于把 react 组件和 redux 的 store 连接起来
        - 生成一个容器组件，负责数据管理和业务逻辑

        ```js
        import { connect } from "react-redux";
        import TodoList from "./TodoList";

        const VisibleTodoList = connect(
            mapStateToProps, // 负责从全局状态state中取出所需数据, 映射到展示组件的props上
            mapDispatchToProps, // 负责把需要用到的action映射到展示组件的props上
        )(TodoList);
        ```

    3. mapStateToProps
        - store 中的 state 更新，mapStateToProps 就会重新执行，重新计算传递给展示组件的 props, 从而触发组件的重新渲染
        - store 中的 state 更新，一定会导致 mapStateToProps 重新执行，
          但是如果 mapStateToProps 新返回的对象和之前的对象浅比较相等，组件的 shouldComponentUpdate 就会返回 false,
          组件的 render 方法就不会再次被触发, 这是 react-redux 的一个重要优化
        - mapStateToProps 接收第 2 个参数，代表容器组件的 props 对象
            ```js
            // ownProps是组件的props对象
            function mapStateToProps(state, ownProps) {
                return {
                    user: state.auth,
                };
            }
            ```
    4. mapDispatchToProps

        - mapDispatchToProps 接收 store.dispatch 方法作为参数，返回展示组件用来修改 state 的函数

        ```js
        function toggleTodo(id) {
            return { type: "TOGGLE_TODO", id };
        }

        // ownProps代表容器组件的props
        function mapDispatchToProps(dispatch, ownProps) {
            return {
                onTodoClick: function (id) {
                    dispatch(toggleTodo(id));
                },
            };
        }
        // 展示组件调用this.props.onTodoClick(id)发送action
        ```

        - `bindActionCreators`, 使用 store 的 dispatch 方法把参数对象中包含的 action, creator 包裹起来
          这样就不需要显示的去用 dispatch 发送 action 了，而是直接调用 action

            ```js
            const mapDispatchToProps = (dispatch) => {
                return {
                    someActionCreator: () => {},
                };
            };

            // 组件中
            this.props.dispatch(this.props.someActionCreator());
            ```

            ```js
            const mapDispatchToProps = (dispatch) => {
                return {
                    someActionCreator: bindActionCreators(
                        someActionCreator,
                        dispatch,
                    ),
                };
            };

            // 组件中
            this.props.someActionCreator();
            ```

    5. Provider 组件

        - Provider 的实现

            ```js
            class Provider extends Component {
                getChildContext() {
                    return {
                        store: this.props.store,
                    };
                }

                render() {
                    return this.props.children;
                }
            }

            Provider.childContextTypes = {
                store: React.PropTypes.object,
            };
            ```

        - Provider 内层的任意组件都可以从 context 中获取 store 对象

            ```js
            // provider为最外层组件
            // container中的组件通过connect把组件和store相关联
            // 组件内部通过props调用state和action
            import { createStore } from 'redux';
            import { Provider } from 'react-redux';
            import todoApp from './reducers';
            import App from './components/App';

            let store = createStore(todoApp);

            render() {
                <Provider store={store}>
                    <App/>
                <Provider>,
                document.getElementById('root')
            }
            ```

5. 中间件和异步操作

    1. 中间件

        - 中间件就如同管道一般，前一个中间件的输出是下一个中间件的输入
        - redux 的中间件增强了 store 的功能，在 action 到达 reducer 前增加一些通用功能(日志输出，异常捕获)
        - 中间件原理

            ```js
            let next = store.dispatch;
            store.dispatch = function dispatchAndLog(action) {
                console.log("dispatching", action);
                let result = next(action);

                console.log("next state", store.getState());
                return result;
            };
            ```

        - 中间件使用

            ```js
            import { applyMiddleware, createStore } from "redux";
            import logger from "redux-logger";
            import reducer from "./reducers";

            const store = createStore(reducer, applyMiddleware(logger));
            ```

        - applyMiddleware

            - applyMiddleware 把接收到的中间件放入数组 chain 中
            - 通过`compose(...chain)(store.dispatch)`定义加强版的 dispatch 方法
            - compose 是工具函数，compose(f, g, h)等价于(...args) => f(g(h(args)))
            - 每一个中间件都接收包含 getState 和 dispatch 的参数对象

            ```js
            export default function applyMiddleware(...middlewares) {
                return (createStore) =>
                    (...args) => {
                        const store = createStore(...args);
                        let dispatch = store.dispatch;
                        let chain = [];

                        const middlewareAPI = {
                            getState: store.getState,
                            dispatch: (...args) => dispatch(...args),
                        };

                        chain = middlewares.map((middleware) =>
                            middleware(middlewareAPI),
                        );
                        dispatch = compose(...chain)(store.dispatch);

                        return {
                            ...store,
                            dispatch,
                        };
                    };
            }
            ```

    2. 异步操作

        - redux-thunk 是处理异步操作最常用的中间件
        - 使用 redux-thunk

        ```js
        import { createStore, applyMiddleware } from "redux";
        import thunk from "redux-thunk";
        import reducer from "./reducers";

        const store = createStore(reducer, applyMiddleware(thunk));
        ```

        - store.dispatch 只能接收普通 js 对象代表的 action, 使用 redux-thunk,store.dispatch 能接收函数作为参数了

        ```js
        store.dispatch(getData("http://xxx"));

        function getData(url) {
            return function (dispatch) {
                dispatch({type:'FETCH_DATA_REQUEST'});
                return fetch(url).then(
                    response => response.json(),
                    error => {
                        console.log('An error occured.', error);
                        dispatch({type:'FETCH_DATA_FAILURE', error});
                    }
                )
                .then(json =>
                    dispatch({type:'FETCH_DATA_SUCCESS', data: json});
                )
            }
        }
        ```

6. 使用`Redux DevTools`调试`redux`应用
7. 性能优化

    1. 创建高阶组件重写组件的 shouldComponentUpdate 方法

    ```js
    export default function connectRoute(WrappedComponent) {
        return class extends React.Component {
            shouldComponentUpdate(nextProps) {
                return nextProps.location !== this.props.location;
            }

            render() {
                return <WrappedComponent {...this.props} />;
            }
        };
    }
    ```

    ```js
    // 使用connectRoute包裹
    // app依赖的store中的state变化就不会再导致Route内组件的render方法重新执行了
    const AsyncHome = connectRoute(asyncComponent(() => import("../Home")));
    ```

    2. 使用`Immutable.js`更加高效的方式创建不可变的对象
        - 通过`Immutable.js`创建的对象在任何情况都无法被修改
        - `Immutable.js`提供了丰富的 api 创建不同类型的不可变对象如 Map, List, Set, Record
          还提供了大量 API 操作这些不可变对象，如 get, set, sort, filter
        - 使用不可变对象会涉及大量的复制操作，影响性能，`Immutable.js`做了大量的优化，降低性能损耗
        - 使用 immer 来搭配 redux 使用`Immutable.js`
    3. Reselect
        - 使用`selector`，对 state 进行计算，但是 state 的任意值发生变化，会导致所有使用到的 selector 重新计算
        - `Reselect`创建具有记忆功能的 selectors, 当 selectors 计算使用的参数未发生变化时，不会再次计算, 而是直接使用上次缓存的结果

#### 3.Mobx

1. 简介

    1. Mobx 响应式管理状态，整体是一个观察者模式的架构
    2. 存储 state 的 store 是被观察者，使用 store 的组件是观察者
    3. Mobx 可以有多个 store 对象
    4. Mobx 比 Redux 更轻量
    5. 和 redux 一样，使用 action 改变应用的 state,state 的改变去影响 views 更新
    6. Mobx 包含 state(状态), computed value(计算值), reaction(响应), action(动作)
    7. computed value 和 reaction 会自动根据 state 的改变做最小化的更新, 并且更新是同步的
    8. action 改变 state, state 是立即被获取的，computed value 采用的是延迟更新，computed value 被使用时，才会重新计算
    9. computed value 必须时纯函数，不能使用它修改 state
    10. 使用`babel-plugin-transform-decorators-legacy`支持装饰器写法
        ```js
        // vscode配置，避免装饰器写法报错
        {
            "compilerOptions": {
                "experimentalDecorators": true
            }
        }
        ```
    11. example

    ```js
    import { observable, computed } from "mobx";

    class TodoList {
        @observable todos = [];

        @computed get unfinishedTodoCount() {
            return this.todos.filter((todo) => !todo.finished).length;
        }
    }
    ```

    ```js
    import { observer } from "mobx-react";
    import { action } from "mobx";

    // 创建observer装饰器创建reaction
    @observer
    class TodoListView extends Component {
        render() {
            return (
                <div>
                    <ul>
                        {this.props.todoList.todos.map((todo) => (
                            <TodoView todo={todo} key={todo.id} />
                        ))}
                    </ul>
                </div>
            );
        }
    }
    ```

2. 主要组成

    1. state

        1. 普通对象(Plain Object)

            - 只有当前普通对象已经存在的属性才会转成可观测的，后面添加的新属性不会自动变成可观测的
            - 属性的 getter 会自动转换成 computed value, 效果和@computed 相同
            - observable 会递归遍历整个对象，遇到的对象的属性值还是一个对象时，属性值会继续被 observable 转换
            - 如果已有的属性被赋予一个新对象，新对象会自动被转换成可观测的对象

            ```js
            // mobx根据普通对象创建一个可观测的新对象
            import { observable, autorun } from "mobx";

            var person = observable({
                name: "Jack",
                age: 20,
                address: {
                    province: "Shanghai",
                },
                get labelText() {
                    return `name:${person.name}, age:${person.age}`;
                },
            });

            // mobx.autorun会创建1个reaction自动响应state的变化
            // autorun(() => {
            // console.log(`name:${person.name}, age:${person.age}`)
            // })
            autorun(() => {
                console.log(person.labelText);
            });

            person.name = "Tom"; // 输出: name: Tom, age: 20
            person.age = 25; // 输出: name: Tom, age: 25

            person.address.province = "chengdu"; // 输出: name: Tom, age: 25
            person.district = "Changning"; // 没有输出

            // 给可观测属性address赋新值
            person.address = {
                province: "Beijing",
                district: "Xicheng",
            }; // 输出: name: Tom, age: 25

            person.address.district = "Pudong"; // 输出: name: Tom, age: 25
            ```

            ```js
            class Person {
                @observable name = "Jack";
                @observable age = 20;
            }
            var person = new Person();
            ```

        2. ES6 Map

            - 返回新的可观测的 Map 对象
            - 向 Map 对象中添加或删除新元素的行为也是可观测的

            ```js
            import { observable, autorun } from "mobx";

            // 每一个元素代表Map对象中的一个键值对
            var map = new Map([
                ["name", "Jack"],
                ["age", 20],
            ]);
            var person = observable(map);

            autorun(() => {
                console.log(
                    `name: ${person.get("name")}, age: ${person.get(
                        "age",
                    )}, address: ${person.get("address")}`,
                );
            });

            person.set("address", "Shanghai");
            // 输出：name: Jack, age: 20, address: Shanghai
            ```

        3. 数组

            - 新的可观测数组，数组元素的增加或减少都会自动观测
            - observable 作用数组类型时，也会递归数组中的每个元素对象

            ```js
            import { observable, autorun } from "mobx";

            var todos = observable([
                { text: "Learn React", finished: false },
                { text: "Learn Redux", finished: false },
            ]);

            autorun(() =>
                console.log(
                    `todo 1 : ${todos[0].text}, finished: ${todos[0].finished}`,
                ),
            );

            todos[0].finished = true;
            // 输出: todo 1 : Learn React, finished: true
            ```

        4. 非普通对象

            - `observable`会返回一个特殊的 boxed values 类型的可观测对象
            - `boxed values`是保存一个指向原对象的引用, 对原对象的访问和修改需要通过新对象的 get()和 set()方法操作

            ```js
            import { observable, autorun } from "mobx";

            function Person(name, age) {
                this.name = name;
                this.age = age;
            }

            var person = observable(new Person("Jack", 20));
            autorun(() =>
                console.log(
                    `name: ${person.get().name}, age: ${person.get().age}`,
                ),
            );

            person.get().age = 25; // 没有输出, 因为person对象的属性不可观测

            // 引用发生变化，可观测
            // 输出: name: jack, age: 20
            person.set(new Person("jack", 20));
            ```

            - 将非普通对象转换成可观测的自定义构造函数的正确实现方式

            ```js
            import { observable, autorun } from "mobx";

            class Person {
                @observable name;
                @observable age;

                constructor(name, age) {
                    this.name = name;
                    this.age = age;
                }
            }

            var person = new Person("jack", 20);
            autorun(() =>
                console.log(`name: ${person.name}, age: ${person.age}`),
            );

            // 输出: name:jack, age: 25
            person.age = 25;
            ```

        5. 基础数据类型

            - observable 将接收的基础数据类型转换成可观测的`boxed values`类型的对象

            ```js
            import { observable, autorun } from "mobx";

            const name = observable("jack");

            autorun(() => console.log(`name:${name.get()}`));

            name.set("Tom"); // 输出 name:Tom
            ```

    2. computed value

        - computed value 是根据 state 衍生出的新值
        - computed value 采用延迟更新策略，只有被使用时才会自动更新
        - computed 一般接收一个函数，用于修饰 class 的 getter 方法

        ```js
        import { observable, computed, autorun } from "mobx";

        class Person {
            @observable name;
            @observable age;

            @computed get isYoung() {
                return this.age < 25;
            }

            constructor(name, age) {
                this.name = name;
                this.age = age;
            }
        }

        var person = new Person("jack", 20);
        autorun(() =>
            console.log(`name:${person.name}, isYoung: ${person.isYoung}`),
        );

        person.age = 25; // 输出: name:Jack, isYoung: false
        ```

    3. reaction

        - 自动响应 state 变化有副作用的函数，例如打印信息、发送网络请求、根据 react 组件树更新 dom
        - observer/@observer
            ```js
            @observer class MyComponent extends React.Component { ... }
            ```
        - autorun

            - autorun 接收到的函数会立即执行一次，以后的执行就依赖 state 的变化
            - autorun 会返回一个清除函数 disposer, 可以调用 disposer 清除副作用

            ```js
            var numbers = observable([1, 2, 3]);
            var sum = computed(() => numbers.reduce((a, b) => a + b, 0));

            var disposer = autorun(() => console.log(sum.get())); // 输出: 6
            numbers.push(4); // 输出: 10

            disposer();
            numbers.push(5); // 没有输出
            ```

        - reaction

            - 接收 2 个函数，第 1 个函数返回被观测的 state, 这个返回值同时是第 2 个函数的输入值
            - 第 1 个函数的返回值发生变化时，第 2 个函数才会被执行
            - 第 3 个参数 options 提供可选的参数
            - `reaction`也会返回 1 个 disposer

            ```js
            const todos = observable([
                {
                    title: "Learn React",
                    done: true,
                },
                {
                    title: "Learn Mobx",
                    done: false,
                },
            ]);

            const reaction1 = reaction(
                () => todos.length,
                (length) =>
                    console.log(
                        "reaction1:",
                        todos.map((todo) => todo.title).join(", "),
                    ),
            );

            const reaction2 = reaction(
                () => todos.map((todo) => todo.title),
                (titles) => console.log("reaction2:", titles.join(", ")),
            );

            // 输出: reaction1: learn react , learn mobx, learn redux
            // 输出: reaction2: learn react , learn mobx, learn redux
            todos.push({ title: "learn redux", done: false });

            // 输出: reaction2: learn Something , learn mobx, learn redux
            todos[0].title = "learn something";
            ```

        - when

            - condition 会自动响应它使用的任何 state 的变化, condition 返回 true 时，sideEffect 会执行,只执行一次
            - when 也会返回一个清除函数 disposer

            ```js
            when(
                () => condition,
                () => {
                    sideEffect;
                },
            );
            ```

            ```js
            class MyResource {
                constructor() {
                    when(
                        () => !this.isVisible,
                        () => this.dispose(),
                    );
                }

                @computed get isVisible() {
                    // 判断某个元素是否可见
                }

                disposer() {
                    // 清除逻辑
                }
            }
            ```

        -

    4. action

        - action 时用来修改 state 的函数
        - 函数内部多次修改 state 时，action 会执行批处理操作，只有当所有的修改都执行完成，
          才会通知相关的 computed value 和 reaction

        ```js
        @action fetchPostList(url) {
            this.pendingRequestCount++;
            return fetch(url).then(
                action(data => {
                    this.pendingRequestCount--;
                    this.posts.push(data);
                })
            );
        }
        ```

        - mobx 提供了@action.bound 帮助完成 this 绑定的工作

        ```js
        class Ticker {
            @observable tick = 0;

            @action.bound
            increment() {
                this.tick++;
            }
        }

        const ticker = new Ticker();
        setInterval(ticker.increment, 1000);
        ```

3. mobx 的常见误区
    - mobx 追踪属性的访问来追踪值的变化，而不是直接追踪值的变化
    - mobx 只追踪同步执行过程中的数据
    - observer 创建的组件，只有当前组件的 render 方法中直接使用的数据才会被追踪
4. mobx-react, 在 react 中使用 Mobx

    - Provider
        - 是 1 个 React 组件，利用 React 的 context 机制把应用所需的 state 传递给子组件
        - 和 Redux 的 react-redux 提供的 Provider 组件相同
    - inject
        - 是 1 个高阶组件，和 Provider 结合使用
        - 从 Provider 提供的 state 选取所需的数据，作为 props 传递给目标组件
    - example

    ```js
    import React, { Component } from "react";
    import ReactDOM from "react-dom";
    import { observer, inject, Provider } from "mobx-react";
    import { observable } from "mobx";
    @observer
    @inject("store") // inject 从context中取出store对象，注入到组件的props中
    class App extends Component {
        render() {
            const { store } = this.props;
            return (
                <div>
                    <ul>
                        {store.map(todo => <TodoView todo={todo} key={todo.id} />)}
                    </ul>
                </div>
            );
        }
    }
    const TodoView = observer(({ todo }) => {
        return <li>{todo.title}</li>;
    });

    // 构造store及其初始数据
    const todos = observable([]);
    todos.push({ id: 1, title: "Task1" });
    todos.push({ id: 2, title: "Task2" });
    ReactDOM.render(
        {/* Provider向context中注入store对象 */ }
        <Provider store={ todos } >
            <App />
        </Provider >,
        document.getElementById("root")
    );
    ```

5. 其他
    - observer/@observer 相当于重写了组件的`shouldComponentUpdate`, 尽可能的多使用，可以提高组件的渲染效率
    - 使用 oberver/@observer 的组件难以在不使用 mobx 的项目中复用组件
