## underscore源码精髓
### 1. void 0替代undefined
#### 优点：
* 避免undefined在局部作用域中被重写过
```js
(function() {
  var undefined = 10;

  // 10 -- chrome
  alert(undefined);
})()
```
* 节省字节大小
