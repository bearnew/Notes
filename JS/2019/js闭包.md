## js闭包
#### 1.闭包的定义
在一个函数中，定义一个内层函数，并将内层函数作为一个返回值。
在全局中调用内层函数，就可以获取外层函数中的局部变量了。
#### 2.闭包用途
1. 读取函数内部的变量
2. 使变量的值始终保持在内存中
3. 用闭包模拟私有方法
4. 在循环中创建闭包
#### 3.闭包的缺点
1. 闭包会使得函数中的变量保存在内存中，内存消耗很大。
2. 闭包会在父函数外部，改变父函数内部变量的值。
3. 每次调用外部函数，都会重新创建内部函数。
4. 闭包的处理速度和内存消耗对脚本性能存在负面影响。
```js
    function f1(){
　　　　var n=999;

　　　　nAdd=function(){n+=1}

　　　　function f2(){
　　　　　　alert(n);
　　　　}

　　　　return f2;

　　}

　　var result=f1();

　　result(); // 999

　　nAdd();

　　result(); // 1000
```
#### 4.闭包常见的错误
> 循环中创建闭包（调用的时候才执行）
* 示例1：
```html
<p id="help">Helpful notes will appear here</p>
<p>E-mail: <input type="text" id="email" name="email"></p>
<p>Name: <input type="text" id="name" name="name"></p>
<p>Age: <input type="text" id="age" name="age"></p>
```
```js
function showHelp(help) {
  document.getElementById('help').innerHTML = help;
}

function setupHelp() {
  var helpText = [
      {'id': 'email', 'help': 'Your e-mail address'},
      {'id': 'name', 'help': 'Your full name'},
      {'id': 'age', 'help': 'Your age (you must be over 16)'}
    ];

  for (var i = 0; i < helpText.length; i++) {
    var item = helpText[i];
    document.getElementById(item.id).onfocus = function() {
      showHelp(item.help); // Your age (you must be over 16)
    }
  }
}

setupHelp();
```
* 示例2：
```js
function count() {
    var arr = [];
    for (var i=1; i<=3; i++) {
        arr.push();
    }
    return arr;
}

var results = count();
var f1 = results[0];
var f2 = results[1];
var f3 = results[2];

f1(); // 16
f2(); // 16
f3(); // 16
```
* 示例3：
```js
for (var i = 0; i < 10; i++) {
    setTimeout(function() { console.log(i); }, 100 * i);
}
```
#### 5.闭包解决方案
* 1.使用匿名函数，增加闭包域空间
匿名函数添加在外层，i进行传值
```js
for (var i = 0; i < helpText.length; i++) {
    (function (i) {
        var item = helpText[i];
        document.getElementById(helpText[i].id).onfocus = function() {
            showHelp(item.help);
        }
    })(i)
}
```
匿名函数添加在外层，i进行赋值
```js
for (var i = 0; i < helpText.length; i++) {
    (function() {
        var item = helpText[i];
        document.getElementById(item.id).onfocus = function() {
            showHelp(item.help);
        }
    })()
}
```
匿名函数添加在内层，i进行传值
```js
for (var i = 0; i < helpText.length; i++) {
    var item = helpText[i];
    document.getElementById(helpText[i].id).onfocus = (function(i) {
        return function() {
            showHelp(helpText[i].help);
        }
    })(i)
}
```
匿名函数添加在内层，i进行赋值
```js
for (var i = 0; i < helpText.length; i++) {
    var item = helpText[i];
    document.getElementById(item.id).onfocus = (function() {
        const item = helpText[i];
        return function() {
            showHelp(item.help);
        }
    })()
}
```

* 2.将Index存放在调用的对象上
```js
for (var i = 0; i < helpText.length; i++) {
    var item = helpText[i];
    var $dom = document.getElementById(helpText[i].id);
    $dom.index = i;
    $dom.onfocus = function() {
        showHelp(helpText[this.index].help);
    }
}
```
* 3.将Index绑定到函数的属性上
```js
for (var i = 0; i < helpText.length; i++) {
    var item = helpText[i];
    (document.getElementById(item.id).onfocus = function() {
        console.log(arguments)
        // arguments.callee获取当前执行的函数
        const item = helpText[arguments.callee.i];
        showHelp(item.help);
    }).i = i;
}
```
* 4.使用let
```js
for (var i = 0; i < helpText.length; i++) {
    let item = helpText[i];
    document.getElementById(item.id).onfocus = function() {
        showHelp(item.help);
    };
}
```