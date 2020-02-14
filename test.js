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
