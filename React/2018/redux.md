### immer
##### 1. redux中操作state,不改变引用类型数据的原始值，需要使用深拷贝。
##### 2. 用...扩展符只能断掉一层引用。
##### 3. 自定义函数循环遍历，开销太大。
```js
function deepClone(a) {
  const keys = Object.keys(a)
  return keys.reduce((memo, current) => {
    const value = a[current]
    if (typeof value === 'object') {
      return {
        ...memo,
        [current]: deepClone(value),
      }
    }
    return {
      ...memo,
      [current]: value,
    }
  }, {})
}
```
##### 4. immutable-js 使用了另一套数据结构的 API ，与我们的常见操作有些许不同，它将所有的原生对象都会转化成 immutable-js 的内部对象，并且任何操作最终都会返回一个新的 immutable 的值。
##### 5. 实现 immutable 的库其实是 immer。
normal
```js
const byId = (state, action) => {
  switch (action.type) {
    case RECEIVE_PRODUCTS:
      return {
        ...state,
        ...action.products.reduce((obj, product) => {
          obj[product.id] = product
          return obj
        }, {})
      }
    default:
      return state
  }
}

```
immer
```js
import produce from 'immer'

const byId = (state, action) =>
  produce(state, draft => {
    switch (action.type) {
      case RECEIVE_PRODUCTS:
        action.products.forEach(product => {
          draft[product.id] = product
        })
    }
  })
```
##### 6. immer原理
```js
// state
class Store {
  constructor(state) {
    this.modified = false
    this.source = state
    this.copy = null
  }
  get(key) {
    if (!this.modified) return this.source[key]
    return this.copy[key]
  }
  set(key, value) {
    if (!this.modified) this.modifing()
    return this.copy[key] = value
  }
  modifing() {
    if (this.modified) return
    this.modified = true
    this.copy = Array.isArray(this.source)
      ? this.source.slice()
      : { ...this.source }
  }
}

// proxy
const PROXY_FLAG = '@@SYMBOL_PROXY_FLAG'
const handler = {
  get(target, key) {
    if (key === PROXY_FLAG) return target
    return target.get(key)
  },
  set(target, key, value) {
    return target.set(key, value)
  },
}

// produce
function produce(state, producer) {
  const store = new Store(state)
  const proxy = new Proxy(store, handler)

  producer(proxy)

  const newState = proxy[PROXY_FLAG]
  if (newState.modified) return newState.copy
  return newState.source
}

```
### selector
##### 1.用于解决计算参数需要依赖多个不同领域state的情况
##### 2.设计数据库一样设计state，selector就相当于查询表的sql语句，reducer相当于修改表的sql语句。
```js
import { createSelector } from 'reselect'

const getVisibilityFilter = (state) => state.visibilityFilter
const getTodos = (state) => state.todos

export const getVisibleTodos = createSelector(
  [ getVisibilityFilter, getTodos ],
  (visibilityFilter, todos) => {
    switch (visibilityFilter) {
      case 'SHOW_ALL':
        return todos
      case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed)
      case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed)
    }
  }
)
```