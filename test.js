const test = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return reject(1)
        }, 1000)
    }).catch(err => {
        console.log('5555', err)
    })
}

test().then(() => {
    console.log('success')
}).catch(err => {
    console.log('66666', err)
})