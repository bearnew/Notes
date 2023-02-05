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
## 5.偏函数、柯里化
1. 设计模式的开放封闭原则，对扩展开放，对修改封闭
2. 偏函数：通过固定函数的部分参数，生成参数数量更少的函数
3. 偏函数是1个n元函数变成一个m(m<n)元函数
  ```js
  // 定义一个包装函数，专门用来处理偏函数逻辑
  function wrapFunc(func, fixedValue) {
    // 包装函数的目标输出是一个新的函数
    function wrappedFunc(input){
      // 这个函数会固定 fixedValue，然后把 input 作为动态参数读取
      const newFunc = func(input, fixedValue)
      return newFunc
    }
    return wrappedFunc
  }
  const multiply3 = wrapFunc(multiply, 3)

  // 输出6
  multiply3(2)
  ```
4. 柯里化
  ```js
  function add(a, b) {
    return a + b
  }

  function multiply(a, b, c) {
    return a*b*c
  }

  function addMore(a, b, c, d) {
    return a+b+c+d
  }

  function divide(a, b) {
    return a/b
  }
  ```
  ```js
  // curry 函数借助 Function.length 读取函数元数
  function curry(func, arity=func.length) {
    // 定义一个递归式 generateCurried
    function generateCurried(prevArgs) {
      // generateCurried 函数必定返回一层嵌套
      return function curried(nextArg) {
        // 统计目前“已记忆”+“未记忆”的参数
        const args = [...prevArgs, nextArg]  
        // 若 “已记忆”+“未记忆”的参数数量 >= 回调函数元数，则认为已经记忆了所有的参数
        if(args.length >= arity) {
          // 触碰递归边界，传入所有参数，调用回调函数
          return func(...args)
        } else {
          // 未触碰递归边界，则递归调用 generateCurried 自身，创造新一层的嵌套
          return generateCurried(args)
        }
      }
    }
    // 调用 generateCurried，起始传参为空数组，表示“目前还没有记住任何参数”
    return generateCurried([])
  }
  ```
  ```js
  const curriedAdd = curry(add)
  const curriedMultiply = curry(multiply)
  const curriedAddMore = curry(addMore)
  const curriedDivide = curry(divide)

  const compute = pipe(
    curriedAdd(1), 
    curriedMultiply(2)(3), 
    curriedAddMore(1)(2)(3), 
    curriedDivide(300)
  )

  compute(3); // 10
  ```
  ## 6.盒子模型
  ```js
  function add4(num) {
    return num + 4
  }  

  function multiply3(num) {
    return num*3
  }  

  function divide2(num) {
    return num/2
  }
  
  const Box = x => ({
    map: f => Box(f(x)),
    valueOf: () => x
  })

  // 值为 21
  const computeBox = Box(10)
    .map(add4)
    .map(multiply3)
    .map(divide2)  
    .valueOf()
  ```
  ```js
    const isEmpty = x => x === undefined || x === null;
    const Maybe = x => ({
      map: f => isEmpty(x) ? Maybe(null) : Maybe(f(x)),  
      valueOf: () => x,  
      inspect: () => `Maybe {${x}}`
    })

    function add4(x) {
      return x + 4
    }  

    function add8(x) {
      x + 8
    }

    function toString(x) {
      return x.toString()
    }  

    function addX(x) {
      return x + 'X'
    }  

    function add10(x) {
      return x + '10'
    }

    const res = Maybe(10)
      .map(add4)
      .map(add8)
      .map(toString)
      .map(addX)  
      .inspect()

    // 输出 Maybe {null}
    console.log(res)
  ```
  ```js
  const Monad = x => ({
    map: f => Monad(f(x)),
    // flatMap 直接返回 f(x) 的执行结果
    flatMap: f => f(x),

    valueOf: () => x,
    inspect: () => `Monad {${x}}`,
  })
  ```
  