let timer;

function testApi(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(3000)
        }, 3000);
        // resolve(3000)
    })
}

function polling(pollingTime) {
    timer = setTimeout(() => {
        console.log('start', timer)
        testApi().then(res => {
            console.log('end')
            polling(res);
        })
    }, pollingTime);
}

polling(0);

setTimeout(() => {
    // 此时清空伦序，timer清除掉了，但是testApi已经加入到了事件队列
    // testApi返回后，轮询继续执行
    clearTimeout(timer);
    console.log('clear', timer)
}, 7000)
