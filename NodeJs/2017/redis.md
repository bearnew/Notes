#### redis
**基本功能：**
* 缓存系统
* 数据存储
* 消息中介
```js
var client = redis.createClient('localhost', 6379);
```
**基本使用**
* 存储和获取值
```js
client.set('hello', JSON.stringify({a: 1, b: 2}));

client.get('hello', function(err, v) {
    console.log('redis get hello err, v:', err, v, typeof v);
})
```
* 列表
```js
client.rpush('testList', 'a');
client.rpush('testList', 'b');
client.rpush('testList', 'c');

client.lpush('testList', '2');

client.lpop('testList', function(err, v) {
    console.log('client.lpop, err ,v:', err, v);
})

client.rpop('testList', function(err, v) {
    console.log('client.rpop, err ,v:', err, v);
})

client.lrange('testList', 0, -1, function(err, lists) {
    console.log('client.rpop, err ,lists:', err, lists);
})
```
* 集合
```js
client.sadd('testSet', 1);
client.sadd('testSet', 'a');
client.sadd('testSet', 'bb');

client.smembers('testSet', function(err, v) {
    console.log('client.smembers err, v:', err, v);
})
```
* 消息中介
> 发布

```js
client.publish('testPublish', 'message from pub.js');
```
> 监听

```js
client.subscribe('testPublish');
client.on('message', function(channel, msg) {
    console.log('client.on message, channel:', channel, 'message:', msg);
})
```