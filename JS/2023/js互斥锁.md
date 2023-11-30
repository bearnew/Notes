# JS 互斥锁

```js
// 异步互斥锁
export const asyncLock = {
  isLocked: false,
  queue: [],
  acquire: function () {
    return new Promise((resolve) => {
      if (this.isLocked) {
        this.queue.push(resolve);
      } else {
        this.isLocked = true;
        resolve(1);
      }
    });
  },
  release: function () {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next();
    } else {
      this.isLocked = false;
    }
  },
};
```

```js
const log = (i) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(i);
      resolve();
    }, Math.floor(Math.random() * 901) + 100);
  });
};

// 调用
const test1 = async () => {
  Array.from({ length: 10 }, (v) => v).map(async (i) => {
    await asyncLock.acquire();
    await log(i);
    await asyncLock.release();
  });
};
// 0 1 2 3 4 5 6 7 8 9
test1();

const test2 = async () => {
  Array.from({ length: 10 }, (v) => v).map(async (i) => {
    await log(i);
  });
};
// 数字随机出
test2();
```
