// 定义了一个promise，用来模拟异步请求，作用是传入参数++
function getNum(num) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(num + 1)
        }, 1000)
    })
}

// 所需要执行的Generator函数，内部的数据在执行完成一步的promise之后，再调用下一步
function* func() {
    var f1 = yield getNum(1);
    console.log(f1)
    var f2 = yield getNum(f1);
    console.log(f2);
};
asyncFun(func);

//自动执行器，如果一个Generator函数没有执行完，则递归调用
function asyncFun(func) {
    var gen = func();

    function next(data) {
        var result = gen.next(data);
        if (result.done) return result.value;
        result.value.then(function (res) {
            next(res);
        });
    }

    next();
}

function* test() {
    var y = 2;
    var x = yield 1;
    x = yield (x + y + 1);
    return x;
}

const gen = test();
console.log(gen.next()); // {value: 1, done: false}

// 只接收上一次yield生成的变量，y依然使用函数中的变量
console.log(gen.next(5, 4)); // {value: 8, done: false}
console.log(gen.next()); // {value: undefined, done: true}