function bigNumAdd(a, b) {
    let str1 = String(a);
    let str2 = String(b);

    const maxLen = Math.max(str1.length, str2.length);
    str1 = str1.padStart(maxLen, 0);
    str2 = str2.padStart(maxLen, 0);

    let val = 0;
    let decimal = 0; // 进位
    let sum = "";
    for (let i = maxLen - 1; i >= 0; i--) {
        val = parseInt(str1[i]) + parseInt(str2[i]) + decimal;
        decimal = Math.floor(val / 10);
        sum = (val % 10) + sum;
    }

    if (decimal) {
        sum = decimal + sum;
    }

    return sum;
}

let a = "9007199254740991";
let b = "1234567899999999999";
let c = "1243575099254740990";
console.log(Number(b)); // 1234567900000000000
console.log(Number(b) > Number.MAX_SAFE_INTEGER); // 大于最大安全数，或小于MIN_SAFE_INTEGER，精度会丢失
console.log(bigNumAdd(a, b)); // 1243575099254740990
