function partial(fn, ...args) {
    return (...arg) => {
        return fn(...args, ...arg);
    };
}
function add(a, b, c) {
    return a + b + c;
}
let partialAdd = partial(add, 1);
partialAdd(2, 3);
