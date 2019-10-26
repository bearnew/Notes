
var i = 2;
Number.prototype.valueOf = function () {
    return i++;
};
var a = new Number(123);
if (a == 2 && a == 3) {
    console.log("Yep, this happened.");
}