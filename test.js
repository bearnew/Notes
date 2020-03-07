var arrLike = {
    length: 3,
    0: "foo",
    1: "bar"
};
var arr = Array.prototype.slice.call(arrLike);

var arr = Array.from(arrLike);
console.log(arr)