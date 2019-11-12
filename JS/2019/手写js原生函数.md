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
#### 5.apply
#### 6.bind
#### 7.继承
#### 8.js函数柯里化
#### 9.promise
```js
new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(111);
    }, 1000)
}).then(data => {
    return new Promise((resolve, reject) => {
        resolve(data + 1111);
    })
}).then(data => {
    console.log(data);
}).catch((ex) => {
    console.log('error', ex)
})

function Promise(fn) {
    let state = 'pending'
    let value = null
    const callbacks = []

    this.then = function (onFulfilled, onRejected) {
        return new Promise((resolve, reject) => {
            handle({
                onFulfilled,
                onRejected,
                resolve,
                reject,
            })
        })
    }

    this.catch = function (onError) {
        this.then(null, onError)
    }

    this.finally = function (onDone) {
        this.then(onDone, onError)
    }

    this.resolve = function (value) {
        if (value && value instanceof Promise) {
            return value
        } if (value && typeof value === 'object' && typeof value.then === 'function') {
            const { then } = value
            return new Promise((resolve) => {
                then(resolve)
            })
        } if (value) {
            return new Promise(resolve => resolve(value))
        }
        return new Promise(resolve => resolve())
    }

    this.reject = function (value) {
        return new Promise(((resolve, reject) => {
            reject(value)
        }))
    }

    this.all = function (arr) {
        const args = Array.prototype.slice.call(arr)
        return new Promise(((resolve, reject) => {
            if (args.length === 0) return resolve([])
            let remaining = args.length

            function res(i, val) {
                try {
                    if (val && (typeof val === 'object' || typeof val === 'function')) {
                        const { then } = val
                        if (typeof then === 'function') {
                            then.call(val, (val) => {
                                res(i, val)
                            }, reject)
                            return
                        }
                    }
                    args[i] = val
                    if (--remaining === 0) {
                        resolve(args)
                    }
                } catch (ex) {
                    reject(ex)
                }
            }
            for (let i = 0; i < args.length; i++) {
                res(i, args[i])
            }
        }))
    }

    this.race = function (values) {
        return new Promise(((resolve, reject) => {
            for (let i = 0, len = values.length; i < len; i++) {
                values[i].then(resolve, reject)
            }
        }))
    }

    function handle(callback) {
        if (state === 'pending') {
            callbacks.push(callback)
            return
        }

        const cb = state === 'fulfilled' ? callback.onFulfilled : callback.onRejected
        const next = state === 'fulfilled' ? callback.resolve : callback.reject

        if (!cb) {
            next(value)
            return
        }
        try {
            const ret = cb(value)
            next(ret)
        } catch (e) {
            callback.reject(e)
        }
    }
    function resolve(newValue) {
        const fn = () => {
            if (state !== 'pending') return

            if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
                const { then } = newValue
                if (typeof then === 'function') {
                    // newValue 为新产生的 Promise,此时resolve为上个 promise 的resolve
                    // 相当于调用了新产生 Promise 的then方法，注入了上个 promise 的resolve 为其回调
                    then.call(newValue, resolve, reject)
                    return
                }
            }
            state = 'fulfilled'
            value = newValue
            handelCb()
        }

        setTimeout(fn, 0)
    }
    function reject(error) {
        const fn = () => {
            if (state !== 'pending') return

            if (error && (typeof error === 'object' || typeof error === 'function')) {
                const { then } = error
                if (typeof then === 'function') {
                    then.call(error, resolve, reject)
                    return
                }
            }
            state = 'rejected'
            value = error
            handelCb()
        }
        setTimeout(fn, 0)
    }
    function handelCb() {
        while (callbacks.length) {
            const fn = callbacks.shift()
            handle(fn)
        }
    }
    fn(resolve, reject)
}
```
#### 10.防抖与节流
#### 11.js深拷贝
#### 12.instanceof

