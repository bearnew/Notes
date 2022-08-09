# mac操作
1. mds 和 mds_stores 是 Spotlight 的活动。先检查是否 Spotlight 造成的系统资源高消耗
```js
// 关闭系统建立索引用的
sudo mdutil -a -i off

// 开启
sudo mdutil -a -i on
```
