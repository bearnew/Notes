## 数据属性
* Configurable
> 表示能否通过delete删除属性，从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性。默认值为true
* Enumerable
> 表示能否通过for-in循环返回属性。默认值为true
* Writable
> 表示能否修改属性的值，默认值为true
* Value
> 包含这个属性的数据值，默认值为undefined

## 定义属性
```
var person = {} 
Object.defineProperty{person, "name", {
    writable: false,
    value: "Nicholas"
}};
```
> 将configurable特性设置为false之后就不能再设置为true了
> 调用Object.defineProperty()方法创建一个新的属性时，如果不指定，configurable,enumerable,writable特性的默认值都为false

## 访问器属性
* Configurable
* Enumerable
* Get
* Set

```
var book = {
    _year: 2004,
    edition: 1
};

object.defineProperty(book, "year", {
    get: function() {
        return this._year;
    },
    set: function(newValue) {
        if(newValue > 2004) {
            this._year = newValue;
            this.edition += newValue -2004;
        }
    }
})
book.year = 2005;
alert(book.edition); // 2
```

## 创建对象

### 工厂模式

```
function createPerson(name, age, job){
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function() {
        alert(this.name);
    }
    return o;
}

var person1 = createPerson("Nicholas", 29, "Software Engineer");
var person2 = createPerson("Greg", 27, "Doctor");
```
### 构造函数模式
```
function Person(name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function() {
        alert(this.name);
    }
}

var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");
// 实例对象的constructor(构造函数)属性指向Person
alert(person1.consturctor == Person) // true
alert(person2.constructor == Person) // true
```
> 用new创建构造函数新实例，经历4个步骤

1. 创建一个新对象
2. 将构造函数的作用域赋给新对象（this指向这个新对象）
3. 执行构造函数中的代码(为新对象添加属性)
4. 返回新对象

> instanceof 操作符用于标识对象类型

```
alert(person1 instanceof Object); // true
alert(person1 instaceof Person); // true
```
## 原型模式
```
function Person () {}
Person.prototype.name = 'Nicholas';
Person.prototype.age = 29;
Person.prototype.job = 'Software Engineer';
Person.prototype.sayName = function() {
    alert(this.name);
}

var person1 = new Person();
person1.sayName(); // 'Nicholas'

var person2 = new Person();
Person2.sayName(); // 'Nicholas'
```
可以通过isPrototypeOf()方法来确定对象之间的关系
```
alert(Person.prototype.isPrototypeOf(person1)) // true
alert(Person.prototype.isPrototypeOf(person2)) // true
```
可以通过Object.getPrototypeOf()方法返回[[prototype]]的值
```
alert(Object.getPrototypeOf(person1) == Person.prototype) // true
alert(Object.getPrototypeOf(person1).name) // true
```
通过hasOwnProperty()方法检测属性是否存在实例中
```
person1.name = 'Greg';
alert(person1.hasOwnProperty("name")) // true
delete(person1.name)
alert(person1.hasOwnProperty("name")) // false
```
in操作符，通过对象能够访问到给定属性时返回true
```
alert(person1.hasOwnProperty("name")) // false
alert("name" in person1) // true
```