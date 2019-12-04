## 深入浅出Node.js
#### 1.Node简介
1. Node是基于V8创建轻量级的web服务器的一套库
    * ![](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/node%E7%BB%84%E4%BB%B6%E6%9E%84%E6%88%90.PNG?raw=true)
3. 异步I/O
    * 在node中，绝大多数的操作都是以异步的方式进行
    * ![](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/%E5%BC%82%E6%AD%A5%E8%B0%83%E7%94%A8.PNG?raw=true)
    ```js
    var fs = require('fs');
    fs.readFile('/path', function (err, file) {
        console.log('读取文件完成')
    });
    console.log('发起读取文件'); 
    ``` 
    * 每个I/O无需等待之前的I/O调用结束，可以极大的提升效率
    ```js
    fs.readFile('/path1', function (err, file) {
        console.log('读取文件1完成');
    });
    fs.readFile('/path2', function (err, file) {
        console.log('读取文件2完成');
    }); 
    ``` 
4. 事件与回调函数
    * 对服务器绑定request事件
    * 对请求事件绑定data事件和end事件
    ```js
    var http = require('http');
    var querystring = require('querystring');
    // ኎ད服务器的request事件
    http.createServer(function (req, res) {
        var postData = '';
        req.setEncoding('utf8');
        // ኎ད请求的data事件
        req.on('data', function (trunk) {
         postData += trunk;
        });
        // ኎ད请求的end事件
        req.on('end', function () {
            res.end(postData);
        });
    }).listen(8080);
    console.log('服务器启动完成'); 
    ``` 
5. 单线程
    * 单线程的优点
        * 单线程不必像多线程编程一样在意状态的同步问题，没有死锁的存在
        * 也没有线程上下文交互所带来的性能上的开销
    * 单线程的缺点
        * 无法利用多核CPU
        * 错误会引起整个应用的退出，应用的健壮性值得考验
        * 大量计算占用CPU,导致无法异步调用I/O
            * JS长时间的执行会导致UI的渲染和响应被中断
            * Node中，长时间的CPU占用会导致后续的I/O发不出调用, 已完成异步I/O的回调函数也会得不到及时的调用
    * 单线程解决方式
        * Web Workers能够创建工作线程来计算，解决js大计算阻塞UI渲染的问题
        * Web Workers为了不阻塞主线程，通过消息传递的方式来传递运行结果, 所以工作线程也不能访问主线程的UI
        * Node采用和Web Workers相同的思路，child_process
        * Node可以将计算分发到各个子进程，将大量的计算分解掉, 通过事件消息来传递结果
6. 跨平台
    * Node第三方模块C++通过libuv实现了跨平台，linux和windows都兼容
7. node的应用场景
    * I/O密集型
        * 能够有效组织起更多的硬件资源，提供更多好的服务
        * I/O密集型的优势，在于Node利用事件循环的处理能力
    * CPU密集型业务
        * 长时间运行的计算（大循环），会导致CPU时间片不能释放，后续I/O无法发起
        * 调整和分解大型运算，可享受并行异步I/O的好处，又能充分利用CPU
        * 使用Node子进程，可以充分利用CPU
    * 分布式应用
        * 阿里的Node分布式应用，利用并行I/O的特点，并行查询多个数据库

#### 2.模块机制

 