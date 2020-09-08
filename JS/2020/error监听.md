## error监听
```js
// window.error监听同步错误
window.error = function() {

}

// unhandledrejection捕获异步错误
window.addEventListener('unhandledrejection', function (event) {
    
})
```