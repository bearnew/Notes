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

## 10 | 机器代码：二进制机器码究竟是如何被 CPU 执行的？

1. cpu 执行二进制码

- ![二进制码](https://github.com/bearnew/picture/blob/master/markdown_v2/2021/javascript%E5%BC%95%E6%93%8Ev8/CPU%E6%89%A7%E8%A1%8C%E4%BA%8C%E8%BF%9B%E5%88%B6%E7%A0%81.PNG?raw=true)

2. 我们将汇编语言编写的程序转换为机器语言的过程称为“汇编”
3. 计算机硬件组成

- [计算机硬件](https://github.com/bearnew/picture/blob/master/markdown_v2/2021/javascript%E5%BC%95%E6%93%8Ev8/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A1%AC%E4%BB%B6.PNG?raw=true)

4. CPU 可以通过指定内存地址，从内存中读取数据，或者往内存中写入数据，有了内存地址，CPU 和内存就可以有序地交互。
5. 内存中的每个存储空间都有其对应的独一无二的地址
6. 一旦二进制代码被装载进内存，CPU 便可以从内存中取出一条指令，然后分析该指令，最后执行该指令。
7. 通用寄存器是 CPU 中用来存放数据的设备，不同处理器中寄存器的个数也是不一样的，之所要通用寄存器，是因为 CPU 访问内存的速度很慢，所以 CPU 就在内部添加了一些存储设备，这些设备就是通用寄存器
8. 通用寄存器容量小，读写速度快，内存容量大，读写速度慢。
9. 通用寄存器既可以存储数据，也可以存储指针。
10. rbp 寄存器通常用来存放栈帧指针的，rsp 寄存器用来存放栈顶指针的，PC 寄存器用来存放下一条要执行的指令等
11. CPU 加载指令：从内存中复制指定长度的内容到通用寄存器中
12. CPU 存储的指令：将通用寄存器内容复制到内存中
13. CPU 执行指令：将寄存器和内存内容复制到 ALU 中执行，执行完后放入另 1 个寄存器中
14. CPU 需要对数据执行读写操作，如果直接读写内存，那么会严重影响程序的执行性能，因此 CPU 就引入了寄存器，将一些中间数据存放在寄存器中，这样就能加速 CPU 的执行速度。
15. 通常有以下几种方式来使用寄存器，这包括了加载指令、存储指令、更新指令。

## 11 | 堆和栈：函数调用是如何影响到内存布局的？

1. 栈执行

```js
// 在同一个任务中重复调用嵌套的 foo 函数；
// 栈无线增加，导致栈溢出
function foo() {
  foo(); // 是否存在堆栈溢出错误?
}
foo();
```

```js
// 使用 setTimeout 让 foo 函数在不同的任务中执行；
// setTimeout会让foo函数在消息队列后面的任务执行，不会影响到当前栈结构
function foo() {
  setTimeout(foo, 0); // 是否存在堆栈溢出错误?
}
```

```js
// 在同一个任务中执行 foo 函数，但是却不是嵌套执行。
// 微任务，不会造成栈溢出，但会导致主线的卡死
function foo() {
  return Promise.resolve().then(foo);
}
foo();
```

2. 使用栈结构来管理函数调用
3. 函数资源分配和回收角度来看，被调用函数的资源分配总是晚于调用函数 (后进)，而函数资源的释放则总是先于调用函数 (先出)。
4. 栈的空间是连续的，分配空间和销毁空间只需要移动指针，速度非常快
5. 栈的空间是有限的，因此使用堆来存放大数据

## 12.延迟解析：V8 是如何实现闭包的？

1. 如果 V8 一次性解析 js 代码会占用非常大的内存，并且会增加用户的等待时间
2. V8 使用惰性解析
   - 遇到函数声明，会跳过函数内部的代码，只会将函数声明转换成函数对象，并不会解析和编译函数内部的代码，也不会生成 AST
   - 仅仅生成顶层代码的 AST 和字节码
3. 拆解闭包-js 的三个特性
   1. js 允许在函数内部定义新的函数
   2. 内部函数中能访问父函数中定义的变量
   3. 函数是一等公民，函数可作为返回值
4. V8 遇到函数会使用预解析器
   1. 对函数做快速的预解析，判断是否存在语法错误
   2. 检查函数内部是否引用了外部变量，引用了外部的变量，则会将栈中的变量复制到堆中，下次执行时，直接使用堆中的引用，执行结束后也不会释放该变量（目的时为了避免外层函数执行完毕后，销毁了变量，导致内存函数读取不到值）

## 13 | 字节码（一）：V8 为什么又重新引入字节码？

1. js 编译成二进制码
   - **时间问题**：编译时间过久，影响代码启动速度；
   - **空间问题**：缓存编译后的二进制代码占用更多的内存。
2. js 编译成字节码
   - 解决启动问题：编译生成字节码的时间很短；
   - 解决空间问题：字节码占用内存不多，缓存字节码会大大降低内存的使用；
   - 代码架构清晰：采用字节码，可以简化程序的复杂度，使得 V8 移植到不同的 CPU 架构平台更加容易。

## 14 ｜字节码（二）：解释器是如何解释执行字节码的？

1. v8 引擎的 2 种架构解释器

   - 基于栈的，基于栈的解释器会将一些中间数据存放到栈中
   - 基于寄存器的，而基于寄存器的解释器会将一些中间数据存放到寄存器中

2. V8 是基于寄存器的
   - 有一个特别的寄存器，那就是累加器。在操作过程中，一些中间结果都默认放到累加器中

## 15 | 隐藏类：如何在内存中快速查找对象属性？

1. js 是动态语言，对象属性执行过程中可以被修改，V8 查找对象属性时，需要经过一系列复杂步骤才能获取到对象属性
2. 为了加快查找对象属性速度，V8 为每个对象提供一个隐藏类
3. 在 V8 中，把隐藏类又称为 map，每个对象都有一个 map 属性，其值指向内存中的隐藏类。
4. 对象的形状发生改变，V8 会重建一个新的隐藏类给对象
5. 避免 V8 重构对象隐藏类的方法
   1. 创建同样的对象，保证顺序一致，这样就能共用隐藏类
   ```js
   let point = { x: 100, y: 200 };
   let point2 = { y: 100, x: 200 };
   ```
   2. 尽量一次性初始化完整对象属性，每次为对象添加属性，V8 都会给对象重新设置隐藏类
   3. 尽量避免使用`delete`方法，`delete`方法会破坏对象形状，导致 v8 为对象重新生成新的隐藏类

## 16 | 答疑： V8 是怎么通过内联缓存来提升函数执行效率的？

- V8 引入了 IC，IC 会监听每个函数的执行过程，并在一些关键的地方埋下监听点，
  这些包括了加载对象属性 (Load)、给对象属性赋值 (Store)、还有函数调用 (Call)，V8 会
  将监听到的数据写入一个称为反馈向量 (FeedBack Vector) 的结构中，同时 V8 会为每个
  执行的函数维护一个反馈向量。有了反馈向量缓存的临时数据，V8 就可以缩短对象属性的
  查找路径，从而提升执行效率。

## 17 | 消息队列：V8 是怎么实现回调函数的？

1. 回调函数

   - 同步回调函数在执行函数内部调用

   ```js
   var myArray = ["water", "goods", "123", "like"];
   function handlerArray(indexName, index) {
     console.log(index + 1 + ". " + indexName);
   }
   myArray.forEach(handlerArray);
   ```

   - 异步回调函数在执行函数外部调用

   ```js
   function foo() {
     alert("Hello");
   }
   setTimeout(foo, 3000);
   ```

2. UI 线程架构

   - ![UI线程架构](https://github.com/bearnew/picture/blob/master/markdown_v2/2021/javascript%E5%BC%95%E6%93%8Ev8/UI%E7%BA%BF%E7%A8%8B%E6%9E%B6%E6%9E%84.png?raw=true)
   - 从消息队列中取出事件执行

   ```js
   function UIMainThread() {
     while (queue.waitForMessage()) { Task task = queue.getNext() processNextMessage(task) } }
   ```

## 18 | 异步编程（一）：V8 是如何实现微任务的？

1. 调用栈
   - 调用栈是一种数据结构，用来管理在主线程上执行的函数的调用关系
   - 栈执行
   ```js
   function foo() {
     foo();
   }
   foo();
   ```
   - ![栈溢出](https://github.com/bearnew/picture/blob/master/markdown_v2/2021/javascript%E5%BC%95%E6%93%8Ev8/%E5%87%BD%E6%95%B0%E8%B0%83%E7%94%A8.png?raw=true)
2. 宏任务

   - 宏任务执行

   ```js
   // foo函数封装成宏任务，放入消息队列中
   // 主线程从消息队列中取出该任务，执行回调函数foo
   // foo函数执行完毕，V8结束当前宏任务，调用栈也会被清空
   // 继续重复取宏任务
   function foo() {
     setTimeout(foo, 0);
   }
   foo();
   ```

   - 宏任务执行时间过久，会影响到消息队列后面宏任务的执行

3. 微任务
   - 微任务能精准的控制回调函数的执行时机
   - V8 为每个宏任务维护一个微任务队列
   - V8 执行`js`时，会创建一个环境对象，微任务队列存放在环境对象中
   - `js`执行完毕后，环境对象被销毁
   ```js
   // V8每次执行微任务，都会退出当前foo函数的调用栈，不会造成栈溢出
   // 存在循环嵌套的微任务，导致宏任务无法退出，导致其他任务无法被执行，页面卡死
   function foo() {
     return Promise.resolve().then(foo);
   }
   foo();
   ```
