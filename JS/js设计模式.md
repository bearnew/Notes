#### 前言 - 设计模式原则
---
###### 1.单一职责
* 一个类只有一个职责
* 拒绝耦合
###### 2.开放-封闭
* 软件实体（类，模块，函数）可扩展 - __开放__
* 软件实体（类，模块，函数）可更改 - __封闭__
###### 3.依赖倒置
* 依赖抽象，不依赖细节
* 针对接口，不针对实现
* 面向对象设计
###### 4.里氏替换
* 子类可替换父类
###### 5.迪米特法则
* 类1调用类2，通过第三者转发调用
* 每一个类都应该降低成员的访问权限
###### 6.接口隔离原则
* 类1对类2的依赖应该建立在最小接口上
* #### 1. 单例模式
---
###### 模式作用
1. 模块间通信
2. __系统中某个类的对象只能存在一个__(不需要每次调用都实例化)
3. 保护自己的属性和方法
###### example:
* __方法1__
```js
function Universe() {

    // 判断是否存在实例
    if (typeof Universe.instance === 'object') {
        return Universe.instance;
    }

    // 其它内容
    this.start_time = 0;
    this.bang = "Big";

    // 缓存
    Universe.instance = this;

    // 隐式返回this
}

// 测试
var uni = new Universe();
var uni2 = new Universe();
console.log(uni === uni2); // true
```
* __方法2__
```js
function Universe() {

    // 缓存的实例
    var instance = this;

    // 其它内容
    this.start_time = 0;
    this.bang = "Big";

    // 重写构造函数
    Universe = function () {
        return instance;
    };
}

// 测试
var uni = new Universe();
var uni2 = new Universe();
uni.bang = "123";
console.log(uni === uni2); // true
console.log(uni2.bang); // 123 
```
* __方法3__
```js
function Universe() {

    // 缓存实例
    var instance;

    // 重新构造函数
    Universe = function Universe() {
        return instance;
    };

    // 后期处理原型属性
    Universe.prototype = this;

    // 实例
    instance = new Universe();

    // 重设构造函数指针
    instance.constructor = Universe;

    // 其它功能
    instance.start_time = 0;
    instance.bang = "Big";

    return instance;
}


// 测试
var uni = new Universe();
var uni2 = new Universe();
console.log(uni === uni2); // true

// 添加原型属性
Universe.prototype.nothing = true;

var uni = new Universe();

Universe.prototype.everything = true;

var uni2 = new Universe();

console.log(uni.nothing); // true
console.log(uni2.nothing); // true
console.log(uni.everything); // true
console.log(uni2.everything); // true
console.log(uni.constructor === Universe); // true
```

__方法4__
```js
var Universe;

(function () {

    var instance;

    Universe = function Universe() {

        if (instance) {
            return instance;
        }

        instance = this;

        // 其它内容
        this.start_time = 0;
        this.bang = "Big";
    };
} ());

//测试代码
var a = new Universe();
var b = new Universe();
alert(a === b); // true
a.bang = "123";
alert(b.bang); // 123
```
* #### 2. 策略模式
---
###### 模式作用
1. 减少大量的if语句
2. 复用性好
###### example:
* __方法1__
```js
const strategy = {
  'S': function(salary) {
    return salary * 4
  },
  'A': function(salary) {
    return salary * 3
  },
  'B': function(salary) {
    return salary * 2
  }
}

const calculateBonus = function(level, salary) {
  return strategy[level](salary)
}

calculateBonus('A', 10000) // 30000
```
* __方法2__
```js
const S = function(salary) {
  return salary * 4
}

const A = function(salary) {
  return salary * 3
}

const B = function(salary) {
  return salary * 2
}

const calculateBonus = function(func, salary) {
  return func(salary)
}

calculateBonus(A, 10000) // 30000
```
* #### 3. 构造函数模式
---
###### 模式作用
1. 用于创建特定类型的对象
2. 第一次声明的时候给对象赋值
3. 自己赋值构造函数，赋予属性和方法
###### example:
* __方法1__
```js
function Door(lock, style) {
    this._lock = lock || 'normal';
    this._style = style || 'normal';
    this.create = function() {
        return 'lock is ' + this._lock + ', style is ' + this._style;
    }
}

var door = new Door('fingerprint lock', 'pure color');
alert(door.create());
```
