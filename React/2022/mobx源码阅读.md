# mobx 源码阅读

## 1.目录结构

```
mobx
├─flow-typed // 全局接口类型
├─scripts
├─src
│  ├─api
│  ├─core
│  ├─types
│  └─utils
└─__tests__
    ├─mixed-versions
    ├─perf
    ├─v4
    │  └─base
    │      └─__snapshots__
    └─v5
        ├─base
        │  └─__snapshots__
        ├─flow
        └─utils
```

## 2.utils

1. 全局变量

   - `globalThis`: 通过定义标准的全局属性来整合越来越分散的访问全局对象的方式， ES2020 标准
   - `window`: 浏览器中
   - `self`: web work 中
   - `global`: node.js 中
   - example

   ```js
   declare const window: any
    declare const self: any

    const mockGlobal = {}

    export function getGlobal() {
        if (typeof globalThis !== "undefined") {
            return globalThis
        }
        if (typeof window !== "undefined") {
            return window
        }
        if (typeof global !== "undefined") {
            return global
        }
        if (typeof self !== "undefined") {
            return self
        }
        return mockGlobal
    }
   ```

2. once 方法

```js
export function once(func: Lambda): Lambda {
    let invoked = false
    return function () {
        if (invoked) {
            return
        }
        invoked = true
        return (func as any).apply(this, arguments)
    }
}
```

```js
export function registerListener(
  listenable: IListenable,
  handler: Function
): Lambda {
  const listeners =
    listenable.changeListeners_ || (listenable.changeListeners_ = []);
  listeners.push(handler);
  return once(() => {
    const idx = listeners.indexOf(handler);
    if (idx !== -1) {
      listeners.splice(idx, 1);
    }
  });
}
```

## 3.api
