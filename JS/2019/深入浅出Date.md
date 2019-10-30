## 国际化业务使用Date注意事项
> 参考@冉余 http://moon.ibu.ctripcorp.com/fun-code/2018/2018-06_07.html
#### 1. safari兼容性
```js
new Date('10-30-2019'); // Invalid Date
new Date('2019-10-30 16:40'); // Invalid Date

// 使用项目中的safariHack做兼容
export default function safariHack(dateString) {
    return dateString.replace(/\-/g, '/');
}

// safari支持不带hh:mm的时间
new Date('2019-10-30')； // Wed Oct 30 2019 08:00:00 GMT+0800 (CST)
```
#### 2. 时间戳
    1. 时间戳（豪秒数）是指从 1970-1-1 00:00:00 UTC 到指定日期的一个差值。
    2. 上海（东8区）的13:50与东京（东9区）14:50是同一时刻
```js
// 在上海运行（东8区）
+new Date('2018-07-17 13:50:00') // 1531806600000
```
```js
// 在东京运行（东9区）
+new Date('2018-07-17 14:50:00') // 1531806600000
```
#### 3. 时区偏移
1. UTC时间戳通信（确保不同时区的用户，看到的起飞时间一致）
    1. 服务器拿到的是航班起飞的当地时间
    2. 服务器将当地时间转换成本地时间戳，减去时区偏移，得到UTC时间戳，传给客户端
    3. 客户端展示时，需加上时区偏移，还原成航班起飞的当地时间
```js
    // 1572480000000是服务器返回的时间戳

    // 在上海运行（东8区）
    new Date(1572480000000); // Thu Oct 31 2019 08:00:00 GMT+0800 (中国标准时间)
    getLocalDate(1572480000); // Thu Oct 31 2019 00:00:00 GMT+0800 (中国标准时间)

    // 在东京运行（东9区）
    new Date(1572480000000); // Thu Oct 31 2019 09:00:00 GMT+0900 (日本标准时间)
    getLocalDate(1572480000); // Thu Oct 31 2019 00:00:00 GMT+0900 (日本标准时间)

    // long是服务器给我们的秒数
    function getLocalDate(long) {
        const data = new Date(long * 1000);
        return new Date(data.getTime() + data.getTimezoneOffset() * 60 * 1000);
    }
```
2. 服务器给我们时间字符串，`new Date()`后，是不需要做时区偏移的
```js
    // 在上海运行（东8区）
    new Date('2019-10-30 16:40'); // Wed Oct 30 2019 16:40:00 GMT+0800 (中国标准时间)

    // 在东京运行（东9区）
    new Date('2019-10-30 16:40'); // Wed Oct 30 2019 16:40:00 GMT+0900 (日本标准时间)
```
3. 本地时间
```js
    // 以本地时区为基础
    new Date(2019, 9, 30); // Wed Oct 30 2019 00:00:00 GMT+0900 (日本标准时间)
    +new Date(2019, 9, 30); // 1572364800000（本地时间戳）

    // 以本地时区为基础
    new Date('2019/10/30'); // Wed Oct 30 2019 00:00:00 GMT+0900 (日本标准时间)
    Date.parse('2019/10/30'); // 1572364800000（本地时间戳）

    // 以UTC时区为基础
    new Date('2019-10-30'); // Wed Oct 30 2019 09:00:00 GMT+0900 (日本标准时间)
    Date.parse('2019-10-30'); // 1572393600000（UTC时间戳）

    // 本地时间戳 - 时区偏移 = UTC时间戳
    Date.parse('2019/10/30') - new Date().getTimezoneOffset() * 60 * 1000 === Date.parse('2019-10-30'); // true
```