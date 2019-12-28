Object.myCreate = function (proto, propertiesObject) {
    if (typeof proto !== 'object' && typeof proto !== 'function') {
        throw new TypeError('Object prototype may only be an Object')
    }
    if (proto === null) {
        throw new Error('Object prototype can not be an null');
    }

    function Tmp() { };
    Tmp.prototype = proto;
    var o = new Tmp();

    if (propertiesObject !== undefined) {
        for (var key in propertiesObject) {
            Object.defineProperty(o, key, propertiesObject[key])
        }
    }

    return o;
}

const person = {
    x: 1,
    y: 2
};

const me = Object.myCreate(person, {
    z: {
        writable: true,
        configurable: true,
        value: 3
    }
});

console.log(me); // { z: 3 }
console.log(me.x); // 1
