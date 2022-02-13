# 手写 mobx

## 1.实现发布订阅

```js
export default class EventEmitter {
  list = new WeakMap();
  on(obj, event, fn) {
    let targetObj = this.list.get(obj);
    if (!targetObj) {
      targetObj = {};
      this.list.set(obj, targetObj);
    }
    let target = targetObj[event];
    if (!target) {
      targetObj[event] = [];
      target = targetObj[event];
    }
    if (!target.includes(fn)) {
      target.push(fn);
    }
  }
  emit(obj, event, ...args) {
    const targetObj = this.list.get(obj);
    if (targetObj) {
      const fns = targetObj[event];
      if (fns && fns.length > 0) {
        fns.forEach((fn) => {
          fn && fn(...args);
        });
      }
    }
  }
}
```

## 2.实现 mobx

```js
const em = new EventEmitter();
let currentFn;

const autorun = (fn) => {
  //   currentFn = fn;
  //   fn();
  //   currentFn = null;
  const warpFn = () => {
    currentFn = warpFn;
    fn();
    currentFn = null;
  };
  warpFn();
};

const observable = (obj) => {
  return new Proxy(obj, {
    get: (target, propKey) => {
      if (typeof target[propKey] === "object") {
        return observable(target[propKey]);
      } else {
        if (currentFn) {
          em.on(target, propKey, currentFn);
        }
        return target[propKey];
      }
    },
    set: (target, propKey, value) => {
      if (target[propKey] !== value) {
        target[propKey] = value;
        em.emit(target, propKey);
      }
      return true;
    },
  });
};
```
