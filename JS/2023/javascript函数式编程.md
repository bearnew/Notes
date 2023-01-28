# javascript 函数式编程

## 1.纯函数

1. 函数除了接受入参，纯纯的计算，啥也不干

```js
let a = 2;
// 非纯函数
function add(x) {
  return a + x;
}

// 非纯函数
function getToday() {
  return new Date().getDate();
}
```

2. 非纯函数会导致 **副作用** 和 **不确定性**
   - 不确定会导致难以调试，数据变化难以追随，计算结果难以复用
   - 副作用会改变函数外部的世界，多个函数改变到同一块信息，结果不可控
3. 纯函数是高度灵活的函数，它的计算逻辑在任何上下文里都是成立的。

## 2.不可变数据

1. 针对引用类型数据，使用拷贝代替修改
2. 拷贝方案缺点明显
   - 数据规模巨大、数据变化频繁的应用来说，拷贝意味着一场性能灾难。
   - 影响应用性能、挤占生存空间
3. git 快照
   - “快照”记录的并不是文件的内容，而是文件的索引
   - 对于那些没有发生变化的文件，git 保存他们原有的索引
   - 对于那些已经发生变化的文件，git 会保存变化后的文件的索引
4. 数据共享
   - 在 git 世界里，这个“变与不变”的区分是文件级别的；而在 Immutable.js 的世界里，这个“变与不变”可以细化到数组的某一个元素、对象的某一个字段。
   - 持久化数据结构在底层依赖了一种经典的基础数据结构，那就是 `Trie`(字典树）。

## 3.Immer.js，一个傻瓜式的 Immutability 解决方案

1. `Immer.js`的原理

```js
function produce(base, recipe) {
  // 预定义一个 copy 副本
  let copy;
  // 定义 base 对象的 proxy handler
  const baseHandler = {
    set(obj, key, value) {
      // 先检查 copy 是否存在，如果不存在，创建 copy
      if (!copy) {
        copy = { ...base };
      }
      // 如果 copy 存在，修改 copy，而不是 base
      copy[key] = value;
      return true;
    },
  };

  // 被 proxy 包装后的 base 记为 draft
  const draft = new Proxy(base, baseHandler);
  // 将 draft 作为入参传入 recipe
  recipe(draft);
  // 返回一个被“冻结”的 copy，如果 copy 不存在，表示没有执行写操作，返回 base 即可
  // “冻结”是为了避免意外的修改发生，进一步保证数据的纯度
  return Object.freeze(copy || base);
}
```

```js
// 这是我的源对象
const baseObj = {
  a: 1,
  b: {
    name: "修言",
  },
};

// 这是一个执行写操作的 recipe
const changeA = (draft) => {
  draft.a = 2;
};

// 这是一个不执行写操作、只执行读操作的 recipe
const doNothing = (draft) => {
  console.log("doNothing function is called, and draft is", draft);
};

// 借助 produce，对源对象应用写操作，修改源对象里的 a 属性
const changedObjA = produce(baseObj, changeA);
// 借助 produce，对源对象应用读操作
const doNothingObj = produce(baseObj, doNothing);

// 答案为 true
console.log(baseObj === doNothingObj);
// 答案为 false
console.log(baseObj === changedObjA);
// 输出为 true，说明不会发生变化，数据共享，避免内存浪费
console.log(baseObj.b === changedObjA.b);
// 输出为 true，说明不会发生变化
console.log(baseObj.b === changedObjA.b);
```

## 4.compose/pipe

1. pipe

```js
// 使用展开符来获取数组格式的 pipe 参数
function pipe(...funcs) {
  function callback(acc, func) {
    return func(acc);
  }

  return function (param) {
    return funcs.reduce(callback, param);
  };
}
```

```js
function add4(num) {
  return num + 4;
}

function multiply3(num) {
  return num * 3;
}

function divide2(num) {
  return num / 2;
}

const compute = pipe(add4, multiply3, divide2);
// 输出 21
console.log(compute(10));
```

2. compose：倒序的 pipe

```js
// 使用展开符来获取数组格式的 pipe 参数
function compose(...funcs) {
  function callback(input, func) {
    return func(input);
  }

  return function (param) {
    return funcs.reduceRight(callback, param);
  };
}
```
