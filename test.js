window.stringify = function (obj) {
    var result = '';
    var curVal;

    if (obj === null) return "null";

    switch (typeof obj) {
        case 'string':
        case 'number':
        case 'boolean':
            return `"${obj}"`;
        case 'undefined':
        case "symbol":
        case "function":
            return undefined;
    }

    switch (Object.prototype.toString.call(obj)) {
        case '[objec RegExp]':
            return `"{}"`;
        case '[object Date]':
            return `"${obj.toJson() ? obj.toJson() : obj.toString()}"`;
        case '[object Array]':
            result = '[';
            for (var i = 0; i < obj.length; i++) {
                curVal = JSON.stringify(obj[i]);
                result += `"${curVal === undefined ? null : curVal}"`;
                result += ','
            }
            if (result !== '[') {
                result.slice(0, -1);
            }
            result += ']';
            return result;
        case '[object Object]':
            result = '[';
            for (var i in obj) {
                curVal = JSON.stringify(obj[i]);
                result += `"${i}":${curVal}`;
                result += ','
            }
            if (result !== '[') {
                result.slice(0, -1);
            }
            return result;
    }
}

var test = {
    a: 1,
    b: undefined,
    c: [1, 2, 3]
}
console.log(stringify(test));