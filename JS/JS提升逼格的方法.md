#### 1.new Set()
```
let arr = [1, 2, 2, 3];
let set = new Set(arr);
let newArr = Array.from(set); // Array.from将Set结构转换成数组

console.log(newArr) // [1, 2, 3]
```
#### 2.Object.assign()
```
let obj1 = {a: 1};
let obj2 = {b: 2};
let obj3 = Object.assign({}, obj1, obj2);

console.log(obj3); // {a: 1, b: 2}
```
#### 3.map()
```
let arr3 = [1, 2, 3, 4, 5];
let newArr3 = arr3.map((e, i) => e * 10); // 给数组每一项乘以10

console.log(newArr3); // [10, 20, 30, 40, 50]
```
#### 4.filter()
```
let arr4 = [1, 2, 3, 4, 5];
let newArr4 = arr4.filter((e, i) => e % 2 === 0); // 取模，过滤余数不为0的数

console.log(newArr4); // [2，4]
```
#### 5.some()
```
let arr5 = [{result: true}, {result: false}];
let newArr5 = arr5.some((e, i) => e.result); // 只要一个为true，即为true

console.log(newArr5); // true
```
#### 6.every()
```
let arr6 = [{result: true}, {result: false}];
let newArr6 = arr6.every((e, i) => e.result); // 只要一个为false，即为false

console.log(newArr6); // false
```
#### 7.~~运算符
> ~符号用在JavaScript中有按位取反的作用，~~即是取反两次，而位运算的操作值要求是整数，其结果也是整数，所以经过位运算的都会自动变成整数，可以巧妙的去掉小数部分，类似于parseInt，比如：

```
let a = 1.23;
let b = -1.23;

console.log(~~a); // 1
console.log(~~b); // -1
```
#### 8.||设置默认值
```
let c = 1;
let d = c || 2; // 如果c的值为true则取存在的值，否则为2

console.log(d); // 1
```
#### 9.     ...运算符
> …运算符是ES6中用于解构数组的方法，可以用于快速获取数组的参数，比如：

```
let [num1, ...nums] = [1, 2, 3];

console.log(num1); // 1
console.log(nums); // [2, 3]
```
#### 10.三元运算符
```
let e = true,
    f = '';

if (e) {
    f = 'man';
} else {
    f = 'woman';
}

// 等同于
e ? f = 'man' : f = 'woman';
```