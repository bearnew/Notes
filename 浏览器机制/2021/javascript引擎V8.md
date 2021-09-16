# javascript 引擎 V8

## 1.V8

1. ![js设计思想](https://github.com/bearnew/picture/blob/master/markdown_v2/2021/javascript%E5%BC%95%E6%93%8Ev8/js%E8%AE%BE%E8%AE%A1%E6%80%9D%E6%83%B3.PNG?raw=true)
2. ![V8编译流水线](https://github.com/bearnew/picture/blob/master/markdown_v2/2021/javascript%E5%BC%95%E6%93%8Ev8/V8%E7%BC%96%E8%AF%91%E6%B5%81%E6%B0%B4%E7%BA%BF.PNG?raw=true)
3. `V8` 是一个由 `Google` 开发的开源 `JavaScript` 引擎，目前用在 `Chrome` 浏览器和 `Node.js`中，其核心功能是执行易于人类理解的 `JavaScript` 代码。
   - 苹果公司在 `Safari` 中就是用 `JavaScriptCore` 虚拟机
   - `Firefox` 使用了`TraceMonkey` 虚拟机
   - `Chrome` 则使用了 `V8` 虚拟机
4. `V8`在编译阶段将`js`代码转换成机器能够理解的机器代码，在执行阶段执行转换后的代码并输出执行结果
5. 计算机只能识别二进制指令，所以要让计算机执行一段高级语言通常有两种手段，第一种是将高级代码转换为二进制代码，再让计算机去执行；另外一种方式是在计算机安装一个解释器，并由解释器来解释执行。
6. V8 并没有采用某种单一的技术，而是混合编译执行和解释执行这两种手段，我们把这种混合使用编译器和解释器的技术称为 JIT（Just In Time）技术。
7. 解释执行的启动速度快，但是执行时的速度慢，而编译执行的启动速度慢，但是执行时的速度快
8. v8 优先采用解释执行策略，如果某段代码的执行频率超过一个值，V8 采用优化编译器将代码编译成执行效率更高效的机器代码
9. V8 执行 js 的流程
   1. 初始化基础环境
   2. 解析源码生成 AST 和作用域
   3. 依据 AST 和作用域生成字节码
   4. 解释执行字节码
   5. 监听热点代码
   6. 优化热点代码为二进制的机器代码
   7. 反优化生成的二进制的机器代码（V8 是一门动态语言，在运行过程中，某些被优化的结构可能会被 JavaScript 动态修改了，这会导致之前被优化的代码失效，如果某块优化之后的代码失效了，那么编译器需要执行反优化操作）

## 2.js 函数即对象

1. js 中的函数是一种特殊的对象，js 中的函数称为一等公民
2. js 不是一门面向对象的语言，面向对象语言天生支持封装、继承、多态，但是 `JavaScript` 并没有直接提供多态的支持
3. 函数除了可以拥有常用类型的属性值之外，还拥有两个隐藏属性，分别是 `name` 属性和 `code` 属性。
4. 函数对象的默认的 `name` 属性值就是 `anonymous`，表示该函数对象没有被设置名称。
5. 另一个隐藏属性是 `code` 属性，其值表示函数代码，以字符串的形式存储在内存中。当执行到一个函数调用语句时，`V8` 便会从函数对象中取出 `code` 属性值，也就是函数代码，然后再解释执行这段函数代码。

## 3.快属性和慢属性

1. 数字属性应该按照索引值大小升序排列，数字属性称为排序属性，在 V8 中被称为 `elements`
2. 字符串属性根据创建时的顺序升序排列，字符串属性就被称为常规属性，在 V8 中被称为 `properties`
3. 执行索引操作，那么 `V8` 会先从 `elements` 属性中按照顺序读取所有的元素，然后再在 `properties` 属性中读取所有的元素，这样就完成一次索引操作。
4. 部分常规属性直接存储在对象本身，称为对象内属性（保存在线性数据结构中的快属性）
5. 对象内属性的数量是固定的，默认是 10 个，超出的属性会被放入常规属性中（保存在非线性数据结构词典中的慢属性）

```js
// index:1 value:test-1
// index:3 value:test-3
// index:5 value:test-5
// index:8 value:test-8
// index:9 value:test-9
// index:50 value:test-50
// index:100 value:test-100
// index:B value:bar-B
// index:A value:bar-A
// index:C value:bar-C

function Foo() {
  this[100] = "test-100";
  this[1] = "test-1";
  this["B"] = "bar-B";
  this[50] = "test-50";
  this[9] = "test-9";
  this[8] = "test-8";
  this[3] = "test-3";
  this[5] = "test-5";
  this["A"] = "bar-A";
  this["C"] = "bar-C";
}
var bar = new Foo();
for (key in bar) {
  console.log(`index:${key} value:${bar[key]}`);
}
```

## 4.函数表达式

1. 函数声明

```js
// 在编译阶段，解析到函数声明，会转换成内存中的对象，放到作用域中
foo();
function foo() {
  console.log("foo");
}
```

2. 函数表达式

```js
// 解析到变量声明，也会放到作用域中，但是会将值设为undefined
foo();
// 在编译阶段，v8并不会处理函数表达式，因此foo为undefined
var foo = function () {
  console.log("foo");
};
```

3. 表达式会返回 1 个值，语句是操作
4. 表达式是不会在编译阶段执行的
5. 函数是对象，在编译阶段，V8 就会将整个函数对象提升到作用域中，并不是给该函数名称赋一个 undefined。
6. 一个函数表达式可以被用作一个即时调用的函数表达式——`IIFE（ImmediatelyInvoked Function Expression）`。

```js
// ()里面定义一个函数，V8把这个函数看成是函数表达式，执行时会返回一个函数对象
// 在表达式后面加上调用括号，就变成了立即调用函数表达式
(function () {
  //statements
})();
```

7. 立即执行函数的好处
   1. 函数立即表达式也是一个表达式，所以 V8 在编译阶段，并不会为该表达式创建函数对象。这样的一个好处就是不会污染环境，函数和函数内部的变量都不会被其他部分的代码访问到。
   2. 使用函数立即表达式就可以将我们内部变量封装起来，避免了相互之间的变量污染。
8. 函数立即表达式是立即执行的，所以将一个函数立即表达式赋给一个变量时，不是存储 IIFE 本身，而是存储 IIFE 执行后返回的结果

```js
var a = (function () {
  return 1;
})();
```

## 5.V8 如何实现对象继承的

1. 利用 `__proto__` 实现继承

```js
var animal = {
  type: "Default",
  color: "Default",
  getInfo: function () {
    return `Type is: ${this.type}，color is ${this.color}.`;
  },
};
var dog = {
  type: "Dog",
  color: "Black",
};
dog.__proto__ = animal;

// Type is: Dog，color is Black.
console.log(dog.getInfo());
```

2. 我们不应该直接通过 _proto_ 来访问或者修改该属性

- 首先，这是隐藏属性，并不是标准定义的。
- 其次，使用该属性会造成严重的性能问题。

3. 构造函数创建对象，实现继承

```js
function DogFactory(type, color) {
  this.type = type;
  this.color = color;
}

// V8引擎实现
// var dog = {}
// dog.__proto__ = DogFactory.prototype
// DogFactory.call(dog,'Dog','Black')
var dog = new DogFactory("Dog", "Black");
```

## 6.作用域链：V8 是如何查找变量的？

1. 变量查找

```js
var name = "极客时间";
var type = "global";
function foo() {
  var name = "foo";
  console.log(name);
  console.log(type);
}
function bar() {
  var name = "bar";
  var type = "function";
  foo();
}

// foo
// global
bar();
```

```js
var x = 4;
var test;
function test_scope() {
  var name = "foo";
  console.log(name);
  console.log(type);
  console.log(test);
  var type = "function";
  // 这里相当于执行this.test = 1
  test = 1;
  console.log(x);
}
// foo
// undefined
// undefined
// 4
test_scope();
```

2. 断点调试，可以看到浏览器`Scope`中包含`Local`作用域和`Global`作用域
3. 全局作用域是在 V8 启动过程中就创建了，且一直保存在内存中不会被销毁的，直至 V8 退出。
   - 全局的 this 值
   - 浏览器，全局作用域中还有 `window`、`document`、`opener` 等非常多的方法和对象
   - `node` 环境，那么会有`Global`、`File` 等内容。
4. 而函数作用域是在执行该函数时创建的，当函数执行结束之后，函数作用域就随之被销毁掉了。
5. `JavaScript` 是基于词法作用域的，词法作用域就是指，查找作用域的顺序是按照函数定义时的位置来决定的，所以我们也将词法作用域称为静态作用域
   - 作用域查找顺序都是按照当前函数作用域–> 全局作用域这个路径来的

## 7.类型转换：V8 是怎么实现 1+“2”的？

1. 对机器语言来说，所有的数据都是一堆二进制代码，CPU 处理这些数据的时候，并没有类型的概念，CPU 所做的仅仅是移动数据，比如对其进行移位，相加或相乘
2. V8 变量相加的转换过程
3. `V8` 会提供了一个 `ToPrimitve` 方法，其作用是将 a 和 b 转换为原生数据类型
4. 先检测该对象中是否存在 `valueOf` 方法，如果有并返回了原始类型，那么就使用该值进行强制类型转换
5. 如果 `valueOf` 没有返回原始类型，那么就使用 `toString` 方法的返回值；
6. 如果 `vauleOf` 和 `toString` 两个方法都不返回基本类型值，便会触发一个 `TypeError` 的错误。

```js
var Obj = {
  toString() {
    return "200";
  },
  valueOf() {
    return 100;
  },
};

// 103
console.log(Obj + 3);
```

```js
var Obj = {
  toString() {
    return new Object();
  },
  valueOf() {
    return new Object();
  },
};

// Uncaught TypeError: Cannot convert object to primitive value
console.log(Obj + 3);
```

## 8.答疑：如何构建和使用 V8 的调试工具 d8？

1. `d8` 是个非常有用的调试工具，能够帮助我们发现我们的代码是否可以被 `V8` 高效地执行，
   比如通过 `d8` 查看代码有没有被 `JIT` 编译器优化，还可以通过 `d8`内置的一些接口查看更多
   的代码内部信息，而且通过使用 `d8`，我们会接触各种实际的优化策略，学习这些策略并结
   合 `V8` 的工作原理，可以让我们更加接地气地了解 `V8` 的工作机制。
2. 通过源码来构建 `d8` 的流程比较简单，首先下载 `V8` 的编译工具链：`depot_tools`，然后再
   利用 `depot_tools` 下载源码、生成工程、编译工程，这就实现了通过源码编译 `d8`。

## 9.运行时环境：运行 JavaScript 代码的基石

1. 宿主环境
   - 浏览器宿主环境
   - `NodeJs`宿主环境
2. 不规范的代码触发频繁垃圾回收或者函数执行时间过长，都会占用宿主环境主线程，影响程序执行效率
3. `Chrome`打开一个渲染进程，就会初始化 V8，同时初始化堆空间和栈空间
4. 栈空间是连续的，查找效率高，涉及到上下文相关的内容都会放到栈上
5. V8 对栈空间的大小会做限制，函数调用过深，V8 就会抛出栈溢出的错误

```js
function factorial(n){
  if(n === 1) {return 1;}
  return n*factorial(n-1);
}
// VM68:1 Uncaught RangeError: Maximum call stack size exceeded
console.log(factorial(50000)
```

6. 堆空间是一种树形的存储结构，用来存储对象类型的离散的数据
7. V8 的执行上下文用来维护执行当前代码的变量环境、词法环境和`this`关键字
8. 全局执行上下文在 V8 的生存周期内是不会被销毁的
9. 所有的任务都是运行在主线程的，在浏览器的页面中，V8 会和页面共用主线程，共用消息队列，所以如果 V8 执行一个函数过久，会影响到浏览器页面的交互性能
10. 事件循环系统主要用来处理任务的排队和任务的调度。
