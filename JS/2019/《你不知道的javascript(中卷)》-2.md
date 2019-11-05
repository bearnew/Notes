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
5. 完整运行
    1. js代码具有原子性，2个函数运行会存在先后顺序，不会同时运行
6. 并发
    1. 多个“进程”同时执行，就出现了并发
    2. 耗时较长的“进程”运行时，页面上的其他代码都不能运行，不能有UI刷新，不能有滚动，输入，按钮等滚动事件
        ```js
        // 1次处理1000条
        var res = [];
        // response(..)从Ajax调用中取得结果数组
        function response(data) {
            // 一次处理1000个
            var chunk = data.splice( 0, 1000 );
            // 添加到已有的res组
            res = res.concat(
                // 创建一个新的数组把chunk中所有值加倍
                chunk.map( function(val){
                    return val * 2;
                } )
            );
            // 还有剩下的需要处理吗？
            if (data.length > 0) {
                // 异步调度下一次批处理
                setTimeout( function(){
                    response( data );
                }, 0 );
            }
        }
        // ajax(..)是某个库中提供的某个Ajax函数
        ajax( "http://some.url.1", response );
        ajax( "http://some.url.2", response ); 
        ``` 
7. 任务
   * 一旦有事件需要运行，事件循环就会运行，直到队列清空。事件循环的每一轮称为一个tick。用户交互、IO 和定时器会向事件队列中加入事件。 
8. 语句顺序
    1. js引擎会对代码执行安全的优化
    2. 将代码排列成对js引擎友好的排序，代码执行会更快
#### 二、回调
1. error-first回调风格，也称为“Node 风格”，因为几乎所有 Node.js API 都采用这种风格，回调的第1个参数保留用作错误对象
2. 回调表达异步流程的方式是非线性的，非顺序的，使得正确推导代码的难度很大
3. 回调函数受第3方(例如ajax)的控制，不可控
4. 回调地狱
    ```js
    listen( "click", function handler(evt){
        setTimeout( function request(){
            ajax( "http://some.url.1", function response(text){
                if (text == "hello") {
                    handler();
                }
                else if (text == "world") {
                    request();
                }
            } );
        }, 500) ;
    }); 
    ```
#### 三、Promise
1. resolve和reject两者都调用，Promise只会接受第一次决议
2. Promise吞掉错误或者异常
    ```js
    var p = new Promise( function(resolve,reject){
        foo.bar(); // foo未定义，所以会出错！
        resolve( 42 ); // 永远不会到达这里 :(
    } );
    p.then(
        function fulfilled(){
            // 永远不会到达这里 :(
        },
        function rejected(err){
            // err将会是一个TypeError异常对象来自foo.bar()这一行
        }
    ); 
    ```
3. `Promise.resolve`传递1个非Promise，非thenable的立即值，就会得到用这个值填充的promise
    ```js
        var p1 = new Promise( function(resolve,reject){
            resolve( 42 );
        });
        var p2 = Promise.resolve( 42 );

        var p1 = Promise.resolve( 42 );
        var p2 = Promise.resolve( p1 );  

        p1 === p2; // true 
    ```
4. 链式流
    1. 每次对Promise调用then, 都会创建并返回一个新的Promise
    2. then中调用的完成返回值，会作为下一链式的参数值
5. 错误处理
    1. try catch无法跨异步进行操作
        ```js
        function foo() {
            setTimeout( function(){
                baz.bar();
            }, 100 );
        }

        try { 
            foo();
            // 后面从 `baz.bar()` 抛出全局错误
        } catch (err) {
            // 永远不会到达这里
        } 
        ```
    2. error-first实现
        ```js
        function foo(cb) {
            setTimeout( function(){
                try {
                    var x = baz.bar();
                    cb( null, x ); // 成功！
                } catch (err) {
                    cb( err );
                }
            }, 100 );
        }
        foo( function(err,val){
            if (err) {
                console.error( err ); // 烦 :(
            } else {
                console.log( val );
            }
        } ); 
        ```
    3. 错误处理的正确方式
        ```js
            var p = Promise.resolve( 42 );
            p.then(function fulfilled(msg){
                // 数字没有string函数，所以会抛出错误
                console.log( msg.toLowerCase() );
            }).catch( handleErrors );
        ```
        ```js
            var p = Promise.reject( "Oops" ).defer();
            // foo(..)是支持Promise的
            foo( 42 ).then(
                function fulfilled(){
                    return p;
                },
                function rejected(err){
                // 处理foo(..)错误
                }
            ); 
        ``` 
6. Promise模式
    1. Promise.all([..])
       1. 同时发送多个ajax请求
       2. 接受一个数组，数组可以是Promise, thenable, 立即值，每个值都会经过`Promise.resolve`过滤
       3. 数组是空的，主Promise就会立即完成
       4. all中的所有promise被完成才会完成，否则进入promise的拒绝/错误处理函数
       ```js
        var p1 = request( "http://some.url.1/" );
        var p2 = request( "http://some.url.2/" );
        Promise.all( [p1,p2] )
        .then( function(msgs){
            // 这里，p1和p2完成并把它们的消息传入
            return request(
            "http://some.url.3/?v=" + msgs.join(",")
            );
        } )
        .then( function(msg){
            console.log( msg );
        } ); 
       ``` 
    2. Promise.race
       1. 接受1个或多个promise
       2. 任何1个promise先完成，则完成
       3. 任何1个promise先拒绝，则拒绝
       ```js
       // 为foo()设定超时
        Promise.race( [
            foo(), // 启动foo()
            timeoutPromise( 3000 ) // 给它3秒钟
        ] )
        .then(
            function(){
                // foo(..)按时完成！
            },
            function(err){
                // 要么foo()被拒绝，要么只是没能够按时完成，
                // 因此要查看err了解具体原因
            }
        ); 
       ```
       ```js
       // polyfill安全的guard检查
        if (!Promise.first) {
            Promise.first = function(prs) {
                return new Promise( function(resolve,reject){
                    // 在所有promise上循环
                    prs.forEach( function(pr){
                        // 把值规整化
                        Promise.resolve( pr )
                        // 不管哪个最先完成，就决议主promise
                        .then( resolve );
                    });
                });
            };
        } 
       ``` 
    3. Promise并发迭代
        ```js
        if (!Promise.map) {
            Promise.map = function(vals,cb) {
                // 一个等待所有map的promise的新promise
                return Promise.all(
                    // 注：一般数组map(..)把值数组转换为 promise数组
                    vals.map( function(val){
                        // 用val异步map之后决议的新promise替换val
                        return new Promise( function(resolve){
                            cb( val, resolve );
                        } );
                    } )
                );
            };
        } 
        ```
        ```js
        var p1 = Promise.resolve( 21 );
        var p2 = Promise.resolve( 42 );
        var p3 = Promise.reject( "Oops" );
        // 把列表中的值加倍，即使是在Promise中
        Promise.map( [p1,p2,p3], function(pr,done){
            // 保证这一条本身是一个Promise
            Promise.resolve(pr)
            .then(
                // 提取值作为v
                function(v){
                    // map完成的v到新值
                    done( v * 2 );
                },
                // 或者map到promise拒绝消息
                done
            );
        })
        .then( function(vals){
            console.log( vals ); // [42,84,"Oops"]
        }); 
        ``` 
7. Promise API
    1. new Promise(...)
        ```js
        var test = new Promise(function (resolve, reject) {
            setTimeout(() => {
                resolve(123);
            }, 0)
        })
        var p = new Promise(function (resolve, reject) {
            console.log(test)
            resolve(test);
        })
        p.then(res => {
            console.log(res); // 123
        })
        ```
    2. Promise.resolve, Promise.reject
        ```js
        // p1和p2等价的
        var p1 = new Promise(function(resolve,reject){
            reject( "Oops" );
        });
        var p2 = Promise.reject( "Oops" ); 
        ```
        ```js
        var fulfilledTh = {
            then: function (cb) { cb(42); }
        };
        var rejectedTh = {
            then: function (cb, errCb) {
                errCb("Oops");
            }
        };
        var p1 = Promise.resolve(fulfilledTh);
        var p2 = Promise.resolve(rejectedTh);

        p1.then(res => {
            console.log(res); // 42
        })

        p2.then(res => {
        }).catch(err => {
            console.log(err); // Oops
        })
        // p1是完成的promise
        // p2是拒绝的promise
        ```
    3. then(...)和catch(...)
       ```js
        p.then( fulfilled, rejected );
        p.catch( rejected ); // 或者p.then( null, rejected ) 
       ``` 
    4. Promise.all
        1. 所有都完成，会得到1个数组
        2. 拒绝的情况，会得到第1个拒绝Promise的拒绝理由值
        3. Promise.all传入空数组会立即完成
            ```js
            Promise.all([]).then(res => {
                console.log(res)
            })
            ``` 
    5. Promise.race
        1. 有1个Promise完成或拒绝，则返回
        2. Promise.race传入空数组会挂住
        ```js
        Promise.race([]).then(res => {
            console.log(res) // 永远不会执行
        })
        ``` 
        ```js
        var p1 = Promise.resolve( 42 );
        var p2 = Promise.resolve( "Hello World" );
        var p3 = Promise.reject( "Oops" );
        Promise.race( [p1,p2,p3] )
        .then( function(msg){
            console.log( msg ); // 42
        });
        Promise.all( [p1,p2,p3] )
        .catch( function(err){
            console.error( err ); // "Oops"
        });
        Promise.all( [p1,p2] )
        .then( function(msgs){
            console.log( msgs ); // [42,"Hello World"]
        }); 
        ```  
8. Promise的局限性
    1. Promise的错误可能在链中一直传播下去，直到某个步骤注册了reject函数
    2. Promise只能有1个完成值，或1个拒绝值
    3. Promise一旦执行，无法取消
    4. Promise会比普通的异步回调慢一些
   
#### 四、生成器
1. 迭代器和生成器
    ```js
    var x = 1;
    function* foo() {
        x++;
        yield; // 暂停！
        console.log("x:", x);
    }
    function bar() {
        x++;
    }

    // 构造一个迭代器it来控制这个生成器
    var it = foo();
    // 这里启动foo()！
    it.next();
    x; // 2
    bar();
    x; // 3
    it.next(); // x: 3 
    ```
2. 迭代消息传递
    1. 第1个next是启动1个生成器，并运行在第1个yield处
    2. 第2个next调用完成第1个被暂停的yield表达式, 并将yield表达式的值作为it.next().value的返回值
    3. next调用需要比yield语句多1个
    4. next函数的传值作为上1个yield表达式的结果
    ```js
    function *foo(x) {
        var y = x * (yield);
        return y;
    }
    var it = foo( 6 );
    // 启动foo(..)
    it.next(); // 执行到yield表达式被暂停
    var res = it.next( 7 ); // 7作为yield的表达式的结果
    res.value; // 42 
    ``` 
3. 第1个next调用，是获取第1个yield的值，最后1个next的调用，获取return的值，没有return则为undefined
    ```js
    function* foo(x) {
        var y = x * (yield "Hello"); // <-- yield一个值！
        // return y;
    }
    var it = foo(6);
    var res = it.next(); // 第一个next()，并不传入任何东西
    console.log(res.value); // "Hello"
    res = it.next(7); // 向等待的yield传入7
    console.log(res.value); // undefined 
    ```
4. 多个迭代器
    ```js
    function* foo() {
        var x = yield 2;
        z++;
        var y = yield (x * z);
        console.log(x, y, z);
    }
    var z = 1;
    var it1 = foo();
    var it2 = foo();
    var val1 = it1.next().value; // 2 <-- yield 2
    var val2 = it2.next().value; // 2 <-- yield 2
    val1 = it1.next(val2 * 10).value; // 40 <-- x:20, z:2
    val2 = it2.next(val1 * 5).value; // 600 <-- x:200, z:3
    it1.next(val2 / 2); // y:300
    // 20 300 3
    it2.next(val1 / 4); // y:10
    // 200 10 3
    ```
5. 用迭代器实现获取有规律的一系列的值
    * for...of函数自动调用它的Symbol.iterator函数来构建迭代器
    ```js
    var gimmeSomething = (function(){
        var nextVal;
        return function(){
            if (nextVal === undefined) {
                nextVal = 1;
            }
            else {
                nextVal = (3 * nextVal) +6;
            }
            return nextVal;
        };
    })();
    gimmeSomething(); // 1
    gimmeSomething(); // 9
    gimmeSomething(); // 33
    gimmeSomething(); // 105 
    ```
    ```js
    var something = (function () {
        var nextVal;
        return {
            // for..of循环需要
            [Symbol.iterator]: function () { return this; },
            // 标准迭代器接口方法
            next: function () {
                if (nextVal === undefined) {
                    nextVal = 1;
                } else {
                    nextVal = (3 * nextVal) + 6;
                }
                return { done: false, value: nextVal };
            }
        };
    })();
    something.next().value; // 1
    something.next().value; // 9
    something.next().value; // 33
    something.next().value; // 105

    for (var v of something) {
        // 321 969
        console.log(v);
        // 不要死循环！
        if (v > 500) {
            break;
        }
    }
    ```
    ```js
    function *something() {
        var nextVal;
        while (true) {
            if (nextVal === undefined) {
                nextVal = 1;
            } else {
                nextVal = (3 * nextVal) + 6;
            }
            yield nextVal;
        }
    } 
    // 1 9 33 105 321 969 
    for (var v of something()) {
        console.log( v );
        // 不要死循环！
        if (v > 500) {
            break;
        }
    }
    ```
6. iterable
    * 每次调用Symbol.iterator会返回1个全新的迭代器
    ```js
    var a = [1,3,5,7,9];
    var it = a[Symbol.iterator]();
    it.next().value; // 1
    it.next().value; // 3
    it.next().value; // 5 
    ```
7. 生成器把while...true带回了js编程世界
    ```js
    function *something() {
        var nextVal;
        while (true) {
            if (nextVal === undefined) {
                nextVal = 1;
            }else{
                nextVal = (3 * nextVal) + 6;
            }
            yield nextVal;
        }
    }

    // 1 9 33 105 321 969 
    for (var v of something()) {
        console.log( v );
        // 不要死循环！
        if (v > 500) {
            break;
        }
    }
    ```
8. break和it.return()可以用来停止生成器
```js
function *something() {
    try {
        var nextVal;
        while (true) {
            if (nextVal === undefined) {
                nextVal = 1;
            }
            else {
                nextVal = (3 * nextVal) + 6;
            }
            yield nextVal;
        }
    }
    // 清理子句
    finally {
        console.log( "cleaning up!" );
    }
} 

var it = something();
for (var v of it) {
    console.log( v );
    // 不要死循环！
    if (v > 500) {
        console.log(
            // 完成生成器的迭代器
            it.return( "Hello World" ).value
        );
        // break;
    }
} 
```
8. 异步迭代生成器
```js
function foo(x,y) {
    ajax(
        "http://some.url.1/?x=" + x + "&y=" + y,
        function(err,data){
            if (err) {
                // 向*main()抛出一个错误
                it.throw( err );
            }
            else {
                // 用收到的data恢复*main()
                it.next( data );
            }
        }
    );
}

function *main() {
    try {
        var text = yield foo( 11, 31 );
        console.log( text ); // text即为ajax请求获取的响应data
    }
    catch (err) {
        console.error( err );
    }
}

var it = main();
// 这里启动！
it.next(); 
```
9. 生成器同步错误处理
* 生成器yield暂停能够从异步函数调用得到返回值
* 生成器yield能够同步捕获来自异步函数调用的错误
```js
function *main() {
    var x = yield "Hello World";
    console.log(x) // 42
    yield x.toLowerCase(); // 引发一个异常！
}

var it = main();
it.next().value; // Hello World

try {
    it.next(42);
}
catch (err) {
    console.error( err ); // TypeError
} 
```
10. 使用async和await代替promise加生成器
```js
function foo(x,y) {
    return request(
        "http://some.url.1/?x=" + x + "&y=" + y
    );
}
async function main() {
    try {
        var text = await foo( 11, 31 );
        console.log( text );
    } catch (err) {
        console.error( err );
    }
}
main(); 
```
11. Promise并发
```js
function *foo() {
    // 让两个请求"并行"，并等待两个promise都决议
    var results = yield Promise.all([
        request( "http://some.url.1" ),
        request( "http://some.url.2" )
    ]);
    var r1 = results[0];
    var r2 = results[1];
    var r3 = yield request(
        "http://some.url.3/?v=" + r1 + "," + r2
    );
    console.log( r3 );
}
// 使用前面定义的工具run(..)
run( foo ); 
```
12. 消息委托
```js
function *foo() {
    console.log( "inside *foo():", yield "B" );
    console.log( "inside *foo():", yield "C" );
    return "D";
}
function *bar() { 
    console.log( "inside *bar():", yield "A" );
    // yield委托！
    console.log( "inside *bar():", yield *foo() );
    console.log( "inside *bar():", yield "E" );
    return "F";
}

var it = bar();
console.log( "outside:", it.next().value );
// outside: A
console.log( "outside:", it.next( 1 ).value );
// inside *bar(): 1
// outside: B
console.log( "outside:", it.next( 2 ).value );
// inside *foo(): 2
// outside: C
console.log( "outside:", it.next( 3 ).value );
// inside *foo(): 3
// inside *bar(): D
// outside: E
console.log( "outside:", it.next( 4 ).value );
// inside *bar(): 4
// outside: F 
```
13. thunk
    1. JavaScript 中的 thunk 是指一个用于调用另外一个函数的函数，没有任何参数。
    ```js
    function foo(x,y) {
        return x + y;
    }
    function fooThunk() {
        return foo( 3, 4 );
    }
    // 将来
    console.log(fooThunk()); // 7 
    ```
    ```js
    function foo(x,y,cb) {
        setTimeout( function(){
            cb( x + y );
        }, 1000 );
    }
    function fooThunk(cb) {
        foo( 3, 4, cb );
    }
    // 将来
    fooThunk( function(sum){
        console.log( sum ); // 7
    } ); 
    ``` 
14. thunk通用方法
    ```js
    function foo(x, y, cb) {
        setTimeout(function () {
            cb(x + y);
        }, 1000);
    }

    function thunkify(fn) {
        var args = [].slice.call(arguments, 1);
        return function (cb) {
            args.push(cb);
            return fn.apply(null, args);
        };
    }

    var fooThunk = thunkify(foo, 3, 4);

    // 将来
    fooThunk(function (sum) {
        console.log(sum); // 7
    });
    ```
15. 生成器小结
    1. yield表示暂停下来等待某个值
    2. next(...)调用会向被暂停的yield表达式传1个值（或者是隐式的undefined）
    3. 生成器为异步代码保持了顺序、同步、阻塞的代码模式

#### 五、程序性能
1. Web Worker
    1. 将程序分成2部分，一部分运行在主UI线程下，另一部分运行在另一个独立的线程中
    2. web worker通过基本的事件消息机制相互联系
    3. worker之间以及他们与主程序之间，不会共享任何作用域或者资源
    ```js
    w1.addEventListener( "message", function(evt){
        // evt.data
    });
    w1.postMessage( "something cool to say" );
    ```
    ```js
    // worker内部
    addEventListener( "message", function(evt){
    // evt.data
    });
    postMessage( "a really cool reply" ); 
    ```
2. Web Worker应用场景
    1. 处理密集型数学计算
    2. 大数据集排序
    3. 数据处理（压缩、音频分析、图像处理）
    4. 高流量网络通信
    5. 数据传递
    6. 共享worker(创建一个共享中心的worker，页面上的多个tab共享资源)
3. 提升js性能
    1. web worker可以启动独立的线程运行js文件
    2. SIMD把CPU级的并行数学运算映射到javascript api中，获得高性能的数据并行运算
    3. asm.js优化垃圾收集和强制类型转换的代码，提升性能

#### 六、性能测试
1. Benchmark.js
    1. 处理了一段js代码建立公平、可靠、有效的性能测试的所有复杂性
    2. 直接使用benchmark
    ```html
    <script src="https://cdn.bootcss.com/lodash.js/4.17.15/lodash.js"></script>
	<script src="https://cdn.bootcss.com/benchmark/2.1.4/benchmark.js"></script>
    ```
    ```js
    function foo() {
    }
    var bench = new Benchmark('foo', foo);
    console.log(bench.hz); // 每秒运算数
    bench.stats.moe; // 出错边界
    bench.stats.variance; // 样本方差
    ```
    3. 使用suite比较方法的性能
    ```js
    var Benchmark = require('benchmark');
    var suite = new Benchmark.Suite;
    var arr1 = function (str) {
        return [].slice.apply(str);
    };
    var str2 = function (str) {
        return [].slice.call(str);
    };
    // 添加测试
    suite.add('arr1', function() {
        arr1('test');
    })
        .add('str2', function() {
            str2('test');
        })
    // add listeners
        .on('cycle', function(event) {
            console.log(String(event.target));
        })
        .on('complete', function() {
            console.log('Fastest is ' + this.filter('fastest').pluck('name'));
        })
    // run async
        .run({ 'async': true });

    // arr1 x 596,505 ops/sec ±1.14% (95 runs sampled)
    // str2 x 627,822 ops/sec ±1.27% (92 runs sampled)
    // Fastest is str2
    ```
2. jsPerf.com
    1. 使用BenchMark.js运行统计上精确可靠的测试，并把测试结果放在一个公开可得的URL上
        * `https://jsperf.com/bearnew-test1`
3. 使用`console.time()`和`console.timeEnd()`
3. 编写更好更清晰的测试
#### 七、asynquence 库
1. 序列与抽象设计
2. 