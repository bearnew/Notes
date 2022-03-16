## 手写 js 原生函数

> https://juejin.im/post/5dc3894051882517a652dbd7

#### 1.new

```js
function New(f) {
    //返回一个func
    return function () {
        var o = Object.create(f.prototype);
        f.apply(o, arguments); //继承父类的属性

        return o; //返回一个Object
    };
}

function foo(something) {
    this.a = something;
}

var baz = New(foo)(3);
console.log(baz.a); // 3
```

#### 2.JSON.stringify

1. 存在 toJSON()方法，序列化时会直接调用该方法
2. Boolean|Number|String 会自动转换成对应的原始值
3. undefined|任意函数|symbol 值，在序列化时会被忽略
4. 数组中的 undefined|任意函数|symbol 值，在序列化时会被转换成 null
5. 以 symbol 为 key 的属性，会被忽略，即使使用了 replacer 函数
6. 不可枚举的属性，循环引用对象的本身，属性也会被忽略
7. Date 的实例序列化时，返回 toJSON 的值
8. Infinity 和 NaN，序列化时被处理成 null
9. 其他实例对象（map, set, weakmap, weakset）将只序列化他们可枚举的属性

```js
window.JSON.stringify = function (obj) {
    var result = "";
    var curVal;

    if (obj === null) return String(obj);

    switch (typeof obj) {
        case "boolean":
        case "number":
        case "string":
            return `"${obj}"`;
        case "undefined":
        case "function":
        case "symbol":
            return undefined;
    }

    switch (Object.prototype.toString.call(obj)) {
        case "[object Array]":
            result += "[";
            for (var i = 0, len = obj.length; i < len; i++) {
                curVal = JSON.stringify(obj[i]);
                result += curVal === undefined ? null : curVal;
                result += ",";
            }
            if (result !== "[") {
                result = result.slice(0, -1);
            }
            result += "]";
            return result;
        case "[object Date]":
            return `"${obj.toJSON ? obj.toJSON() : obj.toString()}"`;
        case "[object RegExp]":
            return "{}";
        case "[object Object]":
            result += "{";
            for (var i in obj) {
                curVal = JSON.stringify(obj[i]);
                if (curVal !== undefined) {
                    result += `"${i}":${curVal},`;
                }
            }
            if (result !== "{") {
                result = result.slice(0, -1);
            }
            result += "}";
            return result;
    }
};
```

#### 3.JSON.parse

-   使用 eval 和 Function 动态编译 js 的功能
-   为了避免 json 中有可执行的 js 代码（引发 xss 攻击），

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
var rx_three =
    /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rx_four = /(?:^|:|,)(?:\s*\[)+/g;

window.JSON.parse = function (json) {
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
};
```

#### 4.call

```js
function addArguments(y) {
    return this.x + y;
}

var obj = {
    x: 1,
};

var result = addArguments.myCall(obj, 2);

console.log(result); // 3
```

```js
if (!Function.prototype.myCall)
    (function () {
        Function.prototype.myCall = function () {
            var callObj = arguments[0];
            var callArgs = Array.prototype.slice.call(arguments, 1);

            if (typeof this !== "function") {
                throw new Error("The object calling call must be function");
            }

            const fn = Symbol("fn");
            callObj[fn] = this;

            var result = callObj[fn](...callArgs);
            delete callObj[fn];
            return result;
        };
    })();
```

#### 5.apply

```js
function addArguments(y) {
    return this.x + y;
}

var obj = {
    x: 1,
};

var result = addArguments.myApply(obj, [2]);

console.log(result); // 3
```

```js
if (!Function.prototype.myApply)
    (function () {
        Function.prototype.myApply = function () {
            var callObj = arguments[0];
            var callArgs = arguments[1];

            if (typeof this !== "function") {
                throw new Error("The object calling call must be function");
            }

            const fn = Symbol("fn");
            callObj[fn] = this;

            var result = callObj[fn](...callArgs);
            delete callObj[fn];
            return result;
        };
    })();
```

#### 6.bind

-   创建 1 个新函数，新函数的 this 被指定为 bind()的第一个参数，其余参数作为新函数的参数

```js
const unbound = {
    x: 1,
    getX: function () {
        return this.x;
    },
};
const module = {
    x: 42,
};

const boundGetX = unbound.getX.bind(module);
console.log(boundGetX());
// expected output: 42
```

-   `bind()`使函数拥有预设的初始参数

```js
function addArguments(arg1, arg2) {
    return arg1 + arg2;
}

var addThirtySeven = addArguments.bind(null, 37);

// 第2个参数被忽略
var result = addThirtySeven(5, 10);
console.log(result); // 42
```

-   实现 bind

```js
if (!Function.prototype.myBind)
    (function () {
        Function.prototype.myBind = function () {
            var thatFunc = this;
            var bindObj = arguments[0];
            var bindArgs = Array.prototype.slice.call(arguments, 1);

            if (typeof thatFunc !== "function") {
                throw new Error("The object calling bind must be function");
            }

            return function () {
                var args = bindArgs.concat(
                    Array.prototype.slice.call(arguments)
                );
                return thatFunc.apply(bindObj, args);
            };
        };
    })();
```

#### 7.instanceof

-   检测构造函数的 prototype 属性是否出现在实例对象的原型链上

```js
function Car() {}
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

-   创建 1 个新对象，使用现有对象来提供新创建对象的**proto**

```js
Object.myCreate = function (proto, propertiesObject) {
    if (typeof proto !== "object" && typeof proto !== "function") {
        throw new TypeError("Object prototype may only be an Object");
    }
    if (proto === null) {
        throw new Error("Object prototype can not be an null");
    }

    function Tmp() {}
    Tmp.prototype = proto;
    var o = new Tmp();

    if (propertiesObject !== undefined) {
        for (var key in propertiesObject) {
            Object.defineProperty(o, key, propertiesObject[key]);
        }
    }

    return o;
};

const person = {
    x: 1,
    y: 2,
};

const me = Object.myCreate(person, {
    z: {
        writable: true,
        configurable: true,
        value: 3,
    },
});

console.log(me); // { z: 3 }
console.log(me.x); // 1
```

#### 8.await async

```js
// 定义了一个promise，用来模拟异步请求，作用是传入参数++
function getNum(num) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(num + 1);
        }, 1000);
    });
}

// 所需要执行的Generator函数，内部的数据在执行完成一步的promise之后，再调用下一步
var func = function* () {
    var f1 = yield getNum(1);
    console.log(f1);
    var f2 = yield getNum(f1);
    console.log(f2);
};
asyncFun(func);

//自动执行器，如果一个Generator函数没有执行完，则递归调用
function asyncFun(func) {
    var gen = func();

    function next(data) {
        var result = gen.next(data);
        if (result.done) return result.value;
        result.value.then(function (data) {
            next(data);
        });
    }

    next();
}
```

> generator 补充知识（使用上一次 yield 生成的值，需要通过 next 函数传参）

```js
function* test() {
    var y = 2;
    var x = yield 1;
    x = yield x + y + 1;
    return x;
}

const gen = test();
console.log(gen.next()); // {value: 1, done: false}

// 只接收上一次yield生成的变量，y依然使用函数中的变量
console.log(gen.next(5, 4)); // {value: 8, done: false}
console.log(gen.next()); // {value: undefined, done: true}
```

#### 9.继承

-   https://github.com/bearnew/Notes/blob/master/JS/2018/JS%E5%AF%B9%E8%B1%A1%E7%BB%A7%E6%89%BF.md

#### 10.js 函数柯里化

-   https://github.com/bearnew/Notes/blob/master/JS/2018/JS%E5%87%BD%E6%95%B0%E6%9F%AF%E9%87%8C%E5%8C%96.md

#### 11.js 深拷贝

-   https://github.com/bearnew/Notes/blob/master/JS/2019/%E6%B7%B1%E6%8B%B7%E8%B4%9D%26%E6%B5%85%E6%8B%B7%E8%B4%9D.md

#### 12.防抖与节流

-   https://github.com/bearnew/Notes/blob/master/JS/2018/js%E9%98%B2%E6%8A%96%26%E6%88%AA%E6%B5%81.md

#### 13.promise

-   https://github.com/bearnew/Notes/blob/master/JS/2019/%E6%89%8B%E5%86%99promise.md

#### 14.jsonp

```js
var jsonp = function (url, param, callback) {
    var callbackSuffix = Math.random().toString().replace(".", "");
    // console.log(callbackSuffix);  // 07626840955849186
    var callbackName = "callback_function" + callbackSuffix;
    // console.log(callbackName); // callback_function07626840955849186
    window[callbackName] = callback;
    var queryString = url.indexOf("?") == -1 ? "?" : "&";
    // console.log(queryString); // ?
    for (var key in param) {
        queryString += key + "=" + param[key] + "&";
    }
    // console.log(queryString); // ?count=10&start=15&
    queryString += "callback=" + callbackName;
    // console.log(queryString); // ?count=10&start=15&callback=callback_function07626840955849186
    var scriptElement = document.createElement("script");
    scriptElement.src = url + queryString;
    document.body.appendChild(scriptElement);
};
window.$jsonp = jsonp;

$jsonp(
    "http://api.douban.com/v2/movie/in_theaters",
    { count: 10, start: 15 },
    function (data) {
        document.getElementById("result").innerHTML = JSON.stringify(data);
    }
);
```

```js
// nodejs
//通过require将http库包含到程序中
var http = require("http");
//引入url模块解析url字符串
var url = require("url");
//引入querystring模块处理query字符串
var querystring = require("querystring");
//创建新的HTTP服务器
var server = http.createServer();
//通过request事件来响应request请求
server.on("request", function (req, res) {
    var urlPath = url.parse(req.url).pathname;
    var qs = querystring.parse(req.url.split("?")[1]);
    if (urlPath === "/jsonp" && qs.callback) {
        res.writeHead(200, {
            "Content-Type": "application/json;charset=utf-8",
        });
        var data = {
            name: "Monkey",
        };
        data = JSON.stringify(data);
        var callback = qs.callback + "(" + data + ");";
        res.end(callback);
    } else {
        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        res.end("Hell World\n");
    }
});
//监听8080端口
server.listen("8080");
//用于提示我们服务器启动成功
console.log("Server running!");
```

#### 15.实现一个双向绑定

-   `defineProperty`

```js
// 数据
const data = {
    text: "default",
};
const input = document.getElementById("input");
const span = document.getElementById("span");
// 数据劫持
Object.defineProperty(data, "text", {
    // 数据变化 --> 修改视图
    set(newVal) {
        input.value = newVal;
        span.innerHTML = newVal;
    },
});
// 视图更改 --> 数据变化
input.addEventListener("keyup", function (e) {
    data.text = e.target.value;
});
```

-   `proxy`

```js
// 数据
const data = {
    text: "default",
};
const input = document.getElementById("input");
const span = document.getElementById("span");
// 数据劫持
const handler = {
    set(target, key, value) {
        target[key] = value;
        // 数据变化 --> 修改视图
        input.value = value;
        span.innerHTML = value;
        return value;
    },
};
const proxy = new Proxy(data, handler);

// 视图更改 --> 数据变化
input.addEventListener("keyup", function (e) {
    proxy.text = e.target.value;
});
```

#### 16.reduce

```js
Array.prototype.reduce = (fn, initVal) => {
    this.forEach((item) => {
        initVal = fn(initVal, item);
    });

    return initVal;
};
```

#### 17.实现记忆函数

```js
const memoization = (fn) => {
    // 使用map key存储参数
    const cache = new Map();

    // ...args多个参数
    return function (...args) {
        const key = JSON.stringify(args);
        if (!map.has(key)) {
            map.set(key, fn.call(this, ...args));
            if (cache.size > 10) {
                // 删除第1次存储的值
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
            }
        } else {
            return map.get(key);
        }
    };
};
```
