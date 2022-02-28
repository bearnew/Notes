// 目标：看题意，缕通例子

// 数组
// 合并有序数组：双指针取小的值放入结果集
var merge = function (nums1, m, nums2, n) {
  let p1 = 0,
    p2 = 0;
  const sorted = [];
  while (p1 < m || p2 < n) {
    let cur;
    if (p1 === m) {
      // 走到数组终点则自然取另一个指针值
      cur = nums2[p2++];
    } else if (p2 === n) {
      cur = nums1[p1++];
    } else if (nums1[p1] < nums2[p2]) {
      // 取小的指针值
      cur = nums1[p1++];
    } else {
      cur = nums2[p2++];
    }
    sorted.push(cur);
  }
  // leetcode读的是堆里的数据
  for (let i = 0; i < nums1.length; i++) {
    nums1[i] = sorted[i];
  }
};
// 两数之和：利用哈希存储从而高效取值
var twoSum = function (nums, target) {
  let map = new Map();
  for (let i = 0; i < nums.length; i++) {
    let key = target - nums[i];
    if (map.has(key)) {
      // map中是否存在target - nums[i]
      return [map.get(key), i];
    } else {
      map.set(nums[i], i);
    }
  }
};
// 有序数组二分查找：双指针定位中点查找
var search = function (nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const middle = Math.ceil((left + right) / 2);
    if (target < nums[middle]) {
      right = middle - 1;
    } else if (target > nums[middle]) {
      left = middle + 1;
    } else {
      return middle;
    }
  }
  return -1;
};
// LRU缓存：利用有序的map来存储
// 每次操作要删除后新增
var LRUCache = function (capacity) {
  this.capacity = capacity;
  this.data = new Map();
};
LRUCache.prototype.get = function (key) {
  if (this.data.has(key)) {
    // 删除重新插入到最后
    const value = this.data.get(key);
    this.data.delete(key);
    this.data.set(key, value);
    return value;
  } else {
    return -1;
  }
};
LRUCache.prototype.put = function (key, value) {
  if (this.data.has(key)) this.data.delete(key, value);
  this.data.set(key, value);
  if (this.data.size > this.capacity) {
    // map.key()可迭代通过next()删除map的第一个键
    this.data.delete(this.data.keys().next().value);
  }
};
// 三数之和：暴力 + 去重分析
// 1、每次枚举的数相同则跳过
// 2、a = 0开始, b = a + 1开始, c指针从右边开始直到b
var threeSum = function (nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    // i需要与上一次枚举的数不同
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    // k指针指向最右端
    let k = n - 1,
      target = -nums[i];
    for (let j = i + 1; j < n; j++) {
      // j需要与上一次枚举的数不同
      if (j > i + 1 && nums[j] === nums[j - 1]) continue;

      // k不断--直到找到答案或者走到了j 停止
      while (j < k && nums[j] + nums[k] > target) k--;
      // 走过了则跳过后续j（j再增加和必然大于0了）
      if (k === j) break;
      // 找到答案则放入结果集
      if (nums[j] + nums[k] === target) {
        res.push([nums[i], nums[j], nums[k]]);
      }
    }
  }
  return res;
};

// 和为target的长度最小的子数组：滑动窗口
var minSubArrayLen = function (target, nums) {
  let left = 0,
    right = 0,
    minLength = Number.MAX_SAFE_INTEGER,
    sum = 0;
  while (right < nums.length) {
    // right++
    sum += nums[right];
    while (sum >= target) {
      // 当找到满足sum > target的right时 就 left++
      minLength = Math.min(minLength, right - left + 1);
      sum -= nums[left];
      left++;
    }
    right++;
  }
  return minLength === Number.MAX_SAFE_INTEGER ? 0 : minLength;
};

// 原地移除元素：双指针，left指向结果数组尾巴，right遍历。如果相等则right++跳, 否则复制right到结果集left里且双指针++
// 螺旋矩阵：四个指针模拟从外到内顺时针移动
var spiralOrder = function (matrix) {
  if (!matrix.length || !matrix[0].length) {
    return [];
  }

  const rows = matrix.length,
    columns = matrix[0].length;
  const order = [];
  let left = 0,
    right = columns - 1,
    top = 0,
    bottom = rows - 1;
  // 四个指针从外向内移动，以最外层为例
  while (left <= right && top <= bottom) {
    // 枚举第一行
    for (let column = left; column <= right; column++) {
      order.push(matrix[top][column]);
    }
    // 枚举最后一列
    for (let row = top + 1; row <= bottom; row++) {
      order.push(matrix[row][right]);
    }
    if (left < right && top < bottom) {
      // 枚举最后一行
      for (let column = right - 1; column > left; column--) {
        order.push(matrix[bottom][column]);
      }
      // 枚举第一列
      for (let row = bottom; row > top; row--) {
        order.push(matrix[row][left]);
      }
    }
    [left, right, top, bottom] = [left + 1, right - 1, top + 1, bottom - 1];
  }
  return order;
};
// 旋转数组：先全部旋转再分别旋转

// 两个数组的交集：set哈希存储
var intersection = function (nums1, nums2) {
  const set1 = new Set(nums1),
    set2 = new Set(nums2),
    set = new Set();
  for (const num of set1) {
    if (set2.has(num)) set.add(num);
  }
  return [...set];
};
// 删除一个元素使数组严格递增
var canBeIncreasing = function (nums) {
  if (check(nums)) return true;
  for (let i = 1; i < nums.length; i++) {
    // 找到不对的元素则试图分别删除两者来判断
    if (nums[i] <= nums[i - 1]) {
      const copy = [...nums];
      copy.splice(i - 1, 1);

      const copy1 = [...nums];
      copy1.splice(i, 1);
      if (check(copy) || check(copy1)) return true;
    }
  }
  return false;
};
const check = (nums) => {
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] <= nums[i - 1]) return false;
  }
  return true;
};

// 字符串
// 大数相加：补位对齐后按位相加
var addStrings = function (num1, num2) {
  const maxlen = Math.max(num1.length, num2.length);
  num1 = num1.padStart(maxlen, 0);
  num2 = num2.padStart(maxlen, 0);

  let res = "",
    carry = 0;
  for (let i = maxlen - 1; i >= 0; i--) {
    const value = parseInt(num1[i]) + parseInt(num2[i]) + carry;
    res = (value % 10) + res;
    carry = Math.floor(value / 10);
  }
  if (carry) res = carry + res;
  return res;
};

// 无重复字符的最长子串：子串[i, j], 枚举下个起点i时j不必回溯而是继续走
var lengthOfLongestSubstring = function (s) {
  let j = -1,
    len = 0;
  const set = new Set();
  for (let i = 0; i < s.length; i++) {
    if (i !== 0) set.delete(s[i - 1]);
    while (!set.has(s[j + 1]) && j + 1 < s.length) {
      // 窗口后个字符不重复则继续走j
      set.add(s[j + 1]);
      j++;
    }
    len = Math.max(len, j - i + 1);
  }
  return len;
};

// 比较版本号：依次直接比较修订号即可
var compareVersion = function (version1, version2) {
  const v1 = version1.split(".");
  const v2 = version2.split(".");

  for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
    const a = parseInt(v1[i]) || 0;
    const b = parseInt(v2[i]) || 0;

    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
  }
  return 0;
};
// 第一个只出现一次的字符
var firstUniqChar = function (s) {
  // 使用map保存数字和频数
  const map = new Map();
  for (let i = 0; i < s.length; i++) {
    if (!map.has(s[i])) {
      map.set(s[i], 1);
    } else {
      map.set(s[i], map.get(s[i]) + 1);
    }
  }
  // 使用map.entries()遍历map
  for (const [key, value] of map.entries()) if (value === 1) return key;
  return " ";
};

// 链表
// 反转链表：前后指针
var reverseList = function (head) {
  let prev = null; // 注意pre要用空指针否则会循环
  let curr = head;
  while (curr) {
    const next = curr.next; // 保存下个节点以前进
    curr.next = prev; // 反转

    // 移动双指针
    prev = curr;
    curr = next;
  }
  return prev;
};
// 环形链表：快慢指针
var detectCycle = function (head) {
  let fast = head;
  let slow = head;

  while (fast) {
    // 快慢指针如果存在环一定会相遇
    slow = slow.next; // 慢指针每次走1步
    if (fast.next) {
      fast = fast.next.next; // 快指针每次走2步
    } else {
      return null;
    }

    // 当相遇时存在a = b + n圈
    if (fast === slow) {
      let ptr = head; // 让ptr从头开始走，ptr和slow会在入环点相遇
      while (ptr !== slow) {
        ptr = ptr.next;
        slow = slow.next;
      }
      return ptr;
    }
  }
  return null;
};
// 环形链表：set记录
var detectCycle = function (head) {
  const visited = new Set();
  while (head) {
    if (visited.has(head)) {
      return head;
    }
    visited.add(head);
    head = head.next;
  }
  return null;
};

// 删除链表的倒数第n个节点：前后指针
var removeNthFromEnd = function (head, n) {
  // 将left，right指针分别放到第0、第n个节点
  // 一起走到结束时，left节点将指向倒数第n-1个节点方便删除
  const dummyHead = new ListNode(0, head);
  let left = dummyHead;
  let right = head;

  for (let i = 1; i <= n; i++) {
    // right从第1个节点走n-1步走到第n个节点
    right = right.next;
  }

  while (right) {
    left = left.next;
    right = right.next;
  }
  if (left.next) left.next = left.next.next;
  return dummyHead.next;
};

// 合并两个有序链表
var mergeTwoLists = function (l1, l2) {
  if (l1 === null) {
    return l2;
  } else if (l2 === null) {
    return l1;
  } else if (l1.val < l2.val) {
    // 小的选入结果集了，并指向后面的链表
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
  }
};

// 快排：双指针
var sortArray = function (nums) {
  return qsort(nums, 0, nums.length - 1);
};
const qsort = (nums, low, high) => {
  if (low < high) {
    // 每个数都左小右大
    let key = patition(nums, low, high); // 让以key为中点的数左小右大
    qsort(nums, low, key - 1); // 递归左右的数
    qsort(nums, key + 1, high);
  }
};
const patition = (nums, low, high) => {
  // 两个指针用来交换排序指向的数+往中间收缩出一个位置（这个位置左小右大）
  const value = nums[low]; // 随便找个value用来比较
  while (low < high) {
    while (low < high && nums[high] >= value) {
      // 大数在正确位置，移动指针继续找
      high--;
    }
    [nums[low], nums[high]] = [nums[high], nums[low]]; // 找到就交换指向的两个数

    while (low < high && nums[low] <= value) {
      low++;
    }
    [nums[low], nums[high]] = [nums[high], nums[low]];
  }
  return low; // 最终收缩到一个指针
};

// 栈
// 有效括号
var isValid = function (s) {
  const stack = []; // 判断栈最终是否为空即可
  for (let i = 0; i < s.length; i++) {
    const last = stack[stack.length - 1];
    if (
      (last === "(" && s[i] === ")") ||
      (last === "[" && s[i] === "]") ||
      (last === "{" && s[i] === "}")
    ) {
      // 三种情况匹配弹出
      stack.pop();
    } else {
      stack.push(s[i]);
    }
  }
  return !stack.length;
};
// 用栈实现队列
var CQueue = function () {
  this.a = [];
  this.b = [];
};
CQueue.prototype.appendTail = function (value) {
  this.a.push(value);
};
CQueue.prototype.deleteHead = function () {
  // 要删除时都把a中元素倒进b里再删，b中有值就直接删好了
  if (!this.b.length) {
    while (this.a.length) {
      this.b.push(this.a.pop());
    }
  }
  if (!this.b.length) return -1;
  return this.b.pop();
};

// 树：只考虑根节点逻辑（+结束条件，+需要的参数和返回值）
// 前序遍历
// 单层逻辑：打印根左右
var preorderTraversal = function (root) {
  const result = [];

  const dfs = (root) => {
    if (!root) return null;

    // 打印根节点和左右子树
    result.push(root.val);
    dfs(root.left);
    dfs(root.right);
  };

  dfs(root);
  return result;
};
// 二叉树的最大深度
var maxDepth = function (root) {
  // 返回当前树最大深度
  const dfs = (root) => {
    if (!root) return 0;
    // 当前树最大深度 = 1 + 左右子树最大深度
    return 1 + Math.max(dfs(root.left), dfs(root.right));
  };
  return dfs(root);
};
// 从根节点到叶节点的路径数字之和
// 单层逻辑：结果等于左右子树路径数字之和相加
// 结束条件：空节点和叶节点
// 中途需要处理基准sum
var sumNumbers = function (root) {
  const dfs = (root, sum) => {
    if (!root) return 0;

    // 算出基准值
    sum = sum * 10 + root.val;
    if (!root.left && !root.right) return sum; // 12 or 13

    // 结果等于左右子树路径数字之和相加
    return dfs(root.left, sum) + dfs(root.right, sum);
  };

  return dfs(root, 0);
};
// 找出一条和为targetNum的路径
// 单层逻辑：结果等于左子树存在这样的路径或右子树存在这样的路径
// 结束条件：空节点和叶节点
// 中途需要处理targetSum
var hasPathSum = function (root, targetSum) {
  const dfs = (root, targetSum) => {
    if (!root) return false;
    if (!root.left && !root.right) return targetSum === root.val;
    // 结果等于左子树存在这样的路径或右子树存在这样的路径
    return (
      dfs(root.left, targetSum - root.val) ||
      dfs(root.right, targetSum - root.val)
    );
  };

  return dfs(root, targetSum);
};

// 迭代前序遍历：遍历左子树，然后让右子树进入下次循环
var preorderTraversal = function (root) {
  const stack = [];
  const result = [];
  while (root || stack.length) {
    while (root) {
      // 左节点全部压栈
      stack.push(root);
      result.push(root.val); // 打印根节点
      root = root.left;
    }
    if (stack.length) root = stack.pop().right; // 让右子树进入下次循环
  }
  return result;
};

// 层序遍历
var levelOrder = function (root) {
  const queue = [root];
  const result = [];
  if (!root) return result;
  while (queue.length) {
    // while循环队列
    const level = [];
    const levelSize = queue.length; // 提前保存当前层节点个数

    for (let i = 0; i < levelSize; i++) {
      const cur = queue.shift();
      level.push(cur.val);

      // 把下层节点追加进队列直到不存在
      if (cur.left) queue.push(cur.left);
      if (cur.right) queue.push(cur.right);
    }
    result.push(level);
  }
  return result;
};
// 二叉树的完全性校验958
var isCompleteTree = function (root) {
  const nodes = [{ node: root, code: 1 }]; // 用code记录它在完全二叉树中该有的序号
  let i = 0; // 因为最终判断需要nodes全集所以用i来循环
  while (i < nodes.length) {
    const cur = nodes[i];
    if (cur.node) {
      nodes.push({ node: cur.node.left, code: cur.code * 2 });
      nodes.push({ node: cur.node.right, code: cur.code * 2 + 1 });
    }
    i++;
  }
  return nodes.length === nodes[i - 1].code;
};

// 全排列回溯
const permute = (nums) => {
  const res = [],
    used = {};

  function dfs(path) {
    if (path.length == nums.length) {
      res.push([...path]);
      return;
    }

    // 每个数的可选集合
    for (const num of nums) {
      // 专注开始填入一条path
      // 填入一个数字
      if (used[num]) continue;
      path.push(num);
      used[num] = true;
      // 递归填完该path接下来的其他数字
      dfs(path);

      // 回溯：填完一条path后，pop一个数（这个数等于没选）到上层走其他分支继续填其他path
      // 比如遍历出一条1->2->3后撤销3，再继续回溯到上一层后往右时才能填3（1->3)
      path.pop();
      used[num] = false;
    }
  }

  dfs([]);
  return res;
};
// https://leetcode-cn.com/problems/permutation-i-lcci/solution/mian-shi-ti-0807-wu-zhong-fu-zi-fu-chuan-2ou4/
// 包含重复数字的数组全排列
var permuteUnique = function (nums) {
  const ret = [];
  const vis = new Array(nums.length).fill(false); // 包含重复数字则用唯一下标标识
  const dfs = (path) => {
    if (path.length === nums.length) {
      ret.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      // 11‘..和1’1..即重复，则当搜索到第二组1‘时，判断如果1’num[i] === 兄弟节点1即nums[i-1], 且1还没被用则重复
      if (vis[i] || (i > 0 && nums[i] === nums[i - 1] && !vis[i - 1])) {
        continue;
      }
      path.push(nums[i]);
      vis[i] = true;
      dfs(path);
      path.pop();
      vis[i] = false;
    }
  };
  nums.sort((x, y) => x - y);
  dfs([]); // 往第1个位置填数
  return ret;
};
// 字符串全排列：相邻字符不能重复
var reorganize = function (nums) {
  const ret = [];
  const used = {}; // 记录每个位置的数字是否被填过（因为包含重复数字所以用下标代表唯一数字）
  const dfs = (path) => {
    if (path.length === nums.length) {
      ret.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      // 横向遍历
      const num = nums[i];
      if (
        used[i] ||
        (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) || // path不重复
        path[path.length - 1] === nums[i] // 一条path里相邻字符不重复
      ) {
        continue;
      }

      path.push(num);
      used[i] = true;
      dfs(path); // 纵向遍历：继续递归填下个位置

      path.pop();
      used[i] = false;
    }
  };
  dfs([]);
  return ret;
};

// 贪心算法
// 求三角形最大周长1224。枚举4，224不满足跳过；枚举2，122满足返回。
// 能构成三角形的条件：两条小边 > 最长边
// 增序数组倒序枚举最长边：以该点为最长边所可能构成的最大周长的三角形则相邻两个（因为如果和前两边不构成三角形则向前更不可能，那么继续枚举下个最长边）
var largestPerimeter = function (nums) {
  nums.sort((a, b) => a - b);
  for (let i = nums.length - 1; i >= 2; i--) {
    if (nums[i - 1] + nums[i - 2] > nums[i]) {
      return nums[i] + nums[i - 1] + nums[i - 2];
    }
  }
  return 0;
};
// 发饼干：双指针，小吃小
// 会议室：按开始时间排序。遍历rooms找有可用room则更新room结束时间则可，否则新增。

// 动态规划
// 最大子序和
var maxSubArray = function (nums) {
  let res = Number.MIN_SAFE_INTEGER,
    sum = 0; // sum代表以当前点为结尾的最大子序和
  for (let i = 0; i < nums.length; i++) {
    const cur = nums[i];
    sum = sum + cur <= cur ? cur : sum + cur; // 前面结果有贡献的话就加上
    res = Math.max(sum, res);
  }
  return res;
};
// 爬楼梯
// f(n) = f(n-1) + f(n-2)
var climbStairs = function (n) {
  let a = 0,
    b = 1,
    c = 1; // 站在f1梯，f0和f1都为1
  for (let i = 1; i <= n; i++) {
    // 从第1梯走到第n梯
    c = a + b; // 更新f1
    a = b;
    b = c;
  }
  console.log(a, b, c);
  return c;
};
var fib = function (n) {
  if (n < 2) return n;
  let a = 0,
    b = 1,
    c = 1; // 现在是f2
  for (let i = 2; i <= n; i++) {
    // 从2走到n
    c = (a + b) % 1000000007; // 更新f2
    a = b;
    b = c;
  }
  return c;
};
// 买卖股票：不断更新最低点min和差值diff(反正不断更新最低点时diff肯定会增加）
var maxProfit = function (prices) {
  let min = Number.MAX_VALUE,
    diff = 0;
  prices.forEach((item) => {
    if (item < min) {
      // 遍历过程中求出最低点
      min = item;
    } else if (item - min > diff) {
      // 每次买都求出跟历史最低点的差值
      diff = item - min;
    }
  });
  return diff;
};
