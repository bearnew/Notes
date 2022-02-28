// 闭包保存上次值
// 节流：判断和上次时间差值大于阈值才调用
const throttle = (fn, threshold) => {
    let prevTime = 0;
    return function (...args) { // 内部要调用传入fn的必须 1、返回高阶函数 2、fn.call(this)
        const currTime = Date.now()
        if (currTime - prevTime > threshold) {
            fn.call(this, ...args)
            prevTime = currTime
        }
    }
}
// 防抖：重置定时器
const debounce = (fn, delay) => {
    let timer = null
    return function (...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.call(this, ...args)
        }, delay)
    }
}


// bind：将this代表的fn放到obj上即可
function bind(obj, ...args) {
    obj.fn = this
    const newfn = (...args1) => obj.fn(...args, ...args1)
    delete obj.fn
    return newfn
}
Function.prototype.apply = function (obj, args){
    obj.fn = this;
    const result = object.fn(...args);
    delete obj.fn;
    return result;
}

// 继承: 用空构造函数代理并用new继承 + 修复constructor
const create = (subProto, superProto) => {
    const fn = new Function()
    fn.prototype = superProto

    const constructor = subProto.constructor
    subProto = new fn()
    subProto.constructor = constructor

    return subProto
}
function Super() { }
function Sub(...args) {
    Super.call(this, ...args)
}
Sub.prototype = create(Sub.prototype, Super.prototype)

// new：新建一个对象继承原型 + 继承属性
const new1 = (FN, ...args) => {
    const obj = Object.create(FN.prototype) // 创建一个拥有原型方法的对象
    const obj1 = FN.call(obj, ...args) // 让该对象拥有构造函数内的属性
    return obj1 instanceof Object ? obj1 : obj // 返回该对象
}


// 数组去重
// 1.ES6
const list = [1, 2, 2];
[...new Set([list])]
// 2.includes
list.filter(item => !result.includes(item))
// 3.排序+对比前后
list.filter((item, index) => index >0 && item !== list[index-1])
// 4. map空间换时间
const map = new Map()
const result = []
list.forEach(item => {
    if (!map.has(item)) {
        result.push(item)
        map.set(item, 1)
    }
})



// 递归
// instanceOf
const instanceOf = (obj, FN) => {
    if (obj.__proto__ === FN.prototype) {
        return true
    } else if (obj.__proto__ === null) {
        return false
    } else {
        return instanceOf(obj.__propo__, FN)
    }
}
// flat
const flat = arr => {
    const result = []
    arr.forEach(item => {
        if (Array.isArray(item)) {
            result = result.concat(flat(item))
        } else {
            result.push(item)
        }
    })
    return result
}
// 要考虑循环引用的话就返回WeakMap
// 深拷贝
const copy = target => {
    const result = Array.isArray(target) ? [] : {}
    for (let item in target) {
        const type = Object.prototype.toString.call(target[item])
        if (type === 'object Object' || type === 'object Array') {
            result[item] = copy(target[item])
        } else {
            result[item] = target[item]
        }
    }
    return result
}
// curry
const curry = fn => {
    return function afterCurry(...args) { // 返回一个函数
        // 判断是否传满调用
        if (fn.length === args.length) {
            return fn.call(this, ...args)
        }
        // 这个函数没传满就继续返回一个函数直到传满为止：但要缓存args
        return function(...rest) {
            return afterCurry(...args, ...rest)
        }
    }
}
// 数组转树
function dfs(list, pid){ 
    const nodes = list.filter(item => item.pid === pid) || []; // 找到第一层节点
    return nodes.map(item =>  ({ ...item, children: dfs(list, item.id ) })) // 构建该层每个节点: 其子节点用dfs构造即可
}
dfs(list, '')

// 并发数有限的并发请求：run里用Promise包裹task，并在then里继续调run
for (let i = 0; i < 2; i++) run() // 先执行几个任务
function run() { // 每个任务内部：取一个任务执行，并await后用promise.then调用下个任务
    new Promise(async resolve => {
        await tasks.shift()() // 等待异步任务执行后
        resolve()
    }).then(() => {
        if (tasks.length) run()
    }).catch(() => {
        if (tasks.length) run()
    })
}


Promise.all = list => {
    let count = 0
    const results = []
    return new Promise(resolve => { // 返回一个promise
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(res => {
                result[index] = res
                if (count++ === list.length) resolve(results) // 计满数则resolve
            }).catch(e => reject(e))
        })
    })
}
Promise.allSettled = function(promises) {
    return new Promise(function(resolve, reject) {
        if (!Array.isArray(promises)) {
            reject(
                new TypeError("arguments must be an array")
            );
        }

        let count = 0;
        const results = [];
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(
                res => {
                    results[index] = res;
                    if (count++ == promises.length) resolve(res);
                },
                err => {
                    results[index] = err;
                    if (count++ == promises.length) resolve(err);
                }
            );
        })
    });
};
Promise.race = promiseList => {
    return new Promise((resolve, reject) => {
        promiseList.forEach(promise =>
            Promise.resolve(promise)
            .then(resolve, reject)
            .catch(reject)
        )
    })
}
// Promise A+
class Promise{
    constructor(executor){
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        this.status = 'pending';
        const resolve = value => {
            // resolve只在第一次调用时才生效
            if(this.status === 'pending'){
                this.status = 'fulfilled';
                this.onResolvedCallbacks.forEach(fn => fn(value));
            }
        }
        const reject = error => {}
        try{
            executor(resolve, reject)
        } catch(err){ reject(err);};
    }
    then = (onFulfilled) => {
        return new Promise((resolve, reject)=> { // 返回一个Promise
            try{
                // resolve还没调用比如将在setTimeout中调用时：则先注册回调函数
                if(this.status === 'pending') {
                   this.onResolvedCallbacks.push((value) => {
                        const result = onFulfilled(value);
                        resolvePromise(result, resolve, reject);
                   });
                }
                // resolve已经被调用：则直接执行回调函数
                if (this.status = 'fulfilled'){
                    const result = onFulFilled();
                    resolve(result);
                }
            } catch(err){ reject();}
        })
    }
    // 递归解析promise，直到拿到普通值
    resolvePromise = (result, resolve, reject) => {
        if(!result instanceof Promise) {
            resolve(result)
        } else {
            result.then(res => {
                resolvePromise(res, resolve, reject)
            }, err => {
                reject(err);
            })
        }
    }
}
// Promise就是把异步任务包起来，好把回调写到then里

// 实现reduce
Array.prototype.reduce = function (fn, initVal) {
    this.forEach(item => {
        initVal = fn(initVal, item); // 迭代用fn结果不断更新initVal
    })
    return initVal
};

// 实现记忆函数: 要求记忆每次传入的无序参数，只缓存10个
const memoization = fn => {
    const cache = new Map() // 用map key存储参数hash，value存储结果

    return function (...args) {
        const key = JSON.stringify(args.sort((a,b) => a-b))
        if (!map.has(key)) {
            map.set(key, fn.call(this, ...args))

            if(cache.size > 10) { // 删除第一个键
                this.cache.delete(this.cache.keys().next().value)
            }
        } else {
            return map.get(key)
        }
    }
}

// 实现图片懒加载
const images = [...document.querySelectorAll('.images')]
images.forEach(image => {           
    if(image.getBoundingClientRect().top < document.documentElement.clientHeight) {             
        image.src = image.dataset.src
    }
})

const io = new IntersectionObserver(entryList => {
    entryList.forEach(entry => {
        const dom = entry.target;
        if (entry.intersectionRatio > 0 && entry.intersectionRatio <= 1) { // 在视口内[0, 1]
            if (!dom.src) dom.src = dom.dataset.src;
        }
    });
});
document.querySelectorAll("img").forEach(item => io.observe(item));


// 下划线转驼峰
let b = 'sds_sdfs'.replace((/(\w)_(\w)(\w*)/g),function(str, x, y, z){
	return x + y.toUpperCase() + z
})

// 实现事件模型
function Emitter() {
    this._listener= {} // { {key: eventName, value: callbacks} }
};

Emitter.prototype.bind = function(eventName, callback) {
    var callbacks = this._listener[eventName] || [];
    callbacks.push(callback);
    this._listener[eventName]= callbacks; 
};

Emitter.prototype.trigger = function(eventName, ...args) {
    this._listener[eventName].forEach(function(callback) {
        callback.call(this, ...args);
    });
};

dom.dispatchEvent(evt);

// 实现观察者模式
// 定义目标类
function Subject(){
    this.observerLists = []; // 观察者列表
    this.callback = function(){} // 对应的回调函数
}

// 添加观察者
Subject.prototype.addObserver = function(observer){
    if (!this.observerLists.includes(observer)) return this.observerLists;
    return this.observerLists.push(observer);
}

// 通知观察者
Subject.prototype.notify = function(params){
    this.observerLists.forEach(item => { // 对所有观察者调用回调函数
        item.callback(params);
    })
}

// 文件上传
{/* <form>
    <input type="file" id="file-input" name="fileContent">
</form> */}

// 表单格式化数据（不包含文件）
const formData = new FormData(document.getElementById('form'))
// 文件实例
const fileReader = new FileReader(),
