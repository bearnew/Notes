function chunk (arr, process, count){
    setTimeout(function(){
        console.log('++++++++++')
        for(var i = 0; i < Math.min(count, arr.length + 1); i++) {
            process(arr.shift());
        }
        if(arr.length > 0) {
            setTimeout(arguments.callee, 100);
        }
    }, 100);
}

const arr = [1, 2, 3, 4, 5, 6, 7, 8]
const process = number => {
    console.log(number)
}

chunk(arr, process, 3);