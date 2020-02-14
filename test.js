setTimeout(() => console.log(1), 100);
process.nextTick(() => console.log(2));
setImmediate(() => console.log(3));
setTimeout(() => {
    for (leti = 0; i < 10000000; i++) {
        ;
    }
    console.log(4);

}, 99.99)