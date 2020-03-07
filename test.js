var anotherObject = {
    a: 2
};

// 创建一个关联到anotherObject 的对象
var myObject = Object.create(anotherObject);
console.log(myObject._proto_ === anotherObject.prototype)
console.log(myObject) // {}