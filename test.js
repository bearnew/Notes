const combinationSum3 = (k, n) => {
  const res = [];
  // 基于当前已选的comb数组(和为sum)，在数start到数9中继续选
  const dfs = (start, comb, sum) => {
    if (comb.length == k) {
      // 选够k个数 结束递归
      if (sum == n) {
        // 组合中数之和等于n
        res.push(comb.slice()); // 将它的拷贝加入解集
      }
      return;
    }
    for (let i = start; i <= 9; i++) {
      // 枚举出所有的选择（选项）
      comb.push(i); // 作出一个选择i
      console.log("aaaa", i);
      dfs(i + 1, comb, sum + i); // 基于该选择i，往下递归
      console.log("bbbb", comb);
      comb.pop(); // 撤销这个选择
      console.log("cccc", comb);
    }
  };

  dfs(1, [], 0); // 入口
  return res;
};

var result = combinationSum3(3, 7);
console.log("xxxxx", result);
