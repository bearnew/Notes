new Promise((resolve, reject) => {
    console.log('step-1') // step-1
    setTimeout(() => {
        resolve('step-2');
    }, 1000)
}).then(data => {
    console.log(data)
    return new Promise((resolve, reject) => {
        resolve('step-3')
    })
}).then(data => {
    console.log(data);
    return Promise.resolve('step-4');
}).then(data => {
    console.log(data);
    return Promise.reject('step-5');
}).then(data => {
    console.log(data); // step-4
}, err => {
    console.log('reject', err)
}).catch(err => {
    console.error('error', err)
}).finally(() => {
    console.log('finally')
})

let p1 = new Promise((resolve, reject) => {
    resolve('success 1')
})

let p2 = new Promise((resolve, reject) => {
    resolve('success 2')
})

let p3 = new Promise((resolve, reject) => {
    reject('fail fail')
})

Promise.all([p1, p2]).then((result) => {
    console.log(result); // ["success 1", "success 2"]
}).catch((error) => {
    console.error(error)
})

Promise.race([p2, p3]).then((result) => {
    console.log(result); // success 2
}).catch((error) => {
    console.error(error)
})

function Promise(fn) {
    let value = null;
    let err = null;
    let status = 'pending';
    const callBacks = [];

    fn(resolve, reject);

    function resolve(result) {
        status = 'fulfilled';
        value = result;

        setTimeout(() => {
            handleCallBacks();
        }, 0)
    }

    function reject(error) {
        status = 'rejected';
        err = error;

        setTimeout(() => {
            handleCallBacks();
        }, 0)
    }

    function handleCallBacks() {
        if (callBacks.length === 0 && status === 'rejected') {
            catchFunction(err);
        }
        if (callBacks.length === 0 && completeFunction) {
            completeFunction();
            return;
        };
        const callBack = callBacks.shift();
        const {
            onFulfilled,
            onRejected,
            resolve,
            reject
        } = callBack;

        try {
            if (status === 'fulfilled') {
                const newValue = onFulfilled(value);

                if (typeof newValue === 'object' && typeof newValue.then === 'function') {
                    newValue.then(res => {
                        resolve(res);
                    })
                } else {
                    resolve(newValue);
                }
            }

            if (status === 'rejected' && onRejected) {
                onRejected(err);
            }

            if (status === 'rejected' && !onRejected) {
                catchFunction(err);
            }
        } catch (err) {
            catchFunction(err);
        }
    }

    this.then = (onFulfilled, onRejected) => {
        return new Promise((resolve, reject) => {
            callBacks.push({
                onFulfilled,
                onRejected,
                resolve,
                reject
            });
        })
    }

    this.catch = errFunction => {
        catchFunction = errFunction;
        return new Promise((resolve, reject) => { })
    }

    this.finally = finallyFunction => {
        completeFunction = finallyFunction;
    }

    Promise.resolve = value => {
        return new Promise(resolve => {
            resolve(value);
        })
    }

    Promise.reject = err => {
        return new Promise((resolve, reject) => {
            reject(err);
        })
    }

    Promise.race = promises => {
        return new Promise(((resolve, reject) => {
            const errs = [];

            for (let p of promises) {
                p.then(val => {
                    console.log('123123', val)
                    resolve(val);
                }, err => {
                    errs.push(err);
                    if (errs.length === promises.length) {
                        reject(errs[0]);
                    }
                });
            }
        }))
    }

    Promise.all = promises => {
        return new Promise((resolve, reject) => {
            const results = [];

            for (let p of promises) {
                p.then(val => {
                    results.push(val);
                    if (results.length === promises.length) {
                        resolve(results);
                    }
                }, err => {
                    reject(err);
                });
            }
        })
    }
}