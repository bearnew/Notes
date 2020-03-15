function myNew(F) {
    return function () {
        // var o = Object.create(F.prototype);
        var o = {};
        o.__proto__ = F.prototype;
        var result = F.apply(o, arguments);

        return (result ? result : o);
    }
}

function Test(a) {
    this.a = a;

    return {
        x: '1'
    }
}

var test = myNew(Test)('hello');
console.log(test);
