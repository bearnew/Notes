new Promise((resolve, reject) => {
    console.log('11111')
    setTimeout(() => {
        resolve('result');
    }, 0)
}).then(res => {
    console.log(res)
})

console.log('2222')
console.time('for')
for (var i = 0; i < 100000; i++) {
    sessionStorage.setItem('key', 'sdfdsf')
    sessionStorage.getItem('key')
}
console.timeEnd('for')
console.log('3333')




// new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve({ test: 1 })
//         resolve({ test: 2 })
//         // reject({ test: 2 })
//     }, 100)
// }).then((data) => {
//     console.log('result1', data)
// }, (data1) => {
//     console.log('result2', data1)
// })
// // }).then((data) => {
// //     console.log('result3', data)
// // })

// function Promise(fn) {
//     let state = 'pending';
//     let value = null;
//     const callbacks = [];

//     this.then = function (onFulfilled) {
//         console.log('3333')
//         return new Promise((resolve, reject) => {
//             console.log('4444')
//             handle({ //桥梁，将新 Promise 的 resolve 方法，放到前一个 promise 的回调对象中
//                 onFulfilled,
//                 resolve
//             })
//         })
//     }

//     function handle(callback) {
//         if (state === 'pending') {
//             console.log('6666')
//             callbacks.push(callback)
//             return;
//         }

//         if (state === 'fulfilled') {
//             console.log('7777', callback)
//             if (!callback.onFulfilled) {
//                 callback.resolve(value)
//                 return;
//             }
//             const ret = callback.onFulfilled(value) //处理回调
//             console.log('555555', ret)
//             callback.resolve(ret) //处理下一个 promise 的resolve
//         }
//     }
//     function resolve(newValue) {
//         console.log('ssss')
//         const fn = () => {
//             console.log('999', state)
//             if (state !== 'pending') return

//             state = 'fulfilled';
//             value = newValue
//             console.log('111111')
//             handelCb()
//         }

//         setTimeout(fn, 0) //基于 PromiseA+ 规范
//     }

//     function handelCb() {
//         console.log('22222', callbacks.length, callbacks)
//         while (callbacks.length) {
//             const fulfiledFn = callbacks.shift();
//             handle(fulfiledFn);
//         };
//     }

//     console.log('uuuuu')
//     fn(resolve)
// }
