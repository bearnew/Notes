# Mobx

### 1. computed 和 getter

-   @computed 的意义在于它能够由 MobX 进行更智能的优化
-   如果你读取 getValue 的值，你通常会得到一个缓存的值，而不带@computed 装饰器，则会重新计算

### 2.异步 action

-   action 中存在 setTimeout、promise 的 then 或 async 语句，并且在回调函数中某些状态改变了，那么这些回调函数也应该包装在 action 中
-   https://cn.mobx.js.org/best/actions.html

### 3.@computed

-   想产生 1 个新值, 使用`@computed`, 想达到 1 个效果，使用`autorun`
-   如果一个计算值不再被观察了，例如使用它的 UI 不复存在了，MobX 可以自动地将其垃圾回收。而 autorun 中的值必须要手动清理才行，这点和计算值是有所不同的
-   get 方法生成的值，每次获取都会重新计算，但加上`@computed`后，计算中的数据没有更改，计算属性将不会重新运行，或者计算属性变化了，计算值没有被使用，也不会重新运行

### 4.autorun reaction when

-   `autorun`方法会立即执行，并且函数中用到的每一个变量发生变化，都会触发

```js
// 一个简单的控制台日志功能
autorun(() => {
    console.log(`Name changed: ${this.firstName}, ${this.lastName}`);
});
```

-   `reaction`不会立即执行，只有被观察的变量发生第一次变化时，才会执行。

```js
reaction(
    () => this.page,
    (page) => {
        switch (page) {
            case "main":
                this.navigateToUrl("/");
                break;
            case "profile":
                this.navigateToUrl("/profile");
                break;
            case "admin":
                this.navigateToUrl("/admin");
                break;
        }
    },
);
```

-   `when`创建一次性的副作用
    -   `autorun` 和 `reaction` 都会返回一个 `disposer` 函数
    -   可以触发 `disposer` 并且在任何时候取消那些副作用
    -   `when` 方法在执行之后会自动 `dispose`, `when`只会出现一次
    -   `when` 需要两个参数，和 `reaction` 类似。第一个参数（追踪函数）需要返回一个布尔值。当返回值为 `true`，`when` 方法的第二个参数（效果函数）会执行。
    ```js
    when(
        () => this.reachedMilestone,
        () => {
            this.showMessage({
                title: "Congratulations",
                message: "You did it!",
            });
        },
    );
    ```

### 5.工具函数

1. `observe`监听

    ```js
    observe(this.todos, (change) => {
        this.disposers.forEach((disposer) => disposer());
        this.disposers = [];

        for (let todo of change.object) {
            var disposer = observe(todo, (changex) => {
                console.log(changex);
            });

            this.disposers.push(disposer);
        }
    });
    ```

2. `spy`
    - 注册一个全局间谍监听器，用来监听所有 MobX 中的事件。
    - 它类似于同时在所有的 observable 上附加了一个 observe 监听器，而且还通知关于运行中的事务/反应和计算
3. `toJS`
    - `toJS(value, options?)`
    - 递归地将一个(observable)对象转换为 javascript 结构
    - 支持 observable 数组、对象、映射和原始类型
4. `trace`
    - 帮助你查找为什么计算值、 reactions 或组件会重新计算
    - 传入 true 作为最后参数来自动地进入 debugger

### 6.mobx 性能优化

-   细粒度拆分视图组件
-   使用专用组件处理列表
-   尽可能晚的解构可观察数据

### 7.和 redux 区别

1. `redux`每次返回一个全新的状态，搭配实现对象`immutable`的库来使用
    - `redux`函数式编程
    - `redux`每次更新创建创建新的`state`对象，开销比`mobx`更大
    - `Mobx` 在上手程度上，要优于 `Redux` ，比如 `Redux` 想使用异步，需要配合中间价，流程比较复杂。
    - `Redux` 对于数据流向更规范化，`Mobx` 中数据更加多样化，允许数据冗余。
    - `Redux` 可拓展性比较强，可以通过中间件自定义增强 `dispatch` 。
    - 在 `Redux` 中，基本有一个 `store` ，统一管理 `store` 下的状态，在 `mobx` 中可以有多个模块，可以理解每一个模块都是一个 `store` ，相互之间是独立的。
2. `mobx`每次都修改同一个状态对象，基于响应式代理
    - 面向对象，使用`class`
    - `get`把依赖收集起来，属性变成了`this[$mobx].getObservablePropValue_(key)`
    - `set`修改时通知所有的依赖做更新，属性变成了`this[$mobx].setObservablePropValue_(key, value)`
    - 代理以后的方法都变成了 `excuteAction`，执行方法会 `dispatch` 一个 `acition`。
    - `mobx` 创建了一个 `ObservableObjectAdministration` 的对象放到了 `$mobx` 属性上。

### 8.observable

1. `observable.deep`，默认的`observable`，会递归调用`observable(value)`
2. `observable.ref`，不可变对象，只追踪引用

```js
@observable.ref author = null
```

3. `observable.shallow`只对第 1 层调用`observable(value)`

### 9.配置装饰器

```js
{
    "plugins":[
         [
          "@babel/plugin-proposal-decorators",
          {
            "legacy": true,
            "loose": true
          }
        ],
        "@babel/plugin-proposal-class-properties",
    ]
}
```

### 10.observable 精确的颗粒化收集

-   对于 `observable` 处理过的属性，每一个属性都会有 `ObserverValue` ，比如上面的结构会产生三个 `ObserverValue` ，分别对应 `object` ，`name` ，`mes` 。
-   当上面通过 `setName` 改变 `name` 属性的时候，只有组件 `A` 会更新。也就是 `name ObserverValue` 只收集了用到 `name` 的依赖项 `A` 组件。
-   调用 `setMes` 同理，只有组件 `B` 更新。 `mes ObserverValue` 只收集了 `B` 组件的依赖。
-   当上面通过 `setObject` 改变 `object` 的时候，即使 `object` 里面 `name` ，`mes` 的值没有变化，也会让组件 `A` ，组件 `B` ，组件 `C` ，全部渲染。`object` 的 `Observer` 同样收集了 `name` 的 `ObserverValue` 和 `mes` 的 `ObserverValue` 。

```js
class Root {
    // C组件使用
    @observable object = {
        name: "alien", // A组件使用
        mes: "let us learn React!", // B组件使用
    };
    @action setName(name) {
        this.object.name = name;
    }
    @action setMes(mes) {
        this.object.mes = mes;
    }
    @action setObject(object) {
        this.object = object;
    }
}
```

### 11.引用类型处理

1. `Proxy`：会把原始对象用 Proxy 代理，Proxy 会精确响应原始对象的变化，比如增加属性——给属性绑定 ObserverValue ，删除属性——给属性解绑 ObserverValue 等。
2. `ObservableAdministration`： 对于子代属性，会创建一个 ObservableAdministration，用于管理子代属性的 ObserverValue。
3. 对于外层 `Root` ，在 constructor 使用 makeObservable ，mobx 会默认给最外层的 Root 添加 ObservableAdministration 。

### 12.基本用法

1. `makeObservable`，让整个模块变成可响应式的

```js
constructor(){ makeObservable(this) }
```

2. `inject`，inject 高阶组件可以把 Provider 中的 mobx 模块，混入到组件的 props 中

```js
<Provider Root={Root}> {/* ... */} </Provider>
```

```js
@inject("Root")
class Index extends React.Component {}
```

### 13.原理

1. 绑定状态——`observable`

```js
// mobx/src/api/observable.ts
function createObservable(target, name, descriptor) {
    // 对于如上DEMO1，target——Root类，name——属性名称 authorInfo 或者 name ，descriptor——属性描述，枚举性，可读性等
    if (isStringish(name)) {
        /* 装饰器模式下 */
        target[Symbol("mobx-stored-annotations")][name] = {
            /* 向类的mobx-stored-annotations属性的name属性上，绑定 annotationType_ ， extend_ 等方法。 */
            annotationType_: "observable", //这个标签证明是 observable，除了observable，还有 action， computed 等。
            options_: null,
            make_, // 这个方法在类组件 makeObservable 会被激活
            extend_, // 这个方法在类组件 makeObservable 会被激活
        };
    }
}
```

```js
// mobx/src/types/createObservableAnnotation.ts
function make_(adm, key, descriptor) {
    /*  */
    return this.extend_(adm, key, descriptor);
}
function extend_(adm, key, descriptor) {
    return adm.defineObservableProperty_(key, descriptor, options);
}
```

2. 激活状态——`makeObservable`

```js
function makeObservable (target){ // target 模块实例——this
    const adm = new ObservableObjectAdministration(target) /* 创建一个管理者——这个管理者是最上层的管理者，管理模块下的observable属性 */
    target[Symbol("mobx administration")] = adm  /* 将管理者 adm 和 class 实例建立起关联 */
    startBatch()
    try{
        let annotations = target[Symbol("mobx-stored-annotations"] /* 上面第一步说到，获取状态 */
        Reflect.ownKeys(annotations)  /* 得到每个状态名称 */
        .forEach(key => adm.make_(key, annotations[key])) /* 对每个属性调用 */
    }finally{
        endBatch()
    }
}
```

3. 观察者属性管理者——`ObservableAdministration`

-   ![20230405194619-2023-04-05](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230405194619-2023-04-05.png)

```js
// mobx/src/types/observableobject.ts
class ObservableObjectAdministration{
    constructor(target_,values_){
        this.target_ = target_
        this.values_ = new Map() //存放每一个属性的ObserverValue。
    }
    /* 调用 ObserverValue的 get —— 收集依赖  */
    getObservablePropValue_(key){
        return this.values_.get(key)!.get()
    }
    /* 调用 ObserverValue的 setNewValue_   */
    setObservablePropValue_(key,newValue){
        const observable = this.values_.get(key)
        observable.setNewValue_(newValue) /* 设置新值 */
    }
    make_(key,annotation){ // annotation 为每个observable对应的配置项的内容，{ make_,extends }
        const outcome = annotation.make_(this, key, descriptor, source)
    }
    /* 这个函数很重要，用于劫持对象上的get,set */
    defineObservableProperty_(key,value){
        try{
            startBatch()
            const descriptor = {
                get(){      // 当我们引用对象下的属性，实际上触发的是 getObservablePropValue_
                   this.getObservablePropValue_(key)
                },
                set(value){ // 当我们改变对象下的属性，实际上触发的是 setObservablePropValue_
                   this.setObservablePropValue_(key,value)
                }
            }
            Object.defineProperty(this.target_, key , descriptor)
            const observable = new ObservableValue(value) // 创建一个 ObservableValue
            this.values_.set(key, observable)             // 设置observable到value中
        }finally{
            endBatch()
        }
    }
}
```

4. 依赖收集
    1. `ObservableValue`
    ```js
    // mobx/src/core/atom.ts
    class Atom {
        observers_ = new Set(); /* 存放每个组件的 */
        /* value改变，通知更新 */
        reportChanged() {
            startBatch();
            propagateChanged(this);
            endBatch();
        }
        /* 收集依赖 */
        reportObserved() {
            return reportObserved(this);
        }
    }
    ```
    ```js
    // mobx/src/types/observablevalue.ts
    class ObservableValue extends Atom {
        get() {
            //adm.getObservablePropValue_ 被调用
            this.reportObserved(); // 调用Atom中 reportObserved
            return this.dehanceValue(this.value_);
        }
        setNewValue_(newValue) {
            // adm.setObservablePropValue_
            const oldValue = this.value_;
            this.value_ = newValue;
            this.reportChanged(); // 调用Atom中reportChanged
        }
    }
    ```
5. 注入模块
    - `Provider`
    ```js
    // mobx-react/src/Provider.tsx
    const MobXProviderContext = React.createContext({});
    export function Provider(props) {
        /* ... */
        return (
            <MobXProviderContext.Provider value={value}>
                {children}
            </MobXProviderContext.Provider>
        );
    }
    ```
    - `inject`
    ```js
    function inject(...storeNames) {
        const Injector = React.forwardRef((props, ref) => {
            let newProps = { ...props };
            const context = React.useContext(MobXProviderContext);
            storeNames.forEach(function (storeName) {
                //storeNames - [ 'Root' ]
                if (storeName in newProps) return;
                if (!(storeName in context)) {
                    /* 将mobx状态从context中混入到props中。 */
                    newProps[storeName] = context[storeName];
                }
            });
            return React.createElement(component, newProps);
        });
        return Injector;
    }
    ```
6. 可观察组件` observer`(mobx-react)
    - `makeComponentReactive` 通过改造 `render` 函数，来实现依赖的收集
    - 每一个组件会创建一个 `Reaction`，`Reaction` 的第二个参数内部封装了更新组件的方法。那么如果触发可观察属性的 `set` ，那么最后触发更新的就是这个方法，对于类组件本质上就是的 `forceUpdate` 方法。
    - 对` render` 函数进行改造，改造成 `reactiveRender` ，在 `reactiveRender` 中，`reaction.track` 是真正的进行依赖的收集，`track` 回调函数中，执行真正的 `render` 方法，得到 `element` 对象 `rendering` 。
    ```js
    // mobx-react/src/observer.tsx
    function observer(componentClass) {
        /* componentClass 是类组件的情况 (函数组件我们暂且忽略) */
        return function makeClassComponentObserver() {
            const target = componentClass.prototype;
            const baseRender = target.render; /* 这个是原来组件的render */
            /* 劫持render函数 */
            target.render = function () {
                return makeComponentReactive.call(this, baseRender);
            };
        };
    }
    ```
    ```js
    // mobx-react/src/observerClass.ts
    function makeComponentReactive(){
        const baseRender = render.bind(this) // baseRender为真正的render方法
        /* 创建一个反应器，绑定类组件的更新函数 —— forceUpdate  */
        const reaction = new Reaction(`${initialName}.render()`,()=>{
            Component.prototype.forceUpdate.call(this) /* forceUpdate 为类组件更新函数 */
        })
        reaction["reactComponent"] = this    /* Reaction 和 组件实例建立起关联 */
        reactiveRender["$mobx"] = reaction
        this.render = reactiveRender
        function reactiveRender() { /* 改造的响应式render方法 */
            reaction.track(() => {  // track中进行真正的依赖收集
                try {
                    rendering = baseRender() /* 执行更新函数 */
                }
            })
            return rendering
        }
        return reactiveRender.call(this)
    }
    ```
7. 反应器——`Reaction`
    ```js
    // mobx/src/core/reaction.ts
    class Reaction {
        constructor(name_, onInvalidate_) {
            this.name_ = name_;
            this.onInvalidate_ =
                onInvalidate_; /* onInvalidate_ 里面有组件的forceUpdate函数，用于更新组件 */
        }
        onBecomeStale_() {
            this.schedule_(); /* 触发调度更新 */
        }
        /* 开启调度更新 */
        schedule_() {
            if (!this.isScheduled_) {
                this.isScheduled_ = true;
                globalState.pendingReactions.push(this);
                runReactions();
            }
        }
        /* 更新 */
        runReaction_() {
            startBatch();
            this.isScheduled_ = false;
            const prev = globalState.trackingContext;
            globalState.trackingContext = this;
            this.onInvalidate_(); /* 更新组件  */
            globalState.trackingContext = prev;
            endBatch();
        }
        /* 收集依赖 */
        track(fn) {
            startBatch();
            /* 第一阶段 */
            const prevTracking = globalState.trackingDerivation;
            globalState.trackingDerivation = this;
            /* 第二阶段 */
            const result = fn.call(context);
            globalState.trackingDerivation = prevTracking;
            /* 第三阶段 */
            bindDependencies(this);
        }
    }
    ```
8.
