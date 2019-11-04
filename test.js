function *main() {
    var x = yield "Hello World";
    console.log(x) // 42
    yield x.toLowerCase(); // 引发一个异常！
}

var it = main();
it.next().value; // Hello World

try {
    it.next(42);
}
catch (err) {
    console.error( err ); // TypeError
} 