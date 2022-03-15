const a = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1);
    }, 1000);
});

const b = a.then((res) => {
    return res;
});
const c = Promise.resolve(1);
const d = Promise.reject(1);
const e = async () => {
    console.log("eeee");
};
e().then(() => {
    console.log("after eeee");
});
console.log(typeof a, typeof b, typeof c, typeof d, typeof e);

Promise.resolve(a).then((res) => {
    // aaaaa 1(延迟1s后打印)
    console.log("aaaaa", res);
});
