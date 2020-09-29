## error监听
```js
// window.error监听同步错误
window.error = function() {

}

// unhandledrejection捕获异步错误
window.addEventListener('unhandledrejection', function (event) {
    
})
```
## error处理
```js
// TypeError: Cannot read property 'gametype' of undefined
//     at <anonymous>:1:26
try{var a = undefined; a.gametype}catch(err) {console.log(err)}
```
```js
// {}
try{var a = undefined; a.gametype}catch(err) {console.log(JSON.stringify(err))}
```
```js
// "Cannot read property 'gametype' of undefined"
try{var a = undefined; a.gametype}catch(err) {console.log(JSON.stringify(err.message))}
```