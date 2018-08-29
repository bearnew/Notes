## javascript冷知识
#### 1.运算符
> 二进制，一个正数，按照绝对值大小转换成的二进制数；一个负数按照绝对值大小转换成的二进制数，然后最高位补1，称为原码。
> <br/>比如 00000000 00000000 00000000 00000101 是 5的 原码。
> <br/>10000000 00000000 00000000 00000101 是 -5的 原码。
<table border="1">
    <tr align="center">
        <th>name</th>
        <th>symbol</th>
        <th>description</th>
        <th>example</th>
    </tr>
    <tr align="center">
        <td>按位或（or）</td>
        <td> | </td>
        <td>两个二进制中有一个为1，则为1，否则为0.</td>
        <td>eg. 3 | 5，<br/>即 0000 0011 | 0000 0101 = 0000 0111，<br/>因此，3 | 5的值得7。</td>
    </tr>
    <tr align="center">
        <td>按位与（and）</td>
        <td> & </td>
        <td>两个二进制都为1，则为1，否则为0.</td>
        <td>eg. 3 & 5，<br/>即 0000 0011 & 0000 0101 = 0000 0001，<br/>因此，3 & 5的值得1。</td>
    </tr>
    <tr align="center">
        <td>按位非（not）</td>
        <td> ~ </td>
        <td>将一个二进制变成相反值</td>
        <td>eg. ~-1，<br/>即 ~0000 0001 = 0000 0000，<br/>因此，~-1的值得0。</td>
    </tr>
    <tr align="center">
        <td>按位异或（xor）</td>
        <td> ^ </td>
        <td>两个二进制中值不同，结果为1，否则为0.</td>
        <td>eg. 9 ^ 5，<br/>即 0000 1001 ^ 0000 0101 = 0000 1100，<br/>因此，9 ^ 5的值得12。</td>
    </tr>
    <tr align="center">
        <td>左移运算（left shift）</td>
        <td> << </td>
        <td>将 a 的二进制形式向左移 b (< 32) 比特位，右边用0填充。</td>
        <td>eg. 4<<1 // 8，7<<2 // 28 ,可以模拟成乘2的指数，</td>
    </tr>
    <tr align="center">
        <td>右移运算（right shift）</td>
        <td> >> </td>
        <td>将 a 的二进制表示向右移 b (< 32) 位，丢弃被移出的位。</td>
        <td>eg. 4>>1 // 2, 5>>2 // 1, 可以模拟成除2的指数整除运算</td>
    </tr>
    <tr align="center">
        <td>无符号右移</td>
        <td> >>> </td>
        <td>将 a 的二进制表示向右移 b (< 32) 位，丢弃被移出的位，并使用 0 在左侧填充。</td>
        <td>eg. 3>>>0 // 3</td>
    </tr>
</table>


取整方法总结
```
~~1.23  两次否运算，舍弃小数部分
1.23^0  异或运算符，舍弃小数部分
1.23|0  或运算符，舍弃小数部分
1.23<<0 左移运算符 ，舍弃小数部分
1.23>>0 右移运算符，舍弃小数部分
1.23>>>0带符号的右移运算符，只对正数有用
parseInt()舍弃小数部分
Math.round()四舍五入取整
Math.floor()向下取整
Math.ceil()向上取整
```

#### 2.单行写一个评级组件
```js
"★★★★★☆☆☆☆☆".slice(5 - rate, 10 - rate); 
```
#### 3.数组扁平化
```js
const flatten = (ary) => ary.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
```
```js
function flatten(a) {
    return Array.isArray(a) ? [].concat(...a.map(flatten)) : a;
}
```
#### 4.将arguments对象转换成数组
```js
var argArray = Array.prototype.slice.call(arguments);

// ES6：
var argArray = Array.from(arguments)

// or
var argArray = [...arguments];
```
#### 5.使用```~x.indexOf('y')```来简化```x.indexOf('y')>-1```
```js
var str = 'hello world';
if (str.indexOf('lo') > -1) {
    // ...
}

if (~str.indexOf('lo')) {
    // ...
}

```
#### 6.数据安全类型检查
```js
// 对象
function isObject(value) {
  return Object.prototype.toString.call(value).slice(8, -1) === 'Object';
}

// 数组
function isArray(value) {
  return Object.prototype.toString.call(value).slice(8, -1) === 'Array';
}

// 函数
function isFunction(value) {
  return Object.prototype.toString.call(value).slice(8, -1) === 'Function';
}
```