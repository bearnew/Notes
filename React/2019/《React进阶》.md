## React进阶
### 一、基础篇
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
