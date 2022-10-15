process.on('uncaughtException', function (err) {
    console.log('uncaughtException', err)
});

console.log('code start')
const func = async () => {
    console.log('promise start')
    console.log(noValid)
    console.log('promise end')
}

const test = () => {
    console.log('function start')
    func();
    console.log('function end')
}

test();
console.log('code end')