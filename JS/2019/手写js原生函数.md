## 手写js原生函数
> https://juejin.im/post/5dc3894051882517a652dbd7
#### 1.new
```js
 function New(f) {
    //返回一个func
    return function () {
        var o = Object.create(f.prototype);
        f.apply(o, arguments);//继承父类的属性

        return o; //返回一个Object
    }
}

function foo(something) {
    this.a = something;
}

var baz = New(foo)(3);
console.log(baz.a); // 3
```
#### 2.JSON.stringify
1. 存在toJSON()方法，序列化时会直接调用该方法
2. Boolean|Number|String 会自动转换成对应的原始值
3. undefined|任意函数|symbol值，在序列化时会被忽略
4. 数组中的undefined|任意函数|symbol值，在序列化时会被转换成null
5. 以symbol为key的属性，会被忽略，即使使用了replacer函数
6. 不可枚举的属性，循环引用对象的本身，属性也会被忽略
7. Date的实例序列化时，返回toJSON的值
8. Infinity和NaN，序列化时被处理成null
9. 其他实例对象（map, set, weakmap, weakset）将只序列化他们可枚举的属性
```js
window.JSON.stringify = function(obj) {
    var result = '';
    var curVal;

    if (obj === null) return String(obj);

    switch(typeof obj) {
        case 'boolean':
        case 'number':
        case 'string':
            return `"${obj}"`;
        case 'undefined':
        case 'function':
        case 'symbol':
            return undefined;
    }

    switch(Object.prototype.toString.call(obj)) {
        case '[object Array]':
            result += '[';
            for (var i = 0, len = obj.length; i < len; i++) {
                curVal = JSON.stringify(obj[i]);
                result += (curVal === undefined ? null : curVal);
                result += ',';
            }
            if (result !== '[') {
                result = result.slice(0, -1);
            }
            result += ']';
            return result;
        case '[object Date]':
            return `"${obj.toJSON ? obj.toJSON() : obj.toString()}"`
        case '[object RegExp]':
            return "{}";
        case '[object Object]':
            result += '{';
            for (var i in obj) {
                curVal = JSON.stringify(obj[i]);
                if (curVal !== undefined) {
                    result += `"${i}":${curVal},`;
                }
            }
            if (result !== '{') {
                result = result.slice(0, -1);
            }
            result += '}';
            return result;
    }
}

```
#### 3.JSON.parse
* 使用eval和Function动态编译js的功能
* 为了避免json中有可执行的js代码（引发xss攻击），
```js
// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
// replace all simple value tokens with "]" characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or "]" or
// "," or ":" or "{" or "}". If that is so, then the text is safe for eval.
var rx_one = /^[\],:{}\s]*$/;
var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rx_four = /(?:^|:|,)(?:\s*\[)+/g;

window.JSON.parse = function(json) {
    if (
        rx_one.test(
            json
                .replace(rx_two, "@")
                .replace(rx_three, "]")
                .replace(rx_four, "")
        )
    ) {
        return eval(`(${json})`);
        // return (new Function('return ' + json))()
    }
}
```
#### 4.call
```js
function addArguments(y) {
    return this.x + y;
}

var obj = {
    x: 1
}

var result = addArguments.myCall(obj, 2);

console.log(result); // 3
```
```js
if (!Function.prototype.myCall) (function () {
    Function.prototype.myCall = function () {
        var callObj = arguments[0];
        var callArgs = Array.prototype.slice.call(arguments, 1);

        if (typeof this !== 'function') {
            throw new Error("The object calling call must be function")
        }

        const fn = Symbol('fn');
        callObj[fn] = this;

        var result = callObj[fn](...callArgs);
        delete callObj[fn];
        return result;
    }
})()
```
#### 5.apply
```js
function addArguments(y) {
    return this.x + y;
}

var obj = {
    x: 1
}

var result = addArguments.myApply(obj, [2]);

console.log(result); // 3
```
```js
if (!Function.prototype.myApply) (function () {
    Function.prototype.myApply = function () {
        var callObj = arguments[0];
        var callArgs = arguments[1];

        if (typeof this !== 'function') {
            throw new Error("The object calling call must be function")
        }

        const fn = Symbol('fn');
        callObj[fn] = this;

        var result = callObj[fn](...callArgs);
        delete callObj[fn];
        return result;
    }
})()
```
#### 6.bind
* 创建1个新函数，新函数的this被指定为bind()的第一个参数，其余参数作为新函数的参数
```js
const module = {
  x: 42,
  getX: function() {
    return this.x;
  }
}

const boundGetX = unboundGetX.bind(module);
console.log(boundGetX());
// expected output: 42
```
* `bind()`使函数拥有预设的初始参数
```js
function addArguments(arg1, arg2) {
    return arg1 + arg2
}

var addThirtySeven = addArguments.bind(null, 37);

// 第2个参数被忽略
var result = addThirtySeven(5, 10);
console.log(result); // 42
```
* 实现bind
```js
if (!Function.prototype.myBind) (function() {
    Function.prototype.myBind = function() {
        var thatFunc = this;
        var bindObj = arguments[0];
        var bindArgs = Array.prototype.slice.call(arguments, 1);

        if (typeof thatFunc !== 'function') {
            throw new Error("The object calling bind must be function")
        }

        return function() {
            var args = bindArgs.concat(Array.prototype.slice.call(arguments))
            return thatFunc.apply(bindObj, args);
        }
    }
})()
``` 
#### 7.instanceof
* 检测构造函数的prototype属性是否出现在实例对象的原型链上
```js
function Car() { }
const car = new Car();

console.log(myInstanceof(car, Car)); // true
console.log(myInstanceof(car, Object)); // true

function myInstanceof(instance, obj) {
    const Proto = obj.prototype;
    let chain = instance.__proto__;

    while (true) {
        if (chain === null) return false;
        if (chain === Proto) return true;
        chain = chain.__proto__;
    }
}
```
#### 8.Object.create
* 创建1个新对象，使用现有对象来提供新创建对象的__proto__
```js
Object.myCreate = function (proto, propertiesObject) {
    if (typeof proto !== 'object' && typeof proto !== 'function') {
        throw new TypeError('Object prototype may only be an Object')
    }
    if (proto === null) {
        throw new Error('Object prototype can not be an null');
    }

    function Tmp() { };
    Tmp.prototype = proto;
    var o = new Tmp();

    if (propertiesObject !== undefined) {
        for (var key in propertiesObject) {
            Object.defineProperty(o, key, propertiesObject[key])
        }
    }

    return o;
}

const person = {
    x: 1,
    y: 2
};

const me = Object.myCreate(person, {
    z: {
        writable: true,
        configurable: true,
        value: 3
    }
});

console.log(me); // { z: 3 }
console.log(me.x); // 1
```
#### 8.await async
#### 9.继承
* https://github.com/bearnew/Notes/blob/master/JS/2018/JS%E5%AF%B9%E8%B1%A1%E7%BB%A7%E6%89%BF.md
#### 10.js函数柯里化
* https://github.com/bearnew/Notes/blob/master/JS/2018/JS%E5%87%BD%E6%95%B0%E6%9F%AF%E9%87%8C%E5%8C%96.md
#### 11.js深拷贝
* https://github.com/bearnew/Notes/blob/master/JS/2019/%E6%B7%B1%E6%8B%B7%E8%B4%9D%26%E6%B5%85%E6%8B%B7%E8%B4%9D.md
#### 12.防抖与节流
* https://github.com/bearnew/Notes/blob/master/JS/2018/js%E9%98%B2%E6%8A%96%26%E6%88%AA%E6%B5%81.md
#### 13.promise
* https://github.com/bearnew/Notes/blob/master/JS/2019/%E6%89%8B%E5%86%99promise.md
