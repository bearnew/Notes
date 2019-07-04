this.middleware = [];
function compose(middleware) {
    return function *(next) {
        if (!next) next = noop();

        var i = middleware.length;

        while(i--) {
            next = middleware[i].call(this, next);
        }

        return yield *next;
    }
}

function *noop() {};

function use(fn) {
    this.middleware.push(fn); 
}

use(function *(next) {
    console.log('first start');
    yield next;
    console.log('first end');
})

use(function *(next) {
    console.log('second start');
    yield next;
    console.log('second end');
})

use(function *(next) {
    console.log('three start');
    yield next;
    console.log('three end');
})

const koa = compose(this.middleware);

co1(koa); // 方法1
co2(koa()) // 方法2

// 中间件普通实现
// 依次调用第1-3中间件的next方法
// 调完之后，再依次调用第3-1中间件的next方法
function co1(fn) {
    const tmp = [];
    wrap(fn);

    function wrap(fn) {
        const gen = fn();
        next(gen);
    }

    function next(gen) {
        const ret = gen.next();
        tmp.push(gen);

        if (ret.done) {
            tmp[2].next();
            tmp[1].next();
            tmp[0].next();
            return;
        }

        wrap(() => ret.value);
    }
}

// 中间件promise实现
function co2(gen) {
    return new Promise((resolve, reject) => {

        onFulfilled();

        function onFulfilled() {
            const ret = gen.next();
            next(ret);
        }

        function next(ret) {
            if (ret.done) {
                return resolve(ret.value);
            }

            if (typeof ret.value.next === 'function') {
                // 当第4层的noop函数resolve后，第3层中间件就进入了then函数，再次调用第3个中间件的next方法
                // 当第3层的noop函数resolve后，第2层中间件就进入了then函数，再次调用第2个中间件的next方法
                // 当第2层的noop函数resolve后，第1层中间件就进入了then函数，再次调用第1个中间件的next方法
                return co2(ret.value).then(() => {
                    onFulfilled();
                });
            }
        }
    })
}
