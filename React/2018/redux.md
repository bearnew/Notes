### React 更新原理

1. 普通的 class 组件，setState 就会重新渲染

```js
import { Component } from "react";

class Dong extends Component {
    constructor() {
        super();

        this.state = {
            a: {
                b: 1,
            },
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.state.a.b = 2;
            this.setState(this.state);
        }, 2000);
    }
    render() {
        // 先渲染成1，再渲染成2
        return <div>{this.state.a.b}</div>;
    }
}

export default Dong;
```

2. 继承 PureComponent 的 class 组件，setState 时会对比 props 和 state 本身变没变，还会对比 state 的每个 key 的值变没变，变了才会重新渲染

```js
import { PureComponent } from "react";

class Dong extends PureComponent {
    constructor() {
        super();

        this.state = {
            a: {
                b: 1,
            },
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.state.a.b = 2;
            this.setState(this.state);
        }, 2000);
    }
    render() {
        // 不会渲染成2
        return <div>{this.state.a.b}</div>;
    }
}

export default Dong;
```

```js
import { useEffect, useState } from "react";

function Dong() {
    const [state, setState] = useState({
        a: {
            b: 1,
        },
    });

    useEffect(() => {
        setTimeout(() => {
            state.a.b = 2;
            setState(state);
        }, 2000);
    }, []);

    // 不会渲染成2
    return <div>{state.a.b}</div>;
}

export default Dong;
```

3. function 组件在用 useState 的 setXxx 时，会对比 state 本身变没变，变了就会重新渲染

```js
import { PureComponent } from "react";

class Dong extends PureComponent {
    constructor() {
        super();

        this.state = {
            a: {
                b: 1,
            },
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                a: this.state.a,
            });
        }, 2000);
    }
    render() {
        // 只会打印1次render
        // sate变了，会比较state每个key的值，key值变了才会重新render
        console.log("render");
        return <div>{this.state.a.b}</div>;
    }
}

export default Dong;
```

```js
import { useEffect, useState } from "react";

function Dong() {
    const [state, setState] = useState({
        a: {
            b: 1,
        },
    });

    useEffect(() => {
        setTimeout(() => {
            setState({
                a: state.a,
            });
        }, 2000);
    }, []);

    // 打印2次render
    // state本身变了就会重新渲染
    console.log("render");
    return <div>{state.a.b}</div>;
}

export default Dong;
```

### immer

##### 1. redux 中操作 state,不改变引用类型数据的原始值，需要使用深拷贝。

##### 2. 用...扩展符只能断掉一层引用。

##### 3. 自定义函数循环遍历，开销太大。

```js
function deepClone(a) {
    const keys = Object.keys(a);
    return keys.reduce((memo, current) => {
        const value = a[current];
        if (typeof value === "object") {
            return {
                ...memo,
                [current]: deepClone(value),
            };
        }
        return {
            ...memo,
            [current]: value,
        };
    }, {});
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
                    obj[product.id] = product;
                    return obj;
                }, {}),
            };
        default:
            return state;
    }
};
```

immer

```js
import produce from "immer";

const byId = (state, action) =>
    produce(state, (draft) => {
        switch (action.type) {
            case RECEIVE_PRODUCTS:
                action.products.forEach((product) => {
                    draft[product.id] = product;
                });
        }
    });
```

##### 6. immer 原理

```js
// state
class Store {
    constructor(state) {
        this.modified = false;
        this.source = state;
        this.copy = null;
    }
    get(key) {
        if (!this.modified) return this.source[key];
        return this.copy[key];
    }
    set(key, value) {
        if (!this.modified) this.modifing();
        return (this.copy[key] = value);
    }
    modifing() {
        if (this.modified) return;
        this.modified = true;
        this.copy = Array.isArray(this.source)
            ? this.source.slice()
            : { ...this.source };
    }
}

// proxy
const PROXY_FLAG = "@@SYMBOL_PROXY_FLAG";
const handler = {
    get(target, key) {
        if (key === PROXY_FLAG) return target;
        return target.get(key);
    },
    set(target, key, value) {
        return target.set(key, value);
    },
};

// produce
function produce(state, producer) {
    const store = new Store(state);
    const proxy = new Proxy(store, handler);

    producer(proxy);

    const newState = proxy[PROXY_FLAG];
    if (newState.modified) return newState.copy;
    return newState.source;
}
```

### selector

##### 1.用于解决计算参数需要依赖多个不同领域 state 的情况

##### 2.设计数据库一样设计 state，selector 就相当于查询表的 sql 语句，reducer 相当于修改表的 sql 语句。

```js
import { createSelector } from "reselect";

const getVisibilityFilter = (state) => state.visibilityFilter;
const getTodos = (state) => state.todos;

export const getVisibleTodos = createSelector(
    [getVisibilityFilter, getTodos],
    (visibilityFilter, todos) => {
        switch (visibilityFilter) {
            case "SHOW_ALL":
                return todos;
            case "SHOW_COMPLETED":
                return todos.filter((t) => t.completed);
            case "SHOW_ACTIVE":
                return todos.filter((t) => !t.completed);
        }
    }
);
```
