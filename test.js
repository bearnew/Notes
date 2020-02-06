const list = [5, 4, 3, 2, 1];
console.log(binarySearch(list, 3)); // 2

function binarySearch(list, item) {
    const arr = quickSort(list);

    let low = 0;
    let high = arr.length - 1;
    let mid;
    let element;

    while (low <= high) {
        mid = Math.floor((low + high) / 2);
        element = arr[mid];

        if (element < item) {
            low = mid + 1;
        } else if (element > item) {
            high = mid - 1;
        } else {
            return mid;
        }
    }

    return -1;
}

function quickSort(arr) {
    if (arr.length === 0) return arr;

    let pivot = arr[arr.length - 1]
    // 通过filter筛选，这个过程不仅在分区 也在进行排序
    let left = arr.filter((v, i) => (v <= pivot) && (i !== arr.length - 1))
    let right = arr.filter(v => v > pivot)
    return [...quickSort(left), pivot, ...quickSort(right)]
}

