let str = "abcabcabcbbccccc";
let num = 0;
let char = "";

// 使其按照一定的次序排列
str = str.split("").sort().join("");
// "aaabbbbbcccccccc"

// \1表示重复第一个括号里面的内容
let re = /(\w)\1+/g;
str.replace(re, (match, val, index, str) => {
    if (num < match.length) {
        num = match.length;
        char = val;
    }
});
console.log(`字符最多的是${char}，出现了${num}次`);
