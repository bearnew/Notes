## 手写js原生函数
#### 1.new
```js
 function New(f) {
    //返回一个func
    return function () {
        var o = Object.create(f.prototype);
        f.apply(o, arguments);//继承父类的属性

        return o; //返回一个Object
    }
}

function foo(something) {
    this.a = something;
}

var baz = New(foo)(3);
console.log(baz.a); // 3
```
#### 2.JSON.stringify
1. 存在toJSON()方法，序列化时会直接调用该方法
2. Boolean|Number|String 会自动转换成对应的原始值
3. undefined|任意函数|symbol值，在序列化时会被忽略
4. 数组中的undefined|任意函数|symbol值，在序列化时会被转换成null
5. 以symbol为key的属性，会被忽略，即使使用了replacer函数
6. 不可枚举的属性，循环引用对象的本身，属性也会被忽略
7. Date的实例序列化时，返回toJSON的值
8. Infinity和NaN，序列化时被处理成null
9. 其他实例对象（map, set, weakmap, weakset）将只序列化他们可枚举的属性
```js

```