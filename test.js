const x = 2;
const obj = {
	x: x,
    arr: [111, 222],
    obj: {key: '对象'},
    a: () => {console.log('函数')},
    date: new Date(),
    reg: /正则/ig
}

console.log(deepCopy(obj))
console.log(deepCopy(obj) === obj)
// obj = {
//     x: 2,
//     arr: [111, 222],
//     obj: {key: '对象'},
//     a: () => {console.log('函数')},
//     date: Sun Mar 03 2019 11:33:38 GMT+0800 (中国标准时间) {},
//     reg: /正则/gi
// }

function deepCopy(obj, hash = new WeakMap()) {
    let cloneObj
    let Constructor = obj.constructor

    if(hash.has(obj)) {
        return hash.get(obj)
    }

    cloneObj = new Constructor()
    hash.set(obj, cloneObj)
    
    for (let key in obj) {
        cloneObj[key] = isObj(obj[key]) ? deepCopy(obj[key], hash) : obj[key];
    }
    return cloneObj
}

function isObj(obj) {
    return Object.prototype.toString.call([obj]) === '[object object]'
}

