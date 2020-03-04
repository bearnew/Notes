function Promise(fn) {
    fn(resolve, reject);

    let value = null;
    let err = null;
    let status = 'pending';
    const callBacks = [];

    function resolve(res) {
        status = 'fulfilled';
        value = res;

        setTimeout(() => {
            handleCallBack();
        }, 0);
    }

    function reject(err) {
        status = 'rejected';
        err = err;

        setTimeout(() => {
            handleCallBack();
        }, 0);
    }

    function handleCallBack() {
        if (callBacks.length === 0 && status === 'rejected') {
            catchFunction(err);
        }

        if (callBacks.length === 0 && completeFunction) {
            completeFunction();
            return;
        }
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
        } catch(err) {
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
            })
        })
    }

    this.catch = errFunction => {
        catchFunction = errFunction;
        return new Promise((resolve, reject) => {})
    }

    this.finally = finallyFunction => {
        completeFunction = finallyFunction;
    }
}