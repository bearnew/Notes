const list = [4, 2, 6, 5, 7, 3, 1];
console.log(quickSort(list)); // [1, 2, 3, 4, 5, 6, 7]

function quickSort(arr) {
    var len = arr.length;
    if (len === 0) return arr;
    const pivot = arr[len - 1];

    const left = arr.filter((val, i) => (val <= pivot) && (i !== len - 1));
    const right = arr.filter(val => val > pivot);

    return [...quickSort(left), pivot, ...quickSort(right)];
}

