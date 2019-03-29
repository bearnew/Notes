

var anotherObject = {
  a:2
};

// 创建一个关联到anotherObject 的对象
var myObject = Object.create( anotherObject );
console.log(myObject) // {}

myObject.a = 3;
console.log(myObject)
console.log(anotherObject)
for (var k in myObject) {
  console.log("found: " + k);// found: a
}

("a" in myObject); // true