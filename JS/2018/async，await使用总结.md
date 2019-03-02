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

### 5.async串行与并行执行
```js
function getUserProfile(id) {
    console.log('1111111111')
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (typeof id === 'string') {
                resolve(id)
            } else {
                reject(id)
            }
        }, 2000)
    })
}

function getUserRepo(id) {
    console.log('2222222222222')
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (typeof id === 'string') {
                resolve(id + 10)
            } else {
                reject(id)
            }
        }, 100)
    })
}

// 串行执行会阻塞
async function getUserInfo(id) {
    const profile = await getUserProfile(id);
    const repo = await getUserRepo(id)
    console.log(profile)
    console.log(repo)

    return { profile, repo }
}

// 并行执行不会阻塞
async function getUserInfo(id) {
    const profilePromise = getUserProfile(id);
    const repoPromise = getUserRepo(id)

    const profile = await profilePromise;
    const repo = await repoPromise;

    console.log(profile)
    console.log(repo)
    return { profile, repo }
}

// 并行执行不会阻塞
async function getUserInfo(id) {
    const [profile, repo] = await Promise.all([
        getUserProfile(id),
        getUserRepo(id)
    ])
    console.log(profile)
    console.log(repo)
    return { profile, repo }
}

getUserInfo('1').then(data => {
    console.log(data)
}).catch(err => {
    console.error(err);
})
```
