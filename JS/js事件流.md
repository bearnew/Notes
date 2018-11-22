## 事件流
### 事件执行顺序
1. 先进行事件捕获，再进行事件冒泡
2. 同一目标，既有捕获事件，又有冒泡事件，按事件注册顺序执行
```html
<div id="wrap">
    <div id="outer">
      <div id="inner"></div>
    </div>
</div>
```
```js
var wrap = document.getElementById('wrap');
var outet = document.getElementById('outer');
var inner = document.getElementById('inner');

wrap.addEventListener('click',function(){
  alert('789');
},false);
outer.addEventListener('click',function(){
  alert('456');
},false);
inner.addEventListener('click',function(){k
  alert('123');
},false);
wrap.addEventListener('click',function(){
  alert('wrap');
},true);
outer.addEventListener('click',function(){
  alert('outer');
},true);
inner.addEventListener('click',function(){
  alert('inner');
},true);

// wrap
// outer
// 123
// inner
// 456
// 789
```