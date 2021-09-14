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
