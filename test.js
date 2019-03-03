const x = {};
x.x = x; 
const obj = {
    x: x,
    y: {
        z: 3
    },
    arr: [111, 222],
    obj: {key: '对象'},
    a: () => {console.log('函数')},
    date: new Date(),
    reg: /正则/ig
}

const copyObj = deepCopy(obj);
copyObj.y.z = 30;
copyObj.arr.pop();
copyObj.obj.key = '对象拷贝';
copyObj.a = () => {console.log('函数拷贝')}
copyObj.reg = /正则拷贝/ig;
console.log(copyObj)
console.log(obj)

function isObj(obj) {
    const typeStr = Object.prototype.toString.call(obj);
    return typeStr === '[object Object]' || typeStr === '[object Array]';
}

function deepCopy(obj, hash = new WeakMap()) {
    if(hash.has(obj)) return hash.get(obj)
    let cloneObj = Array.isArray(obj) ? [] : {}
    hash.set(obj, cloneObj)

console.log(hash)
    for (let key in obj) {
        cloneObj[key] = isObj(obj[key]) ? deepCopy(obj[key], hash) : obj[key];
    }
    return cloneObj
}

