## 异步和性能
#### 一、现在与未来
1. 同步发起ajax, 会锁定浏览器UI,并阻塞所有的用户交互
2. 控制台I/O会延迟
    ```js
    var a = {
        index: 1
    };
    console.log(a.index); // 1
    console.log(a); // { index: 2 }
    a.index++;
    ```
3. 事件循环
    ```js
    // 程序分成很多块，在事件循环队列中一个接一个的执行
    // eventLoop是一个用作队列的数组
    // （先进，先出）
    var eventLoop = [ ];
    var event;
    // “永远”执行
    while (true) {
        // 一次tick
        if (eventLoop.length > 0) {
            // 拿到队列中的下一个事件
            event = eventLoop.shift();
            // 现在，执行下一个事件
            try {
                event();
            }
            catch (err) {
                reportError(err);
            }
        }
    }
    ```
4. 并行线程
    1. 进程和线程独立运行，并可能同时运行
    2. 多个线程能够共享单个进程的内存
    3. js是单线程运行

