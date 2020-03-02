var promiseStart = new Promise(function (resolve, reject) {
    reject('promise is rejected');
});

promiseStart
    .then(res => {
        console.log('resolved');
        return new Promise(function (resolve, reject) {
            resolve('promise is resolved');
        });
    }, fail => {
        console.log('rejected:', fail);
        // return Promise.reject('1234')
        return '123'
    })
    .then(res => {
        console.log('resolved:', res);
    })
    .catch(function (err) {
        console.error('catched:', err);
    })

// rejected: promise is rejected
// resolved: undefined