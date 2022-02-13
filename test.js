class EventEmitter {
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

const em = new EventEmitter();
let currentFn;

const autorun = (fn) => {
  console.log("7777");
  //   const warpFn = () => {
  //     currentFn = warpFn;
  //     console.log("aaaa");
  //     fn();
  //     console.log("bbbbb");
  //     currentFn = null;
  //     console.log("555555", currentFn);
  //   };
  //   warpFn();
  currentFn = fn;
  fn();
  currentFn = null;
};

const observable = (obj) => {
  return new Proxy(obj, {
    get: (target, propKey) => {
      if (typeof target[propKey] === "object") {
        return observable(target[propKey]);
      } else {
        console.log("11111", currentFn);
        if (currentFn) {
          console.log("ppppp", propKey);
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

const store = observable({ a: 1, b: { c: 1 } });

console.log("33333");

autorun(() => {
  console.log("6666");
  if (store.a === 2) {
    console.log(store.b.c);
  }
  console.log("88888");
});
console.log("444444");

store.a = 2;
console.log("rrrrr");
store.b.c = 5;
console.log("yyyyy");
store.b.c = 6;
