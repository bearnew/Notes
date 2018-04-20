### (a == 1 && a == 2 && a == 3)为true
##### 1.valueof
``` js
const a = {
  i: 1,
  valueOf: function () {
    return a.i++;
  }
}

if(a == 1 && a == 2 && a == 3) {
  console.log('Hello World!');
}
```
##### 2.半宽度韩文,是一个Unicode 空格字符
``` js
var aﾠ = 1;
var a = 2;
var ﾠa = 3;
if(aﾠ==1 && a== 2 &&ﾠa==3) {
    console.log("Why hello there!")
}
```
##### 3.用Object.defineProperty定义get属性
``` js
var val = 0;
Object.defineProperty(window, 'a', {
  get: function() {
    return ++val;
  }
});
if (a == 1 && a == 2 && a == 3) {
  console.log('yay');
}
```
##### 4.This works because == invokes toString which calls .join for Arrays.
* 数组进行转换时，会调用join方法
* 例如 a == '1,2,3'为true
* a.join = a.shift, 第一次转换a，即调用a.join(),相当于调用a.shift。得到1，此时a为[2,3]
* 第二次转换得到2,此时a为[3]
``` js
a = [1,2,3];
a.join = a.shift;
console.log(a == 1 && a == 2 && a == 3);
```
##### 5.if里面的a相当于获取with里面对象的.a，.a的话会直接去取get下面的a方法
``` js
var i = 0;
with({
    get a() {
        return ++i;
    }
}) {
    if (a == 1 && a == 2 && a == 3) {
        console.log('wohoo')
    }
}
```