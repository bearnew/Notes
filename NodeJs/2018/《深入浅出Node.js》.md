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
    4. 函数嵌套太深
    5. 异步编程依赖单线程，无法充分利用CPU
    6. 与传统的同步编程方式，存在差异
4. 异步编程解决方案
    1. 事件发布/订阅模式
    ```js
    // 订阅
        emitter.on("event1", function (message) {
            console.log(message);
        });
        // 发布
        emitter.emit('event1', "I am message!"); 
    ```
    ```js
    var options = {
        host: 'www.google.com',
        port: 80,
        path: '/upload',
        method: 'POST'
    };
    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
        res.on('end', function () {
        // TODO
        });
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
    // write data to request body
    req.write('data\n');
    req.write('data\n');
    req.end(); 
    ```
    2. Promise
    3. 流程控制库
        1. 尾触发与Next
           1. 中间件利用了尾触发的机制
            ```js
            var app = connect();
            // Middleware
            app.use(connect.staticCache());
            app.use(connect.static(__dirname + '/public'));
            app.use(connect.cookieParser());
            app.use(connect.session());
            app.use(connect.query());
            app.use(connect.bodyParser());
            app.use(connect.csrf());
            app.listen(3001); 
            ```
            ```js
            // 中间件原理
            app.use = function(route, fn){
                // some code
                this.stack.push({ route: route, handle: fn });
                return this;
            }; 
            ```
        2. async.js
            ```js
            async.series([
                function (callback) {
                    fs.readFile('file1.txt', 'utf-8', callback);
                },
                function (callback) {
                    fs.readFile('file2.txt', 'utf-8', callback);
                }
            ], function (err, results) {
                // results => [file1.txt, file2.txt]
            });
            
            // 等价于
            fs.readFile('file1.txt', 'utf-8', function (err, content) {
                if (err) {
                    return callback(err);
                }
                fs.readFile('file2.txt ', 'utf-8', function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, [content, data]);
                });
            }); 
            ```
        3. step.js
        4. wind.js
5. 异步并发控制
    1. bagpipe.js
        * 通过一个队列来控制并发量
        * 如果当前活跃的异步调用量小于限定值，从队列中取出执行
        * 如果当前活跃的异步调用量达到限定值，调用暂时存放在队列中
        * 每个异步调用结束后，从队列中取出新的异步调用执行
        ```js
        var Bagpipe = require('bagpipe');
        // 设定并发数为10
        var bagpipe = new Bagpipe(10);
        for (var i = 0; i < 100; i++) {
            bagpipe.push(async, function () {
            // 异步回调执行
            });
        }
        bagpipe.on('full', function (length) {
            console.warn('底层系统处理不能及时完成，队列拥堵，目前队列长度为:' + length);
        }); 
        ``` 
    2. async.js
        * 通过`parallelLimit`来处理并发的限制
        ```js
        async.parallelLimit([
            function (callback) {
                fs.readFile('file1.txt', 'utf-8', callback);
            },
            function (callback) {
                fs.readFile('file2.txt', 'utf-8', callback);
            }
            ], 1, function (err, results) {
            // TODO
        }); 
        ```
#### 5.内存控制
1. V8垃圾回收机制和内存限制
    1. V8限制了内存的用量，会通过自己的方式来分配和管理，导致Node无法操作大内存对象
    2. V8限制的深层原因，是V8的垃圾回收的限制
    3. 可以通过命令调整内存限制大小
        ```js
        // 设置老生代内存空间的最大值
        node --max-old-space-size=1700 test.js // 单位为MB
        // 设置新生代内存空间的最大值
        node --max-new-space-size=1024 test.js // 单位为KB
        ``` 
2. V8的对象分配
    1. 查看内存信息
        ```js
        $ node
        > process.memoryUsage(); 
        ```
    2. 代码中声明变量，内存会分配在堆中
    3. 申请到的堆内存不够分配新的对象，将继续申请堆内存，直到大小超过V8的限制
        * 64位系统申请的最大内存为1.4G
        * 32位系统申请的最大内存位700M
    4. V8内存分配
        1. V8的内存分为新生代和老生代
        2. 新生代的对象为存活时间较短的对象
        3. 老生代的对象为存活时间较长或常驻内存的对象
        4. 对象最开始都会被分配到新生代
        5. 新生代中的对象满足某些条件后，会晋升到老生代
        6. 新生代内存空间不够，会直接分配到老生代
        7. ![memory allocation](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/GC0.PNG?raw=true)
    5. 垃圾回收机制的2种方案
        1. 标记清除（所有的浏览器都使用的标记清除的策略）
            * (1)垃圾收集器会在程序运行时，给内存中所有变量加上标记
            * (2)去掉运行环境中变量，以及被运行环境中引用变量的标记
            * (3)垃圾收集器清除仍然带标记的变量，并回收它们占用的内存空间 
        2. 引用计数
            * (1)跟踪被引用的每个变量，如果该变量被赋值给其他变量，则引用次数+1
            * (2)对变量引用的值改变了引用对象，则引用次数-1
            * (3)垃圾收集器运行时，释放掉引用次数为0的值所占用的内存 
    6. 垃圾回收原理
        1. 新生代垃圾回收
            1. 新生代采用`Scavenge`垃圾回收算法，算法实现主要采用`Cheney`算法
                * `Scavenge`只复制存活的对象，新生代中存活的对象较少，时间效率高
                * `Scavenge`只能使用到堆内存的一半
            2. 在`From`空间分配A B C 3个对象
                * ![](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/GC1.PNG?raw=true)
            3. `GC`判定B无引用，AC为活跃对象
                * ![](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/GC2.PNG?raw=true)
            4. 将活跃对象A C从`from`空间复制到`to`空间
                * ![](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/GC3.PNG?raw=true)
            5. 清空`from`空间全部内存
                * ![](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/GC4.PNG?raw=true)
            6. 交换`From`空间和`to`空间
                * ![](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/GC5.PNG?raw=true)
            7. 在`From`空间新增对象D E
                * ![](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/GC6.PNG?raw=true)
            8. 第二轮`GC`进来发现对象D没有引用，做标记
                * ![](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/GC7.PNG?raw=true)
            9. 将活跃对象A、C、E从From空间复制到`To`空间
                * ![](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/GC8.PNG?raw=true)
            10. 清空`From`空间全部内存
                * ![](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/GC9.PNG?raw=true)
            11. 继续交换`From`空间和`To`空间，开始下一轮 
                * ![](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/GC10.PNG?raw=true)
        2. 老生代垃圾回收
            1. Mark-Sweep（标记清除）
                1. Mark-Sweep只清除未被引用的对象
                2. 老生代中有对象A、B、C、D、E、F
                    * ![](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/gco1.PNG?raw=true)
                3. GC进入标记阶段，将A、C、E标记为存活对象
                    * ![](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/gco2.PNG?raw=true)
                4. GC进入清除阶段，回收掉死亡的B、D、F对象所占用的内存空间
                    * ![](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/gco3.PNG?raw=true)
                5. 标记清除后，内存碎片会出现不连续的状态，内存碎片会对后续的内存分配造成问题
            2. Mark-compact（标记整理）
                1. 老生代中有对象A、B、C、D、E、F（和Mark—Sweep一样）
                    * ![](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/gco4.PNG?raw=true)
                2. GC进入标记阶段，将A、C、E标记为存活对象（和Mark—Sweep一样）
                    * ![](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/gco5.PNG?raw=true)
                3. GC进入整理阶段，将所有存活对象向内存空间的一侧移动，灰色部分为移动后空出来的空间
                    * ![](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/gco6.PNG?raw=true)
                4. GC进入清除阶段，将边界另一侧的内存一次性全部回收
                    * ![](https://github.com/bearnew/picture/blob/master/mardown/2020/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAnodejs/gco7.PNG?raw=true)
            3. V8主要使用Mark-Sweep，空间不足时才使用Mark-compact        
        3. 新生代向老生代的晋升
           * 对象第二次经历从`From`空间复制到`To`空间，对象会被移动到老生代中
           * 当`To`空间超过了25%的内存使用，对象会直接从`From`移动到老生代中
    7. 垃圾回收日志
        1. 通过`node --trace_gc`打印垃圾回收的日志信息
        2. 通过`node --prof test01.js`启动，得到V8执行时的性能分析数据
        3. 通过` linux-tick-processor v8.log `，得到统计日志信息
3. 高效使用内存
    1.作用域
        1. 在js中能形成作用域的有函数调用, with, 以及全局作用域
        2. 局部变量会被放入到新生代内存中，随函数执行完毕，作用域的销毁而销毁
        3. 全局作用域需要等到进程的退出才能释放
        4. 只能通过delete删除引用，或者对变量重新赋值，才能将全局变量释放
    ```js
    global.foo = "I am global object";
    console.log(global.foo); // => "I am global object"
    delete global.foo;
    // 或者重新赋值
    global.foo = undefined; // or null
    console.log(global.foo); // => undefined 
    ```
    2. 闭包
        1. 实现外部作用域访问内部作用域变量的方法叫做闭包
        2. 闭包的原理时高阶函数
            ```js
            var foo = function () {
                var bar = function () {
                    var local = "局部Վ量";
                    return function () {
                        return local;
                    };
                };
                var baz = bar();
                console.log(baz());
            }; 
            ```
        3. 闭包函数一旦被调用，原始函数作用域以及变量都不会被释放
        4. 无法被垃圾回收的有全局变量和闭包2种情况
    3. 内存指标
        1. 查看内存使用情况
            ```js
            node
            process.memoryUsage() 
            ```
        2. 查看系统内存的占用
            ```js
            $ node
            > os.totalmem() // 总内存
            8589934592
            > os.freemem() // 空置内存
            4527833088
            > 
            ``` 
4. 内存泄漏 
    1. Node对内存泄漏十分敏感
    2. 造成内存泄漏的几个原因
        * 缓存
        * 队列消费不及时
        * 作用域未释放
    3. 慎将内存当作缓存
    4. Node缓存的解决方案
        1. 缓存限制
            ```js
            var LimitableMap = function (limit) {
                this.limit = limit || 10;
                this.map = {};
                this.keys = [];
            };
            ```
        2. 使用进程外的缓存
            * Redis
            * Memcached 
    5. 关注队列（数组对象）的状态
        * 监控队列的长度
        * 设置超时机制
    6. 内存泄漏的排查
        1. node-heapdump
            1. `npm install heapdump`
            2. 在代码的第一行添加`var heapdump = require('heapdump');`
            3. 抓取堆内存快照` kill -USR2 <pid>`
            4. 使用`Chrome`的`Profile`load快照文件
        2. node-memwatch
            1. node-memwatch示例
                ```js
                var memwatch = require('memwatch');
                // 经过5次垃圾回收，内存仍然没有被释放，会触发leak事件
                memwatch.on('leak', function (info) {
                    console.log('leak:');
                    console.log(info);
                });
                // 垃圾回收时会触发stats事件
                memwatch.on('stats', function (stats) {
                    console.log('stats:')
                    console.log(stats);
                });
                ```
            2. node-memwatch抓取快照
                ```js
                var memwatch = require('memwatch'); 
                // Take first snapshot
                var hd = new memwatch.HeapDiff();

                for (var i = 0; i < 10000; i++) {
                    leak();
                } 

                // Take the second snapshot and compute the diff
                var diff = hd.end();
                console.log(JSON.stringify(diff, null, 2));  
                ``` 
        3.  
5. 大内存应用
    1. V8内存的限制, 无法通过fs.readFile()和fs.writeFile()进行大文件的操作
    2. Node使用`Stream`模块来处理大文件
        ```js
        var reader = fs.createReadStream('in.txt');
        var writer = fs.createWriteStream('out.txt');
        reader.on('data', function (chunk) {
            writer.write(chunk);
        });
        reader.on('end', function () {
            writer.end();
        });

        // 简写
        var reader = fs.createReadStream('in.txt');
        var writer = fs.createWriteStream('out.txt');
        reader.pipe(writer);  
        ```
#### 6.Buffer结构
> Node作为服务器语言，需要处理网络协议，操作数据库，处理图片，接收上传文件，js中的字符串无法满足Node作为服务器的需求，于是Buffer对象应运而生
1. Buffer是1个Array对象，主要用于操作字节
2. Buffer是典型的js和C++结合的模块，将性能相关的用C++实现，将非性能相关的用js实现
3. Buffer所占用的内存不是通过V8分配的，属于堆外内存
4. Buffer在Node进程启动时就已经加载了，无需通过require()引进
5. Buffer对象
    1. Buffer为16进制的2位数
        ```js
        var str = "深入浅出node.js";
        var buf = new Buffer(str, 'utf-8');
        console.log(buf);
        // => <Buffer e6 b7 b1 e5 85 a5 e6 b5 85 e5 87 ba 6e 6f 64 65 2e 6a 73> 
        ```
    2. Buffer和Array相似
        ```js
        var buf = new Buffer(100);
        console.log(buf.length); // => 100

        console.log(buf[10]); // 0-255的随机值 
        ```
    3. Buffer赋值
        1. 赋值小于0，该值逐次加256，直到得到0-255之间的整数
        2. 得到数值大于255，逐次减256，得到0-255区间内的数值
        3. 如果是小数，则舍弃小数部分，只保留整数部分 
6. Buffer内存分配
    1. Buffer使用的是在C++层面申请内存，在js中分配内存的策略
    2. Node采用slab（动态内存管理机制）分配机制
        1. slab是申请好的固定内存区域
            * full: 完全分配状态
            * partial: 部分分配状态
            * empty: 没有被分配状态
        2. 每个slab的大小为8kb，它作为单位单元进行内存分配
7. Buffer的转换
    1. 字符串转Buffer
        ```js
        // encoding为编码类型，支持ASCII, UTF-8, UTF-16LE/UCS-2, Base64, Binary, Hex
        new Buffer(str, [encoding]); 
        ```
    2. Buffer对象可以存储不同编码类型的字符串转码的值
        ```js
        // 可以不断写入内容到Buffer中
        buf.write(string, [offset], [length], [encoding]) 
        ```
    3. Buffer转字符串
        ```js
        buf.toString([encoding], [start], [end]) 
        ```
    4. 通过isEncoding判断Buffer是否支持该编码类型
        ```js
        Buffer.isEncoding(encoding) 
        ```
8. Buffer的拼接
    1. Buffer可以与字符串进行拼接
        ```js
        var fs = require('fs');
        var rs = fs.createReadStream('test.md');
        var data = '';
        rs.on("data", function (chunk){
            // chunk对象即为buffer对象
            data += chunk;
        });
        rs.on("end", function () {
            console.log(data);
        }); 
        ```
    2. 对含有宽字节的中文Buffer进行拼接，会出现乱码�
        ```js
        // 床前明���光，疑���地上霜
        // Buffer的长度限制越大，出现乱码的概率越低
        var rs = fs.createReadStream('test.md', {highWaterMark: 11});
        ```
    3. 通过setEncoding解决编码乱码问题
        ```js
        var rs = fs.createReadStream('test.md', { highWaterMark: 11});
        rs.setEncoding('utf8');
        ```
    4. 
9. 正确拼接Buffer
    1. 通过`Buffer.concat`封装了从小Buffer对象向大Buffer对象的复制过程
    2. 通过`iconv-lite`模块来进行转码
    ```js
    var chunks = [];
    var size = 0;
    res.on('data', function (chunk) {
        chunks.push(chunk);
        size += chunk.length;
    });
    res.on('end', function () {
        var buf = Buffer.concat(chunks, size);
        var str = iconv.decode(buf, 'utf8');
        console.log(str);
    });  
    ```
10. Buffer与性能
    1. Buffer性能测试
        ```js
        var http = require('http');
        var helloworld = "";

        for (var i = 0; i < 1024 * 10; i++) {
            helloworld += "a";
        }
        // helloworld = new Buffer(helloworld);
        http.createServer(function (req, res) {
            res.writeHead(200);
            res.end(helloworld);
        }).listen(8001); 
        ```
        ```js
        // 通过ab并行发起200个客户端，进行测试
        ab -c 200 -t 100 http://127.0.0.1:8001/ 
        ```
    2. Buffer性能提升方法
        1. 预先转换静态内容为Buffer对象，有效减少CPU的重复使用，节省服务器资源
        2. 设置highWaterMark
            * highWaterMark的设置对内存的分配和使用有一定的影响
            * highWaterMark设置过小，会导致系统调用的次数过多
            ```js
            fs.createReadStream(path, opts)
            // opts
            {
                flags: 'r',
                encoding: null,
                fd: null,
                mode: 0666,
                highWaterMark: 64 * 1024
            } 
            ``` 
        4. 传递start end, `{start: 90, end: 99} `

#### 7.网络编程
1. 服务器
    1. ASP需要IIS作为服务器
    2. PHP需要Apache或Nginx环境
    3. JSP需要Tomcat服务器
    4. Node提供net, dgram, http, https分别处理TCP, UDP, HTTP, HTTPS, 适用于服务器端和客户端
2. 构建TCP服务（传输控制协议）
    1. 创建TCP服务端
        ```js
        var net = require('net');
        var server = net.createServer(function (socket) {
            // 新的连接
            socket.on('data', function (data) {
                socket.write("你好")
            });

            socket.on('end', function () {
                console.log('连接断开');
            });

            socket.write("深入浅出Node.js：\n");
        });

        server.listen(8124, function () {
            console.log('server bound');
        }); 
        ```
    2. 通过Telnet作为客户端
        ` telnet 127.0.0.1 8124 `
    3. 通过nc工具进行会话
        ```js
        // 服务端
        server.listen('/tmp/echo.sock'); 

        // 客户端
        nc -U /tmp/echo.sock 
        ```
    4. 通过net模块自行构建客户端
        ```js
        var net = require('net');
        var client = net.connect({port: 8124}, function () { //'connect' listener
            console.log('client connected');
            client.write('world!\r\n');
        });
        client.on('data', function (data) {
            console.log(data.toString());
            client.end();
        });
        client.on('end', function () {
            console.log('client disconnected');
        }); 
        ```
        ```js
        // 如果服务端是Domain Socket
        var client = net.connect({path: '/tmp/echo.sock'}); 
        ```
        ```js
        node client.js
        ```
    5. TCP服务的事件
        1. 服务器事件, 通过`net.createServer()`创建的服务器，是1个`EventEmitter`实例
            1. listening
                * server.listen(port,listeningListener), 第2个参数
            2. connection
                * net.createServer(), 最后1个参数传入
            3. close
                * 调用server.close()后，服务器停止接收新的套接字连接
                * 等待所有连接断开，会触发该事件 
            5. error
                * 服务器发生异常，触发该事件
        2. 连接事件
            1. data
                * 一端使用write()传递数据，另一端触发data事件，接收到的数据为write()发送的数据
            2. end
                * 连接中一端发送FIN数据，触发该事件
            3. connect
                * 用于客户端，连接成功，触发该事件
            4. drain
                * 一端使用write()发送数据，当前这端会触发该事件
            5. error
                * 异常发生时，触发该事件
            6. close
                * 套接字完全关闭时，触发该事件
            7. timeout
                * 一段时间内，无活跃连接，触发该事件
    6. TCP套接字时可读可写的Stream对象，可使用pipe方法实现管道操作
        ```js
        var net = require('net');
        var server = net.createServer(function (socket) {
            socket.write('Echo server\r\n');
            socket.pipe(socket);
        });
        server.listen(1337, '127.0.0.1'); 
        ```    
3. 构建UDP服务
    1. UDP相关概念
        1. TCP连接一旦建立，所有的会话都基于连接完成
        2. 客户端需要与另外的TCP服务通信，需要创建一个套接字来完成
        3. UDP中，1个套接字可以与多个UDP服务通信
        4. UDP无需连接，资源消耗低，处理快速灵活
        5. 网络差，容易丢包
        6. DNS服务是基于UDP实现的
    2. 创建UDP套接字
        * UDP套接字创建，既可以作为客户端发送数据，又可以作为服务端接收数据
        ```js
        var dgram = require('dgram');
        var socket = dgram.createSocket("udp4");
        ```
    3. 创建UDP服务器端
        ```js
        var dgram = require("dgram");
        var server = dgram.createSocket("udp4");
        server.on("message", function (msg, rinfo) {
            console.log("server got: " + msg + " from " +
            rinfo.address + ":" + rinfo.port);
        });
        server.on("listening", function () {
            var address = server.address();
            console.log("server listening " +
            address.address + ":" + address.port);
        });

        // 该套接字将接收所有网卡上41234端口上的消息
        server.bind(41234); 
        ```
    4. 创建UDP客户端
        ```js
        var dgram = require('dgram');
        var message = new Buffer("深入浅出Node.js");
        var client = dgram.createSocket("udp4");
        // socket.send(buf, offset, length, port, address, [callback]) 
        client.send(message, 0, message.length, 41234, "localhost", function(err, bytes) {
            client.close();
        }); 
        ```
        ```js
        node server.js 
        server listening 0.0.0.0:41234 
        server got: 深入浅出Node.js from 127.0.0.1:58682
        ```
    5. UDP套接字事件
        1. message: 接收到消息时触发该事件
        2. listening: 当UDP套接字开始监听时，触发该事件
        3. close: 调用close触发该事件，close后如需再次触发message, 需要重新绑定
        4. error: 异常发生时，监听该事件，如果不监听，进程会直接退出
4. 构建HTTP服务
    1. HTTP(HyperText Transfer Protocol)
        ```js
        var http = require('http');
        http.createServer(function (req, res) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Hello World\n');
        }).listen(1337, '127.0.0.1');
        console.log('Server running at http://127.0.0.1:1337/'); 
        ```
        ```js
        // 通过curl显示Http通信的所有信息
        curl -v http://127.0.0.1:1337 
        ```
    2. http模块
        1. Http服务能够与多个客户端保持连接
        2. Node采用事件驱动的形式，并不会为每一个连接创建额外的线程或进程
        3. 所以能够保持很低的内存占用，所以能实现高并发
        4. 一个TCP会话能够用于多次请求和响应
        5. http服务的事件
            * connection: 服务器与客户端建立底层TCP连接，触发该事件
            * request: 解析出HTTP头后，触发该事件
            * close: 调用server.close()方法停止接受新的连接，触发该事件
            * checkContinue: 客户端发送较大数据时，头部带Expect: 100-continue的请求到服务器，服务器触发checkContinue事件
            * connect: 客户端发起CONNECT请求时触发
            * upgrade: 客户端在请求头中带上Upgrade字段要求升级连接协议，服务器接收到后触发该事件
            * clientError: 客户端触发error事件，传递到服务器，服务器触发该事件
    3. HTTP客户端
        1. options参数
            * host: 服务器的域名或IP地址
            * hostname: 服务器名称
            * port: 服务器端口，默认80
            * localAddress: 建立网络连接的本地网卡
            * socketPath: Domain套接字路径
            * method: HTTP请求方法，默认为GET
            * path: 请求路径，默认为/
            * headers: 请求头对象
            * auth: Basic认证，值会被计算成请求头中的Authorization部分
            ```js
            var options = {
                hostname: '127.0.0.1',
                port: 1334,
                path: '/',
                method: 'GET'
            };
            var req = http.request(options, function(res) {
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log(chunk);
                });
            });
            req.end();
            ```
        2. HTTP代理
            * http模块包含1个默认的客户端代理对象http.globalAgent
            * ClientRequest对象对同一个服务器端发起的HTTP请求最多可以创建5个连接
            * 调用HTTP客户端发起10次HTTP请求，实质只有5个请求处于并发状态，后续请求会等待前面的请求完成后才发起
        3. HTTP客户端事件
            * response: 得到服务器响应时，触发该事件
            * socket: 底层连接池建立的连接分配给当前请求对象时，触发该事件
            * connect: 客户端向服务器发起CONNECT请求时，服务器响应了200，客户端会触发该事件
            * upgrade: 客户端向服务器发起Upgrade请求时，服务器响应了101 Switching Protocols状态，客户端会触发该事件
            * continue: 客户端向服务器端发起Expect: 100-continue头信息，服务器响应了100 continue状态，客户端将触发该事件
5. 构建WebSocket服务
    1. WebSocket客户端基于事件编程
    2. WebSocket实现了客户端与服务器端的长连接
    3. 客户端与服务器端只建立1个TCP连接，可以使用更少的连接
    4. WebSocket比HTTP请求响应模式更灵活、更高效
    5. WebSocket有更轻量级的协议头，减少数据传送量
    ```js
    var socket = new WebSocket('ws://127.0.0.1:12010/updates');
    socket.onopen = function () {
        // 每50ms向服务器发送一次数据
        setInterval(function() {
            if (socket.bufferedAmount == 0)
                socket.send(getUpdateData());
        }, 50);
    };
    // 通过onmessage接收服务器端传来的数据
    socket.onmessage = function (event) {
    // TODO：event.data
    }; 
    ```
6. 网络服务与安全
    1. Node在网络安全上提供了3个模块， 分别为crypto, tls, https
    2. crypto用于加密、解密，SHA1, MD5等加密算法都在其中
    3. tls是建立在TLS/SSL加密的TCP
        1. TLS/SSL是一个公钥/私钥结构，是一个非对称的结构
        2. Node在底层采用的是openssl实现TLS/SSL
        3. 创建服务器端
            ```js
            var tls = require('tls');
            var fs = require('fs');
            var options = {
                key: fs.readFileSync('./keys/server.key'),
                cert: fs.readFileSync('./keys/server.crt'),
                requestCert: true,
                ca: [ fs.readFileSync('./keys/ca.crt') ]
            };
            var server = tls.createServer(options, function (stream) {
                console.log('server connected', stream.authorized ? 'authorized' : 'unauthorized');
                stream.write("welcome!\n");
                stream.setEncoding('utf8');
                stream.pipe(stream);
            });
            server.listen(8000, function() {
                console.log('server bound');
            });  
            ```
        4. TLS客户端
            ```js
            // 创建私钥
            $ openssl genrsa -out client.key 1024
            // 生成CSR
            $ openssl req -new -key client.key -out client.csr
            // 生成签名证书
            $ openssl x509 -req -CA ca.crt -CAkey ca.key -CAcreateserial -in client.csr -out client.crt 
            ```
            ```js
            var tls = require('tls');
            var fs = require('fs');
            var options = {
                key: fs.readFileSync('./keys/client.key'),
                cert: fs.readFileSync('./keys/client.crt'),
                ca: [ fs.readFileSync('./keys/ca.crt') ]
            };
            var stream = tls.connect(8000, options, function () {
                console.log('client connected', stream.authorized ? 'authorized' : 'unauthorized');
                process.stdin.pipe(stream);
            });
            stream.setEncoding('utf8');
            stream.on('data', function(data) {
                console.log(data);
            });
            stream.on('end', function() {
                server.close();
            }); 
            ```
    4. https是建立在SSL上的http
        1. 创建HTTPS服务
            ```js
            var https = require('https');
            var fs = require('fs');
            var options = {
                key: fs.readFileSync('./keys/server.key'),
                cert: fs.readFileSync('./keys/server.crt')
            };
            https.createServer(options, function (req, res) {
                res.writeHead(200);
                res.end("hello world\n");
            }).listen(8000); 
            ```
        2. HTTPS客户端
            ```js
            var https = require('https');
            var fs = require('fs');
            var options = {
                hostname: 'localhost',
                port: 8000,
                path: '/',
                method: 'GET',
                key: fs.readFileSync('./keys/client.key'),
                cert: fs.readFileSync('./keys/client.crt'),
                ca: [fs.readFileSync('./keys/ca.crt')]
            };
            options.agent = new https.Agent(options);
            var req = https.request(options, function(res) {
                res.setEncoding('utf-8');
                res.on('data', function(d) {
                    console.log(d);
                });
            });
            req.end();
            req.on('error', function(e) {
                console.log(e);
            }); 
            ```
#### 8.构建Web应用
1. 基础功能
    1. 请求方法
        * `HTTP_Parser`在解析请求报文时，会将报文头抽取出来，设置为`req.method`
            ```js
            function (req, res) {
                switch (req.method) {
                    case 'POST':
                        update(req, res);
                        break;
                    case 'DELETE':
                        remove(req, res);
                        break;
                    case 'PUT':
                        create(req, res);
                        break;
                    case 'GET':
                    default:
                        get(req, res);
                }
            }  
            ```
    2. 路径解析
        * `HTTP_Parser`将路径解析为`req.url`
            ```js
            function (req, res) {
                var pathname = url.parse(req.url).pathname;
                var paths = pathname.split('/');
                var controller = paths[1] || 'index';
                var action = paths[2] || 'index';
                var args = paths.slice(3);
                if (handles[controller] && handles[controller][action]) {
                    handles[controller][action].apply(null, [req, res].concat(args));
                } else {
                    res.writeHead(500);
                    res.end('找不到响应控制器');
                }
            } 
            ```
    3. 查询字符串
        * 使用`querystring`模块处理
            ```js
            var url = require('url');
            var querystring = require('querystring');
            var query = querystring.parse(url.parse(req.url).query); 
            ```
            ```js
            // 将字符串解析成JSON对象
            var query = url.parse(req.url, true).query;

            {
                foo: 'bar',
                baz: 'val'
            } 
            ```
    4. Cookie
        1. 服务器向客户端发送Cookie
        2. 浏览器将Cookie保存
        3. 每次浏览器请求，都会将Cookie发送给服务端
        4. Cookie会被放到req.headers.cookie上
        5. Cookie的值是key=value;key2=value2的形式，需要解析
            ```js
            var parseCookie = function (cookie) {
                var cookies = {};
                if (!cookie) {
                    return cookies;
                }
                
                var list = cookie.split(';');
                for (var i = 0; i < list.length; i++) {
                    var pair = list[i].split('=');
                    cookies[pair[0].trim()] = pair[1];
                }
                return cookies;
            }; 
            ```
        6. Set-Cookie的name=value是必须包含的部分，其余都是可选参数
        7. 减轻Cookie对性能的影响
            1. 减少Cookie的大小
            2. 为静态组件使用不同的域名
    5. Session
        1. Session的数据只保留在服务器端
        2. 基于Cookie实现用户和数据的映射
            1. 服务器每次接收请求，检查Cookie中的sessionId(口令)
            2. 服务器通过sessionID 来识别用户和认证状态
            2. 如果过期重新生成，响应时，给客户端设置新的值
            ```js
            var sessions = {};
            var key = 'session_id';
            var EXPIRES = 20 * 60 * 1000;
            var generate = function () {
                var session = {};
                session.id = (new Date()).getTime() + Math.random();
                session.cookie = {
                    expire: (new Date()).getTime() + EXPIRES
                };
                sessions[session.id] = session;
                return session;
            };
             
            function (req, res) {
                var id = req.cookies[key];
                if (!id) {
                    req.session = generate();
                } else {
                    var session = sessions[id];
                    if (session) {
                        if (session.cookie.expire > (new Date()).getTime()) {
                            // 更新超时时间
                            session.cookie.expire = (new Date()).getTime() + EXPIRES;
                            req.session = session;
                        } else {
                            // 超时了，删除旧的数据，并重新生成
                            delete sessions[id];
                            req.session = generate();
                        }
                    } else {
                        // 如果session过期或口令不对，重新生成session
                        req.session = generate();
                    }
                }
                handle(req, res);
            } 
            ```
        3. 通过查询字符串来实现浏览器和服务器数据的对应
            1. 用户访问`http://localhost/pathname`, url中不带`session_id`参数
            2. 将用户重定向到`http://localhost/pathname?session_id=12344567`
        4. 通常将session存储在Redis, Memcached缓存中
        5. 通常服务器将session通过私钥加密签名后发给客户端
    6. 缓存
        * 添加`Expires`或`Cache-Control`到报文头中
        * 配置`ETags`
    7. Basic认证
        1. 检查请求报文头中的`Authorization`字段的内容
            `Authorization: Basic dXNlcjpwYXNz`
        2. Basic认证中，将用户和密码组合`username + ":" + password`,然后进行Base64编码
            ```js
            var encode = function (username, password) {
                return new Buffer(username + ':' + password).toString('base64');
            }; 
            ```
        3. 首次访问，浏览器会响应1个401未授权状态吗
2. 数据上传
    1. 通过报文头的`Transfer-Encoding`或`Content-Length`判断请求中是否带有内容
        ```js
        var hasBody = function(req) {
            return 'transfer-encoding' in req.headers || 'content-length' in req.headers;
        };

        // 转换成Buffer对象，再转换成没有乱码的字符串 
        function (req, res) {
            if (hasBody(req)) {
                var buffers = [];
                req.on('data', function (chunk) {
                    buffers.push(chunk);
                });
                req.on('end', function () {
                    req.rawBody = Buffer.concat(buffers).toString();
                    handle(req, res);
                });
            } else {
                handle(req, res);
            }
        }
        ```
    2. 表单提交
        ```html
        <form action="/upload" method="post">
            <label for="username">Username:</label> <input type="text" name="username" id="username" />
            <br /> 
            <input type="submit" name="submit" value="Submit" />
        </form> 
        ```
        ```js
        // 请求头的Content-Type: application/x-www-form-urlencoded
        var handle = function (req, res) {
            if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
                req.body = querystring.parse(req.rawBody);
            }
            todo(req, res);
        };
        ```
    3. 其他格式
        1. JSON类型的值为`application/json`
            ```js
            var mime = function (req) {
                var str = req.headers['content-type'] || '';
                return str.split(';')[0];
            };
            var handle = function (req, res) {
                if (mime(req) === 'application/json') {
                    try {
                        req.body = JSON.parse(req.rawBody);
                    } catch (e) {
                        // 异常内容ǈ响应Bad request
                        res.writeHead(400);
                        res.end('Invalid JSON');
                        return;
                    }
                }
                todo(req, res);
            }; 
            ```
        2. XML的值为`application/xml`
            ```js
            var xml2js = require('xml2js');
            var handle = function (req, res) {
                if (mime(req) === 'application/xml') {
                    xml2js.parseString(req.rawBody, function (err, xml) {
                        if (err) {
                            // 异常内容ǈ响应Bad request
                            res.writeHead(400);
                            res.end('Invalid XML');
                            return;
                        }
                        req.body = xml;
                        todo(req, res);
                    });
                }
            }; 
            ```
    4. 附件上传
        ```html
        <form action="/upload" method="post" enctype="multipart/form-data">
            <label for="username">Username:</label> <input type="text" name="username" id="username" />
            <label for="file">Filename:</label> <input type="file" name="file" id="file" />
            <br />
            <input type="submit" name="submit" value="Submit" />
        </form> 
        ```
        ```js
        // 基于流式处理解析报文，将接收到的文件写入系统的临时文件夹，并返回对应的路径
        var formidable = require('formidable');
         
         function (req, res) {
            if (hasBody(req)) {
                if (mime(req) === 'multipart/form-data') {
                    var form = new formidable.IncomingForm();
                    form.parse(req, function(err, fields, files) {
                        req.body = fields;
                        req.files = files;
                        handle(req, res);
                    });
                }
            } else {
                handle(req, res);
            }
        } 
        ```
    5. 数据上传与安全
        1. 内存
            * 限制上传内容的大小，一旦超出限制，停止接收数据，响应400
            * 通过流式解析，将数据流导向到磁盘中，Node只保留文件路径等小数据
        2. CSRF（跨站请求伪造）
            * 在Session中赋予1个随机值，并将随机值告之前端
            ```js
            var generateRandom = function(len) {
                return crypto.randomBytes(Math.ceil(len * 3 / 4))
                .toString('base64')
                .slice(0, len);
            }; 
            ```
            ```js
            // 对每个请求的用户，在Session中赋予1个随机值
            var token = req.session._csrf || (req.session._csrf = generateRandom(24)); 
            ```
            ```html
            <form id="test" method="POST" action="http://domain_a.com/guestbook">
                <input type="hidden" name="content" value="vim是这个世界上最好的编辑器" />
                <input type="hidden" name="_csrf" value="<%=_csrf%>" />
            </form> 
            ```
            ```js
            function (req, res) {
                var token = req.session._csrf || (req.session._csrf = generateRandom(24));
                var _csrf = req.body._csrf;
                if (token !== _csrf) {
                    res.writeHead(403);
                    res.end("禁止访问");
                } else {
                    handle(req, res);
                }
            } 
            ```
3. 路由解析
    1. 文件路径型
        1. 静态文件
            * URL路径与网站目录路径一致
        2. 动态文件
            * 根据文件路径，执行动态脚本
    2. MVC
        1. MVC模型
            * 控制器Controller, 一组行为的集合
            * 模型Model, 数据相关的操作和封装
            * 视图View, 视图的渲染
            * 路由解析，根据URL寻找到对应的控制器和行为
            * 行为调用相关的模型，进行数据操作
            * 数据操作结束后，调用视图和相关数据进行页面渲染，输出到客户端
    3. Restful(Representational State Transfer 表现层状态转化)
        1. RESTful设计主要是将服务器端提供的内容实体看作1个资源，并表现在URL上
            ```js
            // 传统模式
            POST /user/add?username=jacksontian
            GET /user/remove?username=jacksontian
            POST /user/update?username=jacksontian
            GET /user/get?username=jacksontian
            ```
            ```js
            POST /user/jacksontian
            DELETE /user/jacksontian
            PUT /user/jacksontian
            GET /user/jacksontian 
            ```
            ```js
            // node端的实现

            // 添加用户
            app.post('/user/:username', addUser);
            // 删除用户
            app.delete('/user/:username', removeUser);
            // 修改用户
            app.put('/user/:username', updateUser);
            // 查询用户
            app.get('/user/:username', getUser); 
            ```
4. 中间件
    1. 用中间件来简化和隔离基础设施与业务逻辑之间的细节
    2. 每个中间件处理掉相对简单的逻辑
    3. 将路由和中间件进行结合
        ```js
        app.use(querystring);
        app.use(cookie);
        app.use(session);
        app.get('/user/:username', getUser);
        app.put('/user/:username', authorize, updateUser);
        ```
    4. 中间件异常处理
        1. 异步方法的异常不能直接捕获，中间件异步产生的异常需要自己传递出来
    5. 中间件性能
        1. 编写高效的中间件
            * 使用高效的方法（通过jsperf.com测试）
            * 缓存需要重复计算的结果
            * 避免不必要的计算
        2. 合理的使用路由
            * 匹配特定的路由使用特定的中间件
            ```js
            // 在public路径下，才会匹配静态文件中间件
            app.use('/public', staticFile); 
            ```
5. 页面渲染
    1. 内容响应
        1. MIME
            * 浏览器通过不同的`Content-Type`来决定采用不同的渲染方式，这个值称为MIME值
            * 不同文件类型具备不同的MIME值
                * JSON文件的值为`application/json`
                * XML文件的值为`application/xml`
                * PDF文件的值为`application/pdf`
            * 可通过lookup获取文件的MIME值
            ```js
            var mime = require('mime');
            mime.lookup('/path/to/file.txt'); // => 'text/plain'
            mime.lookup('file.txt'); // => 'text/plain'
            mime.lookup('.TXT'); // => 'text/plain'
            mime.lookup('htm'); // => 'text/html' 
            ``` 
            ```js
            // 页面展示<html><body>Hello World</body></html>
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('<html><body>Hello World</body></html>\n'); 
            ```
            ```js
            // 页面展示hello world
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('<html><body>Hello World</body></html>\n'); 
            ```
        2. 附件下载
            * Content-Disposition
                * inline: 内容只需即时查看
                * attachment: 内容为可下载的附件
            * 指定保存时使用的文件名
                ```js
                Content-Disposition: attachment; filename="filename.ext" 
                ``` 
            * 响应附件下载的API
                ```js
                res.sendfile = function (filepath) {
                    fs.stat(filepath, function(err, stat) {
                        var stream = fs.createReadStream(filepath);
                        // 设置内容
                        res.setHeader('Content-Type', mime.lookup(filepath));
                        // 设置长度
                        res.setHeader('Content-Length', stat.size);
                        // 设置为附件
                        res.setHeader('Content-Disposition' 'attachment; filename="' + path.basename(filepath) + '"');
                        res.writeHead(200);
                        stream.pipe(res);
                    });
                }; 
                ``` 
        3. 响应json
            ```js
            res.json = function (json) {
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.end(JSON.stringify(json));
            }; 
            ```
        4. 响应跳转
            ```js
            res.redirect = function (url) {
                res.setHeader('Location', url);
                res.writeHead(302);
                res.end('Redirect to ' + url);
            }; 
            ```
    2. 视图渲染
        ```js
        res.render = function (view, data) {
            res.setHeader('Content-Type', 'text/html');
            res.writeHead(200);
            // 实际渲染
            var html = render(view, data);
            res.end(html);
        }; 
        ```
    3. 模板
        1. 模板的4个要素
            * 模板语言
            * 包含模板语言的模板文件
            * 拥有动态数据的数据对象
            * 模板引擎
        2. 模板引起的简单实现
            ```js
            var render = function (str, data) {
                // 模板技术，就是替换特殊标签的技术
                var tpl = str.replace(/<%=([\s\S]+?)%>/g, function(match, code) {
                    return "' + obj." + code + "+ '";
                });
                tpl = "var tpl = '" + tpl + "'\nreturn tpl;";
                var complied = new Function('obj', tpl);
                return complied(data);
            }; 
            ```
            ```js
            // 模板编译
            var complie = function (str) {
                var tpl = str.replace(/<%=([\s\S]+?)%>/g, function(match, code) {
                    return "' + obj." + code + "+ '";
                });
                tpl = "var tpl = '" + tpl + "'\nreturn tpl;";
                return new Function('obj, escape', tpl);
            }; 
            ```
        3. 模板安全
            * 将形成HTML标签的字符，转换成安全的字符
            ```js
            var escape = function (html) {
                return String(html)
                .replace(/&(?!\w+;)/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;'); // IE不支持&apos, (单引号)转义
            }; 
            ``` 
        4. 模板逻辑
            ```js
            <% if (user) { %> 
            <h2><%= user.name%></h2>
            <% } else { %>
            <h2>匿名用户</h2>
            <% } %>
            ```
        5. 集成文件系统
            ```js
            var cache = {};
            var VIEW_FOLDER = '/path/to/wwwroot/views';
            res.render = function (viewname, data) {
                if (!cache[viewname]) {
                    var text;
                    try {
                        text = fs.readFileSync(path.join(VIEW_FOLDER, viewname), 'utf8');
                    } catch (e) {
                        res.writeHead(500, {'Content-Type': 'text/html'});
                        res.end('模板文件错误');
                        return;
                    }
                    cache[viewname] = complie(text);
                }
                var complied = cache[viewname];
                res.writeHead(200, {'Content-Type': 'text/html'});
                var html = complied(data);
                res.end(html);
            };

            app.get('/path', function (req, res) {
                res.render('viewname', {});
            });  
            ```
        6. 子模版
            ```js
            <ul>
                <% users.forEach(function(user){ %>
                <% include user/show %>
                <% }) %> 
            </ul> 
            ``` 
        7. 布局视图
            ```js
            res.render('user', {
                layout: 'layout.html',
                users: []
            });
            // 或者
            res.render('profile', {
                layout: 'layout.html',
                users: []
            }); 
            ```
        8. 模板性能
            * 缓存模板文件
            * 缓存模板文件编译后的函数  
#### 9.玩转进程
1. 服务模型的变迁
    1. 石器时代：同步
        * 服务耗时为N秒，QPS为1/N
    2. 青铜时代：复制进程
        * 100个连接启动100个进程来进行服务
    3. 白银时代： 多线程
        * 1个线程服务1个请求
    4. 黄金时代：事件驱动
        * Node和Nginx是基于事件驱动的单线程方式  
2. 多进程架构
    1. Node提供了`child_process`模块，并且也提供了`child_process.fork()`供我们实现进程的复制
    ```js
    // work.js 监听多个端口
    var http = require('http');
    http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World\n');
    }).listen(Math.round((1 + Math.random()) * 1000), '127.0.0.1');

    // master.js
    var fork = require('child_process').fork;
    var cpus = require('os').cpus();
    for (var i = 0; i < cpus.length; i++) {
        fork('./worker.js');
    }
    ```
    2. child_process提供4个方法创建子进程
        * spawn(): 启动一个子进程来执行命令
        * exec(): 启动一个子进程来执行命令，有1个回调函数来获知子进程的状况
        * execFile(): 启动一个子进程来执行可执行文件
        * fork(): 启动一个子进程，只需指定要执行的javascript文件模版
        ```js
        var cp = require('child_process');
        cp.spawn('node', ['worker.js']);
        cp.exec('node worker.js', function (err, stdout, stderr) {
        // some code
        });

        // 通过execFile执行的javascript文件，首行需添加#!/usr/bin/env node
        cp.execFile('worker.js', function (err, stdout, stderr) {
        // some code
        });
        cp.fork('./worker.js'); 
        ```
    3. 进程间通信
        1. 子进程对象由send()方法实现主进程向子进程发送数据
        2. message事件实现收听子进程发来的数据
        ```js
        
        ```
