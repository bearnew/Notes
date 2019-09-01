var a = new Array(3);
var b = [undefined, undefined, undefined];
var c = [];
c.length = 3;

var x = a.map(function (v, i) { return i; }); //  [empty × 3]
var y = b.map(function (v, i) { return i; }); // [ 0, 1, 2 ]

var z = Array.apply(null, { length: 3 }); // [ undefined, undefined, undefined ]
