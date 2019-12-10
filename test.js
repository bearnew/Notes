new Promise((resolve, reject) => {
    resolve({a: 1})
}).then((res = {}) => {
    console.log(res.a)
})