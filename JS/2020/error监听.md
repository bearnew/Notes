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
## window.addEventListener('error')与window.onerror的异同点在于
1. 前者能够捕获到资源加载错误，后者不能。
2. 都能捕获js运行时错误，捕获到的错误参数不同。前者参数为一个event对象；后者为 msg, url, lineNo, columnNo, error一系列参数。event对象中都含有后者参数的信息。
```js
window.addEventListener('error', function (event) {
  console.log(event)
  if (event) {
    var target = event.target || event.srcElement;
    // 写上
    var isElementTarget = target instanceof HTMLElement
    if (!isElementTarget) return; // js error不再处理

    var source = event.target
    // 对该资源进行处理..
  }
  //设为true表示捕获阶段调用，会在元素的onerror前调用
}, true)
```
## document.addEventListener 可以用来监听Element元素的加载情况
```js
document.addEventListener('load', function (event) {
  if (event) {
    var target = event.target
    if(target.localName==='iframe'){
      // 继续判断...
    } else{
      //资源加载成功处理..
    }
  }
}, true)

document.addEventListener('error', function (event) {
  if (event) {
    var target = event.target
    // 资源加载错误处理.. target.outerHTML 拿到原标签内容，例 <img src="./img/a.png">
  }
  //设为true表示捕获阶段调用，会在元素的onerror前调用,在window.addEventListener('error')后调用
}, true)
```
## 监控资源加载失败
1. script onerror
```js
<script onerror="onError(this)"></script>  

new ScriptExtHtmlWebpackPlugin({
    custom: {
      test: /\.js$/,
      attribute: 'onerror',
      value: 'onError(this)'
    }
 })
```
2. window.addEventListener
* `onerror` 的事件并不会向上冒泡，`window.onerror` 接收不到加载失败的错误
* 冒泡虽不行，但捕获可以！我们可以通过捕获的方式全局监控加载失败的错误
* 这也监控到了脚本错误，但通过 `!(event instanceof ErrorEvent)` 判断便可以筛选出加载失败的错误
```js
window.addEventListener('error', (event) => {
  if (!(event instanceof ErrorEvent)) {
    // todo
  }
}, true);
```  