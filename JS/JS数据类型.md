 JS数据类型
====
数据类型
```
Undefined Null Boolean Number String  // 简单数据类型
Object // 复杂数据类型
```

Undefined
----
1.声明了变量但未对其加以初始化
2.未声明的变量
Null
----
空对象指针

```
typeof null === object  // true
null == undefined // true
```

Boolean
----

 - Boolean()能转换成true的值

```
true
任何非空字符串
任何非零数字（包括无穷大）
任何对象
n/a、N/A(不适用)   
```

 - Boolean()能转换成false的值

```
false
" "（空字符串）
0、NaN
null
undefined
```

Number
----
isNaN()检测不是数值，并且不能被转换成数值
```
typeof NaN  // number

isNaN(NaN) // true
isNaN(10) // false
isNaN("10") // false
isNaN("blue") // true
isNaN('true') // false
```
数值转换的方法：Number()、 parseInt()、 parseFloat()

String
====
toString()
null和undefined没有toString()方法，在不确定值是否为null或者undefined的情况下用String()方法，String()能够将任何类型的值转换成字符串
```
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