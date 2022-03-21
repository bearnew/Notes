function myGet(obj, path, defaultVal) {
    let pathArr = path;
    if (!Array.isArray(path)) {
        pathStr = path.replace(/\[(?:"|')?(\w+)("|')?\]/, ".$1");
        pathArr = pathStr.split(".");
    }
    let res = obj;
    for (const p of pathArr) {
        res = (res || {})[p];
    }

    return res === undefined ? defaultVal : res;
}

var object = { a: [{ b: { c: 3 } }] };

console.log(myGet(object, "a[0].b.c")); // 3
console.log(myGet(object, "a['0'].b.c")); // 3
console.log(myGet(object, ["a", "0", "b", "c"])); // 3
console.log(myGet(object, "a.b.c", "default")); // default
