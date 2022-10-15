# js错误
## 1.JS错误类型
1. `RangeError`
    - 当数字类型变量或者参数超出其有效范围时，出现 `RangeError` 的错误提示
    ```ts
    // Uncaught RangeError: Maximum call stack size exceeded
    function loop(i) {
        loop(i+1);
    }
    loop(1);
    ```
2. `ReferenceError`
    - 当引用无效时，会出现 `ReferenceError` 的错误提示
    ```ts
    "use strict";
    console.log(notValidVar); // ReferenceError: notValidVar 未定义
    ```
3. `SyntaxError`
    - 当解析无效 `JavaScript` 代码时，会出现 `SyntaxError` 的错误提示
    ```ts
    1 *** 3 // SyntaxError: 无效的标记 *
    let age b = 18; // Uncaught SyntaxError: Unexpected identifier 'b'
    ```
4. `TypeError`
    - 变量或者参数不是有效类型时，会出现 TypeError 的错误提示
    ```ts
    "1.2".toPrecision(1); // TypeError: '1.2'.toPrecision 不是函数。
    '123'.map(i => console.log(i)) // TypeError: "123".map is not a function
    ```
5. `URIError`
    - 当传入无效参数至 `encodeURI()` 和 `decodeURI()` 时，会出现 `URIError` 的错误提示
    ```ts
    decodeURI("%"); // URIError: URL 异常
    ```
6. `DOMException`
    - 浏览器违规操作 dom
    ```ts
    // Uncaught DOMException: Node.appendChild: May not add a Document as a child
    document.body.appendChild(document.cloneNode(true));
    ```
7. `EvalError`

    - 当`eval`使用不当时便会抛出`EvalError`
    - `ECMAScript` 新规范不再抛出此错误

    ```ts
    try {
        throw new EvalError("EvalError has occurred");
    } catch (e) {
        console.log(e instanceof EvalError); // true
        console.log(e.message); // EvalError has occurred
        console.log(e.name); // EvalError
    }
    ```

8. `InternalError`(`ECMAScript`新规范不再抛出此错误)
    - `InternalError` 对象表示出现在`JavaScript` 引擎内部的错误。 
    - "InternalError: too many switch cases"（过多case子句）；
    - "InternalError: too many parentheses in regular expression"（正则表达式中括号过多）；
    - "InternalError: array initializer too large"（数组初始化器过大）；
    - "InternalError: too much recursion"（递归过深）。

## 2.抛出错误
1. 语法分析的时候抛出`SyntaxError`语法错误
    - https://github.com/SampsonKY/Daily_question/issues/19
    - 词法分析转换成token: https://www.clloz.com/programming/compilers/2019/04/07/lexical-analysis-token/
    - 语法分析转换成AST: https://gist.github.com/snailkn/b703f68c6c77ff5a75ae80a79e8f6c16
    - example
    ```js
    // Uncaught SyntaxError: Unexpected identifier 'b'
    console.log('code start')
    const func = () => {
        let age b = 123;
    }

    const test = () => {
        console.log('function start')
        func();
        console.log('function end')
    }

    test();
    console.log('code end')
    ```
    ```js
    // SyntaxError: Unexpected identifier
    // let age b = 1;

    process.on('uncaughtException', function (err) {
        console.log('uncaughtException', err)
    });

    console.log('code start')
    const func = async () => {
        console.log('promise start')
        let age b = 1;
        console.log(noValid)
        console.log('promise end')
    }

    const test = () => {
        console.log('function start')
        func();
        console.log('function end')
    }

    test();
    console.log('code end')
    ```
2. 代码执行的时候出错(非`SyntaxError`语法错误)
    - 同步错误，阻塞后续代码执行
    ```js
    // code start
    // function start
    // Uncaught ReferenceError: noValid is not defined

    console.log('code start')
    const func = () => {
        console.log(noValid)
    }

    const test = () => {
        console.log('function start')
        func();
        console.log('function end')
    }

    test();
    console.log('code end')
    ```
    - 异步错误，只阻塞函数体内代码执行
    ```js
    // code start
    // function start
    // promise start
    // function end
    // code end
    // Uncaught (in promise) ReferenceError: noValid is not defined

    console.log('code start')
    const func = async () => {
        console.log('promise start')
        console.log(noValid)
        console.log('promise end')
    }

    const test = () => {
        console.log('function start')
        func();
        console.log('function end')
    }

    test();
    console.log('code end')
    ```
## 3.浏览器监听错误
1. 监听同步错误
    - `addEventListener`与`onerror`参数不同
    - `addEventListener`能监听资源错误
    - `onerror`比`addEventListener`先触发
    - `addEventListener`能够多次订阅，`onerror`是`window`上的属性，多次订阅会覆盖
    ```js
    window.addEventListener('error', function (event) {
        // listen error ErrorEvent {isTrusted: true, message: 'Script error.', filename: '', lineno: 0, colno: 0, …}
        console.log('listen error', event)
    }, true)

    window.onerror = function(errMsg) {
        // on error Script error.
        console.log('on error', errMsg)
    }
    ```
2. 监听未显式处理的`Promise`异常
    - `unhandledrejection` 只能捕获未显式处理的`Promise`异常
    - `addEventListener`能够多次订阅，`onerror`是`window`上的属性，多次订阅会覆盖
    ```js
        window.addEventListener('unhandledrejection', function (event) {
            // listen error ErrorEvent {isTrusted: true, message: 'Script error.', filename: '', lineno: 0, colno: 0, …}
            console.log('listen error', event)
        }, true)

        window.onunhandledrejection = function(errMsg) {
            // on error Script error.
            console.log('on error', errMsg)
        }

        // 能触发 unhandledrejection ，因为未显式处理
        new Promise((resolve, reject) => {
            reject(1)
        }).then(() => {})

        // 能触发 unhandledrejection ，因为未显式处理
        Promise.reject('test').then(console.log)

        // 不能触发 unhandledrejection ，因为已处理
        Promise.reject('test').then(console.log, console.log)

        // 不能触发 unhandledrejection ，因为没处理，直接抛出异常
        Promise.reject('test')

        // 不能触发 unhandledrejection ，因为没处理，直接抛出异常
        new Promise((resolve, reject) => {
            reject(1)
        });

        // 不能触发unhandledrejection，因为非Promise包裹的异常
        Promise.resolve().then(() => {
            console.log(noValid)
        })
    ```
3. 异步错误处理
    1. 在`await`外层使用`try catch`
    2. 在`then`的第2个参数捕获
    3. 用`promise.catch`捕获
    ```js
    const func = () => {
        return new Promise((resolve, reject) => {
            reject('promise reject');
        })
    }

    // const test = async () => {
    //     try {
    //         await func();
    //     } catch (err) {
    //         console.log('tyr catch', err)
    //     }
    // }

    // const test = async () => {
    //     func().then(res => {
    //     }, rej => {
    //         console.log('then second cb', rej)
    //     })
    // }

    const test = async () => {
        func().catch(err => {
            console.log('promise catch', err)
        })
    }

    test();
    ```
4. 统一处理错误
    - 高阶函数
    ```js
    const handleTryCatch = (fn: (...args: any[]) => Promise<{}>) => async (...args: any[]) => {
    try {
        return [null, await fn(...args)];
    } catch(e) {
        console.log(e, 'e.messagee');
        return [e];
    }
    }

    async function main () {
        const [err, res] = await handleTryCatch(fetchFailure)('');
        if(err) {
            console.log(err, 'err');
            return;
        }
        console.log(res, 'res');
    }
    ```
    - 装饰器
    ```js
    const asyncErrorWrapper = (errorHandler: (e: Error) => void = errorHandle) => (target: Function) => {
    const props = Object.getOwnPropertyNames(target.prototype);
    props.forEach((prop) => {
        var value = target.prototype[prop];
        if(Object.prototype.toString.call(value) === '[object AsyncFunction]'){
            target.prototype[prop] = async (...args: any[]) => {
            try{
                return await value.apply(this,args);
            }catch(err){
                return errorHandler(err);
            }
            }
        }
    });
    }

    @asyncErrorWrapper(errorHandle)
    class Store {
        async getList (){
            return Promise.reject('类装饰：失败了');
        }
    }

    const store = new Store();

    async function main() {
        const o = await store.getList();
    }
    main();
    ```
## 4.监听node错误
1. 使用`process.on('uncaughtException', function (err) {})`监听同步错误
- 无法捕获路由里面的错误（todo）
```js
// code start
// function start
// promise start
// uncaughtException ReferenceError: noValid is not defined

process.on('uncaughtException', function (err) {
    console.log('uncaughtException', err)
});

console.log('code start')
const func = () => {
    console.log('promise start')
    console.log(noValid)
    console.log('promise end')
}

const test = () => {
    console.log('function start')
    func();
    console.log('function end')
}

test();
console.log('code end')
```
2. 使用`process.on('unhandledrejection', function (err) {}`监听异步错误
```js
// code start
// function start
// promise start
// function end
// code end
// (node:14182) UnhandledPromiseRejectionWarning: ReferenceError: noValid is not defined

process.on('uncaughtException', function (err) {
    console.log('uncaughtException', err)
});

console.log('code start')
const func = async () => {
    console.log('promise start')
    console.log(noValid)
    console.log('promise end')
}

const test = () => {
    console.log('function start')
    func();
    console.log('function end')
}

test();
console.log('code end')
```