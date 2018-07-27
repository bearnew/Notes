## 减少react不必要的渲染
#### 原因
某个子组件用到的数据在父组件得到更新，其他所有子组件（包括未用到更新数据的子组件）都将会进行重新render

![组件render](https://github.com/bear-new/picture/blob/master/mardown/2018-07-27%20pureRender/render.jpg?raw=true)

#### 解决办法
##### 1.使用Mobx 
[mobx中文文档 - 传送门](https://cn.mobx.js.org/)
##### 2.使用shouldComponentUpdate
* __常规做法__
```js
//在render函数调用前判断：如果前后state中Number不变，通过return false阻止render调用
  shouldComponentUpdate(nextProps,nextState){
      if(nextProps.Number == this.props.Number){
        return false
      }
  }
```
* __使用```react-addons-pure-render-mixin```__
> 原理：借助react0.14.6的PureRenderMixin下重写shouldComponent方法

用法：
```js
import PureRenderMixin from 'react-addons-pure-render-mixin';

constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    
    this.state = {};
}
```
* __copy__

```js
var ReactComponentWithPureRenderMixin = {
  shouldComponentUpdate: function(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
};

function shallowCompare(instance, nextProps, nextState) {
  return (
    !shallowEqual(instance.props, nextProps) ||
    !shallowEqual(instance.state, nextState)
  );
}

function shallowEqual(objA, objB, compare, compareContext) {
  var ret = compare ? compare.call(compareContext, objA, objB) : void 0;

  if (ret !== void 0) {
    return !!ret;
  }

  if (objA === objB) {
    return true;
  }

  if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

  // Test for A's keys different from B.
  for (var idx = 0; idx < keysA.length; idx++) {
    var key = keysA[idx];

    if (!bHasOwnProperty(key)) {
      return false;
    }

    var valueA = objA[key];
    var valueB = objB[key];

    ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;

    if (ret === false || (ret === void 0 && valueA !== valueB)) {
      return false;
    }
  }

  return true;
};

module.exports = ReactComponentWithPureRenderMixin;
```
