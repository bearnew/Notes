var a = 1;
function b() {
    var a = 2;
    function c() {
        console.log(a);
    }

    return c;
}

b()(); // 2