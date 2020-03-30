/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function (nums) {
    var len = nums.length;
    var path = [];
    var res = [];

    backtrack(path);
    return res;

    function backtrack(path) {
        if (path.length === len) {
            res.push(path);
            return;
        }

        for (var i = 0; i < len; i++) {
            if (!path.includes(nums[i])) {
                path.push(nums[i]);
                backtrack(path.slice());
                path.pop();
            }
        }
    }
};

// [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
console.log(JSON.stringify(permute([1, 2, 3])));
