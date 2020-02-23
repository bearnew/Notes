this.middleware = [];

function use(fn) {
    this.middleware.push(fn);
}

use(function* (next) {
    console.log('first start');
    yield next;
    console.log('first end');
})

use(function* (next) {
    console.log('second start');
    yield next;
    console.log('second end');
})

use(function* (next) {
    console.log('three start');
    yield next;
    console.log('three end');
})

const koa = compose(this.middleware);
co(koa());


function compose(middleware) {
    if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
    for (const fn of middleware) {
        if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
    }

    return function (next) {
        // 记录上一次执行中间件的位置 #
        let index = -1
        return dispatch(0)
        function dispatch(i) {
            // 理论上 i 会大于 index，因为每次执行一次都会把 i递增，
            // 如果相等或者小于，则说明next()执行了多次
            if (i <= index) return Promise.reject(new Error('next() called multiple times'))
            index = i
            // 取到当前的中间件
            let fn = middleware[i]
            if (i === middleware.length) fn = next
            if (!fn) return Promise.resolve()
            try {
                return Promise.resolve(fn(function next() {
                    return dispatch(i + 1)
                }))
            } catch (err) {
                return Promise.reject(err)
            }
        }
    }
}


function co(p) {
    return p.then(gen => {
        if (!gen) {
            return;
        }

        const ret = gen.next();

        if (!ret.done) {
            return co(ret.value()).then(res => {
                gen.next();
            });
        }
    }).catch(err => {
        console.error(err);
    })
}
