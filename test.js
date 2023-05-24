const removeDuplicates = function (nums) {
    const len = nums.length;
    const maxDuplicateLen = 2; // 最多允许的重复次数
    if (len <= maxDuplicateLen) {
        return len;
    }

    let slow = maxDuplicateLen - 1; // 慢指针
    let fast = maxDuplicateLen; // 快指针

    while (fast < len) {
        if (nums[slow - (maxDuplicateLen - 1)] !== nums[fast]) {
            nums[slow + 1] = nums[fast];
            slow++;
            fast++;
        } else {
            fast++;
        }
    }

    return slow + 1;
};
