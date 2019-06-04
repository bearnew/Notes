function test(list) {
    var arr = [];
    console.log(list)
    list.map(item => {
        //获取当前文件的绝对路径
        if (item instanceof Array) {
            arr = arr.concat(test(item));
        } else {
            arr.push(item);
        }
    })
    return arr;
}

console.log(test([1, [2 ,[3, 4]], 5]))
