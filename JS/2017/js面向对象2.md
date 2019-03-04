#### 面向对象
1. js没有类的概念,通过对象来实现**继承**，**封装**，**多态**，**抽象**
2. prototype属性与原型
```js
function Foo() {}

typeof Foo.prototype // "object"

Foo.prototype 
{
    constructor: Foo,
    __proto__: Object
}

Foo.prototype.prototype
// undefined

Object.prototype
// {__defineGetter__:f,__defineSetter:f,toString...}

Object.prototype.prototype
// undefined

Foo.__proto__
// f()

Foo.__proto__.__proto__
// {__defineGetter__:f,__defineSetter:f,toString...}

Foo.__proto__.__proto__.__proto__
null

```
3. Object.create
```js
// 同过Object.create创建一个空对象，对象的原型指向Person.prototype
Student.prototype = Object.create(Person.prototype);
```
4. 改变原型的属性，会影响到已生成的实例，改变整个原型，已生成的实例还是指向之前生成实例时的那个原型对象
```js
function Person () {}
var student = new Person();

Person.prototype.x = 101;
student.x // 101
Person.prototype.x = 102;
student.x // 102

Person.prototype = {y:2}
student.y // undefined
student.x // 102
```
5. 对象的属性
> 数据属性：Configurable,Enumerable,Writable,Value

> 访问器属性：get,set
6. 通过arguments实现多态