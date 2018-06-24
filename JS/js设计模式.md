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
* #### 4. 建造者模式
---
###### 模式作用
1. 分步创建一个复杂对象
2. 解耦封装过程和具体创建的组件
3. 无需关心组件如何封装
###### example:
* __方法1__
```js
//1.产出东西是房子
//2.包工头调用工人进行开工 而且他要很清楚工人们具体的某一个大项
//3.工人是盖房子的 工人可以建卧室 建客厅 建厨房
//4.包工头只是一个接口而已 他不干活 他只对外说我能建房子
function Fangzi(){//Fangzi可以理解为单例模式
    if(!(this instanceof Fangzi)){
        return new Fangzi();
    }
    this.woshi = "";
    this.keting = "";
    this.chufang = "";
}
function Baogongtou(){
    if(!(this instanceof Baogongtou)){
        return new Baogongtou();
    }
    this.jianfangzi = function(gongren){
        gongren.jian_chufang();
        gongren.jian_keting();
        gongren.jian_woshi();
    }
}
function Gongren(){
    if(!(this instanceof Gongren)){
        return new Gongren();
    }
    this.jian_woshi = function(){
        console.log("建卧室");
    }
    this.jian_keting = function(){
        console.log("建客厅");
    }
    this.jian_chufang = function(){
        console.log("建厨房");
    }
    this.jiaofang = function(){
        var _fangzi = new Fangzi();
        _fangzi.woshi = "ok";
        _fangzi.keting = "ok";
        _fangzi.chufang = "ok";
        return _fangzi;
    }
}
var gongren = new Gongren();
var baogongtou = new Baogongtou();
baogongtou.jianfangzi(gongren);
var myfangzi = gongren.jiaofang();
console.log(myfangzi);
```
* #### 5. 工厂模式
---
###### 模式作用
1. 对象的构建十分复杂
2. 需要依赖具体的环境创建不同的实例
3. 处理大量具有相同属性的小对象
###### example:
* __方法1__
```js
function createObject(name,age,profession){//集中实例化的函数
    var obj = new Object();
    obj.name = name;
    obj.age = age;
    obj.profession = profession;
    obj.move = function () {
        return this.name + ' at ' + this.age + ' engaged in ' + this.profession;
    };
    return obj;
}
var test1 = createObject('trigkit4',22,'programmer');//第一个实例
var test2 = createObject('mike',25,'engineer');//第二个实例
alert(test1.move());
alert(test2.move());
```