const list = [4, 2, 6, 5, 7, 3, 1];
console.log(heapSort(list)); // [1, 2, 3, 4, 5, 6, 7]

function heapSort(arr) {
    var heapSize = arr.length;
    buildMaxHeap(arr);

    while (heapSize > 1) {
        heapSize--;
        swap(arr, 0, heapSize);
        heapify(arr, heapSize, 0);
    }
    return arr;
}

// 构建大顶堆
function buildMaxHeap(arr) {
    var heapSize = arr.length;
    for (var i = Math.floor(arr.length / 2); i >= 0; i--) {
        heapify(arr, heapSize, i);
    }
}

// 堆调整
// [4, 2, 6, 5, 7, 3, 1]
// i为3(5), left为7, right为8, arr不变
// i为2(6), left为5(3), right为6(1), largest不变，arr不变
// i为1(2)，left为3(5)， right为4(7)，满足第1个if, largest为3(5), 满足第二个if, largest为4(7), swap后arr为[4, 7, 6, 5, 2, 3, 1]
// i为0(4), left为1(7), right为2(6), 满足第1个if, largest位1（7），不满足第2个if, largest为1(7), swap后arr为[7, 4, 6, 5, 2, 3, 1], 继续递归
// i为1(4), left为3(5), right为4(2), 满足第1个if, largest为3(5), swap后arr为[7, 5, 6, 4, 2, 3, 1]
function heapify(arr, heapSize, i) {
    var left = 2 * i + 1;
    var right = 2 * i + 2;
    var largest = i;

    if (left < heapSize && arr[left] > arr[largest]) {
        largest = left;
    }

    if (right < heapSize && arr[right] > arr[largest]) {
        largest = right;
    }

    if (largest !== i) {
        swap(arr, i, largest);
        heapify(arr, heapSize, largest);
    }
}

function swap(arr, index1, index2) {
    [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
}
