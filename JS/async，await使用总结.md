## async，await使用总结
### 1.async函数返回的是一个Promise对象
> 如果函数return的一个直接量，async会把这个直接量通过Promise.resolve()封装成Promise对象。
```js
async function testAsync() {
    return 'hello async';
}

testAsync().then(v => {
    console.log(v); // 输出 hello async
})
```
### 2.await不仅用于等待Promise对象，也可以接普通函数或直接量
```js
function getSomething() {
    return "something";
}

async function testAsync() {
    return Promise.resolve("hello async");
}

async function test() {
    const v1 = await getSomething();
    const v2 = await testAsync();
    console.log(v1, v2); // 输出 something Promise {<resolved>: "hello async"}
}

test();
```
### 3.await必须在async函数的上下文中
### 4.async会将其后函数的返回值封装成一个Promise对象，await会等待这个Promise完成，并将其resolve的结果返回出来