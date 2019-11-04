function foo(x, y, cb) {
    setTimeout(function () {
        cb(x + y);
    }, 1000);
}

function thunkify(fn) {
    var args = [].slice.call(arguments, 1);
    return function (cb) {
        args.push(cb);
        return fn.apply(null, args);
    };
}

var fooThunk = thunkify(foo, 3, 4);

// 将来
fooThunk(function (sum) {
    console.log(sum); // 7
});