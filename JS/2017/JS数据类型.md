## JS数据类型

![js数据类型](https://github.com/bearnew/picture/blob/master/mardown/2019-05-04%20js-type/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20190504204011.jpg?raw=true)
====
数据类型
```javascript
Undefined Null Boolean Number String Symbol // 简单数据类型
Object // 复杂数据类型
```
####
* 基本数据类型存储在栈中
* 引用数据类型存储在堆中，栈中存放指向引用数据类型在堆中存储地址的指针
#### typeof的返回值(7种)
* string
* symbol
* number
* boolean
* undefined
* object
* function
> 检测一个对象的类型，强烈推荐使用Object.prototype.toString方法

Undefined
----
1. 声明了变量但未对其加以初始化
2. 未声明的变量
Null
----
空对象指针

```javascript
typeof null === object  // true
null == undefined // true
```

Boolean
----

 - Boolean()能转换成true的值

```javascript
true
任何非空字符串
任何非零数字（包括无穷大）
任何对象
n/a、N/A(不适用)   
```

 - Boolean()能转换成false的值

```javascript
false
" "（空字符串）
0、NaN
null
undefined
```

Number
----
isNaN()检测不是数值，并且不能被转换成数值
```javascript
typeof NaN  // number

isNaN(NaN) // true
isNaN(10) // false
isNaN("10") // false
isNaN("blue") // true
isNaN('true') // false
```
数值转换的方法：Number()、 parseInt()、 parseFloat()
```js
console.log([1, 2, 3].map(parseInt));       // [1, NaN, NaN]
// 解析如下
// parseInt(1, 0) // 1,  没有零进制..直接转换为十进制了
// parseInt(2, 1) // 一进制只能用0表示，所以返回NaN
// parseInt(3, 2) // 二进制用0 1表示，也返回NaN

console.log([1, 2, 3].map(parseFloat));            // [1, 2, 3]
// 解析如下
// parseFloat函数没有第二参数，只能按照十进制输出了，即为答案的输出。
```

String
====
toString()
null和undefined没有toString()方法，在不确定值是否为null或者undefined的情况下用String()方法，String()能够将任何类型的值转换成字符串
```javascript
var num = 10;
num.toString();        // "10'
num.toString(2);        // "1010"
num.toString(16);      // "a"

var value1 = null
var value2;
String(value1)      // "null"
String(undefined)     // "undefined"
```

Object
====
var o = new Object();

 1. constructor 
保存用于创建当前对象的函数,如上 Object()就是构造函数(constructor)
 2. hasOwnProperty('propertyName')
检测属性在实例中（非原型）是否存在,例: o.hasOwnproperty("name");
 3. toLocalString()
返回对象的字符串表示，该字符串与执行环境的地区对应
4. toString()
返回对象的字符串表示
5. valueOf()
返回对象的字符串、数值或布尔值表示。通常与toString()方法返回值相同。
