# NodeJs

###### 1. GC 垃圾回收

1. 内存空间分为新生代和老生代
   - 新生代：存活时间较短的对象
   - 老生代：存活时间较长的对象
2. 标记清除
   1. 给内存中所有的变量加上标记
   2. 去掉运行环境中变量的标记，去掉被运行环境中引用变量的标记
   3. 垃圾收集器清除仍然带有标记的变量，回收内存空间
3. 引用计数
   1. 运行环境中的变量，或者被运行环境中引用的变量，引用计数+1
   2. 回收引用计数为 0 的内存
4. 新生代垃圾回收使用 from、to 空间
   1. 将存在标记的变量留在 from 空间，不存在标记的变量移动到 to 空间
   2. 清除 from 空间，交换 from 空间和 to 空间
5. 老生代垃圾回收使用标记清除
   1. 空间不足时会使用标记整理
   2. 标记整理会将存活对象向内存空间的一侧移动
6. 新生代向老生代的晋升
   1. 经历 2 次 from 到 to 空间的交换
   2. to 空间超过 25%的内存使用，对象直接从 from 移动到老生代

###### 2.内存泄漏

1. 缓存
2. 队列消费不及时，内存占用堆积
3. 作用域未释放（闭包）

###### 3.stream

1. v8 内存限制，无法进行大文件写入，通过流 stream 的方式读取和写入

```js
var reader = fs.createReadStream("in.txt");
var writer = fs.createWriteStream("out.txt");
reader.on("data", function (chunk) {
  writer.write(chunk);
});
reader.on("end", function () {
  writer.end();
});

// 简写
var reader = fs.createReadStream("in.txt");
var writer = fs.createWriteStream("out.txt");
reader.pipe(writer);
```

###### 4.buffer

1. 16 进制的 2 位数
2. Node 进程启动时加载
3. Buffer 是 1 个 Array 对象，用于操作字节
4. 是 js 和 c++结合起来
5. buffer 处理网络协议、操作数据库、处理图片、文件上传
6. Buffer 和字符串可相互转换
7. Buffer 是 js 分配内存，c++申请内存

###### 5.网络

1. net: TCP
2. dgram: UDP
3. http: HTTP
4. https: HTTPS
5. websocket
   1. 使用更少的链接，只建立 1 个 TCP 连接
   2. 更灵活、更高效
   3. 更轻量的协议头，减少数据传送量
6.

###### 6.单线程

- 优点
  - 不用在意状态同步，不用加锁
  - 没有线程上下文同步带来的开销
- 缺点
  - 无法利用多核 cpu
  - 应用健壮性问题，错误会引起整个应用退出
  - JS 长时间的执行，导致 UI 的渲染和响应被中断，导致异步 I/O 的回调得不到执行
- 优化
  - webWorkers 来做 JS 的大计算
  - Node 使用 child_process 将计算分发到子进程

###### 7.Node 应用场景

1. 处理 I/O 密集型
   - Node 的事件循环，可以处理大量的并发请求
   - Node 垃圾回收自动回收内存
