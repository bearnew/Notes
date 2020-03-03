var Parent = {
	name: 'james',
	sayHi: function() {
		console.log(`Hi ${this.name}.`)
	}
}

var Child = function() {
	this.getName = function() {
		console.log(this.name)
	}
}

// 相当于把Child.prototype.__proto__指向Parent
Child.prototype = Object.create(Parent, {
	name: {
		value: 'wade'
	}
});
var c = new Child();

console.log(Child.prototype)
console.log(c.constructor) // ƒ Object() { [native code] }
Child.prototype.constructor = Child;
console.log(c.constructor) // f () { this.getName = function() { console.log(this.name) } }

c.sayHi(); // Hi wade.
c.getName(); // wade