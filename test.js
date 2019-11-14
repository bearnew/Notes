new Promise((resolve, reject) => {
    console.log('11111')
    setTimeout(() => {
        resolve(111);
    }, 1000)
}).then(data => {
    return new Promise((resolve, reject) => {
        resolve(data + 111);
    })
}).then(data => {
    console.log(data); // 222
}).catch((ex) => {
    console.log('error', ex)
})

function Promise(fn) {
    let state = 'pending'
    let value = null
    const callbacks = []

    // step2-执行new Promise(...).then()时，进入this.then函数
    this.then = function (onFulfilled, onRejected) {
        return new Promise((resolve, reject) => {
            handle({
                onFulfilled,
                onRejected,
                resolve,
                reject,
            })
        })
    }

    function handle(callback) {
        if (state === 'pending') {
            // step3-向callbacks中push了onFulfilled, onRejected, resolve, reject函数
            callbacks.push(callback)
            return
        }

        const cb = state === 'fulfilled' ? callback.onFulfilled : callback.onRejected
        const next = state === 'fulfilled' ? callback.resolve : callback.reject

        if (!cb) {
            next(value)
            return
        }
        try {
            const ret = cb(value)
            next(ret)
        } catch (e) {
            callback.reject(e)
        }
    }
    // step5-执行异步返回的111传给resolve
    function resolve(newValue) {
        const fn = () => {
            if (state !== 'pending') return

            if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
                const { then } = newValue
                if (typeof then === 'function') {
                    // newValue 为新产生的 Promise,此时resolve为上个 promise 的resolve
                    // 相当于调用了新产生 Promise 的then方法，注入了上个 promise 的resolve 为其回调
                    then.call(newValue, resolve, reject)
                    return
                }
            }
            state = 'fulfilled'
            value = newValue
            handelCb()
        }

        // 为了保证同步代码resolve后，也是在then中的回调push到callbacks后执行
        setTimeout(fn, 0)
    }

    function reject(error) {
        const fn = () => {
            if (state !== 'pending') return

            if (error && (typeof error === 'object' || typeof error === 'function')) {
                const { then } = error
                if (typeof then === 'function') {
                    then.call(error, resolve, reject)
                    return
                }
            }
            state = 'rejected'
            value = error
            handelCb()
        }
        setTimeout(fn, 0)
    }

    function handelCb() {
        while (callbacks.length) {
            const fn = callbacks.shift()
            handle(fn)
        }
    }

    // step1-执行new promise中的函数
    // 这里就是setTimeout(() => { resolve(111);}, 1000)
    fn(resolve, reject)

    this.catch = function (onError) {
        this.then(null, onError)
    }

    this.finally = function (onDone) {
        this.then(onDone, onError)
    }

    this.resolve = function (value) {
        if (value && value instanceof Promise) {
            return value
        } if (value && typeof value === 'object' && typeof value.then === 'function') {
            const { then } = value
            return new Promise((resolve) => {
                then(resolve)
            })
        } if (value) {
            return new Promise(resolve => resolve(value))
        }
        return new Promise(resolve => resolve())
    }

    this.reject = function (value) {
        return new Promise(((resolve, reject) => {
            reject(value)
        }))
    }

    this.all = function (arr) {
        const args = Array.prototype.slice.call(arr)
        return new Promise(((resolve, reject) => {
            if (args.length === 0) return resolve([])
            let remaining = args.length

            function res(i, val) {
                try {
                    if (val && (typeof val === 'object' || typeof val === 'function')) {
                        const { then } = val
                        if (typeof then === 'function') {
                            then.call(val, (val) => {
                                res(i, val)
                            }, reject)
                            return
                        }
                    }
                    args[i] = val
                    if (--remaining === 0) {
                        resolve(args)
                    }
                } catch (ex) {
                    reject(ex)
                }
            }
            for (let i = 0; i < args.length; i++) {
                res(i, args[i])
            }
        }))
    }

    this.race = function (values) {
        return new Promise(((resolve, reject) => {
            for (let i = 0, len = values.length; i < len; i++) {
                values[i].then(resolve, reject)
            }
        }))
    }
}
