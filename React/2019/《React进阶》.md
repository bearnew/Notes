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

