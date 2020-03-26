function unique1(arr) {
    return Array.from(new Set(arr));
}

function unique2(arr) {
    var map = {};
    arr.map((i, index) => {
        if (map[i]) {
            arr.splice(index, 1);
        } else {
            map[i] = true;
        }
    })

    return arr;
}

console.log(unique2([1, 2, 2, 3, 4]))
