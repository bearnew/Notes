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
1. CommonJs
    1. 模块引用
        ```js
        var math = require('math');
        ```
    2. 模块定义
        ```js
        // math.js
        exports.add = function() {}
        // program.js
        var math = require('math');
        exports.increment = function (val) {
            return math.add(val, 1);
        }; 
        ```
    3. 模块标识
        1. 传给require()方法的参数，必须符合小驼峰命名的字符串，或者以., ..开头的相对路径，或者绝对路径
        2. 每个模块具有独立的空间，互不干扰，不必考虑变量污染
    4. ![commonjs](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/node%E7%BB%84%E4%BB%B6%E6%9E%84%E6%88%90.PNG?raw=true)
2. Node的模块实现
    1. Node中引入模块的过程
        1. 核心模块（Node提供的模块）
            * 路径分析（Node进程启动时，部分核心模块被加载到了内存中）
        2. 文件模块（运行时动态加载）
            * 路径分析
            * 文件定位
            * 编译执行 
    2. 优先从缓存加载
        * `Node`对引入过的模块都会进行缓存
        * `Node`缓存的时编译和执行后的对象
    3. 路径分析和文件定位
        1. 模块标识符分析
            * 核心模块，eg. http, fs, path
            * ./或者../相对路径
            * /的绝对路径
            * 自定义的模块（模块查找最耗时）
        2. 文件定位
            * 带上文件扩展名，加快加载速度
            * 优先查找文件，然后通过`package.json`查找模块路径，找不到则抛出异常
    4. 模块编译
        1. .js文件通过fs模块同步读取文件后编译执行
        2. .node文件用C/C++编写的扩展文件，通过`dlopen()`加载最后编译生成的文件
        3. .json通过fs同步读取文件，用JSON.parse解析返回对象，将对象赋值给exports，供外部调用
        4. 其余扩展名文件，被当作.js文件载入
        5. `exports`是通过形参的方式传入的，为了使`require`达到类的效果，需赋值给`module.exports`对象
        6. 编译成功的模块缓存在`NativeModule._cache`上
        7. 文件模块缓存在`Module._cache`
    5. 包与NPM
        1. 包结构
            * package.json: 包描述文件
            * bin: 用于存放可执行的二进制文件的目录
            * lib: 用于存放javascript代码的目录
            * doc: 用于存放文档的目录
            * test: 用于存放单元测试的目录
        2. NPM常用功能
            1. 查看帮助
                `npm -v`
            2. 全局模式安装
                `npm install express -g`
            3. 本地安装（安装目录必须带有package.json文件）
                ```js
                npm install <tarball file>
                npm install <tarball url>
                npm install <folder>
                ```
            4. 从非官方源安装
                ```js
                npm install underscore --registry=http://registry.url
                npm config set registry http://registry.url
                ```
            5. `package.json`中的`scripts`提供钩子功能 
                ```json
                // 执行install package时，会先执行presintall.js然后执行install.js
                "scripts": {
                    "preinstall": "preinstall.js",
                    "install": "install.js",
                    "uninstall": "uninstall.js",
                    "test": "test.js"
                } 
                ```
        3. 发布包
            1. 编写模块
                ```js
                // hello.js
                exports.sayHello = function () {
                    return 'Hello, world.';
                }; 
                ```
            2. 初始化包描述文件
                ```js
                npm init
                ```
            3. 注册包仓库账号
                ```js
                npm adduser
                Username: (jacksontian)
                Email: (shyvo1987@gmail.com) 
                ```
            4. 上传包
                ```js
                npm publish <folder>
                ```
            5. 管理包权限
                ```js
                npm owner ls <package name>
                npm owner add <user> <package name>
                npm owner rm <user> <package name> 
                ```
            6. 分析包(通过模块路径找到所有的包，并生成依赖树)
                `npm ls`
            7. 
        4. 企业可以通过源码搭建局域NPM
        5. NPM潜在的风险
            * 通过`https://npmjs.org/`上的依赖榜说明模块的质量和可靠性
            * 通过github判定
            * 好的npm包需要具备
              * 良好的文档
              * 良好的测试
              * 良好的编码
3. AMD（Asynchronous Module Definition）
    * AMD是commonjs的一个延申
    * 仅在需要的时候被引入
    * 在声明模块时指定所有的依赖，通过形参传递依赖到模块中
    ```js
    define(['dep1', 'dep2'], function (dep1, dep2) {
        return function () {};
    }); 
    ``` 
4. CMD
    * CMD支持动态引入
    * require, exports, module通过形参传给模块，需要依赖模块时，调用require引入
    ```js
    define(function(require, exports, module) {
    // The module code goes here
    });
    ``` 
5. 兼容多种模块规范
    ```js
    ;(function (name, definition) {
    // 检测上ူ文环境是否为AMDईCMD
    var hasDefine = typeof define === 'function',
    // 检查上ူ文环境是否为Node
    hasExports = typeof module !== 'undefined' && module.exports;
    if (hasDefine) {
    // AMD环境ईCMD环境
    define(definition);
    } else if (hasExports) {
    // 定义为೵通Node模块
    module.exports = definition();
    } else {
    // 将模块的执行结ࡕࠬ在windowՎ量中ǈ在៓બ器中thisኸၠwindow对象
    this[name] = definition();
    }
    })('hello', function () {
    var hello = function () {};
    return hello;
    });
    ```
#### 3.异步I/O
1. 异步I/O让前端的体验更好
2. 资源分配
    * 多线程面临的问题
        1. 创建线程和线程上下文切换的开销较大
        2. 面临锁和状态同步的问题
    * 单线程
        * 单线程，异步I/O
        * 利用web works高效的利用CPU和I/O
3. 异步I/O和非阻塞I/O
    1. 非阻塞I/O
        * 立即返回的仅仅是当前调用的状态，需要重复调用获取值
    2. 异步I/O
        * 非阻塞I/O,加轮询技术，就实现了异步I/O
        * 通过线程之间的通信将I/O得到的数据进行传递（线程池原理）
        * 单线程仅仅是指javasript执行单线程，内部完成I/O另有线程池
4. 事件循环
    1. Node创建1个while(true)循环
    2. 执行循环，查看是否有事件待处理
    3. 取出事件及相关回调函数，执行它们
    4. 进入下个循环，知道没有事件，退出进程
    5. ![](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF.png?raw=true)
5. 观察者
    1. 循环过程中，需要向观察者循环事件是否需要处理
6. 请求对象
    1. 送入线程池等待执行以及I/O操作完毕后的回调处理，都放入在了请求对象中
7. 非I/O的异步API
    * setTimeout
    * setInterval
    * setImmediate
        * 将回调函数延迟执行
    * process.nextTick
        * 定时器精确度不够，setTimeout(fn, 0)比较浪费性能
        * process.nextTick操作相对较为轻量
        * 每次调用process.nextTick方法，会将回调放入队列中，下一轮事件循环时取出
        ```js
        process.nextTick(function () {
            console.log('延迟执行');
        });
        console.log('正常执行'); 
        ```
        * `process.nextTick`（idle观察者）先于 I/O观察者 先于 `setImmediate`（check观察者）
        * `process.nextTick`回调函数保存在数组中
        * `setImmediate`保存在链表中
        ```js
        // 加入ଇ߲nextTick()的回调函数
        process.nextTick(function () {
        console.log('nextTickჽ׿执行1');
        });
        process.nextTick(function () {
        console.log('nextTickჽ׿执行2');
        });
        // 加入ଇ߲setImmediate()的回调函数
        setImmediate(function () {
        console.log('setImmediateჽ׿执行1');
        // 进入ူْ循环
        process.nextTick(function () {
        console.log('ഽ势֭入');
        });
        });
        setImmediate(function () {
        console.log('setImmediateჽ׿执行2');
        });
        console.log('正常执行'); 
        ```
8. 事件驱动与高性能服务器
    1. Node通过事件驱动的方式处理请求，无需为每一个请求创建额外的对应线程
    2. 省掉创建线程和销毁线程的开销
#### 4.异步编程
1. 函数式编程
    1. 高阶函数
        1. 将函数作为参数的函数
        ```js
        var points = [40, 100, 1, 5, 25, 10];
        points.sort(function(a, b) {
            return a - b;
        });
        // [ 1, 5, 10, 25, 40, 100 ] 
        ```
        2. 将函数作为返回值的函数
        ```js
        function foo(x) {
            return function () {
                return x;
            };
        } 
        ```
    2. 偏函数
        1. 通过传不同的参数，产生新的定制函数
        ```js
        var isType = function (type) {
            return function (obj) {
                return toString.call(obj) == '[object ' + type + ']';
            };
        };
        var isString = isType('String');
        var isFunction = isType('Function'); 
        ```
2. 异步编程的优势
    1. 基于事件驱动的非阻塞I/O模型，可以使CPU与I/O并不相互依赖等待
    2. 利用Node的异步模型与V8的高性能，充分发挥CPU和I/O资源的优势
3. 异步编程的难点
    1. try catch只能捕获当次事件循环内的异常
    ```js
    var async = function (callback) {
        process.nextTick(callback);
    };
    // 对callback执行时抛出的异常无能为力
    try {
        async(callback);
    } catch (e) {
        // TODO
    } 
    ```
    2. 出错，导致回调函数被执行2次
    ```js
    var async = function (callback) {
        process.nextTick(function() {
            var results = something;
            if (error) {
                return callback(error);
            }
            callback(null, results);
        });
    };

    try {
        req.body = JSON.parse(buf, options.reviver);
        callback();
    } catch (err){
        err.body = buf;
        err.status = 400;
        callback(err);
    } 
    ```
2. 函数嵌套太深
