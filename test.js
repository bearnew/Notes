function flatten(arr) {
    return Array.isArray(arr) ? [].concat(...arr.map(flatten)) : arr;
}

console.log(flatten([1, [2, 3]]))
console.log([].concat(1, 2, 3))
