if (!Function.prototype.myBind) (function () {
    Function.prototype.myBind = function () {
        var thatFunc = this;
        var bindObj = arguments[0];
        var bindArgs = Array.prototype.slice.call(arguments, 1);

        if (typeof thatFunc !== 'function') {
            throw new Error("The object calling bind must be function")
        }

        return function () {
            var args = bindArgs.concat(Array.prototype.slice.call(arguments))
            return thatFunc.apply(bindObj, args);
        }
    }
})()

function addArguments(arg1, arg2) {
    return arg1 + arg2
}

var addThirtySeven = addArguments.myBind(null, 37);

// 第2个参数被忽略
var result = addThirtySeven(5, 10);
console.log(result); // 42

