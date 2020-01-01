## React进阶
### 一、基础篇
##### 1. React基础
1. React简介
    * 引入虚拟DOM、状态、单向数据流等设计理念，形成以组件为核心，用组件搭建UI的开发模式，完美的将数据、组件状态、UI映射在一起
2. JSX
    * 描述`UI`的`javascript`扩展语法
    * 可以同时存放`UI`描述和`UI`数据
    * 用`JSX`创建界面元素更加清晰简洁
    * JSX语法只是`React.createElement`的语法糖
    ```js
    // jsx
    const element = <div className="foo">Hello, React</div>

    // 转换后
    const element = React.createElement('div', { className: 'foo' }, 'Hello, React');
    ```
3. 通过`PropTypes`对组件进行属性校验
    * `PropTypes.string`
    * `PropTypes.number`
    * `PropTypes.bool`
    * `PropTypes.func`
    * `PropTypes.object`
    * `PropTypes.array`
    * `PropTypes.symbol`
    * `PropTypes.element`, React元素
    * `PropTypes.node`, 可被渲染的节点
    ```js
    import PropTypes from 'prop-types';

    class PostItem extends React.Component {

    }

    PostItem.propTypes = {
        post: PropTypes.object,
        onVote: PropTypes.func,
        style: PropTypes.shape({
            color: PropTypes.string,
            fontSize: PropTypes.number
        }),
        sequence: PropTypes.arrayOf(PropTypes.number),
        onVote: PropTypes.func.isRequired
    }
    ```
4. 定义组件默认属性
    ```js
    function Welcome(props) {
        return <h1>welcome</h1>
    }

    Welcome.defaultProps = {
        name: 'Stranger'
    }
    ```
5. 组件挂载
    1. constructor
        * 调用super(props)保证props被传入组件中
        * 通常用于初始化组件的state和绑定事件处理方法
    2. componentWillMount
        * 组件被挂载在dom前调用，这里面的方法都可以提前到constructor中
        * 在这里面调用this.setState不会引起组件的重新渲染
    3. render
        * render是1个纯函数，不能有任何有副作用的操作
    4. componentDidMount
        * 组件被挂载在DOM后调用，只会被调用一次
        * 依赖DOM的操作放在此方法中
6. 组件更新，依次调用的生命周期为
    1. componentWillReceiveProps(nextProps)
        * 只有props变化引起的更新，componentWillReceiveProps才会调用
    2. shouldComponentUpdate(nextProps, nextState)
        * 方法返回true,组件继续更新，方法返回false,组件更新停止
        * 用于减少组件不必要的渲染，优化组件性能
    3. componentWillUpdate(nextProps, nextState)
        * 组件更新前执行的操作，一般很少用到
    4. render
    5. componentDidUpdate(prevProps, prevState)
        * prevProps和prevState代表组件更新前的props和state
7. 组件卸载
    1. componentWillUnmount
        * 清除定时器或者DOM元素等操作
8. 列表渲染和key
    1. React通过key标记列表中的每个元素
    2. 通过key知道哪些元素发生变化，提高渲染效率
9. 事件处理
    1. React中，事件处理采用驼峰式命名而不是DOM元素中的小写字母命名，onclick要写成onClick
    2. 在render中使用箭头函数或者bind,会导致每次render调用，都会重新创建1个新的事件处理函数，带来额外的性能开销
        ```js
        <button onClick={event => {}}>Click</button>
        <button onClick={this.handleClick.bind(this)}>click</button>
        ```
    3. 将组件的方法赋值给元素的事件属性，可以避免render调用重新创建事件处理函数
        ```js
        <button onClick={this.handleClick} >click</button>
        ```
    4. 使用bind可以为函数传参   
        ```js
        class MyComponent extends React.component {
            handleClick(item, event) {

            }
            render() {
                return (
                    <button onClick={this.handleClick.bind(this, 'test')}></button>
                )
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
                    [target.name]: target.value
                })
            }
            render() {
                return (
                    <input
                        type="text"
                        name="name"
                        value={this.state.name}
                        onChange={this.handleChange}
                    />
                )
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
        * 使用ref来获取表单的值
        ```js
        class SimpleForm extends Component {
            handleSubmit(event) {
                console.log(this.input.value);
            }
            render() {
                return (
                    <form onSubmit={this.handleSubmit}>
                        <input defaultValue="something" ref={input => this.input = input} />
                        <input type="checkbox" defaultChecked={true} />
                    </form>
                )
            }
        }
        ```
##### 2. React 16特性
1. render
    1. render支持新的返回类型，数组和字符串
    ```js
    class StringComponent extends Component {
        render() {
            return 'just a string';
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
                <StringComponent />
            ]
        }
    }
    ```
2. 错误处理
    * 错误边界（Error Boundaries）
    * 错误边界是能够捕获子组件的错误并对其做优雅处理的组件
    * 优雅的处理可以是输出错误的日志，显示出错提示等
    * 定义了`componentDidCatch(error, info)`的组件将成为一个错误边界组件
    ```js
    class ErrorBoundary extends React.Component {
        constructor(props) {
            super(props);
            this.state = { hasError: false }
        }
        componentDidCatch(error, info) {
            // 显示错误UI
            this.setState({ hasError: true })
            // 同时输出错误日志
            console.log(error, info)
        }
        render() {
            if (this.state.hasError) {
                return <h1>Oops, something went wrong.</h1>
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
            )
        }
    }
    const Profile = ({ user }) => <div>name: {user.name}</div>;
    ``` 
3. Portals
    * Portals特性让我们可以把组件渲染到组件树以外的DOM节点上
    * 应用场景是渲染应用的全局弹窗
    * 使用portals, 任意组件都可以将弹窗组件渲染到根节点上，方便弹窗显示
    ```js
    class Modal extends Component {
        constructor(props) {
            super(props);

            // 根节点下创建1个div
            this.container = document.createElement('div');
            document.body.appendChild(this.container);
        }
        componentWillUnmount() {
            document.body.removeChild(this.container);
        }
        render() {
            // 创建的dom树挂载到this.container指向的div节点下面
            return ReactDOM.createPortal(
                <div className="modal">
                    <span className="close" onClick={this.props.onClose}>close</span>
                    <div className="content">{this.props.children}</div>
                </div>,
                this.container
            )
        }
    }
    ```
    ```js
    class App extends Component {
        constructor(props) {
            super(props);
            this.state = {
                showModal: true
            }
        }
        // 关闭弹窗
        closeModal = () => {
            this.setState({
                showModal: false
            })
        }

        render() {
            return (
                <div>
                    <h2>Dashboard</h2>
                    {
                        this.state.showModal &&
                            <Modal onClose={this.closeModal}>Modal Dialog</Modal>
                    }
                </div>
            )
        }
    }
    export default App;
    ```
4. 自定义DOM属性
    * React16会把不识别的属性传给DOM元素
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
1. 不能直接修改state
    ```js
    // 错误
    this.state.title = 'React';

    // 正确
    this.setState({
        title: 'React'
    })
    ```
2. state的更新是异步的
    * React会把多次state的修改合并成一次
    ```js
    // 点击增加数量，就会加1
    this.setState({
        quantity: this.state.quantity + 1
    })

    // 连续点击2次，等价于
    Object.assign(
        previousState,
        { quantity: this.state.quantity + 1 },
        { quantity: this.state.quantity + 1 }
    )

    // 后面的数量会覆盖前面的操作，最终的数量只会+1
    ``` 
    ```js
    // 正确的代码
    this.setState((preState, props) => ({
        quantity: preState.quantity + 1
    }))
    ```
3. state的更新是1个合并的过程
    ```js
    class Example extends React.Component {
        constructor() {
            super();
            this.state = {
                val: 0
            };
        }
  
        componentDidMount() {
            // isBatchingUpdates被设置成了true
            this.setState({val: this.state.val + 1});
            console.log(this.state.val);    // 0

            this.setState({val: this.state.val + 1});
            console.log(this.state.val);    // 0

            // isBatchingUpdates被设置成了false
            setTimeout(() => {
                this.setState({val: this.state.val + 1});
                console.log(this.state.val);  // 2

                this.setState({val: this.state.val + 1});
                console.log(this.state.val);  // 3
            }, 0);
        }

        render() {
            return null;
        }
    };
    ``` 
4. state与不可变对象
    1. 状态的类型是不可变类型（number, string, boolean, null, undefined）, 直接赋新值
        ```js
        this.setState({
            count: 1,
            title: 'React',
            success: true
        })
        ```
    2. 状态的类型是数组
        * 使用concat, slice, filter方法或者ES6的数组扩展语法
        * 不要使用push, pop, shift, unshift, splice等方法修改数组类型的状态
        ```js
        this.setState(preState => {
            books: preState.books.concat(['React Guide'])
        })
        ```
        ```js
        this.setState(preState => {
            books: [...preState.books, 'React Guide']
        })
        ```
        ```js
        this.setState(preState => {
            books: preState.books.slice(1, 3);
        })
        ```
        ```js
        this.setState(preState => {
            books: preState.books.filter(item => {
                return item !== 'React';
            })
        })
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
    4. React推荐组件的状态是不可变对象
        1. 避免修改了原对象而导致的错误
        2. 当组件的状态都是不可变对象时，可以避免不必要的渲染 
5. 组件与服务器通信
    1. 组件挂载阶段通信
        1. 一般选择在`componentWillMount`或者`componentDidMount`中通信
        2. componentDidMount能保证DOM处于挂载阶段，操作DOM是安全的
        3. 服务端渲染时，`componentWillMount`会被调用2次
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
            <UserList users={this.state.users} />

            // 子组件
            {
                this.props.users.map(user => (
                    <li>user</li>
                ))
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
        2. A组件调用父组件传递的回调函数改变状态，父组件将状态传给B组件
    3. context
        ```js
        // theme-context.js
        export const themes = {
            light: {
                background: '#eee'
            },
            dark: {
                background: '#222'
            }
        }

        export const ThemeContext = React.createContext(
            theme.dark // 默认值
        );
        ```
        ```js
        // theme-button.js
        import { ThemeContext } from './theme-context';

        class ThemedButton extends React.Component {
            render() {
                let theme = this.context;

                return (
                    <button style={{ backgroundColor: theme.background }} />
                )
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
    1. 在DOM元素上使用Ref
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
                            ref={input => { this.textInput = input }}
                        />
                    </div>
                )
            }
        }
        ```
    2. 在组件上使用ref(不能在函数组件上使用ref)
        ```js
        class Container extends React.Component {
            handleClick = () => {
                // 失去焦点
                this.inputInstance.blur();
            }
            render() {
                return (
                    <div>
                        <AutoFocusTextInput
                            ref={input => { this.inputInstance = input }}
                        />
                        <button onClick={this.handleClick}>失去焦点</button>
                    </div>
                )
            }
        }
        ```
    3. 父组件访问子组件的DOM节点
        ```js
        function Children(props) {
            return (
                <div>
                    <input ref={props.inputRef} />
                </div>
            )
        }
        ```
        ```js
        class Parent extends React.Component {
            render() {
                return (
                    <Children
                        inputRef={el => this.inputElement = el}
                    />
                )
            }
        }
        ``` 
#### 2.虚拟DOM和性能优化
1. 虚拟DOM
    1. 每一次对DOM的修改都会引起对浏览器的重新布局和重新渲染
    2. 虚拟DOM使用普通的js对象来描述DOM元素
    3. React元素本身就是一个虚拟DOM节点
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
2. Diff算法
    1. 每次render方法都会返回1个新的虚拟DOM对象
    2. 每次render. React会使用Diff算法比较前后2次render返回的虚拟DOM的差异部分，更新到真实DOM上
    3. Diff算法
        1. 当根节点是不同类型时，会把整个虚拟DOM树拆掉重建，重建后，将虚拟DOM整体更新到真实DOM上
            * 旧的React组件的实例的`componentWillUnmount`会被调用
            * 新的React组件的实例的`componentWillMount`和`componentDidMount`方法会被调用
        2. 当根节点是相同类型的DOM元素，只是元素属性发生了变化，React会更新虚拟DOM树和真实DOM树中对应节点的这一属性
        3. 当根节点是相同的组件类型, 同步变化的属性到虚拟DOM上，然后更新真实DOM
            * 组件实例会调用`componentWillReceiveProps`和`componentWillUpdate` 
        4. React会根据Key匹配子节点，只要子节点的key没有变化，React认为这是同一节点，从而提高Diff算法的效率
3. 性能优化
    1. 使用生产环境版本的库
    2. 使用`shouldComponentUpdate`减少不必要的渲染
        1. `React.PureComponent`具有`shouldComponentUpdate`的逻辑
        2. `React.PureComponent`是使用的浅比较，如果直接修改数据，组件不会直接渲染
        ```js
        import React from 'react';

        export default class NumberList extends React.PureComponent {
            constructor(props) {
                super(props);
                this.state = {
                    numbers: [1, 2, 3, 4]
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
                console.log('render')
                return (
                    <div>
                        <button onClick={this.handleClick} />
                        {this.state.numbers.map(item => <div>{item}</div>)}
                    </div>
                );
            }
        }
        ``` 
4. 使用key
    * React根据key索引元素，可以减少DOM操作，提高DOM更新效率
5. 性能检测工具
    * React Developer Tools for Chrome
        * 通过 React Developer Tools 可以看到组件之间的嵌套关系以及每个组件的事件、属性、状态等信息
    * Chrome Performance Tab
        * 观察组件的挂载、更新、卸载过程以及各阶段使用的时间
    * why-did-you-update
        * 打印出render方法中不必要的调用
#### 3.高阶组件
> 实现组件逻辑的抽象和复用
1. 基本概念
    * 接收React组件作为参数，并返回1个新的React组件
    * 高阶组件的本质也是1个函数
    * 高阶组件的实现方式，本质上是装饰者模式
    ```js
    import React, { Component } from 'react';

    function withPersistentData(WrappedComponent) {
        return class extends Component {
            componentWillMount() {
                let data = localStorage.getItem('data');
                this.setState({ data });
            }
            render() {
                return <WrappedComponent
                            data={this.state.data}
                            {...this.props}
                        />
            }
        }
    }
    ```
    ```js
    class MyComponent extends Component {
        render() {
            return <div>{this.props.data}</div>
        }
    }
    export default withPersistentData(MyComponent)
    ``` 
2. 使用场景
    1. 操纵props
        * 高阶组件可以先拦截props, 对props进行增加、删除、修改的操作，然后将处理后的props传递给被包装的组件
    2. 通过ref访问组件实例
        * 适用于复用逻辑需要包装组件的方法支持时
        ```js
        function withRef(wrappedComponent) {
            return class extends React.Component {
                someMethod() {
                    this.wrappedInstance.someMethodInWrappedComponent();
                }
                render() {
                    return <WrappedComponent
                                ref={instance => { this.wrappedInstance = instance }}
                                {...this.props}
                            />
                }
            }
        }
        ``` 
    3. 组件状态提升
        ```js
        function withControlledState(WrappedComponent) {
            return class extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        value: ''
                    };
                    this.handleValueChange =
                        this.handleValueChange.bind(this);
                }
                handleValueChange(event) {
                    this.setState({
                        value: event.target.value
                    });
                }
                render() {
                    // newProps 保存受控组件需要使用的属性和事件处理函数
                    const newProps = {
                        controlledProps: {
                            value: this.state.value,
                            onChange: this.handleValueChange
                        }
                    };
                    return <WrappedComponent {...this.props}
                        {...newProps} />
                }
            }
        }
        ```
        ```js
        class SimpleControlledComponent extends React.Component {
            render() {
                //此时的SimpleControlledComponent为无状态组件，状态由高阶组件维护
                return <input name="simple"
                    {...this.props.controlledProps} />
            }
        }
        const ComponentWithControlledState = withControlledState(SimpleControlledComponent);
        ```
    4. 用其他元素包装组件 
        ```js
        function withRedBackground(WrappedComponent) {
            return class extends React.Component {
                render() {
                    return (
                        <div style={{ backgroundColor: 'red' }}>
                            <WrappedComponent {...this.props} />
                        </div>
                    )
                }
            }
        }
        ```
3. 参数传递
    1. 接收除组件外1个额外的参数
        ```js
        function withPersistentData(WrappedComponent, key) {
            return class extends Component {

            }
        }
        ```
        ```js
        const MyComponent1WithPersistentData = withPersistentData(MyComponent, 'data');
        const MyComponent2WithPersistentData = withPersistentData(MyComponent, 'name');
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
        }
    }
    ``` 
5. 注意事项
    1. 不要在render中使用高阶组件，因为每次render，高阶组件都会卸载然后重新挂载
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
    3. refs不会被传递给包装组件

### 三、实战
#### 1.React-Router
1. 单页面应用和前端路由
    1. 后端路由
        * 服务器根据URL返回1个HTML页面
        * 1个URL对应1个HTML页面
        * 1个web应用包含很多HTML页面
    2. 前端路由
        * 单页应用，无论URL如何变化，对应的HTML都是同1个
        * 对SEO支持不太好
2. React-Router(安装以下2个包，会自动依赖react-router)
    * react-router-dom（在浏览器中使用）
    * react-router-native（在react-native中使用）
3. 路由器
    1. React Router通过Router和Route两个组件完成路由功能
    2. 一个应用需要1个Router实例,Router相当于路由器
    3. Route定义为Router的子组件
    4. Router的实例
        1. BrowserRouter
            * 使用HTML5的`history API`(pushState, replaceState)实现UI和URL的同步
            * `http://example.com/some/path`
            * 需要配置服务器，让服务器能够处理所有的URL
            * React Router中提供的其他组件可以通过context获取history对象
            * Router中只能包含唯一的1个元素
                ```js
                ReactDOM.render((
                    <BrowserRouter>
                        <App />
                    <BrowserRouter>
                ), document.getElementById('root'))
                ``` 
        2. HashRouter 
            * HashRouter使用URL的hash实现应用的UI和URL的同步
            * `http://example.com/#/some/path`
4. 路由配置
    1. path
        1. 每个Route都需要定义1个path属性
        2. 使用`BrowserRouter`时，path用来描述Route匹配的URL的pathname
            ```js
            // 匹配http://example.com/foo
            // Route中定义的组件会被渲染出来
            <Route path='/foo' />
            ```
        3. 使用`HashRouter`时，path用来匹配URL的hash
    2. match
        1. URL和Route匹配时，Route会创建一个match对象作为props的一个属性传给被渲染的组件
        2. params
            * Route的path可以包含的参数
                ```js
                // Route包含1个参数id
                <Route path='/foo/:id'>

                // params就是从url中解析出的参数
                // params = { id: 1 }
                URL = 'http://example.com/foo/1';
                ``` 
        3. isExact
            * 当URL完全匹配时，值为true
            * 当URL部分匹配时，值为false
            ```js
            path = '/foo';
            // 完全匹配
            URL = 'http://example.com/foo';
            // 部分匹配
            URL = 'http://example.com/foo/1';
            ```
        4. path
            * 构建嵌套路由时会使用到
        5. url
            * URL的匹配部分
    3. Route渲染组件的方式
        1. component
            * 当URL和Route匹配时，component属性定义的组件就会被渲染
            ```js
            // 当URL为http://example.com/foo时，Foo会被渲染
            <Route path='/foo' component={Foo}>
            ``` 
        2. render
            * render的值是1个函数，函数返回React元素
            * 为待渲染的组件传递额外的属性
            ```js
            <Route path='/foo' render={props => (
                <Foo {...props} data={extraProps} />
            )}>
            ```
        3. children
            * 函数返回要渲染的React元素
            * 无论匹配是否成功，children返回的组件都会被渲染
            * 匹配不成功时，match属性为null
            ```js
            <Route path='/foo' children={props => (
                <div className={props.match ? 'active' : ''}>
                    <Foo />
                </div>
            )}>
            ``` 
    4. Switch和exact
        * 把Route包到1个Switch组件中，让第1个匹配的Route渲染
        * 使用Route的exact属性，URL和Route完全匹配，Route才渲染
        ```js
        <Router>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/posts' component={Posts} />
                <Route path='/:user' component={User} />
            </Switch>
        </Router>
        ``` 
    5. 嵌套路由
        * Route渲染的组件内部，定义新的Route
        ```js
        const Posts = ({ match }) => {
            return (
                <div>
                    // match.url为/posts
                    <Route path={`${match.url}/:id`} component={PostDetail} />
                    <Route exact path={match.url} component={PostList} />
                </div>
            )
        }
        ```
5. 链接Link
    * Link是React Router提供的链接组件，1个Link组件定义了点击Link时，页面该如何路由
    * to声明要导航的url地址
        ```js
        const Navigation = () => (
            <header>
                <nav>
                    <ul>
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='/posts'>Posts</Link></li>
                    </ul>
                </nav>
            </header>
        )
        ```
    * to可以是object对象，对象可以包含pathname, search, hash, state
        ```js
        <Link to={{
            pathname: '/posts',
            search: '?sort=name',
            hash: '#the-hash',
            state: { fromHome: true }
        }}/>
        ``` 
    * 通过history.push(path, [state])导航，浏览器会新增1条记录
        `history.push('/posts')`
    * 通过history.replace(path, [state])导航，新记录替换当前记录
        `history.push('/posts')`
#### 2.Redux
1. Redux通过约定的规范将修改应用状态的步骤标准化，让应用状态的管理不再错综复杂
2. Redux三大原则
    * 唯一数据源
        * 集中式管理应用状态，减少出错可能性
    * 保持应用状态只读
        * 不能直接更改应用状态，只能发送action进行更改
    * 应用状态的改变通过纯函数完成
        * reducer是1个纯函数，不能直接修改原来的状态对象，需要创建1个新的状态对象返回
3. Redux主要由action, reducer, store这三部分组成
    1. action
        * action是store唯一的信息来源
        * action发送给store，必须通过store的dispatch方法
        * action必须有1个type属性描述action的类型
        ```js
        export function addTodo(text) {
            return { type: 'ADD_TODO', text }
        }
        ``` 
    2. reducer
        * reducer是纯函数，接收两个参数，当前state和action, 返回新的state
        * reducer返回的state需要是新的对象，不能改变原有对象
        ```js
        // Object.assign也行
        function todoApp(state = initialState, action) {
            switch (action.type) {
                case SET_VISIBILITY_FILTER:
                    return { ...state, visibilityFilter: action.filter }
                default:
                    return state
            }
        }
        ```
        * 可拆分多个reducer, 使用`combineReducers`合并
        ```js
        import { combineReducers } from 'redux'
        const todoApp = combineReducers({
            todos,
            visibilityFilter
        })
        ``` 
    3. store
        * store是action和reducer之间的桥梁
        * 保存应用状态
        * 通过方法`getState()`访问应用状态
        * 通过方法`dispatch(action)`发送更新状态的意图
        * 通过方法`subscribe(listener)`注册监听函数，监听应用状态的改变
        ```js
        // 监听
        let unsubscribe = store.subscribe(() => {
            console.log(store.getState())
        })
        // 取消监听
        unsubscribe();
        ```
        * 一个Redux应用只有1个store，store保存唯一数据源
        ```js
        import { createStore } from 'redux';
        import todoApp from './reducers';

        let store = createStore(todoApp, initialState);
        ```  
        * `store.getState`获取当前应用的状态state
        ```js
        const state = store.getState();
        ```
        * `store.dispatch`发送action
        ```js
        function addTodo(text) {
            return {
                type: 'ADD_TODO',
                text
            }
        }

        store.dispatch(addTodo('learn about actions'));
        ```  
4. React中使用react-redux
    1. 展示组件和容器组件
        * presentational components, 负责应用的UI展示
        * container components，负责应用逻辑的处理
    2. connect
        * react-redux提供了一个connect函数，用于把react组件和redux的store连接起来
        * 生成一个容器组件，负责数据管理和业务逻辑
        ```js
        import { connect } from 'react-redux';
        import TodoList from './TodoList';

        const VisibleTodoList = connect(
            mapStateToProps, // 负责从全局状态state中取出所需数据, 映射到展示组件的props上
            mapDispatchToProps // 负责把需要用到的action映射到展示组件的props上
        )(TodoList);
        ``` 
    3. mapStateToProps
        * store中的state更新，mapStateToProps就会重新执行，重新计算传递给展示组件的props, 从而触发组件的重新渲染
        * store中的state更新，一定会导致mapStateToProps重新执行，
            但是如果mapStateToProps新返回的对象和之前的对象浅比较相等，组件的shouldComponentUpdate就会返回false,
            组件的render方法就不会再次被触发, 这是react-redux的一个重要优化
        * mapStateToProps接收第2个参数，代表容器组件的props对象
            ```js
            // ownProps是组件的props对象
            function mapStateToProps(state, ownProps){
                return {
                    user: state.auth
                }
            }
            ``` 
    4. mapDispatchToProps
        * mapDispatchToProps接收store.dispatch方法作为参数，返回展示组件用来修改state的函数
        ```js
        function toggleTodo(id) {
            return { type: 'TOGGLE_TODO', id }
        }

        // ownProps代表容器组件的props
        function mapDispatchToProps(dispatch, ownProps) {
            return {
                onTodoClick: function(id) {
                    dispatch(toggleTodo(id));
                }
            }
        }
        // 展示组件调用this.props.onTodoClick(id)发送action
        ```
        * `bindActionCreators`, 使用store的dispatch方法把参数对象中包含的action, creator包裹起来
            这样就不需要显示的去用dispatch发送action了，而是直接调用action
            ```js
            const mapDispatchToProps = dispatch => {
                return {
                    someActionCreator: () => {}
                }
            }

            // 组件中
            this.props.dispatch(this.props.someActionCreator())
            ```
            ```js
            const mapDispatchToProps = dispatch => {
                return {
                    someActionCreator: bindActionCreators(someActionCreator, dispatch)
                }
            }

            // 组件中
            this.props.someActionCreator();
            ```  
    5. Provider组件
        * Provider的实现
            ```js
            class Provider extends Component {
                getChildContext() {
                    return {
                        store: this.props.store
                    }
                }

                render() {
                    return this.props.children;
                }
            }

            Provider.childContextTypes = {
                store: React.PropTypes.object
            }
            ```
        * Provider内层的任意组件都可以从context中获取store对象
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
        * 中间件就如同管道一般，前一个中间件的输出是下一个中间件的输入
        * redux的中间件增强了store的功能，在action到达reducer前增加一些通用功能(日志输出，异常捕获)
        * 中间件原理
            ```js
            let next = store.dispatch;
            store.dispatch = function dispatchAndLog(action) {
                console.log('dispatching', action);
                let result = next(action);

                console.log('next state', store.getState());
                return result;
            }
            ```
        * 中间件使用
            ```js
            import { applyMiddleware, createStore } from 'redux';
            import logger from 'redux-logger';
            import reducer from './reducers';

            const store = createStore(
                reducer,
                applyMiddleware(logger)
            )
            ```
        * applyMiddleware
            * applyMiddleware把接收到的中间件放入数组chain中
            * 通过`compose(...chain)(store.dispatch)`定义加强版的dispatch方法
            * compose是工具函数，compose(f, g, h)等价于(...args) => f(g(h(args)))
            * 每一个中间件都接收包含getState和dispatch的参数对象
            ```js
            export default function applyMiddleware(...middlewares) {
                return (createStore) => (...args) => {
                    const store = createStore(...args);
                    let dispatch = store.dispatch;
                    let chain = [];

                    const middlewareAPI = {
                        getState: store.getState,
                        dispatch: (...args) => dispatch(...args)
                    }

                    chain = middlewares.map(middleware => middleware(middlewareAPI));
                    dispatch = compose(...chain)(store.dispatch);

                    return {
                        ...store,
                        dispatch
                    }
                }
            }
            ``` 
    2. 异步操作
        * redux-thunk是处理异步操作最常用的中间件
        * 使用redux-thunk
        ```js
        import { createStore, applyMiddleware } from 'redux';
        import thunk from 'redux-thunk';
        import reducer from './reducers';

        const store = createStore(
            reducer,
            applyMiddleware(thunk)
        )
        ```
        * store.dispatch只能接收普通js对象代表的action, 使用redux-thunk,store.dispatch能接收函数作为参数了
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
    1. 创建高阶组件重写组件的shouldComponentUpdate方法
    ```js
    export default function connectRoute(WrappedComponent) {
        return class extends React.Component {
            shouldComponentUpdate(nextProps) {
                return nextProps.location !== this.props.location;
            }

            render() {
                return <WrappedComponent {...this.props} />
            }
        }
    }
    ```
    ```js
    // 使用connectRoute包裹
    // app依赖的store中的state变化就不会再导致Route内组件的render方法重新执行了
    const AsyncHome = connectRoute(asyncComponent(() => import('../Home')));
    ```
    2. 使用`Immutable.js`更加高效的方式创建不可变的对象
        * 通过`Immutable.js`创建的对象在任何情况都无法被修改
        * `Immutable.js`提供了丰富的api创建不同类型的不可变对象如Map, List, Set, Record
            还提供了大量API操作这些不可变对象，如get, set, sort, filter
        * 使用不可变对象会涉及大量的复制操作，影响性能，`Immutable.js`做了大量的优化，降低性能损耗
        * 使用immer来搭配redux使用`Immutable.js`
    3. Reselect
        * 使用`selector`，对state进行计算，但是state的任意值发生变化，会导致所有使用到的selector重新计算
        * `Reselect`创建具有记忆功能的selectors, 当selectors计算使用的参数未发生变化时，不会再次计算, 而是直接使用上次缓存的结果  
#### 3.Mobx
1. 简介
    1. Mobx响应式管理状态，整体是一个观察者模式的架构
    2. 存储state的store是被观察者，使用store的组件是观察者
    3. Mobx可以有多个store对象
    4. Mobx比Redux更轻量
    5. 和redux一样，使用action改变应用的state,state的改变去影响views更新
    6. Mobx包含state(状态), computed value(计算值), reaction(响应), action(动作)
    7. computed value和reaction会自动根据state的改变做最小化的更新, 并且更新是同步的
    8. action改变state, state是立即被获取的，computed value采用的是延迟更新，computed value被使用时，才会重新计算
    9. computed value必须时纯函数，不能使用它修改state
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
    import { observable, computed } from 'mobx';

    class TodoList {
        @observable todos = [];

        @computed get unfinishedTodoCount() {
            return this.todos.filter(todo => !todo.finished).length;
        }
    }
    ```
    ```js
    import { observer } from 'mobx-react';
    import { action } from 'mobx';

    // 创建observer装饰器创建reaction 
    @observer
    class TodoListView extends Component {
        render() {
            return (
                <div>
                    <ul>
                        {this.props.todoList.todos.map(todo => (
                            <TodoView todo={todo} key={todo.id} />
                        ))}
                    </ul>
                </div>
            )
        }
    }
    ``` 
2. 主要组成
    1. state
        1. 普通对象(Plain Object)
            * 只有当前普通对象已经存在的属性才会转成可观测的，后面添加的新属性不会自动变成可观测的 
            * 属性的getter会自动转换成computed value, 效果和@computed相同
            * observable会递归遍历整个对象，遇到的对象的属性值还是一个对象时，属性值会继续被observable转换
            * 如果已有的属性被赋予一个新对象，新对象会自动被转换成可观测的对象
            ```js
            // mobx根据普通对象创建一个可观测的新对象
            import { observable, autorun } from 'mobx';

            var person = observable({
                name: 'Jack',
                age: 20,
                address: {
                    province: 'Shanghai'
                },
                get labelText() {
                    return `name:${person.name}, age:${person.age}`;
                }
            })

            // mobx.autorun会创建1个reaction自动响应state的变化
            // autorun(() => {
                // console.log(`name:${person.name}, age:${person.age}`)
            // })
            autorun(() => {
                console.log(person.labelText);
            })

            person.name = 'Tom'; // 输出: name: Tom, age: 20
            person.age = 25; // 输出: name: Tom, age: 25

            person.address.province = 'chengdu'; // 输出: name: Tom, age: 25
            person.district = 'Changning'; // 没有输出

            // 给可观测属性address赋新值
            person.address = {
                province: "Beijing",
                district: "Xicheng"
            }; // 输出: name: Tom, age: 25

            person.address.district = "Pudong"; // 输出: name: Tom, age: 25
            ```
            ```js
            class Person {
                @observable name = 'Jack';
                @observable age = 20;
            }
            var person = new Person();
            ```
        2. ES6 Map
            * 返回新的可观测的Map对象
            * 向Map对象中添加或删除新元素的行为也是可观测的
            ```js
            import { observable, autorun } from 'mobx';

            // 每一个元素代表Map对象中的一个键值对
            var map = new Map([['name', 'Jack'], ['age', 20]]);
            var person = observable(map);

            autorun(() => {
                console.log(`name: ${person.get('name')}, age: ${person.get('age')}, address: ${person.get('address')}`)
            })

            person.set('address', 'Shanghai');
            // 输出：name: Jack, age: 20, address: Shanghai
            ``` 
        3. 数组
            * 新的可观测数组，数组元素的增加或减少都会自动观测
            * observable作用数组类型时，也会递归数组中的每个元素对象
            ```js
            import { observable, autorun } from "mobx";

            var todos = observable([
                { text: "Learn React", finished: false },
                { text: "Learn Redux", finished: false }
            ]);

            autorun(() => console.log(`todo 1 : ${todos[0].text}, finished: ${todos[0].finished}`));

            todos[0].finished = true;
            // 输出: todo 1 : Learn React, finished: true
            ``` 
        4. 非普通对象
            * `observable`会返回一个特殊的boxed values类型的可观测对象
            * `boxed values`是保存一个指向原对象的引用, 对原对象的访问和修改需要通过新对象的get()和set()方法操作
            ```js
            import { observable, autorun } from 'mobx';

            function Person(name, age) {
                this.name = name;
                this.age = age;
            }

            var person = observable(new Person('Jack', 20));
            autorun(() => console.log(`name: ${person.get().name}, age: ${person.get().age}`));

            person.get().age = 25; // 没有输出, 因为person对象的属性不可观测

            // 引用发生变化，可观测
            // 输出: name: jack, age: 20
            person.set(new Person('jack', 20));
            ```
            * 将非普通对象转换成可观测的自定义构造函数的正确实现方式
            ```js
            import { observable, autorun } from 'mobx';

            class Person {
                @observable name;
                @observable age;

                constructor(name, age) {
                    this.name = name;
                    this.age = age;
                }
            }

            var person = new Person('jack', 20);
            autorun(() => console.log(`name: ${person.name}, age: ${person.age}`));

            // 输出: name:jack, age: 25
            person.age = 25;
            ```  
        5. 基础数据类型 
            * observable将接收的基础数据类型转换成可观测的`boxed values`类型的对象
            ```js
            import { observable, autorun } from 'mobx';

            const name = observable('jack');

            autorun(() => console.log(`name:${name.get()}`));

            name.set('Tom'); // 输出 name:Tom
            ```  
    2. computed value
        * computed value是根据state衍生出的新值
        * computed value采用延迟更新策略，只有被使用时才会自动更新
        * computed一般接收一个函数，用于修饰class的getter方法
        ```js
        import { observable, computed, autorun } from 'mobx';

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

        var person = new Person('jack', 20);
        autorun(() => console.log(`name:${person.name}, isYoung: ${person.isYoung}`));

        person.age = 25; // 输出: name:Jack, isYoung: false
        ``` 
    3. reaction
        * 自动响应state变化有副作用的函数，例如打印信息、发送网络请求、根据react组件树更新dom
        * observer/@observer
            ```js
            @observer class MyComponent extends React.Component { ... }
            ```
        * autorun
            * autorun接收到的函数会立即执行一次，以后的执行就依赖state的变化
            * autorun会返回一个清除函数disposer, 可以调用disposer清除副作用
            ```js
            var numbers = observable([1, 2, 3]);
            var sum = computed(() => numbers.reduce((a, b) => a + b, 0));

            var disposer = autorun(() => console.log(sum.get())); // 输出: 6
            numbers.push(4); // 输出: 10

            disposer();
            numbers.push(5); // 没有输出
            ```
        * reaction
            * 接收2个函数，第1个函数返回被观测的state, 这个返回值同时是第2个函数的输入值
            * 第1个函数的返回值发生变化时，第2个函数才会被执行
            * 第3个参数options提供可选的参数
            * `reaction`也会返回1个disposer
            ```js
            const todos = observable([
                {
                    title: 'Learn React',
                    done: true
                },
                {
                    title: 'Learn Mobx',
                    done: false
                }
            ])

            const reaction1 = reaction(
                () => todos.length,
                length => console.log('reaction1:', todos.map(todo => todo.title).join(", "))
            );

            const reaction2 = reaction(
                () => todos.map(todo => todo.title),
                titles => console.log('reaction2:', titles.join(", "))
            );

            // 输出: reaction1: learn react , learn mobx, learn redux
            // 输出: reaction2: learn react , learn mobx, learn redux
            todos.push({ title: 'learn redux', done: false });

            // 输出: reaction2: learn Something , learn mobx, learn redux
            todos[0].title = 'learn something';
            ``` 
        * when
            * condition会自动响应它使用的任何state的变化, condition返回true时，sideEffect会执行,只执行一次
            * when也会返回一个清除函数disposer
            ```js
            when(() => condition, () => { sideEffect })
            ```
            ```js
            class MyResource {
                constructor() {
                    when(
                        () => !this.isVisible,
                        () => this.dispose()
                    )
                }

                @computed get isVisible() {
                    // 判断某个元素是否可见
                }

                disposer() {
                    // 清除逻辑
                }
            }
            ``` 
        *  
    4. action
        * action时用来修改state的函数
        * 函数内部多次修改state时，action会执行批处理操作，只有当所有的修改都执行完成，
            才会通知相关的computed value和reaction
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
        * mobx提供了@action.bound帮助完成this绑定的工作      
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
3. mobx的常见误区
    * mobx追踪属性的访问来追踪值的变化，而不是直接追踪值的变化
    * mobx只追踪同步执行过程中的数据
    * observer创建的组件，只有当前组件的render方法中直接使用的数据才会被追踪
4. mobx-react, 在react中使用Mobx
    * Provider
        * 是1个React组件，利用React的context机制把应用所需的state传递给子组件
        * 和Redux的react-redux提供的Provider组件相同 
    * inject
        * 是1个高阶组件，和Provider结合使用
        * 从Provider提供的state选取所需的数据，作为props传递给目标组件
    * example
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
    * observer/@observer相当于重写了组件的`shouldComponentUpdate`, 尽可能的多使用，可以提高组件的渲染效率
    * 使用oberver/@observer的组件难以在不使用mobx的项目中复用组件