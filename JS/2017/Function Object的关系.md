## Object和Function的关系
* Object Array Function Number都是构造函数, 所以`Object instanceof Function`为true;
* Function.prototype是1个对象，所以`Function instanceof Object`为true
```js
console.log(Object instanceof Function); // true
console.log(Object instanceof Object); // true
console.log(Function instanceof Function); // true
console.log(Function instanceof Object); // true
```
```js
function F() { }
Object.prototype.a = 'a';
Function.prototype.b = 'b';
F.prototype.c = 'c;'

// 创建一个空对象f
// 空对象f的prototype指向F的prototype的拷贝
// F内的this指向f,并执行F内的方法
var f = new F();

console.log(F instanceof Object); // true
console.log(F instanceof Function); // true
console.log(f instanceof Object); // true
console.log(f instanceof Function); // false

console.log(f.a, f.b, f.c); // a undefined c
console.log(f.constructor.a, f.constructor.b, f.constructor.c, F.c); // a b undefined undefined
```