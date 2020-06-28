
// 首页home接口请求状态
// let initHomePromise = new Promise(resolve => {
//     initHomeStatusResolve = resolve;
// });
let initHomePromise = Promise.resolve();
let initHomeStatusResolve = () => {};

const initHomeStart = () => {
    initHomePromise = new Promise(resolve => {
        initHomeStatusResolve = resolve;
    });
}

const initHomeEnd = () => {
    initHomeStatusResolve();
}

initHomeStart()
    initHomePromise.then(res => {
        console.log('success')
    })
initHomeEnd()

initHomePromise.then(res => {
    console.log('23222')
})