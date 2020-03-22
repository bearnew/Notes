const ws = new WeakSet();
const obj = {};
const foo = {};

ws.add(window);
ws.add(obj);
ws.clear()

var a = {
    x: 1
}
var b = {
    x: 2
}
const m = new WeakMap([[a, 1], [b, 2]])
console.log(m)
a = null;
console.log(a)
m.clear()
console.log(m)