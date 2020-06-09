const test = new Promise((resolve, reject) => {

})
Promise.all([test]).finally(() => {
    console.log('1111')
})
