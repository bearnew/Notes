
function test() {
    
    for (let i = 0; i < 10; i++) {
        console.log('start', i)
        if (i > 5) {
            return 'a';
        }
        console.log('end', i);
    }
}

console.log('test', test());