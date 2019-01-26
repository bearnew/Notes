## react高阶组件
* 高阶组件就是接受一个组件作为参数并返回一个新组件的函数
* 高阶组件是一个函数，并不是组件
* 多个组件需要相同功能时，使用高阶组件减少重复实现
* 高阶组件示例
* react-redux中的connect
    ```js
    export default connect(mapStateToProps, mapDispatchToProps)(Header);
    ```
### 1.高阶组件最简单的实现
* 组件A
```js
import React, { Component } from 'react';
export default function A(WrappedComponent) {
    return class A extends Component {
        render() {
            return (
                <div className="A-wrapper">
                    <div>这是一个弹窗</div>
                    <WrappedComponent />
                </div>
            )
        }
    }
}
```
* 组件B
```js
import React, { Component } from 'react';
class B extends Component {
    render() {
        return (
            <div>这是弹窗B</div>
        )
    }
}

export default A(B);
```
* 组件C
```js
import React, { Component } from 'react';
class C extends Component {
    render() {
        return (
            <div>这是弹窗C</div>
        )
    }
}

export default A(C);
```
### 2.通过装饰器来实现高阶组件
create-react-app中，需暴露出npm包
```js
npm run eject
```
首先，安装依赖
```js
cnpm i -D babel-prest-stage-2
cnpm i -D babel-preset-react-native-stage-0
```
根目录下.babelrc配置
```js
{
    "presets": ["react-native-stage-0/decorator-support"]
}
```
使用
```js
@A
export default class B extends Component {
    render() {
        return (
            <div>这是组件B</div>
        )
    }
}
```
### 3.代理方式的高阶组件
* 操纵props
* 抽取状态
* 访问ref
* 包装组件
根组件
```js
export default class App extends Component {
    render() {
        return (
            <div>
                <B
                    name='张三'
                    age={18}
                />
            </div>
        )
    }
}
```
组件A
```js
import React, { Component } from 'react';

export default title => WrappedComponent => class A extends Component {
    constructor(props) {
        super(props);
        this.state={
            value: ''
        }
    }
    onInputChange = e => {
        this.setState({
            value: e.target.value
        })
    }
    refc(instance) {
        instance.getName && alert(instance.getName())
    }
    render() {
        const {
            age,
            ...otherProps
        } = this.props;
        return (
            <div>
                <div>{title}</div>
                <WrappedComponent
                    sex='男'
                    {...otherProps}
                    ref={this.refc.bind(this)}
                    value={this.state.value}
                    onInputChange={this.onInputChange}
                />
            </div>
        )
    }
}
```
组件B
```js
class B extends Component {
    getName() {
        return '我是B组件'
    }
    render() {
        return(
            <div>
                我的名字是:{this.props.name}
                我的年龄是:{this.props.age}
                我的性别是:{this.props.sex}
            </div>
        )
    }
}
export default A('提示')(B);
```
### 4.继承方式的高阶组件
* 操纵props
* 操纵生命周期函数
组件A
```js
export default A = WrappedComponent => class NewComponent extends WrappedComponent {
    static displayName = `NewComponent(${this.getDisplayName(WrappedComponent)})`
    ComponentWillMount() {
        alert('我是修改后的生命周期') // 会覆盖B组件的生命周期
    }
    getDisplayName(WrappedComponent) {
        return WrappedComponent.displayName || WrappedComponent.name || 'Component'
    }
    render() {
        const element = super.render();
        return React.cloneElement(element, this.props, element.props.children)
    }
}
```
组件B
```js
@A
export default B extends Component {
    ComponentWillMount() {
        alert('我是修改前的生命周期')
    }
    render() {
        return (
            <div>我是组件B</div>
        )
    }
}
```