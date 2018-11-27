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