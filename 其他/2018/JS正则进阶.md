#### 正则验证工具

[regexper.com](https://regexper.com/)

#### 1. 正则分组

通过分组$1,$2...取得()里面的匹配的内容

```javascript
var str = "http://img.mukewang.com/57ab14aa0001bc9706000338-240-135.jpg";
var result = str.replace(/http:(\/\/.+\.jpg)/, "$1");
console.log(result); // //img.mukewang.com/57ab14aa0001bc9706000338-240-135.jpg
```

```javascript
var str = "2018/1-21";
var result = str.replace(/^(\d{4})[/-](\d{2})[/-](\d{2})$/, "$2-$3-$1");
console.log(result); // 01-21-2018
```

#### 2. 修饰符

-   **g**: global 全文搜索
-   **i**: ignore case 不区分大小写
-   **m**: multiple lines 多行搜索

```javascript
var reg = /\bis\b/g;
var reg = new RegExp("\\bis\\b", "g");
```

#### 3. 量词

-   **?** 出现 0 次或 1 次（最多出现一次）
-   **+** 出现 1 次或多次（至少出现一次）
-   **\*** 出现 0 次或多次（任意次）
-   **{n}** 出现 n 次
-   **{n,m}** 出现 n 到 m 次
-   **{n,}** 至少出现 n 次

#### 4. 非贪婪模式(尽可能匹配少的次数)

量词后面加上?号

```javascript
"12345678".replace(/\d{3,6}?/g, "X"); // 'XX78'
```

#### 5. 忽略分组

不希望捕获分组，只需要在分组内加上?:就可以

```javascript
var str = "Byronabvdok";
var result = str.replace(/(?:Byron).*(ok)/i, "$1");
console.log(result); // ok
```

#### 6. 前瞻后顾

-   前瞻： `exp1(?=exp2)` 查找 exp2 前面的 exp1
-   后顾: `(?<=exp2)exp1` 查找 exp2 后面的 exp1
-   负前瞻: `exp1(?!exp2)` 查找后面不是 exp2 的 exp1
-   负后顾: `(?<!exp2)exp1` 查找前面不是 exp2 的 exp1

```javascript
"a2*34v8".replace(/\w(?=\d)/g, "X"); // X2*X4X8
"a2*34vV".replace(/\w(?!\d)/g, "X"); // aX*3XXX
```

#### 7. 正则对象方法

-   **test**
    存在匹配正则表达式的字符，返回 true，否则返回 false

```javascript
var reg = /\w/g;
reg.test("ab");
true;
```

-   **exec**
    如果没有匹配的文本返回 null，否则返回一个结果数组

```javascript
var reg1 = /\d(\w)\d/;
var reg2 = /\d(\w)\d/g;
var str = "$1a2b3c4";
var match1 = reg1.exec(str);
console.log(reg1.exec(str)); //	["1a2", "a", index: 1, input: "$1a2b3c4"]
console.log(reg2.exec(str)); // ["1a2", "a", index: 1, input: "$1a2b3c4"]
console.log(match1[0]); // 1a2
console.log(match1[1]); // a
console.log(match1[2]); // undefined
```

#### 8. 字符串对象方法

-   **search**
    返回第一个匹配结果的 Index,查找不到返回-1

```javascript
var reg = /\w/g;
"ab".search(reg); // 0
```

-   **match**
    如果没有匹配的文本返回 null，否则返回一个结果数组

```javascript
var reg = /\d(\w)\d/;
var str = "$1a2b3c4";
var match = str.match(reg);
console.log(match); // ["1a2", "a", index: 1, input: "$1a2b3c4"]
```

-   **replace**

String.prototype.replace(reg, function);

function 有 4 个参数

1. 匹配字符串
2. 正则分组内容，没有分组则没有该参数
3. 匹配项在字符串中的 index
4. 原字符串

```javascript
var reg = /(\d)(\w)(\d)/g;
var str = "a1b2c3d4f5";
str.replace(reg, function (match, group1, group2, group3, index, origin) {
    console.log(match); // 第一次:1b2 第二次:3d4
    console.log(group1); // 第一次:1 第二次:3
    console.log(group2); // 第一次:b 第二次:d
    console.log(group3); // 第一次:2 第二次:4
    console.log(index); // 第一次:1 第二次:5
    console.log(origin); // 第一次:a1b2c3d4f5 第二次:a1b2c3d4f5
});
```

#### 9.匹配单个数字出现 n 次

-   匹配单个数字重复 n 次：(\d)\1{n-1}
-   其中,\d 表示一位数字，
-   (\d)表示匹配之后捕获该匹配，并分组并对组进行编号
-   \1 表示被捕获的第一个分组
-   {n-1}是因为被捕获的第一个分组已经消耗了一位数字，因此要减 1。

#### 10.正则非

```js
rule.test = /^((?!\.styled).)*\.(sa|sc|c)ss$/;
```
