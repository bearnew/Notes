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
