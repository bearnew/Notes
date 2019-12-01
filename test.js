new Promise((resolve, reject) => {
    console.log('step-1') // step-1
    setTimeout(() => {
        resolve('step-2');
    }, 1000)
}).then(data => {
    console.log(data); // step-2
    return 'step-3';
}).then(data => {
    console.log(data); // step-3
    return data.xs.x
}).catch(err => {
    console.error('error', err)
})

function Promise(fn) {
    console.log('----------')
    let value = null;
    let status = 'pending';
    let callBacks = [];
    let errBack = null;

    this.x = '1'
    let self = this;
    console.log('+++++++++++')

    fn(resolve, reject);

    function resolve(result) {
        console.log('ppppp', errBack, callBacks)
        status = 'fulfilled';
        value = result;


        console.log(errBack)
        handleCallBacks();
    }

    function reject(error) {
        status = 'rejected';
        value = error;
    }

    function handleCallBacks() {
        console.log('5555', errBack)
        if (callBacks.length === 0) return;
        const {
            onFulfilled,
            onRejected,
            resolve,
            reject
        } = callBacks;

        try {
            if (status === 'fulfilled') {
                const newValue = onFulfilled(value);
                resolve(newValue);
            }

            if (status === 'rejected' && onRejected) {
                onRejected(value);
                reject(value);
            }
        } catch (err) {
            console.log('1111', err)
            console.log('2222', errBack)
            errBack(err);
        }

        if (status === 'rejected' && !onRejected) {
            errBack(value);
        }
    }

    this.then = (onFulfilled, onRejected) => {
        console.log('eeeee')
        return new Promise((resolve, reject) => {
            console.log('rrrr')
            callBacks = {
                onFulfilled,
                onRejected,
                resolve,
                reject
            }
            err
        })
    }

    this.catch = errFunction => {
        callBacks = errFunction;
        this.x = '3333'
        console.log('nnnn', errBack)
    }
}


// function Promise(fn) {
//     let state = 'pending'
//     let value = null
//     const callbacks = []

//     this.then = function (onFulfilled, onRejected) {
//         return new Promise((resolve, reject) => {
//             handle({
//                 onFulfilled,
//                 onRejected,
//                 resolve,
//                 reject,
//             })
//         })
//     }

//     this.catch = function (onError) {
//         this.then(null, onError)
//     }

//     this.finally = function (onDone) {
//         this.then(onDone, onError)
//     }

//     this.resolve = function (value) {
//         if (value && value instanceof Promise) {
//             return value
//         } if (value && typeof value === 'object' && typeof value.then === 'function') {
//             const { then } = value
//             return new Promise((resolve) => {
//                 then(resolve)
//             })
//         } if (value) {
//             return new Promise(resolve => resolve(value))
//         }
//         return new Promise(resolve => resolve())
//     }

//     this.reject = function (value) {
//         return new Promise(((resolve, reject) => {
//             reject(value)
//         }))
//     }

//     this.all = function (arr) {
//         const args = Array.prototype.slice.call(arr)
//         return new Promise(((resolve, reject) => {
//             if (args.length === 0) return resolve([])
//             let remaining = args.length

//             function res(i, val) {
//                 try {
//                     if (val && (typeof val === 'object' || typeof val === 'function')) {
//                         const { then } = val
//                         if (typeof then === 'function') {
//                             then.call(val, (val) => {
//                                 res(i, val)
//                             }, reject)
//                             return
//                         }
//                     }
//                     args[i] = val
//                     if (--remaining === 0) {
//                         resolve(args)
//                     }
//                 } catch (ex) {
//                     reject(ex)
//                 }
//             }
//             for (let i = 0; i < args.length; i++) {
//                 res(i, args[i])
//             }
//         }))
//     }

//     this.race = function (values) {
//         return new Promise(((resolve, reject) => {
//             for (let i = 0, len = values.length; i < len; i++) {
//                 values[i].then(resolve, reject)
//             }
//         }))
//     }

//     function handle(callback) {
//         if (state === 'pending') {
//             callbacks.push(callback)
//             return
//         }

//         const cb = state === 'fulfilled' ? callback.onFulfilled : callback.onRejected
//         const next = state === 'fulfilled' ? callback.resolve : callback.reject

//         console.log('11111', value)
//         if (!cb) {
//             next(value)
//             return
//         }
//         try {
//             const ret = cb(value)
//             next(ret)
//         } catch (e) {
//             callback.reject(e)
//         }
//     }
//     function resolve(newValue) {
//         const fn = () => {
//             if (state !== 'pending') return

//             if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
//                 const { then } = newValue
//                 if (typeof then === 'function') {
//                     // newValue 为新产生的 Promise,此时resolve为上个 promise 的resolve
//                     // 相当于调用了新产生 Promise 的then方法，注入了上个 promise 的resolve 为其回调
//                     then.call(newValue, resolve, reject)
//                     return
//                 }
//             }
//             state = 'fulfilled'
//             console.log('44444', newValue)
//             value = newValue
//             handelCb()
//         }

//         setTimeout(fn, 0)
//     }
//     function reject(error) {
//         const fn = () => {
//             if (state !== 'pending') return

//             if (error && (typeof error === 'object' || typeof error === 'function')) {
//                 const { then } = error
//                 if (typeof then === 'function') {
//                     then.call(error, resolve, reject)
//                     return
//                 }
//             }
//             state = 'rejected'
//             value = error
//             handelCb()
//         }
//         setTimeout(fn, 0)
//     }
//     function handelCb() {
//         while (callbacks.length) {
//             const fn = callbacks.shift()
//             handle(fn)
//         }
//     }
//     fn(resolve, reject)
// }