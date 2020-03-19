## 1.加载非规范的模块
* 使用`require.config`的`shim`属性配置不兼容的模块
```js
// underscore和backbone都没有采用AMD规范编写
require.config({
    shim: {
        'underscore':{
            exports: '_'
　　　　  },
　　　　  'backbone': {
　　　　　　  deps: ['underscore', 'jquery'], // 依赖
　　　　　　  exports: 'Backbone'
　　　　  }
　　 }
});
```
## 2.加载自定义模块
* require.config配置shim中exports的值，一定要与相关文件中暴露出全局变量名称一致。如果暴露出多个全局变量，那么exports可以指定其中任何一个，作为模块的返回结果
```js
/* main.js */
define(["myCustomMod"], function(myCustomMod) {
    console.log(myCustomMod.max(1, 2, 3));
})
```
```js
/* myCustomMod.js */
var  myCustomMod = {};      // 很重要，和shim中exports值必须一致
myCustomMod.add = function(num1, num2) {
    return num1 + num2;
};
myCustomMod.max = function() {
    return Math.max.apply(Math, [].slice.call(arguments));
}
```
```js
/* require.config.js */
require.config({
    waitSeconds: 0,
    baseUrl: '/',
    paths: {
        myCustomMod: "myCustomMod"
    },
    shim: {
        "myCustomMod": {
            deps: [],
            exports: "myCustomMod"
        }
    }
})
```