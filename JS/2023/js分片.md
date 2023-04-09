# js分片
1. JS 脚本下载完成地更早，从而执行的更早，而其同步初始化过程(主要指静态 import)耗时较久，这段时间内即使首屏图片下载完成，GUI 线程也无法渲染(因为 GUI 线程和 JS 线程是互斥执行的)；为此，我们借鉴 react 的分片思想，对JS初始化过程进行分片操作，以期降低首屏带图时间。
2. 分片时长为5ms，每隔5ms检查页面是否渲染完成
3. `setTimeout`会有`4ms`的延迟
4. `requestAnimationFramed`是在微任务执行完之后，浏览器重排重绘之前执行，执行的时机是不准确的。如果`raf`之前`JS`的执行时间过长，依然会造成延迟
5. `requestIdleCallback`的执行时机是在浏览器重排重绘之后，也就是浏览器的空闲时间执行。其实执行的时机依然是不准确的，`raf`执行的`JS`代码耗时可能会过长
6. 在`React`中，异步执行优先使用`setImmediate`，其次是`MessageChannel`，最后是`setTimeout`，都是根据浏览器对这些的特性支持程度决定的，`setImmediate`有兼容性问题
7. `require`没有`treeshaking`，增加桥阶层
```js
/**
 * why bridges?
 * require 没有 tree-shaking，增加一层 bridge 确保未用到的被 tree-shaking
 */
import { observable } from 'mobx';
import { observer } from 'mobx-react';

export { observable, observer };

```
8. 分片核心代码
```js
// AST import转换require
result = result.replace("ReactDOM: () => require('react-dom').default", "ReactDOM: () => require('react-dom')")
result = result.replace("React: () => require('react').React", "React: () => require('react')")
```
```js
// 入口文件
export default function ({ defaultTasks }) {
    if (shouldSplit()) {
        const requireAsync = require('./requireAsync').default;

        const tasks = {
            $react: () => require('react'),
            $reactDOM: () => require('react-dom'),
            $mobx: () => require('./bridges/mobx'),
            ...defaultTasks,
        };

        requireAsync(tasks).then((options) => initPage(options));
    } else {
    }
}
```
```js
// 时间分片调度，每隔5ms判断页面是否渲染完成
const executeSplitTasks = (tasks) => {
    return new Promise((resolve) => {
        // 兜底代码
        if (typeof window === 'undefined' || typeof MessageChannel === 'undefined') {
            tasks.forEach((fn) => fn());
            resolve();
            return;
        }

        const YIELD_INTERVAL = 5;
        const channel = new MessageChannel();
        let idx = 0;
        /**
         * 已渲染首屏，则不再交出控制权
         */
        function checkFsReadyHeavy() {
            const fsItems = window.__fsImgItems || [];
            for (let i = 0; i < fsItems.length; i++) {
                if (!fsItems[i].time) {
                    return false;
                }
            }
            return true;
        }
        let hasRenderFs = false;
        function shouldYield(startTime) {
            try {
                hasRenderFs = hasRenderFs || checkFsReadyHeavy();
                return !hasRenderFs && Date.now() - startTime > YIELD_INTERVAL;
            } catch (e) {
                return false;
            }
        }

        function workLoopConcurrent() {
            const startTime = Date.now();
            while (tasks[idx] !== undefined) {
                tasks[idx++]();
                // 页面没渲染完成，每隔5ms检测，shouldYield为true，阻塞js执行，将控制权交给浏览器渲染
                // 页面渲染完成，shouldYield为false，不再阻塞，直接执行require
                if (shouldYield(startTime)) {
                    channel.port1.postMessage(null);
                    return;
                }
            }
            resolve();
        }
        channel.port2.onmessage = () => {
            workLoopConcurrent();
        };
        workLoopConcurrent();
    });
};

export default async (requireTasks) => {
    const ret = {};
    const taskKeys = Object.keys(requireTasks);
    const wrapTasks = taskKeys.map((key) => () => {
        const result = requireTasks[key]();
        // 非直接使用模块，不引用
        if (key[0] !== '$') {
            ret[key] = result;
        }
    });
    await executeSplitTasks(wrapTasks);
    return ret;
};

```