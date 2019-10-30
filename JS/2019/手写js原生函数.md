## 手写js原生函数
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

