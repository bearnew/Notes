## 事件流
### 事件执行顺序
1. addEventListener
    ```js
    // useCapture, true-事件捕获，false-事件冒泡
    EventTarget.addEventListener(type, {
        capture, // 是否在捕获阶段触发事件
        once, // 是否只调用1次
        // 浏览器滚动时，会有一个短暂的停留来延迟检测是否要preventDefault,导致滑动卡顿
        // passive设置为ture，告诉浏览器是不调用preventDefault的，从而忽略检测
        passive
    }, useCapture)
    ```
2. 先进行事件捕获，再进行事件冒泡
3. 同一目标，既有捕获事件，又有冒泡事件，按事件注册顺序执行
```html
<div id="wrap">
    <div id="outer">
      <div id="inner"></div>
    </div>
</div>
```
```css

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