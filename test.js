const list = [4, 2, 6, 5, 7, 3, 1];
console.log(quickSort(list)); // [1, 2, 3, 4, 5, 6, 7]

function quickSort(arr) {
    if (arr.length === 0) return arr;

    let pivot = arr[arr.length - 1]
    let left = arr.filter((v, i) => (v <= pivot) && (i !== arr.length - 1))
    let right = arr.filter(v => v > pivot)
    return [...quickSort(left), pivot, ...quickSort(right)]
}
