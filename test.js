window.JSON.stringify = function(obj) {
    var result = '';
    var curVal;

    if (obj === null) return String(obj);

    switch(typeof obj) {
        case 'boolean':
        case 'number':
            return String(obj);
        case 'string':
            return `"${obj}"`;
        case 'undefined':
        case 'function':
        case 'symbol':
            return undefined;
    }

    switch(Object.prototype.toString.call(obj)) {
        case '[object Array]':
            result += '[';
            for (var i = 0, len = obj.length; i < len; i++) {
                curVal = JSON.stringify(obj[i]);
                result += (curVal === undefined ? null : curVal);
                result += ',';
            }
            if (result !== '[') {
                result = result.slice(0, -1);
            }
            result += ']';
            return result;
        case '[object Date]':
            return `"${obj.toJSON ? obj.toJSON() : obj.toString()}"`
        case '[object RegExp]':
            return "{}";
        case '[object Object]':
            
    }
}
