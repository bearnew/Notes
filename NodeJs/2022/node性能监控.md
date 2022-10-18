# node性能监控
## 1.node-clinic
## 2.内存监控
    - chrome://inspect/#devices
## 3.heapdump
```js
// 内存监控
const heapdump = require('heapdump');

heapdump.writeSnapshot(
    `/Users/bearnew/PDD/Project/mobile-fun-poker/normalH5/${Date.now()}.heapsnapshot`
);
```