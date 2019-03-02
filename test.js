class Parent {
	constructor(name) {
		this.name = name;
	}
}

class Child extends Parent {
	constructor(name, age) {
		super(name);
		this.age = age;
	}
}

var c = new Child('james', 34);
console.log(c.name); // james
console.log(c.age); // 34
