## 深入JSON.stringify
### 1.第二个参数
* 数组
```js
var foo = {
    foundation: 'Mozilla',
    model: 'box',
    week: 45,
    transport: 'car',
    month: 7
};

// {"model":"box"}
console.log(JSON.stringify(foo, ['model', 'name']));
```
* 函数
```js
const user = {
    name: 'jay',
    age: 26
}

// {"age":26}
console.log(JSON.stringify(user, (key, value) => {
    if (typeof value === 'string') {
        return undefined;
    }
    return value;
}))
```
### 2.第三个参数
* 数字
```js
const user = {
    name: 'jay',
    age: 26
}

// {
//     "name": "jay",
//     "age": 26
// }
console.log(JSON.stringify(user, null, 5)); // 5个space
```
* 字符串
```js
const user = {
    name: 'jay',
    age: 26
}

// {
//     ** "name": "jay",
//     ** "age": 26
// }
console.log(JSON.stringify(user, null, '**')); // 用**填充
``` 
### 3.toJSON方法 
```js
const user = {
    name: 'jay',
    age: 26,
    toJSON() {
        return {
            des: `${this.name}'s age is ${this.age}`
        }
    }
}

// {
//     ** "des": "jay's age is 26"
// }
console.log(JSON.stringify(user, null, '**')); // 优先调用toJSON方法
```