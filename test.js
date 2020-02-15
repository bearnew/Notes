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
                result = result.slice(0, -1);
            }
            result += ']';
            return result;
        case '[object Object]':
            result = '{';
            for (var i in obj) {
                curVal = JSON.stringify(obj[i]);
                result += `"${i}":${curVal}`;
                result += ','
            }
            if (result !== '{') {
                result = result.slice(0, -1);
            }
            result += '}';
            return result;
    }
}

var rx_one = /^[\],:{}\s]*$/;
var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rx_four = /(?:^|:|,)(?:\s*\[)+/g;

window.parse = function (json) {
    if (
        rx_one.test(
            json
                .replace(rx_two, "@")
                .replace(rx_three, "]")
                .replace(rx_four, "")
        )
    ) {
        // return eval(`(${json})`)
        return (new Function('return' + json))()
    }
}

var json = '{"a":"1", "b":2}';
console.log(parse(json))