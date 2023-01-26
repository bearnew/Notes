var findKthLargest = function (nums, k) {
  let heapSize = nums.length;
  buildMaxHeap(nums);

  while (heapSize > nums.length - k + 1) {
    heapSize--;
    // 将堆顶放在末尾
    swap(nums, 0, heapSize);
    // 重新构建堆，将最大值放在堆顶
    heapify(nums, 0, heapSize);
  }

  return nums[0];

  // 构建大顶堆
  // 大顶堆：每个节点的值都大于或等于其子节点的值，在堆排序算法中用于升序排列
  function buildMaxHeap(nums) {
    for (var i = Math.floor(heapSize / 2) - 1; i >= 0; i--) {
      heapify(nums, i, heapSize);
    }
  }

  // 构建堆
  // 第 n 个元素的 左子节点 为 2*n+1
  // 第 n 个元素的 右子节点 为 2*n+2
  // 第 n 个元素的 父节点 为 (n-1)/2
  function heapify(nums, i, heapSize) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let largest = i;

    if (left < heapSize && nums[left] > nums[largest]) {
      // 找出作为堆顶的元素
      largest = left;
    }
    if (right < heapSize && nums[right] > nums[largest]) {
      // 找出作为堆顶的元素
      largest = right;
    }
    if (largest !== i) {
      // 交换元素，生成标准堆
      swap(nums, i, largest);
      // 构建下一层堆
      heapify(nums, largest, heapSize);
    }
  }

  function swap(arr, idx1, idx2) {
    [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
  }
};

var k = findKthLargest([4, 2, 6, 5, 7, 3, 1], 5);

console.log("kkkk", k);
