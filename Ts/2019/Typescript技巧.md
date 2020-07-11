## 1.类型保护
```js
export function isDate(val: any): val is Date {
    return Object.prototype.toString.call(val) === '[object Date]';
}
```