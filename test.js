/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function(nums) {
    let n = nums.length;
    let res = [];
    let tmpPath = [];
    let backtrack = (tmpPath) => {
        console.log('111111', tmpPath)
        if(tmpPath.length == n){
            res.push(tmpPath);
            return;
        }
        console.log('444444')
        for(let i = 0;i < n;i++){
            if(!tmpPath.includes(nums[i])){
                tmpPath.push(nums[i]);
                console.log('2222222', tmpPath)
                backtrack(tmpPath.slice());
                console.log('333333', tmpPath)
                tmpPath.pop();
            }
        }
    }
    backtrack(tmpPath);
    return res;
};

console.log(permute([1,2,3]))
