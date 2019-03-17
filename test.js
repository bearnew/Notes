function New(f) {
    //返回一个func
    return function () {
        var o = Object.create(f.prototype);
        console.log(f, arguments)
        f.apply(o, arguments);//继承父类的属性

        return o; //返回一个Object
    }
}

function foo(something) {
    this.a = something;
}

var baz = New(foo)(3);
console.log(baz.a); // 3
