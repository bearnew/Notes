## underscore源码精髓
### 1.void 0替代undefined
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
### 2.类型判断
* toString的this未定义，返回"[object Undefined]"
* toString的this定义返回"[object 参数的构造函数]"
```js
toString('123123') // [object undefined]

var x = {};
x.toString = toString;
x.toString('123123') // [object Object]

var y = [];
y[0] = toString;
y[0]('1231') // [object, Array]

```
```js
_.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
  _['is' + name] = function(obj) {
    return toString.call(obj) === '[object ' + name + ']';
  };
});
```
