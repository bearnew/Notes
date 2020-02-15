function chunk(arr, process, count) {
    setTimeout(function () {
        console.log('--------------')

        const len = Math.min(count, arr.length);
        for (var i = 0; i < len; i++) {
            arr.shift();
            process();
        }

        if (arr.length > 0) {
            setTimeout(arguments.callee, 300)
        }
    }, 300)
}

const arr = new Array(29).fill(1);
const count = 10;
function process() {
    console.log('log')
}

chunk(arr, process, count)