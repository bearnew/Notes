function lazyMan(name) {
    const { log } = console;
    const sleep = (s) =>
        new Promise((res) =>
            setTimeout(() => log(`Wake up after ${s}`) || res(), s * 1000)
        );
    const queue = [() => log(`Hi! This is ${name}!`)];
    // 这个里用了 push(x) && ctx
    // push 的返回值是数组 push 后的长度 所以不会出现 0 , 可以放心在箭头函数里使用
    const ctx = {
        eat: (food) => queue.push(() => log(`Eat ${food}~`)) && ctx,
        sleep: (s) => queue.push(() => sleep(s)) && ctx,
        sleepFirst: (s) => queue.unshift(() => sleep(s)) && ctx,
    };

    // 微任务，和Promise.resolve()执行时机一样
    queueMicrotask(async () => {
        while (queue.length) {
            await queue.shift()();
        }
    });

    return ctx;
}

lazyMan("Hank");
// 打印：Hi! This is Hank!

lazyMan("Hank").sleep(10).eat("dinner");
// 打印：Hi! This is Hank!
// 等待了 10 秒后
// 打印：Wake up after 10
// 打印：Eat dinner~
lazyMan("Hank").eat("dinner").eat("supper");
// 打印：Hi This is Hank!
// 打印：Eat dinner~
// 打印：Eat supper~
lazyMan("Hank").sleepFirst(5).eat("supper");
// 等待了 5 秒后
// 打印：Wake up after 5
// 打印：Hi This is Hank!
// 打印：Eat supper

lazyMan("Hank").eat("supper").sleepFirst(5);
// 等待了 5 秒后
// 打印：Wake up after 5
// 打印：Hi This is Hank!
// 打印：Eat supper
