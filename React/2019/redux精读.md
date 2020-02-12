## Redux
> 处理错综复杂的`state`状态
> https://blog.hhking.cn/2019/07/12/redux-interpretation/
## 1.redux中的核心API
```js
// store: {
//   dispatch,
//   subscribe,
//   getState,
//   replaceReducer
// },
createStore,
bindActionCreators,
combineReducers,
applyMiddleware,
compose
```
## 2.createStore
```js
import isPlainObject from './utils/isPlainObject';

export var ActionTypes = {
    INIT: '@@redux/INIT'
};

export default function createStore(reducer, initialState) {
    if (typeof reducer !== 'function') {
        throw new Error('Expected the reducer to be a function.');
    }

    var currentReducer = reducer;
    var currentState = initialState;
    var listeners = [];
    var isDispatching = false;

    function getState() {
        return currentState;
    }

    function subscribe(listener) {
        listeners.push(listener);
        var isSubscribed = true;

        return function unsubscribe() {
            if (!isSubscribed) {
                return;
            }

            isSubscribed = false;
            var index = listeners.indexOf(listener);
            listeners.splice(index, 1);
        };
    }

    function dispatch(action) {
        if (!isPlainObject(action)) {
            throw new Error(
                'Actions must be plain objects. ' +
                'Use custom middleware for async actions.'
            );
        }

        if (typeof action.type === 'undefined') {
            throw new Error(
                'Actions may not have an undefined "type" property. ' +
                'Have you misspelled a constant?'
            );
        }

        if (isDispatching) {
            throw new Error('Reducers may not dispatch actions.');
        }

        try {
            isDispatching = true;
            // 就是这一句啦, 将 currentState 设置为 reducer(currentState, action) 返回的值
            currentState = currentReducer(currentState, action);
        } finally {
            isDispatching = false;
        }

        // 如果有监听函数,就顺序调用
        listeners.slice().forEach(listener => listener());

        // 最后,返回传入的action
        return action;
    }

    function replaceReducer(nextReducer) {
        currentReducer = nextReducer;
        dispatch({ type: ActionTypes.INIT });
    }

    dispatch({ type: ActionTypes.INIT });

    return {
        dispatch,
        subscribe,
        getState,
        replaceReducer
    };
}
```
## 3.bindActionCreators
```js
// bindActionCreators.js 部分代码

// 这个方法的做用，其实就是一个简写的调用方法，方便使用
// 结果就是返回一个函数: `dispatch(actionCreator(xxx))`
function bindActionCreator(actionCreator, dispatch) {
  return function() {
    return dispatch(actionCreator.apply(this, arguments))
  }
}
```
## 4.compose
```js
// compose被appliMiddleware.js内部用于组合多个middleware组件；
export default function compose(...func) {
    if (func.length === 0) {
        return arg => arg
    }
    if (func.length === 1) {
        return funcs[0]
    }
    return funcs.reduce((a, b) => (...args) => a(b(...args)));

}
```
## 5.redux-thunk以及中间件原理
```js
// redux-thunk
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```
```js
function applyMiddleware(store, middlewares) {
  middlewares = middlewares.slice()
  middlewares.reverse()

  let dispatch = store.dispatch
  middlewares.forEach(middleware =>
    dispatch = middleware(store)(dispatch)
  )

  return Object.assign({}, store, { dispatch })
}
```
```js
// 将经过 logger 和 crashReporter 两个 middleware！
store.dispatch(addTodo('Use Redux'))
```
```js
import { createStore, combineReducers, applyMiddleware } from 'redux'

let todoApp = combineReducers(reducers)
let store = createStore(
  todoApp,
  // applyMiddleware() 告诉 createStore() 如何处理中间件
  applyMiddleware(logger, crashReporter)
)

const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

const crashReporter = store => next => action => {
  try {
    return next(action)
  } catch (err) {
    console.error('Caught an exception!', err)
    Raven.captureException(err, {
      extra: {
        action,
        state: store.getState()
      }
    })
    throw err
  }
}
```
## 6.react-redux
```js
// provider
export default class Provider extends Component {
    constructor(props) {
        super(props)

        // 获取store
        const { store } = props

        // 初始化state, storeState为初始的redux state
        this.state = {
            storeState: store.getState(),
            // 保存init store
            store
        }
    }

    render() {
        // ReactReduxContext为默认context, 点过去看一下默认值。 看 -> context.js文件，createContext参数是null
        const Context = this.props.context || ReactReduxContext

        // value 为this.state
        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        )
    }
}
```
```js
// connect.js

// 首先为以参数的形式为connect注入一些方法
export function createConnect({
    // connectAdvanced为react-redux暴露出的api
    connectHOC = connectAdvanced,
} = {}) {
    // connect方法
    return function connect(
        // 接受的四个参数
        mapStateToProps,
        mapDispatchToProps,
        mergeProps,
        {
            pure = true,  // 是否就行浅比较的配置
            strictEqual,  // 判断object引用, strictEqual(a, b)=> a === b
            shallowEqual, // 浅比较，上面介绍了
            ...extraOptions  // 其他配置项
        } = {}
    ) {
        // 一系列的方法执行，对三个参数的类型做了容错处理
        // 分别初始化了各自的参数mapStateToProps,mapDispatchToProps,mergeProps，注入了一些内部的默认参数和方法
        // 他们大致是这样的function： 
        // (dispatch, options) => initProxySelector() => mapToPropsProxy() => props
        const initMapStateToProps = match(...args)
        const initMapDispatchToProps = match(...args)
        const initMergeProps = match(...args)
        // 返回值由执行connectAdvanced获取,并传入初始化的initMapStateToProps等参数和pure等配置项
        return connectAdvanced(selectorFactory, {
            initMapStateToProps,
            initMapDispatchToProps,
            initMergeProps,
            pure,
            ...extraOptions
        })
    }
}

// 直接执行createConnect方法返回connect
export default createConnect()
```
