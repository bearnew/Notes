# Mobx
### 1. computed和getter
* @computed的意义在于它能够由MobX进行更智能的优化
* 如果你读取getValue的值，你通常会得到一个缓存的值，而不带@computed装饰器，则会重新计算
### 2.异步action
* action 中存在 setTimeout、promise 的 then 或 async 语句，并且在回调函数中某些状态改变了，那么这些回调函数也应该包装在 action 中
* https://cn.mobx.js.org/best/actions.html
### 3.@computed
* 想产生1个新值, 使用`@computed`, 想达到1个效果，使用`autorun`
* 如果一个计算值不再被观察了，例如使用它的UI不复存在了，MobX 可以自动地将其垃圾回收。而 autorun 中的值必须要手动清理才行，这点和计算值是有所不同的
* get方法生成的值，每次获取都会重新计算，但加上`@computed`后，计算中的数据没有更改，计算属性将不会重新运行，或者计算属性变化了，计算值没有被使用，也不会重新运行
### 4.autorun reaction when
* `autorun`方法会立即执行，并且函数中用到的每一个变量发生变化，都会触发
```js
// 一个简单的控制台日志功能
autorun(()=>{
    console.log(`Name changed: ${this.firstName}, ${this.lastName}`);
});
```
* `reaction`不会立即执行，只有被观察的变量发生第一次变化时，才会执行。
```js
reaction(()=>this.page, page => {
    switch(page) {
        case 'main':
            this.navigateToUrl('/');
            break;
        case 'profile':
            this.navigateToUrl('/profile');
            break;
        case 'admin':
            this.navigateToUrl('/admin');
            break;
    }
})
```
* `when`创建一次性的副作用
    * `autorun` 和 `reaction` 都会返回一个 `disposer` 函数
    * 可以触发 `disposer` 并且在任何时候取消那些副作用
    * `when` 方法在执行之后会自动 `dispose`, `when`只会出现一次
    * `when` 需要两个参数，和 `reaction` 类似。第一个参数（追踪函数）需要返回一个布尔值。当返回值为 `true`，`when` 方法的第二个参数（效果函数）会执行。
    ```js
    when(()=>this.reachedMilestone, ()=>{
        this.showMessage({ title: 'Congratulations', message: 'You did it!'});
    })
    ```
### 5.工具函数
1. `observe`监听
    ```js
    observe(this.todos, change => {
        this.disposers.forEach(disposer => disposer());
        this.disposers = [];

        for (let todo of change.object) {
            var disposer = observe(todo, changex => {
                console.log(changex);
            })

            this.disposers.push(disposer);
        }
    })
    ```
2. `spy`
    * 注册一个全局间谍监听器，用来监听所有 MobX 中的事件。 
    * 它类似于同时在所有的 observable 上附加了一个 observe 监听器，而且还通知关于运行中的事务/反应和计算
4. `toJS`
    * `toJS(value, options?)`
    * 递归地将一个(observable)对象转换为 javascript 结构
    * 支持 observable 数组、对象、映射和原始类型
5. `trace`
    * 帮助你查找为什么计算值、 reactions 或组件会重新计算
    * 传入 true 作为最后参数来自动地进入 debugger