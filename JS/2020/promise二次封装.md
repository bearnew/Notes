## Promise二次封装
```js
var x = 0;
function query() {
    x ++;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // resolve('success');
            if (x == 3) {
                resolve('success');
            }
            reject('fail');
        }, 200);
    })
}

function queryWrap(interval, max) {
    return excute(0);

    function excute(n) {
        return query().then(res => {
            return res;
        }, async fail => {
            n++;
            if (n > max) {
                return Promise.reject(fail);
            }

            await waitFunc();
            return excute(n++);
        })
    }

    async function waitFunc() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, interval);
        })
    }
}

queryWrap(100, 3).then(res => {
    console.log(res)
}, fail => {
    console.log(fail);
})
```