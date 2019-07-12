## ==为true
* example
```js
[] == ![]; // true
[] == !{}; // true
null == undefined; // true
[1] == '1'; // true
{} == {}; // false, ({}).valueOf() == ({}).valueOf() 为true
{} == !{}; //false, !{}为false, {}为true
```
* rule
```js
1. undefined == null，结果是true。且它俩与所有其他值比较的结果都是false。

2. String == Boolean，需要两个操作数同时转为Number。

3. String/Boolean == Number，需要String/Boolean转为Number。

4. Object == Primitive，需要Object转为Primitive(具体通过valueOf和toString方法)。
```