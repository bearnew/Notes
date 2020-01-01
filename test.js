const list = [4, 5, 2, 3, 1];
console.log(insertionSort(list)); // [1, 2, 3, 4, 5]

function insertionSort(arr) {
    var length = arr.length;
    var j, temp;

    for (var i = 1; i < length; i++) {
        j = i;
        temp = arr[i];
        while (j > 0 && arr[j - 1] > temp) {
            arr[j] = arr[j - 1];
            j--;
        }
        arr[j] = temp;
    }

    return arr;
}

function swap(arr, index1, index2) {
    [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
}