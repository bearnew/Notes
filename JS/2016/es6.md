#### ES6新特性
> http://www.cnblogs.com/Wayou/p/es6_new_features.html
#### let
1. 块级作用域
2. 不存在变量申明提升
3. 不允许重复声明
#### const
1. 块级作用域
2. 声明的常量不提升
3. const声明的变量指向的那个内存地址不得改动，但是依然可以添加新属性
#### ...展开操作符
```js
let fruits = ['apple', 'banana','pear']

console.log(fruits) // ['apple', 'banana','pear']
console.log(...fruits) // apple banana pear

function breakfast(dessert, drink, ...foods) {
    console.log(dessert, drink, foods)
}
breakfase('apple', 'banana','pear','peach');
```

#### Object.is判断两个值是否相等
```js
+0 === -0  // true
NaN == NaN // false

Object.is(NaN,NaN) // true
Object.is(+0, -0) // false
```

#### 设置对象的prototype
```js
let breakfast = {
    getDrink(){
        return 'milk';
    }
}

let sunday = Object.create(breakfast);
console.log(sunday.getDrink()); // milk
console.log(Object.getPrototypeof(sunday) == breakfast) // true

Object.setPrototypeof(sunday, breakfast);
console.log(sunday.getDrink()); // milk
console.log(Object.getPrototypeof(sunday) === breakfast ); // true
```
#### constructor super
```js
class A {
    constructor() {
        this.type = "a"
    }
    
    say(msg) {
        console.log(`${this.type} say ${msg}`)
    }
}

class B extends A {
    
    constructor() {
        super()
        this.type = "b"
    }
    
}

var b = new B()
b.say("hi") // b say hi

// 如果注释掉B中的constructor函数，那么 b.say() 输出  a say hi
```
> 上面代码首先用class定义了一个“类”，可以看到里面有一个constructor方法，这就是构造方法，而this关键字则代表实例对象。简单地说，constructor内定义的方法和属性是实例对象自己的，而constructor外定义的方法和属性则是所有实例对象可以共享的。

> Class之间可以通过extends关键字实现继承，这比ES5的通过修改原型链实现继承，要清晰和方便很多。上面定义了一个Cat类，该类通过extends关键字，继承了Animal类的所有属性和方法。

> super关键字，它指代父类的实例（即父类的this对象）。子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类没有自己的this对象，而是继承父类的this对象，然后对其进行加工。如果不调用super方法，子类就得不到this对象。

> ES6的继承机制，实质是先创造父类的实例对象this（所以必须先调用super方法），然后再用子类的构造函数修改this。

#### iterators迭代器
```js
function chef(foods) {
    let i = 0;
    
    return {
        next() {
            let done = (i >= foods.length);
            let value = !done ? foods[i++] : undefined;
            
            return {
                value: value,
                done: done
            }
        }
    }
}

let test = chef(['apple', 'banana']);
console.log(test.next()) // Object {value:"apple", done:false}
console.log(test.next()) // Object {value:"banana", done:false}
console.log(test.next()) // Object {value:undefined,done:true}
```
#### generators生成器
```js
let chef = function* (foods) {
    for(var i=0; i<foods.length; i++) {
        yield foods[i];
    }
}

let test = chef(['apple','banana']);
console.log(test.next()); // Object {value:"apple", done:false}
console.log(test.next()); // Object {value:"banana", done:false}
console.log(test.next()); // Object {value:undefined,done:true}
```
#### static静态方法
```js
class Chef {
    constructor(food) {
        this.food = food;
    }
    
    static cook() {
        console.log(this.food);
    }
}

// static定义的方法，不需要实例化，就可以直接调用
chef.cook('tomato'); // tomato
```
#### Set
> Set和Map类似，也是一组key的集合，但不存储value。由于key不能重复，所以，在Set中，没有重复的key。
```js
let dessert = new Set('apple', 'banana', 'tomato');
dessert.add('pear');
dessert.has('apple');
dessert.delete('pear');
dessert.clear();
```
#### Map
> Map是一组键值对的结构，具有极快的查找速度。
```js
var m = new Map([[1, 'Michael'], [2, 'Bob'], [3, 'Tracy']]);
m.get(1); // 'Michael'
var m = new Map(); // 空Map
m.set('Adam', 67); // 添加新的key-value
m.set('Bob', 59);
m.has('Adam'); // 是否存在key 'Adam': true
m.get('Adam'); // 67
m.delete('Adam'); // 删除key 'Adam'
m.get('Adam'); // undefined
```

