function F() { }
Object.prototype.a = 'a';
Function.prototype.b = 'b';
F.prototype.c = 'c;'

// 创建一个空对象f
// 空对象f的prototype指向F的prototype的拷贝
// F内的this指向f,并执行F内的方法
var f = new F();

console.log(F instanceof Object); // true
console.log(F instanceof Function); // true
console.log(f instanceof Object); // true
console.log(f instanceof Function); // false

console.log(f.a, f.b, f.c); // a undefined c
console.log(f.constructor.a, f.constructor.b, f.constructor.c, F.c); // a b undefined undefined


// const list = [4, 2, 6, 5, 7, 3, 1];
// console.log(mergeSort(list)); // [1, 2, 3, 4, 5, 6, 7]

// function mergeSort(arr) {
//     var length = arr.length;
//     if (length === 1) {
//         return arr;
//     }
//     var mid = Math.floor(length / 2),
//         left = arr.slice(0, mid),
//         right = arr.slice(mid, length);

//     return merge(mergeSort(left), mergeSort(right));
// }

// function merge(left, right) {
//     var result = [];
//     var leftIndex = 0;
//     var rightIndex = 0;

//     while (leftIndex < left.length && rightIndex < right.length) {
//         if (left[leftIndex] < right[rightIndex]) {
//             result.push(left[leftIndex++]);
//         } else {
//             result.push(right[rightIndex++]);
//         }
//     }

//     while (leftIndex < left.length) {
//         result.push(left[leftIndex++]);
//     }

//     while (rightIndex < right.length) {
//         result.push(right[rightIndex++]);
//     }

//     return result;
// }