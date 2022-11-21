## promise 两种写法

-   1.`new Promise`里面只能使用`resolve`
-   2.函数本身为`Promise`时，可使用`return Promise.resolve()`, 或直接使用`return`

```js
function test1() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(123);
        }, 1000);
    });
}

function test2() {
    return test1().then((res) => {
        return 456;
    });
}

function test3() {
    return test2().then((res) => {
        return Promise.resolve(789);
    });
}

test1().then((res) => {
    console.log(res); // 123
});

test2().then((res) => {
    console.log(res); // 456
});

test3().then((res) => {
    console.log(res); // 789
});
```

## promise 错误处理

### 1.reject 后的东西，then 中有第二个回调，进入第二个回调

```js
var test = function () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject("失败了");
        }, 1000);
    });
};

test()
    .then(
        (res) => {
            console.log("sucess", res);
        },
        (fail) => {
            console.log("fail", fail);
        }
    )
    .catch((err) => {
        console.error("catch", err);
    });

// fail 失败了
```

### 2.如果 then 中没有写第二个回调，则进入 catch

```js
var test = function () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject("失败了");
        }, 1000);
    });
};

test()
    .then((res) => {
        console.log("sucess", res);
    })
    .catch((err) => {
        console.error("catch", err);
    });

// catch 失败了
```

### 3.多层 promise 错误处理

-   **错误做法（容易出现程序 Bug）:**

```js
var promiseStart = new Promise(function (resolve, reject) {
    reject("promise is rejected");
});

promiseStart
    .then(
        (res) => {
            console.log("resolved");
            return new Promise(function (resolve, reject) {
                resolve("promise is resolved");
            });
        },
        (fail) => {
            console.log("rejected:", fail);
        }
    )
    .then((res) => {
        console.log("resolved:", res);
    })
    .catch(function (err) {
        console.error("catched:", err);
    });

// rejected: promise is rejected
// resolved: undefined
```

-   **正确做法（catch 掉错误）:**

```js
var promiseStart = new Promise(function (resolve, reject) {
    reject("promise is rejected");
});

promiseStart
    .then((res) => {
        console.log("resolved");
        return new Promise(function (resolve, reject) {
            resolve("promise is resolved");
        });
    })
    .then((res) => {
        console.log("resolved:", res);
    })
    .catch(function (err) {
        console.error("catched:", err);
    });

// catched: promise is rejected
```

```js
// 5555 1
// success
const test = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return reject(1);
        }, 1000);
    }).catch((err) => {
        console.log("5555", err);
    });
};

test()
    .then(() => {
        console.log("success");
    })
    .catch((err) => {
        console.log("66666", err);
    });
```

## new Promise 主体代码立即执行

```js
const myPromise = new Promise((resolve, reject) => {
    // 这里是 Promise 主体，执行异步任务
    console.log(1);
    ajax("xxx", () => {
        resolve("成功了");
    });
}).then(() => {
    console.log(2);
});
console.log(3); // 最终输出 1、3、2
```

## 第 1 个异常被捕获后，返回一个新的 promise，进入到后面的 then 逻辑

```js
// 捕获异常啦
// 成功
const p = new Promise((resolve, reject) => {
    reject("异常啦"); // 或者通过 throw new Error() 跑出异常
})
    .catch((err) => {
        console.log("捕获异常啦"); // 进入
    })
    .catch(() => {
        console.log("还有异常吗"); // 不进入
    })
    .then(() => {
        console.log("成功"); // 进入
    });
```

## async await

-   await 同一行后面的内容对应 Promise 主体内容，即同步执行的
-   await 下一行的内容对应 then()里面的内容，是异步执行的
-   await 同一行后面应该跟着一个 Promise 对象，如果不是，需要转换（如果是常量会自动转换）
-   async 函数的返回值还是一个 Promise 对象

## Promise 中断

```js
function getPromiseWithCancel(originPromise) {
    let cancel = (v) => {};
    let isCancel = false;
    const cancelPromise = new Promise(function (resolve, reject) {
        cancel = (e) => {
            isCancel = true;
            reject(e);
        };
    });
    const groupPromise = Promise.race([originPromise, cancelPromise]).catch(
        (e) => {
            if (isCancel) {
                // 主动取消时，不触发外层的 catch
                return new Promise(() => {});
            } else {
                return Promise.reject(e);
            }
        }
    );
    return Object.assign(groupPromise, { cancel });
}

// 使用如下
const originPromise = axios.get(url);
const promiseWithCancel = getPromiseWithCancel(originPromise);
promiseWithCancel.then((data) => {
    console.log("渲染数据", data);
});
promiseWithCancel.cancel(); // 取消 Promise，将不会再进入 then() 渲染数据
```
