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