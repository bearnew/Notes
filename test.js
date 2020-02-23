// 加入ଇ߲nextTick()的回调函数
process.nextTick(function () {
    console.log('nextTickჽ׿执行1');
});

new Promise((resolve, reject) => {
    resolve(1)
    console.log('5555')
}).then(res => {
    console.log('sdfsdf')
})
