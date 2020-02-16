var a = [];
var b = {};
var c = function () { };

var d = a && b && c; // function() {}
var e = Boolean(a && b && c); // true

console.log(e)