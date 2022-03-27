# requestIdleCallback

## 1.一帧的工作

-   1s60 帧，每一帧力求在 16.66ms 内完成
-   ![life_of_frame](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/life_of_frame.png?raw=true)

## 2.空余时间

-   每帧的生命周期执行完，没有超过 16ms，此时就会执行`requestIdleCallback`
-   `requestAnimationFrame`每一帧必定会执行，`requestIdleCallback` 是捡浏览器空闲来执行任务
-   假如浏览器一直处于非常忙碌的状态，`requestIdleCallback `注册的任务有可能永远不会执行

## 3.强制执行

```js
// 超过2s后，didTimeout会为true,强制执行
requestIdleCallback(myNonEssentialWork, { timeout: 2000 });
function myNonEssentialWork(deadline) {
    while (
        // 如果1帧内有富余的时间，或者超时
        (deadline.timeRemaining() > 0 || deadline.didTimeout) &&
        tasks.length > 0
    )
        doWorkIfNeeded();

    if (tasks.length > 0) requestIdleCallback(myNonEssentialWork);
}
```
