#### 函数节流(throttle)
> 指定时间间隔内只会执行一次任务

```js
function throttle(fn, interval = 300) {
    let canRun = true;

    return function() {
        if(!canRun){
            return;
        }
        canRun = false;

        setTimeout(() => {
            fn()
            canRun = true;
        }, interval)
    }
}
```
#### 函数防抖(debounce)
> 任务频繁触发的情况下，只有任务触发的间隔超过指定间隔的时候，任务才会执行。

```js
function debounce(fn, interval = 300) {
    let timeout = null;

    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn()
        }, interval)
    }
}
```

#### example

```js
function log(val) {
    console.log(val)
}

// 123 * 20
window.addEventListener('scroll', () => {
    log(123)
})

// 456 * 4
window.addEventListener('scroll', throttle(() => {
    log(456)
}))

// 789
window.addEventListener('scroll', debounce(() => {
    log(789)
}))
```

#### 知识扩展：分时函数
> 与函数截流功能一致，不同的是，函数截流为被动调用，分时函数为主动调用

> 应用场景: 避免Js一次性执行太多的任务，使用分时函数，每一段时间执行一次任务，直到所有的任务执行完。

```js
//  arr: 源数据
//  process: 处理函数
//  count: 每次抽取个数
function chunk(arr, process, count) {
    setTimeout(function () {
        console.log('--------------')

        const len = Math.min(count, arr.length);
        for (var i = 0; i < len; i++) {
            arr.shift();
            process();
        }

        if (arr.length > 0) {
            setTimeout(arguments.callee, 300)
        }
    }, 300)
}

const arr = new Array(29).fill(1);
const count = 10;
function process() {
    console.log('log')
}

// --------------
// log * 10
// --------------
// log * 10
// --------------
// log * 9
chunk(arr, process, count)
```

