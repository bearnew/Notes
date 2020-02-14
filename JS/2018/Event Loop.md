## Event Loop总结
### 前言
    1. 受浏览器交互影响，js从诞生之日起就是一门单线程非阻塞的脚本语言
    2. js在任何时候，都只有一个主线程来处理所有任务
    3. web worker可以让js多线程执行
        * web worker的线程受主线程完全控制，不能独立执行
        * 没有I/O权限，只能为主线程分担计算等任务
### 1.执行栈
    1. 内存中的堆和栈
        * 堆(heap)中存放对象
        * 栈(stack)中存放基础类型变量及对象指针
    2. 执行栈
        * js调用方法的时候，方法会被排列到一个单独的地方，这个地方称为执行栈
### 2.事件队列
    1. 遇到异步事件，会将事件挂起，继续执行执行栈中的其他任务。
    2. 异步事件返回结果后，Js会将事件加入到与当前执行栈不同的另一队列，我们称为事件队列。
    3. 主线程中的任务执行完毕，会查找事件队列中的任务。
    4. 将事件队列中的任务（异步事件对应的回调）放入执行栈中，执行同步代码
    5. 反复循环，整个过程称为事件循环。
    6. 图中stack为执行栈，webApis为异步事件，callback queue为事件队列。
![avatar](https://github.com/bearnew/picture/blob/master/mardown/2018-11-21%20event%20loop/eventLoop1.jpg?raw=true)
### 3.macro task与micro task
    1. 宏任务
        * setInterval()
        * setTimeout()
        * I/O
        * setImmediate()
        * requestAnimationFrame
    2. 微任务
        * process.nextTick
        * MutationObserver
            * 监听DOM结构变化的API
        * Promise.then catch finally
    3. 主线程会先执行事件队列中的微任务，再执行事件队列中的宏任务
eg.1
```js
setImmediate(function(){
    console.log("setImmediate");
});
setTimeout(function(){
    console.log("setTimeout");
}, 10);
process.nextTick(()=>{
    console.log('nextTick');
});

// nextTick
// setImmediate
// setTimeout
```
eg.2
```js
setImmediate(function(){
    console.log("setImmediate");
});
setTimeout(function(){
    console.log("setTimeout");
}, 0);
process.nextTick(()=>{
    console.log('nextTick');
});

// nextTick
// setTimeout
// setImmediate
```
eg.3
```js
setTimeout(_ => console.log(6))

new Promise(resolve => {
  resolve()
  console.log(1)
}).then(_ => {
  console.log(3)
  Promise.resolve().then(_ => {
    console.log(4)
  }).then(_ => {
    Promise.resolve().then(_ => {
      console.log(5)
    })
  })
})

console.log(2)

// 1
// 2
// 3
// 4
// 5
// 6
```
### 4.nodejs事件循环
外部输入数据-->轮询阶段(poll)-->检查阶段(check)-->关闭事件回调阶段(close callback)-->定时器检测阶段(timer)-->I/O事件回调阶段(I/O callbacks)-->闲置阶段(idle, prepare)-->轮询阶段...

* poll: 等待新的I/O事件，node在一些特殊情况下会阻塞在这里。
* check: setImmediate()的回调会在这个阶段执行。
* close callbacks: 例如socket.on('close', ...)这种close事件的回调。
* timers: 这个阶段执行定时器队列中的回调如 setTimeout() 和 setInterval()。
* I/O callbacks: 这个阶段执行几乎所有的回调。但是不包括close事件，定时器和setImmediate()的回调。
* idle, prepare: 这个阶段仅在内部使用，可以不必理会。
* 观察者的优先顺序 `idle观察者(process.nextTick()) > io观察者(setTimeout) > check观察者(setImmediate)`
    * process.nextTick()，效率最高，消费资源小，但会阻塞CPU的后续调用； 
    * setTimeout()，精确度不高，可能有延迟执行的情况发生，且因为动用了红黑树，所以消耗资源大； 
    * setImmediate()，消耗的资源小，也不会造成阻塞，但效率也是最低的。
![nodejs事件循环](https://github.com/bearnew/picture/blob/master/mardown/2018-11-21%20event%20loop/eventLoop2.png?raw=true)