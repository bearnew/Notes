# js 涨知识

## 1.constructor 返回值

- 常规构造函数

```js
function Foo(name, age) {
  // this 指向 Foo
  this.name = name;
  this.age = age;
  this.class = "class";
  // return this // 默认有这一行
}

// Foo 的实例
let f = new Foo("aa", 20);
```

- 构造函数 return 新数据，返回**非对象**类型不生效

```js
// 不返回
function People() {}
const people = new People(); // People {}

// 返回数字
function People() {
  return 1;
}
const people = new People(); // People {}

// 返回新对象
function Animal() {
  return {
    hello: "world",
  };
}
const animal = new Animal(); // { hello: 'world' }
```

## 2.call

- fn1.call.call(fn2) 等效于 fn2.call(undefined)。而且无论您加多少个 .call，效果也是一样的。

```js
function fn1() {
  console.log(1);
}

function fn2() {
  console.log(2);
}

fn1.call.call(fn2); // 2
```

## 3.es6 函数带默认参数时将生成声明作用域

```js
var x = 10;

function fn(
  x = 2,
  y = function () {
    return x + 1;
  }
) {
  var x = 5;
  return y();
}

fn(); // 3
```

## 4.函数表达式（非函数声明）中的函数名不可覆盖

- 如果设置 var CC = 123，加声明关键词是可以覆盖的。

```js
const c = function CC() {
  CC = 123;
  return CC;
};

c(); // Function
```

## 5.getter/setter 动态设置

```js
class Hello {
  _name = "lucy";

  getName() {
    return this._name;
  }

  // 静态的getter
  get id() {
    return 1;
  }
}

const hel = new Hello();

hel.name; // undefined
hel.getName(); // lucy

// 动态的getter
Hello.prototype.__defineGetter__("name", function () {
  return this._name;
});

Hello.prototype.__defineSetter__("name", function (value) {
  this._name = value;
});

hel.name; // lucy
hel.getName(); // lucy

hel.name = "jimi";
hel.name; // jimi
hel.getName(); // jimi
```

## 6.浮点数误差

```js
0.3 - 0.2 !== 0.1; // true
0.3 - 0.2 - 0.1 <= Number.EPSILON; // true
```

## 7.es6 重复解构对象

```js
const obj = {
  a: {
    b: 1,
  },
  c: 2,
};

const {
  a: { b },
  a,
} = obj;
```

## 8.对象===比较的是内存地址，而>=将比较转换后的值

```js
{} === {} // false

// 隐式转换 toString()
{} >= {}  // true
```

## 9.try/catch/finally 也有特定的执行顺序

- 在 try/catch 代码块中，如果碰到 return xxyyzz;关键词，
- 那么 xxyyzz 会先执行并把值放在临时变量里，
- 接着去执行 finally 代码块的内容后再返回该临时变量。
- 如果 finally 中也有 return aabbcc，那么会立即返回新的数据 aabbcc。

```js
function fn1() {
  console.log("fn1");
  return 1;
}

function fn2() {
  console.log("fn2");
  return 2;
}

function getData() {
  try {
    throw new Error("");
  } catch (e) {
    return fn1();
  } finally {
    return fn2();
  }
}

console.log(getData());

// 打印顺序: 'fn1', 'fn2', 2
```

## 10.数据超过了安全值就变得不安全了

```js
Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2; // true

// 等价于
2 ** 53 === 2 ** 53 + 1; // true
```

## 11.函数形参带默认值时，会改变一些认知

```js
function test(a, b = 1) {
  arguments[0] = 20;
  console.log(a); // 123
}
console.log(test.length); // 1

test(123); // 123
```

## 12.delete 操作符并不会直接释放内存，而是说它会使得 V8（Javascript）引擎中的 hidden class 失效，将该 object 变为一个通用的 slow object，这就使得执行速度有了很明显的降低

- 执行效率

```js
undefined > map.delete > delete > omit
```

- 设置成`undefined`

```js
obj.a = undefined;
```

- `omit`

```js
function omit(obj, key) {
  const [[key], ...others] = obj;
  return others;
}
```

- `map.delete`

```js
let map = new Map([["a", 1]]);
map.delete("a");
```

## 13.Proxy 不支持的判断

```js
// proxy不支持的浏览器

// Uncaught ReferenceError: Poxy is not defined
const isSupport = typeof Proxy === "function";

// false
const isSupport = typeof window.Proxy === "function";
```

## 14. promise await 中的变量

```js
var obj = {
  a: 1,
  add: function () {
    return new Promise((resolve) => {
      this.a = this.a + 1;
      resolve(this.a);
    });
  },
  log: async () => {
    const { a } = obj;
    console.log("11111", a);

    obj.add().then(() => {
      console.log("22222", a); // 1
      console.log("44444", obj.a); // 3
    });

    await obj.add();
    console.log("33333", a); // 1
    console.log("55555", obj.a); // 3
  },
};

obj.log();
```

```js
var obj = {
  a: 1,
  add: function () {
    return new Promise((resolve) => {
      this.a = this.a + 1;
      resolve(this.a);
    });
  },
  log: async () => {
    const { a } = obj;
    console.log("11111", a);

    await obj.add();
    console.log("33333", a); // 1
    console.log("55555", obj.a); // 2

    obj.add().then(() => {
      console.log("22222", a); // 1
      console.log("44444", obj.a); // 3
    });
  },
};

obj.log();
```
