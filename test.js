

// code start
// function start
// promise start
// function end
// code end
// (node:14182) UnhandledPromiseRejectionWarning: ReferenceError: noValid is not defined

process.on('uncaughtException', function (err) {
    console.log('uncaughtException', err)
});

console.log('code start')
const func = () => {
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