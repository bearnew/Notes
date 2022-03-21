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

#### 18.判断数据类型

```js
// typeof 可以正确识别：Undefined、Boolean、Number、String、Symbol、Function
// myTypeof 识别Null、Date、Array
const myTypeof = (obj) => {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
};

typeOf([]); // 'array'
typeOf({}); // 'object'
typeOf(new Date()); // 'date'
```

#### 19.requestIdleCallback 实现

```js
if (typeof window !== "undefined" && !window.requestIdleCallback) {
    window.requestIdleCallback = function (callback) {
        return setTimeout(() => {
            callback({
                didTimeout: false,
                timeRemaining() {
                    return Infinity;
                },
            });
        });
    };

    window.cancelIdleCallback = function (callbackID) {
        clearTimeout(callbackID);
    };
}
```

#### 20.useState

```js
// // useState
// const fiberStates = {}; // 当前组件所有states
// let curr; // 当前state指针
// const useState = (initialState) => {
//     // state: 取链表里保存的或初始值
//     const state = fiberStates[curr] || initialState;
//     // setState
//     const setState = (newState) => {
//         fiberStates[curr] = newState;
//         render(); // 进入渲染流程
//     };

//     curr = curr.next;
//     return [state, setState];
// };

let _state = [],
    _index = 0;
function useState(initialState) {
    let curIndex = _index; // 记录当前操作的索引
    _state[curIndex] =
        _state[curIndex] === undefined ? initialState : _state[curIndex];
    const setState = (newState) => {
        _state[curIndex] = newState;
        ReactDOM.render(<App />, rootElement);
    };
    _index += 1; // 下一个操作的索引
    return [_state[curIndex], setState];
}

const [count, setCount] = useState(1);
setCount(2);
const [obj, setObj] = useState({ a: 1 });
setObj({ a: 2 });
console.log("222222", _state);
```

#### 21.useEffect

```js
const lastDepsBox = [];
const lastClearCallbacks = [];
let index = 0;

const useEffect = (callback, deps) => {
    const lastDeps = lastDepsBox[index];
    const changed =
        !lastDeps || // 首次渲染，肯定触发
        !deps || // deps不传，次次触发
        deps.some((dep, index) => dep !== lastDeps[index]); // 正常比较

    if (changed) {
        lastDepsBox[index] = deps;
        if (lastClearCallbacks[index]) {
            // 清除函数
            lastClearCallbacks[index]();
        }
        lastClearCallbacks[index] = callback();
    }
    index++;
};
```

#### 22.数组去重

```js
// ES5
function unique(arr) {
    return arr.filter((item, index, rawArr) => {
        return rawArr.indexOf(item) === index;
    });
}
```

```js
// ES6
function unique2(arr) {
    return [...new Set(arr)];
}
```

```js
// 空间
function unique3(arr) {
    const map = new Map();
    const result = [];
    arr.forEach((item) => {
        if (!map.has(item)) {
            result.push(item);
            map.set(item, 1);
        }
    });

    return result;
}
```

#### 23.数组扁平化

```js
const flatten1 = (arr) =>
    arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
```

```js
function flatten2(a) {
    return Array.isArray(a) ? [].concat(...a.map(flatten)) : a;
}
```

```js
const flatten3 = (arr) => {
    return JSON.parse("[" + JSON.stringify(arr).replace(/\[|\]/g, "") + "]");
};
```

```js
// 拍平无数层
[1, 2, [3, 4, [5]]].flat(Infinity);
```

#### 24.解析 url 参数

```js
const url = "https://www.baidu.com:8080/aaa/1.html?id=1&key=test#ffff";
const link = window.document.createElement("a");
link.href = url;
// '?id=1&key=test'
console.log(link, link.search);

function parseUrl(url) {
    // ['https://www.baidu.com:8080/aaa/1.html?id=1&key=test#ffff', 'id=1&key=test#ffff', index: 0, input: 'https://www.baidu.com:8080/aaa/1.html?id=1&key=test#ffff', groups: undefined]
    const str = /.+\?(.+)$/.exec(url);
    const arr = str[1].split("&");
    let obj = {};
    arr.forEach((param) => {
        if (/=/.test(param)) {
            // 有value的参数
            let [key, val] = param.split("=");
            // 解码
            val = decodeURIComponent(val);
            // 转为数字
            val = /^\d+$/.test(val) ? parseFloat(val) : val;
            if (obj.hasOwnProperty(key)) {
                obj[key] = [].concat(obj[key], val);
            } else {
                obj[key] = val;
            }
        } else {
            // 没有value的参数
            obj[param] = true;
        }
    });

    return obj;
}
```

#### 25.字符串模板

```js
function render(template, data) {
    // 模板字符串正则
    // 字母、数字、下划线和点
    const reg = /\{\{((\w|\.)+)\}\}/;
    if (reg.test(template)) {
        const name = reg.exec(template)[1];
        if (name.includes(".")) {
            const keys = name.split(".");
            let index = 0;
            let o = data;
            while (index < keys.length) {
                const key = keys[index];
                o = o[key];
                index++;
            }
            template = template.replace(reg, o);
        } else {
            template = template.replace(reg, data[name]);
        }

        return render(template, data);
    }

    return template;
}

let template =
    "我是{{name}}，年龄{{age}}，性别{{sex}}，我的爸爸是{{parent.father}}";
let person = {
    name: "布兰",
    age: 12,
    parent: {
        father: "杰克",
        mother: "丽萨",
    },
};
var html = render(template, person);
// 我是布兰，年龄12，性别undefined，我的爸爸是杰克
console.log(html);
```

#### 26.偏函数

```js
function partial(fn, ...args) {
    return (...arg) => {
        return fn(...args, ...arg);
    };
}
function add(a, b, c) {
    return a + b + c;
}
let partialAdd = partial(add, 1);
partialAdd(2, 3);
```

#### 27.手写 forEach

```js
Array.prototype.myForEach = function (callback, thisArg) {
    if (this === null) {
        throw new TypeError("this is null or undefined");
    }
    if (typeof callback !== "function") {
        throw new TypeError(callback + "is not a function");
    }
    const Obj = Object(this);
    // 保证转换后的值为正整数
    // 底层做了 2 层转换，第一是非 number 转成 number 类型，第二是将 number 转成 Uint32 类型
    const len = Obj.length >>> 0;
    let k = 0;
    while (k < len) {
        if (k in Obj) {
            callback.call(thisArg, Obj[k], k, Obj);
        }
        k++;
    }
};

const arr = [1, 2, 3];
arr.myForEach((item, idx) => {
    console.log(idx, item);
});
```

#### 28.手写 Map

```js
Array.prototype.myMap = function (callback, thisArg) {
    if (this === null) {
        throw new TypeError("this is null or undefined");
    }
    if (typeof callback !== "function") {
        throw new TypeError(callback + "is not a function");
    }
    const Obj = Object(this);
    // 保证转换后的值为正整数
    // 底层做了 2 层转换，第一是非 number 转成 number 类型，第二是将 number 转成 Uint32 类型
    const len = Obj.length >>> 0;
    const res = [];
    for (let k = 0; k < len; k++) {
        res[k] = callback.call(thisArg, Obj[k], k, Obj);
    }

    return res;
};

const arr = [1, 2, 3];
const arr2 = arr.myMap((item, idx) => {
    return item + 1;
});
console.log("111111", arr2);
```

#### 29.手写 filter

```js
Array.prototype.myFilter = function (callback, thisArg) {
    if (this === null) {
        throw new TypeError("this is null or undefined");
    }
    if (typeof callback !== "function") {
        throw new TypeError(callback + "is not a function");
    }
    const Obj = Object(this);
    // 保证转换后的值为正整数
    // 底层做了 2 层转换，第一是非 number 转成 number 类型，第二是将 number 转成 Uint32 类型
    const len = Obj.length >>> 0;
    const res = [];
    for (let k = 0; k < len; k++) {
        const isPass = callback.call(thisArg, Obj[k], k, Obj);
        if (isPass) {
            res.push(Obj[k]);
        }
    }

    return res;
};

const arr = [1, 2, 3];
const arr2 = arr.myFilter((item, idx) => {
    return item > 1;
});
console.log("111111", arr2);
```

#### 30.手写 some

```js
Array.prototype.mySome = function (callback, thisArg) {
    if (this === null) {
        throw new TypeError("this is null or undefined");
    }
    if (typeof callback !== "function") {
        throw new TypeError(callback + "is not a function");
    }
    // 使用Object包裹，使Obj.length不报错
    const Obj = Object(this);
    // 保证转换后的值为正整数
    // 底层做了 2 层转换，第一是非 number 转成 number 类型，第二是将 number 转成 Uint32 类型
    const len = Obj.length >>> 0;
    for (let k = 0; k < len; k++) {
        const isPass = callback.call(thisArg, Obj[k], k, Obj);
        if (isPass) {
            return isPass;
        }
    }

    return false;
};

const arr = [1, 2, 3];
const isExist = arr.mySome((item, idx) => {
    return item > 1;
});
console.log("111111", isExist);
```

#### 31.Object.assign

```js
function myAssign(target, ...source) {
    if (target == null) {
        throw new TypeError("Cannot convert undefined or null to object");
    }
    const res = Object(target);
    source.forEach((obj) => {
        if (!!obj) {
            for (let k in obj) {
                if (obj.hasOwnProperty(k)) {
                    res[k] = obj[k];
                }
            }
        }
    });

    return res;
}

const obj1 = { a: 18, b: 30 };
const obj2 = { c: 15 };
const obj3 = { b: 20, d: 20 };
// {0: 1, 1: 2, 2: 3, a: 18, b: 20, c: 15, d: 20}
console.log("111111", Object.assign(obj1, obj2, obj3, [1, 2, 3]));
```

#### 32.实现 Object.is

```js
const myObjectIs = (x, y) => {
    if (x === y) {
        // +0与-0应该不相等
        // x和y相等的时候，只处理+0和-0的情况
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
        // NaN与NaN应该相等
        return x !== x && y !== y;
    }
};

console.log(+0 === -0); // true
console.log(NaN === NaN); // false
console.log(myObjectIs(+0, -0)); // false
console.log(myObjectIs(NaN, NaN)); // true
```

#### 33.Promise 并行限制

```js
class Scheduler {
    constructor() {
        this.queue = [];
        this.maxCount = 2;
        this.runCount = 0;
    }

    add(promise) {
        this.queue.push(promise);
    }

    taskStar() {
        for (let i = 0; i < this.maxCount; i++) {
            this.request();
        }
    }

    request() {
        if (
            !this.queue ||
            !this.queue.length ||
            this.runCount >= this.maxCount
        ) {
            return;
        }

        this.queue
            .shift()()
            .then(() => {
                this.runCount--;
                this.request();
            });
        this.runCount++;
    }
}

const timeOutRequest = (time) =>
    new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    });
const scheduler = new Scheduler();
const addTask = (time, order) => {
    scheduler.add(() => timeOutRequest(time).then(() => console.log(order)));
};
addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");

// 1、2两个任务开始执行
// 500ms时，2任务执行完毕，输出2，任务3开始执行
// 800ms时，3任务执行完毕，输出3，任务4开始执行
// 1000ms时，1任务执行完毕，输出1，此时只剩下4任务在执行
// 1200ms时，4任务执行完毕，输出4
scheduler.taskStart();
```

#### 34.滚动加载

```js
window.addEventListener(
    "scroll",
    function () {
        const clientHeight = document.documentElement.clientHeight;
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        if (clientHeight + scrollTop >= scrollHeight) {
            // 检测到滚动至页面底部，进行后续操作
            // ...
        }
    },
    false
);
```

#### 35.分片渲染

```js
// 分片渲染
function fragmentRender(total, perCount) {
    // 需要循环插入的次数
    const loopCount = Math.ceil(total / perCount);
    // 已经渲染了多少次
    let renderCount = 0;
    const ul = document.querySelector("ul");
    loop();

    function loop() {
        if (renderCount < loopCount) {
            window.requestAnimationFrame(add);
        }
    }
    function add() {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < perCount; i++) {
            const li = document.createElement("li");
            li.innerText = "test";
            fragment.appendChild(li);
        }

        ul.appendChild(fragment);
        renderCount++;
        loop();
    }
}

setTimeout(() => {
    // 插入10万数据，每次插入20条
    fragmentRender(100000, 20);
}, 0);
```

#### 36.打印当前网页多少 HTML 元素

```js
const fn = () => {
    return [
        ...new Set([...document.querySelectorAll("*")].map((el) => el.tagName)),
    ].length;
};
```

#### 37.将 virtualDom 转换成真实 dom

```js
// vnode结构：
// {
//   tag,
//   attrs,
//   children,
// }

//Virtual DOM => DOM
function render(vnode, container) {
    container.appendChild(_render(vnode));
}

function _render(vnode) {
    // 数字需要转换成字符串
    if (typeof vnode === "number") {
        vnode = String(vnode);
    }
    // 字符串直接创建文本节点
    if (typeof vnode === "string") {
        // createTextNode只接收字符串
        return document.createTextNode(vnode);
    }
    // 普通dom
    const dom = document.createElement(vnode.tag);
    if (vnode.attrs) {
        // 遍历属性
        Object.keys(vnode.attrs).forEach((key) => {
            const value = vnode.attrs[key];
            dom.setAttribute(key, value);
        });
    }

    // 子数组进行递归操作
    vnode.children.forEach((child) => render(child, dom));

    return dom;
}
```

#### 38.数组转树

```js
function dfs(list, pid) {
    const nodes = list.filter((item) => item.pid === pid) || []; // 找到第一层节点
    return nodes.map((item) => ({ ...item, children: dfs(list, item.id) })); // 构建该层每个节点: 其子节点用dfs构造即可
}

// 测试
const data = [
    // 注意这里，专门把pid为1的元素放一个在前面
    { id: 2, name: "部门2", pid: 1 },
    { id: 1, name: "部门1", pid: 0 },
    { id: 3, name: "部门3", pid: 1 },
    { id: 4, name: "部门4", pid: 3 },
    { id: 5, name: "部门5", pid: 4 },
    { id: 7, name: "部门7", pid: 6 },
];
// pid为父元素的id
console.log(dfs(data, 0));
```

#### 39.树转数组

```js
function treeToArr(tree) {
    const list = [];
    const queue = [...tree];
    while (queue.length) {
        const node = queue.shift();
        const children = node.children;
        // 取出当前节点的子节点，放到队列中，等待下一次循环
        if (children.length > 0) {
            queue.push(...children);
        }
        delete node.children;
        list.push(node);
    }

    return list;
}

const tree = [
    {
        id: 1,
        name: "部门1",
        pid: 0,
        children: [
            { id: 2, name: "部门2", pid: 1, children: [] },
            {
                id: 3,
                name: "部门3",
                pid: 1,
                children: [
                    {
                        id: 4,
                        name: "部门4",
                        pid: 3,
                        children: [
                            { id: 5, name: "部门5", pid: 4, children: [] },
                        ],
                    },
                ],
            },
        ],
    },
];
console.log(treeToArr(tree));
```

#### 40.setInterval 实现 setTimeout

```js
function mySettimeout(fn, t) {
    const timer = setInterval(() => {
        fn();
        clearInterval(timer);
    }, t);
    return () => {
        clearInterval(timer);
    };
}
function log() {
    console.log("test test test");
}
const disposer = mySettimeout(log, 3000);
setTimeout(() => {
    disposer();
}, 2000);
```

#### 41.setTimeout 实现 setInterval

```js
function myInterval(fn, t) {
    let timer = null;
    function interval() {
        fn();
        timer = setTimeout(interval, t);
    }
    timer = setTimeout(interval, t);
    return () => {
        clearTimeout(timer);
    };
}
function log() {
    console.log("test test test");
}
const disposer = myInterval(log, 1000);
setTimeout(() => {
    disposer();
}, 3000);
```

#### 42.版本号排序

```js
const sortVersion = (arr) => {
    return arr.sort((x, y) => {
        let i = 0;
        const list1 = x.split(".");
        const list2 = y.split(".");

        while (true) {
            const s1 = list1[i];
            const s2 = list2[i];
            i++;
            if (s1 === undefined || s2 === undefined) {
                return list2.length - list1.length;
            }
            if (s1 === s2) continue;
            return s2 - s1;
        }
    });
};

const versionList = ["0.1.1", "2.3.3", "0.302.1", "4.2", "4.3.5", "4.3.4.5"];
console.log(sortVersion(versionList));
```

#### 43.LRU（Least rencently used）缓存

```js
//  一个Map对象在迭代时会根据对象中元素的插入顺序来进行
// 新添加的元素会被插入到map的末尾，整个栈倒序查看
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key) {
        if (this.cache.has(key)) {
            const tempVal = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, tempVal);
            return tempVal;
        } else {
            return -1;
        }
    }

    put(key, val) {
        // key存在，仅修改值
        if (this.cache.has(key)) {
            this.cache.delete(key);
            this.cache.set(key, val);
        } else if (this.cache.size < this.capacity) {
            // key不存在，cache还可以存储
            this.cache.set(key, val);
        } else {
            // key不存在，cache已满
            this.cache.delete(this.cache.keys().next().value);
            this.cache.set(key, val);
        }
    }
}

let cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log("cache.get(1)", cache.get(1)); // 返回  1
cache.put(3, 3); // 该操作会使得密钥 2 作废
console.log("cache.get(2)", cache.get(2)); // 返回 -1 (未找到)
cache.put(4, 4); // 该操作会使得密钥 1 作废
console.log("cache.get(1)", cache.get(1)); // 返回 -1 (未找到)
console.log("cache.get(3)", cache.get(3)); // 返回  3
console.log("cache.get(4)", cache.get(4)); // 返回  4
```

#### 44.大数相加

```js
function bigNumAdd(a, b) {
    let str1 = String(a);
    let str2 = String(b);

    const maxLen = Math.max(str1.length, str2.length);
    str1 = str1.padStart(maxLen, 0);
    str2 = str2.padStart(maxLen, 0);

    let val = 0;
    let decimal = 0; // 进位
    let sum = "";
    for (let i = maxLen - 1; i >= 0; i--) {
        val = parseInt(str1[i]) + parseInt(str2[i]) + decimal;
        decimal = Math.floor(val / 10);
        sum = (val % 10) + sum;
    }

    if (decimal) {
        sum = decimal + sum;
    }

    return sum;
}

let a = "9007199254740991";
let b = "1234567899999999999";
let c = "1243575099254740990";
console.log(Number(b)); // 1234567900000000000
console.log(Number(b) > Number.MAX_SAFE_INTEGER); // 大于最大安全数，或小于MIN_SAFE_INTEGER，精度会丢失
console.log(bigNumAdd(a, b)); // 1243575099254740990
```

#### 45.闭包打印

```js
// 依次打印1 2 3 4 5
for (var i = 1; i <= 5; i++) {
    (function (i) {
        setTimeout(() => console.log(i), 1000 * i);
    })(i);
}
```

#### 46.生成随机数

```js
function getRandom(min, max) {
    // random返回介于 0（包含） ~ 1（不包含） 之间的一个随机数
    return Math.floor(Math.random() * (max - min)) + min;
}
```

#### 47.正则千分位

```js
//无小数点
let num1 = "1321434322222";
num1.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
//有小数点
let num2 = "342243242322.34";
num2.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");

function formatNum(num) {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
console.log("1000000".replace(/\b/g, ",")); // ,1000000, 单词的开始和结束
console.log("1000000".replace(/\B/g, ",")); // 1,0,0,0,0,0,0 每个字符间位置
console.log(/React(?=DOM|Native)/g.test("ReactDOM")); // true 正向肯定预查
console.log(/React(?!Router)/g.test("ReactDOM")); // false 正向否定预查
console.log(formatNum(num1)); // 1,321,434,322,222
console.log(formatNum(num2)); // 342,243,242,322.34
```

#### 48.转驼峰

```js
var formatCamel = function (s) {
    return s.replace(/-\w/g, function (x) {
        return x.slice(1).toUpperCase();
    });
};

console.log(formatCamel("get-element-by-id")); // getElementById
```

#### 49.出现最多的字符和个数

```js
let str = "abcabcabcbbccccc";
let num = 0;
let char = "";

// 使其按照一定的次序排列
str = str.split("").sort().join("");
// "aaabbbbbcccccccc"

// \1表示重复第一个括号里面的内容
let re = /(\w)\1+/g;
str.replace(re, (match, val, index, str) => {
    if (num < match.length) {
        num = match.length;
        char = val;
    }
});
console.log(`字符最多的是${char}，出现了${num}次`);
```

#### 50.实现 delay

```js
function delay(fn, ms, ...args) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            Promise.resolve(fn(...args)).then(resolve);
        }, ms);
    });
}

function log(name) {
    console.log("111111" + name);
}
delay(log, 2000, "jay");
```
