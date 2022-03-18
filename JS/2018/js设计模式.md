#### 前言 - 设计模式原则

---

###### 1.单一职责

-   一个类只有一个职责
-   拒绝耦合

###### 2.开放-封闭

-   软件实体（类，模块，函数）可扩展 - **开放**
-   软件实体（类，模块，函数）可更改 - **封闭**

###### 3.依赖倒置

-   依赖抽象，不依赖细节
-   针对接口，不针对实现
-   面向对象设计

###### 4.里氏替换

-   子类可替换父类

###### 5.迪米特法则

-   类 1 调用类 2，通过第三者转发调用
-   每一个类都应该降低成员的访问权限

###### 6.接口隔离原则

-   类 1 对类 2 的依赖应该建立在最小接口上

###### 7.将不变的事物和变化的事物分离开来

###### 8.模式分类

-   **创建型:** 抽象工厂、工厂、单例、建造者、原型
-   **结构型:** 桥接、代理、装饰器、适配器、享元、组合、门面（外观）
-   **行为型:** 观察者、模板、迭代、状态、命令、中介者、解释器、职责链、访问者、策略、备忘录

#### 1. 单例模式

---

###### 模式作用

1. 模块间通信
2. **系统中某个类的对象只能存在一个**(不需要每次调用都实例化)
3. 保护自己的属性和方法

###### example:

-   **方法 1**

```js
function Universe() {
    // 判断是否存在实例
    if (typeof Universe.instance === "object") {
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

-   **方法 2**

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

-   **方法 3**

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

**方法 4**

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
})();

//测试代码
var a = new Universe();
var b = new Universe();
alert(a === b); // true
a.bang = "123";
alert(b.bang); // 123
```

#### 2. 策略模式

---

###### 模式作用

1. 减少大量的 if 语句
2. 复用性好

###### example:

-   **方法 1**

```js
const strategy = {
    S: function (salary) {
        return salary * 4;
    },
    A: function (salary) {
        return salary * 3;
    },
    B: function (salary) {
        return salary * 2;
    },
};

const calculateBonus = function (level, salary) {
    return strategy[level](salary);
};

calculateBonus("A", 10000); // 30000
```

-   **方法 2**

```js
const S = function (salary) {
    return salary * 4;
};

const A = function (salary) {
    return salary * 3;
};

const B = function (salary) {
    return salary * 2;
};

const calculateBonus = function (func, salary) {
    return func(salary);
};

calculateBonus(A, 10000); // 30000
```

#### 3. 构造函数模式

---

###### 模式作用

1. 用于创建特定类型的对象
2. 第一次声明的时候给对象赋值
3. 自己赋值构造函数，赋予属性和方法

###### example:

-   **方法 1**

```js
function Door(lock, style) {
    this._lock = lock || "normal";
    this._style = style || "normal";
    this.create = function () {
        return "lock is " + this._lock + ", style is " + this._style;
    };
}

var door = new Door("fingerprint lock", "pure color");
alert(door.create());
```

#### 4. 建造者模式

---

###### 模式作用

1. 分步创建一个复杂对象
2. 解耦封装过程和具体创建的组件
3. 无需关心组件如何封装

###### example:

-   **方法 1**

```js
//1.产出东西是房子
//2.包工头调用工人进行开工 而且他要很清楚工人们具体的某一个大项
//3.工人是盖房子的 工人可以建卧室 建客厅 建厨房
//4.包工头只是一个接口而已 他不干活 他只对外说我能建房子
function Fangzi() {
    //Fangzi可以理解为单例模式
    if (!(this instanceof Fangzi)) {
        return new Fangzi();
    }
    this.woshi = "";
    this.keting = "";
    this.chufang = "";
}
function Baogongtou() {
    if (!(this instanceof Baogongtou)) {
        return new Baogongtou();
    }
    this.jianfangzi = function (gongren) {
        gongren.jian_chufang();
        gongren.jian_keting();
        gongren.jian_woshi();
    };
}
function Gongren() {
    if (!(this instanceof Gongren)) {
        return new Gongren();
    }
    this.jian_woshi = function () {
        console.log("建卧室");
    };
    this.jian_keting = function () {
        console.log("建客厅");
    };
    this.jian_chufang = function () {
        console.log("建厨房");
    };
    this.jiaofang = function () {
        var _fangzi = new Fangzi();
        _fangzi.woshi = "ok";
        _fangzi.keting = "ok";
        _fangzi.chufang = "ok";
        return _fangzi;
    };
}
var gongren = new Gongren();
var baogongtou = new Baogongtou();
baogongtou.jianfangzi(gongren);
var myfangzi = gongren.jiaofang();
console.log(myfangzi);
```

#### 5. 工厂模式

---

###### 模式作用

1. 对象的构建十分复杂
2. 需要依赖具体的环境创建不同的实例
3. 处理大量具有相同属性的小对象

###### example:

-   **方法 1**

```js
function createObject(name, age, profession) {
    //集中实例化的函数
    var obj = new Object();
    obj.name = name;
    obj.age = age;
    obj.profession = profession;
    obj.move = function () {
        return this.name + " at " + this.age + " engaged in " + this.profession;
    };
    return obj;
}
var test1 = createObject("trigkit4", 22, "programmer"); //第一个实例
var test2 = createObject("mike", 25, "engineer"); //第二个实例
alert(test1.move());
alert(test2.move());
```

#### 6. 代理模式

---

###### 模式作用

1. 远程代理（一个对象将不同空间的对象进行局部代理）
2. 虚拟代理（根据需要创建开销很大的对象如渲染网页暂时用占位代替真图）
3. 安全代理（控制真实对象的访问权限）
4. 智能指引（调用对象代理处理另外一些事情，如垃圾回收）

###### example:

-   **方法 1**

```js
var Flower = function () {};
var Pursuit = {
    sendFlower: function (target) {
        target.receiveFlower("玫瑰");
    },
};

var Proxy = {
    sendFlower: function (sender, receiver) {
        sender.sendFlower(receiver);
    },
};

var SchoolGirl = {
    receiveFlower: function (flower) {
        console.log("女孩收到花: " + flower);
    },
};

// 直接送花
// Pursuit.sendFlower(SchoolGirl);

// 让别人代理送花
Proxy.sendFlower(Pursuit, SchoolGirl);
```

-   **方法 2**

```js
var myImage = (function () {
    // var imgNode = new Image();
    var imgNode = document.createElement("img");
    document.body.appendChild(imgNode);
    return {
        setSrc: function (src) {
            imgNode.src = src;
        },
    };
})();

// 代理模式
var ProxyImage = (function () {
    var img = new Image();
    img.onload = function () {
        myImage.setSrc(this.src);
    };
    return {
        setSrc: function (src) {
            // 占位图片loading
            myImage.setSrc(
                "http://img.lanrentuku.com/img/allimg/1212/5-121204193Q9-50.gif"
            );
            img.src = src;
        },
    };
})();
// 调用方式

ProxyImage.setSrc(
    "https://dimg04.c-ctrip.com/images/a10i1a0000018yc4e4CF6.jpg"
); // 真实要展示的图片
```

#### 7. 命令模式

---

###### 模式作用

1. 将函数的封装，调用，请求结合为一体
2. 调用具体的函数解耦命令对象与接收对象
3. 提高程序模块化的灵活性

###### example:

-   **方法 1**

```js
var CarManager = {
    // 请求信息
    requestInfo: function (model, id) {
        return "The information for " + model + " with ID " + id + " is foobar";
    },

    // 购买汽车
    buyVehicle: function (model, id) {
        return "You have successfully purchased Item " + id + ", a " + model;
    },

    // 组织view
    arrangeViewing: function (model, id) {
        return (
            "You have successfully booked a viewing of " +
            model +
            " ( " +
            id +
            " ) "
        );
    },
};

CarManager.execute = function (command) {
    return CarManager[command.request](command.model, command.carID);
};

console.log(
    CarManager.execute({
        request: "arrangeViewing",
        model: "Ferrari",
        carID: "145523",
    })
);
console.log(
    CarManager.execute({
        request: "requestInfo",
        model: "Ford Mondeo",
        carID: "543434",
    })
);
console.log(
    CarManager.execute({
        request: "buyVehicle",
        model: "Ford Escort",
        carID: "543434",
    })
);
```

-   **方法 2**

```js
var CarManager = {
    // 请求信息
    requestInfo: function (model, id) {
        return "The information for " + model + " with ID " + id + " is foobar";
    },

    // 购买汽车
    buyVehicle: function (model, id) {
        return "You have successfully purchased Item " + id + ", a " + model;
    },

    // 组织view
    arrangeViewing: function (model, id) {
        return (
            "You have successfully booked a viewing of " +
            model +
            " ( " +
            id +
            " ) "
        );
    },
};

CarManager.execute = function (name) {
    return (
        CarManager[name] &&
        CarManager[name].apply(CarManager, [].slice.call(arguments, 1))
    );
};

console.log(CarManager.execute("arrangeViewing", "Ferrari", "14523"));
console.log(CarManager.execute("requestInfo", "Ford Mondeo", "54323"));
console.log(CarManager.execute("buyVehicle", "Ford Escort", "34232"));
```

-   **方法 3**

```js
// 撤销命令
var waiter = {
    timer: {},
    book: function (dish, customerId) {
        this.timer[customerId] = setTimeout(() => {
            console.log(`complete: ${dish} for ${customerId}`);
        }, 3000);
    },
    cancel: function (dish, customerId) {
        if (this.timer[customerId]) {
            clearTimeout(this.timer[customerId]);
            console.log(`cancel: ${dish} for ${customerId}`);
        } else {
            console.log(`You haven't book`);
        }
    },
};

waiter.excute = function () {
    waiter[arguments[0]].apply(waiter, [].slice.call(arguments, 1));
};

// cancel: vegetable for 1
// complete: meat for 2
waiter.excute("book", "vegetable", 1);
setTimeout(() => {
    waiter.excute("cancel", "vegetable", 1);
}, 2000);

waiter.excute("book", "meat", 2);
```

-   **方法 4**

```html
<html>
    <body>
        <button id="replay">播放录像</button>
    </body>
    <script>
        // 重做命令
        var Ryu = {
            attack: function () {
                console.log("攻击");
            },
            defense: function () {
                console.log("防御");
            },
            jump: function () {
                console.log("跳跃");
            },
            crouch: function () {
                console.log("蹲下");
            },
        };

        var makeCommand = function (receiver, state) {
            // 创建命令
            return function () {
                receiver[state]();
            };
        };

        var commands = {
            119: "jump", // W
            115: "crouch", // S
            97: "defense", // A
            100: "attack", // D
        };
        var commandStack = []; // 保存命令的堆栈

        document.onkeypress = function (ev) {
            var keyCode = ev.keyCode,
                command = makeCommand(Ryu, commands[keyCode]);
            if (command) {
                command(); // 执行命令
                commandStack.push(command); // 将刚刚执行过的命令保存进堆栈
            }
        };

        document.getElementById("replay").onclick = function () {
            // 点击播放录像
            var command;
            while ((command = commandStack.shift())) {
                // 从堆栈里依次取出命令并执行
                command();
            }
        };
    </script>
</html>
```

#### 8.迭代器模式

1. 提供一种方法顺序的访问一个聚合对象中的各个元素

```js
$.each(["a", "b", "c"], function (index, value) {
    console.log(index + ":" + value);
});

$("li").each(function (index) {
    console.log(index + ":" + $());
});
```

#### 9.观察者模式（发布-订阅模式）

-   实现简单的广播通信

```js
// 订阅
document.body.addEventListener(
    "click",
    function () {
        alert(2);
    },
    false
);

document.body.addEventListener(
    "click",
    function () {
        alert(3);
    },
    false
);

document.body.addEventListener(
    "click",
    function () {
        alert(4);
    },
    false
);

// 发布
document.body.click();
```

```js
//通用代码
var observer = {
    //订阅
    addSubscriber: function (callback) {
        this.subscribers[this.subscribers.length] = callback;
    },
    //退订
    removeSubscriber: function (callback) {
        for (var i = 0; i < this.subscribers.length; i++) {
            if (this.subscribers[i] === callback) {
                delete this.subscribers[i];
            }
        }
    },
    //发布
    publish: function (msg) {
        for (var i = 0; i < this.subscribers.length; i++) {
            if (typeof this.subscribers[i] === "function") {
                this.subscribers[i](msg);
            }
        }
    },
    // 将对象o具有观察者功能
    make: function (o) {
        // Object.setPrototypeOf(o, observer);
        o.__proto__ = observer;
        o.subscribers = [];
    },
};

var blogger = {
    recommend: function (msg) {
        this.publish(msg);
    },
};

var user = {
    receive: function (msg) {
        console.log(`user receive: ${msg}`);
    },
};

observer.make(blogger);

blogger.addSubscriber(user.receive);
blogger.recommend("new news!"); // ser receive: new news!

blogger.removeSubscriber(user.receive);
blogger.recommend("can you receive message?"); // 无
```

#### 10.装饰者模式

```js
var Car = function () {};
Car.prototype.drive = function () {
    console.log("normal drive");
};

var AutoPilotDecorator = function (car) {
    this.car = car;
};

AutoPilotDecorator.prototype.drive = function () {
    this.car.drive();
    console.log("start auto drive");
};

var car = new Car();
car = new AutoPilotDecorator(car);

// normal drive
// start auto drive
car.drive();
```

```js
// 装饰类
function isAnimal(target) {
    target.isAnimal = true;
    return target;
}
@isAnimal
class Cat {}
console.log(Cat.isAnimal); // true
```

```js
// ES7
// 方法装饰器, 传参和defineProperty类似
// target-Car, 装饰的类
// key-drive, 修改的属性的名称
// descriptor, 被修改的属性描述符
// {
//   value: drive,
//   enumerable: false,
//   configurable: true,
//   writable: true
// };
function autopilotDecorator(target, key, descriptor) {
    const method = descriptor.value;

    descriptor.value = () => {
        method.apply(target);
        console.log("start auto drive");
    };

    return descriptor;
}

class Car {
    @autopilotDecorator
    drive() {
        console.log("normal drive");
    }
}

let car = new Car();
// normal drive
// start auto drive
car.drive();
```

```js
// createDecorate，将高阶函数创建成装饰器
const createDecorate =
    (fn) =>
    (...args) =>
    (target, name, descriptor) => {
        if (descriptor.value) {
            // @decorate method() { }
            return {
                enumerable: false,
                configurable: true,
                writable: true,
                value: fn(...args)(descriptor.value),
            };
        } else if (descriptor.initializer) {
            // @decorate method = () => {}
            return {
                enumerable: false,
                configurable: true,
                writable: true,
                initializer(this) {
                    return fn(...args)(descriptor.initializer.call(this));
                }
            };
        }
    };
```

#### 11.适配器模式

-   将不兼容的接口变得兼容

```js
// 目标接口格式
interface ITarget {
  f1()

  f2()

  f3()
}

// 原有类与目标接口不兼容
class Origin {
  fa() {
  }

  fb() {
  }

  f3() {
  }
}

// 使用适配器来兼容
class Adaptor implements ITarget {
  origin = new Origin()

  f1() {
    this.origin.fa()
  }

  f2() {
    this.origin.fb()
  }

  f3() {
    this.origin.f3()
  }
}
```

#### 12.享元模式（对象池模式）

-   共享的单元。复用对象，节省内存，前提是享元对象是不可变对象(初始化之后不再改变)
-   3 个手动档驾考车，然后注册 10 个考生参与考试，一开始肯定有 3 个考生同时上车，然后在某个考生考完之后其他考生接着后面考

```js
let examCarNum = 0; // 驾考车总数

/* 驾考车对象 */
class ExamCar {
    constructor(carType) {
        examCarNum++;
        this.carId = examCarNum;
        this.carType = carType ? "手动档" : "自动档";
        this.usingState = false; // 是否正在使用
    }

    /* 在本车上考试 */
    examine(candidateId) {
        return new Promise((resolve) => {
            this.usingState = true;
            console.log(
                `考生- ${candidateId} 开始在${this.carType}驾考车- ${this.carId} 上考试`
            );
            setTimeout(() => {
                this.usingState = false;
                console.log(
                    `%c考生- ${candidateId} 在${this.carType}驾考车- ${this.carId} 上考试完毕`,
                    "color:#f40"
                );
                resolve(); // 0~2秒后考试完毕
            }, Math.random() * 2000);
        });
    }
}

/* 手动档汽车对象池 */
ManualExamCarPool = {
    _pool: [], // 驾考车对象池
    _candidateQueue: [], // 考生队列

    /* 注册考生 ID 列表 */
    registCandidates(candidateList) {
        candidateList.forEach((candidateId) =>
            this.registCandidate(candidateId)
        );
    },

    /* 注册手动档考生 */
    registCandidate(candidateId) {
        const examCar = this.getManualExamCar(); // 找一个未被占用的手动档驾考车
        if (examCar) {
            examCar
                .examine(candidateId) // 开始考试，考完了让队列中的下一个考生开始考试
                .then(() => {
                    const nextCandidateId =
                        this._candidateQueue.length &&
                        this._candidateQueue.shift();
                    nextCandidateId && this.registCandidate(nextCandidateId);
                });
        } else this._candidateQueue.push(candidateId);
    },

    /* 注册手动档车 */
    initManualExamCar(manualExamCarNum) {
        for (let i = 1; i <= manualExamCarNum; i++) {
            this._pool.push(new ExamCar(true));
        }
    },

    /* 获取状态为未被占用的手动档车 */
    getManualExamCar() {
        return this._pool.find((car) => !car.usingState);
    },
};

ManualExamCarPool.initManualExamCar(3); // 一共有3个驾考车
ManualExamCarPool.registCandidates([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 10个考生来考试
```

#### 13.备忘录模式

-   备忘录模式简单的说就是在不破坏已有逻辑的前提下，将日后需要获取的数据在第一次保存下来以免造成重复且低效的操作
-   该设计模式最主要的任务就是对现有数据或者状态做缓存，为将来某个时刻使用或者恢复做准备。
-   应用场景:
    -   分页时的数据缓存
    -   内容懒加载时的缓存
    -   keep-alive 来缓存路由/组件

```js
const baseOperateController = (function () {
    // 缓存对象
    const cache = {};
    // 基础函数
    return function (params, fn, cb) {
        // 判断是否在缓存下
        if (cache[params]) {
            // 从缓存中读取并传递给业务函数
            fn(cache[params]);
        } else {
            // 没有缓存则将控制权转移给外部回调函数，并传递相应参数
            cb &&
                cb(params)
                    .then((res) => {
                        cache[params] = res.data;
                    })
                    .catch((err) => console.log(err));
        }
    };
})();

// 使用
baseOperateController(params, showView, asyncFn);
```
