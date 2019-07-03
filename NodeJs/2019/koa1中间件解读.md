## koa1中间件解读

1. 将middleware数组中的generator函数合并成一个generator
    * 将noop作为第3中间件的next函数
    * 第3中间件作为第2中间件的next函数
    * 第2中间件作为第1中间件的next函数
    ```js
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

    const generatorKoa = compose(this.middleware);
    ```
2. 调用generator函数，生成一个指向内部状态的指针对象，传给co
> co.js是根据生成器特性和Promise结合创造出来的一个自动生成器，会自动按顺序执行next函数，直到done为true为止
    ```js
    co.wrap = function (fn) {
        createPromise.__generatorFunction__ = fn;
        return createPromise;
        function createPromise() {
            return co.call(this, fn.apply(this, arguments));
        }
    };

    const test = co.wrap(generatorKoa);
    ```
3. co中返回一个promise,promise中调用```onFulfilled```函数
    ```js
    function co() {
        return new Promise((resolve, reject) => {
            onFulfilled();

            function onFulfilled() {
                //
            }
        })
    }
    ```
4. ```onFulfilled```函数中第一次执行next方法，并把```{value: Generator, done: false}```结果传给自定义的```next```方法执行
    ```js
    function co() {
        return new Promise((resolve, reject) => {
            onFulfilled();

            function onFulfilled(res) {
                var ret;
                try {
                    ret = gen.next(res);
                    console.log('11111', ret)
                } catch (e) {
                    return reject(e);
                }
                next(ret);
                return null;
            }

            function next(ret) {
                //
            }
        })
    }
    ```
5. ```next```中，调用```toPromise```方法，如果是```gen.next()```是```generator```函数，则继续递归调用co
    ```js
    function next(ret) {
        if (ret.done) return resolve(ret.value);
        var value = toPromise.call(ctx, ret.value);
        if (value && isPromise(value)) {
            return value.then(onFulfilled, onRejected);
        }
        return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
            + 'but the following object was passed: "' + String(ret.value) + '"'));
    }

    function toPromise(obj) {
        if (!obj) return obj;
        if (isPromise(obj)) return obj;
        if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
        if ('function' == typeof obj) return thunkToPromise.call(this, obj);
        if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
        if (isObject(obj)) return objectToPromise.call(this, obj);
        return obj;
    }
    ```
6. 调用到第noop的next函数时，```ret.done```为```true```
    * return返回，则回到上一层，到达第3个中间件的next函数
    * 第3个中间件函数，已被toPromise转换为promise对象，执行了return操作，返回到第2个中间件的next函数
    * 第2个中间件函数，同理，返回到第一个中间件的next函数
    * 第一个中间件的next函数的返回值仍然是promise对象，仍然return
7. 同步函数已经执行完毕，开始执行promise.then后面的onFulfilled函数，
    * 依次执行完成第3个，第2个，第1个中间件后面的onFulfilled函数
    * 第1个中间件执行完毕后，ret.done为true, return, 但此时外围已再无函数，整个中间件操作完成

