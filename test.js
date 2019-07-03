// function* helloWorldGenerator() {
//     console.log('1111')
//     yield 'hello';
//     console.log('22222')
//     // yield 'world';
//     // return 'ending';
//   }
  
//   var hw = helloWorldGenerator();
//   hw.next();
//   hw.next()

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

co(koa);
// test()

function co(fn) {
    const tmp = [];
    wrap(fn);

    function wrap(fn) {
        const gen = fn();
        // console.log(gen)
        next(gen);    
    }

    function next(gen) {
        const ret = gen.next();
        tmp.push(gen);
        // console.log(tmp)
        // console.log(ret)

        if (ret.done) {
            tmp[2].next();
            tmp[1].next();
            tmp[0].next();
            return;
        }

        wrap(() => ret.value);
    }
}
