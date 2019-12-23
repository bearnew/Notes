## ==为true
* example

```js
[] == ![]; // true, ![]为false, [] == false, '' == false, 0 == 0
[] == !{}; // true, !{}为false, [] == false, '' == false, 0 == 0
NaN == !NaN; // true
NaN === !NaN; // true
NaN == 0; // false
null == undefined; // true
[1] == '1'; // true, '1' == '1'
{} == {}; // false, ({}).valueOf() == ({}).valueOf() 为true
{} == !{}; //false, {} == false, Number({}) == Number(false), NaN == 0, false

Object.defineProperty(window, 'a', {
    get: function () {
        return ''
    }
})

var b = {
    valueOf: function () {
        console.log('valueof')
        return ''
    },
    toString: function () {
        console.log('tostring')
        return ''
    },
}

console.log(b == a) // true, b == '', b.valueOf() == '', true
console.log(b == []) // false, 比较栈中的地址，为false
console.log([] == a) // true, [] == '', [].toString() == '', false
```
* rule

```js
1. undefined == null，结果是true。且它俩与所有其他值比较的结果都是false。

2. String == Boolean，需要两个操作数同时转为Number。

3. String/Boolean == Number，需要String/Boolean转为Number。

4. Object == Primitive，需要Object转为Primitive(具体通过valueOf和toString方法)。

5. Object == Object, 直接比较`Object`在栈中地址
```