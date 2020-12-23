var arr = [1,2,3]

function test() {
    for (const num of arr) {
        if (num > 2) {
            return true;
        }
    }
}

console.log(test())