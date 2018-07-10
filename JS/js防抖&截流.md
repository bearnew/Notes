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

window.addEventListener('scroll', throttle(() => {
    log(123)
}))

window.addEventListener('scroll', debounce(() => {
    log(123)
}))
```
