function isObj(obj) {
    const typeStr = Object.prototype.toString.call(obj);
    return typeStr === "[object Object]" || typeStr === "[object Array]";
}

function deepCopy(obj, hash = new WeakMap()) {
    if (hash.has(obj)) return hash.get(obj);
    const reference = [Date, RegExp, Set, WeakSet, Map, WeakMap, Error];
    if (reference.includes(obj?.constructor)) {
        res = new obj.constructor(obj);
    }

    let cloneObj = Array.isArray(obj) ? [] : {};
    hash.set(obj, cloneObj);

    for (let key in obj) {
        cloneObj[key] = isObj(obj[key]) ? deepCopy(obj[key], hash) : obj[key];
    }

    return cloneObj;
}

obj = {
    x: { x: { a: 1 } },
    y: { z: 30 },
    arr: [111],
    obj: { key: "对象拷贝" },
    a: () => {
        console.log("函数拷贝");
    },
    date: new Date(),
    reg: /正则拷贝/gi,
};
console.log(obj);
