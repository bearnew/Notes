const arr = [1, 2, 3, 4];

function test() {
    arr.forEach((i) => {
        if (i > 3) return;
        console.log(i);
    });
    console.log("end");
}

test();
