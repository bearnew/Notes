function foo(x) {
    x = x + 1;
    x; // 3
}
var a = 2;
var b = new Number(a); // Object(a)也一样
var c = a;
foo(b);
foo(c);
console.log(b); // 是Number {2}，不是3
console.log(c); // 2