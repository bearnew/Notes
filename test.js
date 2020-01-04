const list = [4, 2, 6, 5, 7, 3, 1];
console.log(mergeSort(list)); // [1, 2, 3, 4, 5, 6, 7]

function mergeSort(arr) {
    var length = arr.length;
    if (length === 1) {
        return arr;
    }
    var mid = Math.floor(length / 2),
        left = arr.slice(0, mid),
        right = arr.slice(mid, length);

    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    var result = [];
    var leftIndex = 0;
    var rightIndex = 0;

    console.log(left, right)
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex++]);
        } else {
            result.push(right[rightIndex++]);
        }
    }

    while (leftIndex < left.length) {
        result.push(left[leftIndex++]);
    }

    while (rightIndex < right.length) {
        result.push(right[rightIndex++]);
    }

    console.log(result)
    return result;
}