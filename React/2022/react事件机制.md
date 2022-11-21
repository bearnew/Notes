# react事件机制
## 1.事件传播机制
1. 捕获阶段，事件从window开始，自上而下一直传播到目标元素的阶段
2. 目标阶段，事件真正的触发元素处理事件的阶段
3. 冒泡阶段，从目标元素开始，自下而上一直传播到window的阶段
4. `scroll`、`blur`、及各种媒体事件等没有冒泡阶段
## 2.react实现自己的事件机制
1. 将事件都代理到了根节点上，减少了事件监听器的创建，节省了内存
2. 磨平浏览器差异，开发者无需兼容多种浏览器写法。如想阻止事件传播时需要编写`event.stopPropagation()` 或 `event.cancelBubble = true`，在React中只需编写`event.stopPropagation()`即可。
3. 对开发者友好。只需在对应的节点上编写如`onClick`、`onClickCapture`等代码即可完成`click`事件在该节点上冒泡节点、捕获阶段的监听，统一了写法。
## 3.事件分类
- SimpleEventPlugin简单事件，代表事件onClick
- BeforeInputEventPlugin输入前事件，代表事件onBeforeInput
- ChangeEventPlugin表单修改事件，代表事件onChange
- EnterLeaveEnventPlugin鼠标进出事件，代表事件onMouseEnter
- SelectEventPlugin选择事件，代表事件onSelect
## 4.事件收集
```js
// React代码加载时就会执行以下js代码
SimpleEventPlugin.registerEvents();
EnterLeaveEventPlugin.registerEvents();
ChangeEventPlugin.registerEvents();
SelectEventPlugin.registerEvents();
BeforeInputEventPlugin.registerEvents();

// 上述代码执行完后allNativeEvents集合中就会有cancel、click等80种事件
allNativeEvents = ['cancel','click', ...]

// nonDelegatedEvents有cancel、close等29种事件
nonDelegatedEvents = ['cancel','close'，...]

// registrationNameDependencies保存react事件和其依赖的事件的映射
registrationNameDependencies = {
    onClick: ['click'],
    onClickCapture: ['click'],
    onChange: ['change','click','focusin','focusout','input','keydown','keyup','selectionchange'],
    ...
}
```
## 5.事件代理
- 事件委托代理到根的操作发生在`ReactDOM.render(element, container)`
- 事件委托的节点从React16的document更改为React17的React树的根DOM容器。
## 6.合成事件
- `SyntheticEvent`