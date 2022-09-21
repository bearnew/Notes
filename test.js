

// SyntaxError: Unexpected identifier
// let age b = 1;

process.on('uncaughtException', function (err) {
    console.log('uncaughtException', err)
});

console.log('code start')
const func = async () => {
    console.log('promise start')
    let age b = 1;
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