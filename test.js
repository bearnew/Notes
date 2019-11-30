var a = NaN, b = Infinity, c = 42;
console.log(Number.isFinite(a)); // false
console.log(Number.isFinite(b)); // false
console.log(Number.isFinite(c)); // false

new Promise((resolve, reject) => {
    console.log('11111')
    setTimeout(() => {
        resolve('hello world');
    }, 1000)
}).then(data => {
    return data;
}).then(data => {
    console.log('hello world'); // hello world
}).catch((ex) => {
    console.log('error', ex)
})


function Promise(fn) {
    let value = null;
    let status = 'pending';
    let callBacks = [];

    fn(resolve, reject);

    function resolve(result) {
        status = 'fulfilled';
        value = result;

        console.log('resolve resolve resolve resolve resolve')
        handleCallBacks();
    }

    function reject(error) {
        status = 'rejected';
        value = error;
    }

    function handleCallBacks() {
        if (callBacks.length === 0) return;
        const {
            onFulfilled,
            onRejected,
            resolve,
            reject
        } = callBacks;
        console.log(status, value)
        if (status === 'fulfilled') {
            console.log('33333', onFulfilled)
            onFulfilled(value);
            resolve(value);
        }

        if (status === 'rejected' && onRejected) {
            onRejected(value);
            reject(value);
        }

        if (status === 'rejected' && !onRejected) {
            this.catch(value);
        }
    }

    this.then = (onFulfilled, onRejected) => {
        console.log('then then then')
        return new Promise((resolve, reject) => {
            callBacks = {
                onFulfilled,
                onRejected,
                resolve,
                reject
            }
        })
    }

    this.catch = err => {

    }
}
