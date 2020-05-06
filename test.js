const arr = [1, 2, 3, 4, 5];

function test() {
    for (let i of arr) {
        console.log(i)
        if (i === 3) {
            return i;
        }   
    }
    console.log('5555')
}

console.log(test())
