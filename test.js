const p = new Promise((resolve, reject) => {
    reject("异常啦"); // 或者通过 throw new Error() 跑出异常
})
    .catch((err) => {
        console.log("捕获异常啦"); // 进入
    })
    .catch(() => {
        console.log("还有异常吗"); // 不进入
    })
    .then(() => {
        console.log("成功"); // 进入
    });
