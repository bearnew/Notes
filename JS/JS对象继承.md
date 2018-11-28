## JS对象继承
### 1.对象冒充
__原理__：
1. 就是把 Parent 构造函数放到 Children 构造函数里面执行一次。
2. 那为什么不直接执行，非要转个弯把 Parent 赋值给 Children 的 method 属性再执行呢？ 这跟 this 的指向有关，在函数内 this 是指向 window 的。
3. 当将 Parent 赋值给 Children 的 method 时, this 就指向了 Children 类的实例。
```js
var Parent = function(name) {
	this.name = name;
	
	this.sayHi = function() {
		console.log(`Hi ${this.name}.`)
	}
}

var Child = function(name) {
	this.method = Parent;
	console.log('11111', this) // 11111 Child {method: ƒ}
	this.method(name);
	console.log('22222', this) // 22222 Child {method: ƒ, name: "wade", sayHi: ƒ}
	delete this.method;
	console.log('33333', this) // 33333 Child {name: "wade", sayHi: ƒ}

	this.getName = function() {
		console.log(this.name);
	}
}

var p = new Parent('james');
var c = new Child('wade');

p.sayHi(); // Hi james.
c.sayHi(); // Hi wade.
c.getName(); // wade
```
### 2.原型链继承
__tips:__
确保父类构造函数Parent没有任何的参数
```js
var Parent = function() {
	this.name = 'john';
	
	this.sayHi = function() {
		console.log(`Hi ${this.name}.`)
	}
}

var Child = function() {}

Child.prototype = new Parent(); // constructor也被重写了
// Child.prototype.constructor = Child; // 可以将Child实例的constructor重新定义为Child

var p = new Parent();
var c = new Child();

console.log(c.constructor) // f () { this.name = 'john'; this.sayHi = function() { console.log(`Hi ${this.name}.`) } }
console.log(c.__proto__) // Parent {name: "john", sayHi: ƒ}
console.log(Child.prototype) // Parent {name: "john", sayHi: ƒ}

p.sayHi(); // Hi john.
c.sayHi(); // Hi john.
```
### 3.调用call或apply方法
```js
var Parent = function(name) {
	this.name = name;
	
	this.sayHi = function() {
		console.log(`Hi ${this.name}.`)
	}
}

var Child = function(name) {
	// Parent.call(this, name);
	Parent.apply(this, [name])

	this.getName = function() {
		console.log(this.name)
	}
}

var p = new Parent('james');
var c = new Child('wade');

p.sayHi(); // Hi james.
c.sayHi(); // Hi wade.
c.getName(); // wade
```
### 4.Object.create()
__tips:__
Object.create()的第一个参数必须为对象
```js
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

Child.prototype = Object.create(Parent, {
	name: {
		value: 'wade'
	}
});
var c = new Child();

console.log(c.constructor) // ƒ Object() { [native code] }
Child.prototype.constructor = Child;
console.log(c.constructor) // f () { this.getName = function() { console.log(this.name) } }

c.sayHi(); // Hi wade.
c.getName(); // wade

```
### 5.extends继承
__原理:__
super虽然代表了父类Parent的构造函数，但是返回的是子类Children的实例，即super内部的this指的是Children，因此super()在这里相当于Parent.prototype.constructor.call(this)。
```js
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

```