var a = function* () {
    yield 'hello';
    yield 'world';
    return 'ending';
}
// console.log(co(a()));
// co(helloWorldGenerator).then(() => {
//     console.log('sdsdf')
// });


this.middleware = [];
function compose(middleware) {
    return function *(next) {
        if (!next) next = noop();

        var i = middleware.length;

        while(i--) {
            next = middleware[i].call(this, next);
        }

        // console.log('6666', yield *next)
        return yield *next;
        // yield *next;
        // return next;
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

// console.log('ssssss', koa)

const test = co.wrap(koa)
// console.log(typeof test, test)
test()
