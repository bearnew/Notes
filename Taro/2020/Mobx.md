# Mobx
### 1. computed和getter
* @computed的意义在于它能够由MobX进行更智能的优化
* 如果你读取getValue的值，你通常会得到一个缓存的值，而不带@computed装饰器，则会重新计算
### 2.异步action
* action 中存在 setTimeout、promise 的 then 或 async 语句，并且在回调函数中某些状态改变了，那么这些回调函数也应该包装在 action 中
* https://cn.mobx.js.org/best/actions.html