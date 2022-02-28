// 只是个循环，每个节点往放到它该在的children里
// 用map优化测试
// 1. 找不到父节点则放入结果集
// 2. 找到父节点则放入父节点的children
const fn = (data) => {
    const result = [];
    data.forEach((item) => {
        const parent = menu.find((a) => a.id === item.pid);
        if (!parent) {
            result.push(item);
        } else {
            if (!parent.children) parent.children = [];
            parent.children.push(item);
        }
    });
    return result;
};
const fn = (data) => {
    const result = [];

    let map = {};
    data.forEach((item) => {
        map[item.id] = item;
    });

    data.forEach((item) => {
        let parent = map[item.pid]; // 简化查找复杂度
        if (!parent) {
            result.push(item);
        } else {
            if (!parent.children) parent.children = [];
            parent.children.push(item);
        }
    });
    return result;
};

// 深比较
function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            (areObjects && !deepEqual(val1, val2)) ||
            (!areObjects && val1 !== val2)
        ) {
            return false;
        }
    }

    return true;
}

function isObject(object) {
    return object != null && typeof object === "object";
}
// 用generator函数封装async await
function getAsync(generatorFunc) {
    return function async(...args) {
        const gen = generatorFunc.apply(this, ...args); // 生成一个迭代器
        return new Promise((resolve, reject) => {
            function step(key, arg) {
                let result = gen[key](arg); // 调用next执行一步拿到结果
                const { value, done } = result;
                if (done) {
                    return resolve(value);
                } else {
                    // async会把value用Promise包一下，然后用then自动继续调用step
                    return Promise.resolve(value).then((val) =>
                        step("next", val)
                    );
                }
            }
            step("next");
        });
    };
}

// useState
const fiberStates = {}; // 当前组件所有states
let curr; // 当前state指针
const useState = (initialState) => {
    // state: 取链表里保存的或初始值
    const state = fiberStates[curr] || initialState;
    // setState
    const setState = (newState) => {
        fiberStates[curr] = newState;
        render(); // 进入渲染流程
    };

    curr = curr.next;
    return [state, setState];
};

// useEffect
let lastDeps;
const useEffect = (effectFn, deps) => {
    const changed =
        !lastDeps || // 首次渲染
        !list ||
        !list.length || // deps不传或为空
        list.some((item, index) => !Object.is(item, lastDeps[index])); // deps改变
    if (changed) {
        lastDeps = deps;
        effectFn(); // 触发副作用
    }
};

// 编程题刷过就知道了
// 解答题要去想，然后刷过就知道了，比如天平砝码

// 你有一个天平，140g盐、7g 和 2g 的砝码各一个，只允许使用天平 3 次，把盐分成 90g 和 50g 两堆（第一次不允许使用天平将盐对半分为 70g）
// （1）7g+2g砝码分140g=9g+131g
// (2）7g+2g 砝码 分131g= 61g+70g
// （3）用2g砝码+9g盐 分61g盐=50g+11g

// JSON.parse
function jsonParse(opt) {
    return eval("(" + opt + ")");
}
// JSON.stringify
function jsonStringify(obj) {
    let type = typeof obj;
    if (type !== "object") {
        if (/string|undefined|function/.test(type)) {
            obj = '"' + obj + '"';
        }
        return String(obj);
    } else {
        let json = [];
        let arr = Array.isArray(obj);
        for (let k in obj) {
            let v = obj[k];
            let type = typeof v;
            if (/string|undefined|function/.test(type)) {
                v = '"' + v + '"';
            } else if (type === "object") {
                v = jsonStringify(v);
            }
            json.push((arr ? "" : '"' + k + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
}
jsonStringify({ x: 5 }); // "{"x":5}"
jsonStringify([1, "false", false]); // "[1,"false",false]"
jsonStringify({ b: undefined }); // "{"b":"undefined"}"

// 解析url为对象
function parseParam(url) {
    const paramsStr = /.+\?(.+)$/.exec(url)[1]; // 将 ? 后面的字符串取出来
    const paramsArr = paramsStr.split("&"); // 将字符串以 & 分割后存到数组中
    let paramsObj = {};
    // 将 params 存到对象中
    paramsArr.forEach((param) => {
        if (/=/.test(param)) {
            // 处理有 value 的参数
            let [key, val] = param.split("="); // 分割 key 和 value
            val = decodeURIComponent(val); // 解码
            val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字

            if (paramsObj.hasOwnProperty(key)) {
                // 如果对象有 key，则添加一个值
                paramsObj[key] = [].concat(paramsObj[key], val);
            } else {
                // 如果对象没有这个 key，创建 key 并设置值
                paramsObj[key] = val;
            }
        } else {
            // 处理没有 value 的参数
            paramsObj[param] = true;
        }
    });

    return paramsObj;
}

// 实现render
let domElement = document.createElement(type);

for (let propName in props) {
    let item = props[propName];
    if (propName === "children") {
        item = Array.isArray(item) ? item : [item];
        item.forEach((child) => render(child, domElement));
    } else if (propName === "style") {
        for (let attr in item) {
            domElement.style[attr] = item[attr];
        }
    }
}

// 最长上升子序列长度: dp[i]表示 [:i] 的最长上升子序列长度
// dp[i] = Math.max(dp[i], dp[j] + 1)
var lengthOfLIS = function (nums) {
    const dp = new Array(nums.length).fill(1);
    let maxLen = 1;
    for (let i = 0; i < nums.length; i++) {
        // 选定一个i为子序列终点
        for (let j = 0; j < i; j++) {
            // 遍历对比其前面所有nums[j] 并用 [:j] 来更新 [:i]
            // 先求当前j -> i的结果：如果递增，则dp[i] = dp[j] + 1
            // 由当前j -> i的结果 和 其他j -> i的结果 选大求出dp[i]
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxLen = Math.max(maxLen, dp[i]); // 选一个最大dp[i]
    }
    return maxLen;
};

// 最长公共子数组长度:
// dp[i][j]：表示 A[i:] 和 B[j:] 的最长公共子数组的长度
// public int findLength(int[] A, int[] B) {
//     int n = A.length, m = B.length; // js二维数组必须手动初始化否则无法修改
//     int[][] dp = new int[n + 1][m + 1];
//     int ans = 0;
//     for (int i = n - 1; i >= 0; i--) {
//         for (int j = m - 1; j >= 0; j--) {
// 同时选定ij
//             dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : 0;
//             ans = Math.max(ans, dp[i][j]);
//         }
//     }
//     return ans;
// }

// 最小路径和: dp
// 上或左最小，首排首列单独处理
// dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
const minPathSum = (grid) => {
    const row = grid.length,
        col = grid[0].length;
    // 第一行和第一列先单独计算（+=上或左路径即可）
    for (let i = 1; i < row; i++) {
        grid[i][0] += grid[i - 1][0];
    }
    for (let j = 1; j < col; j++) {
        grid[0][j] += grid[0][j - 1];
    }

    for (let i = 1; i < row; i++) {
        for (let j = 1; j < col; j++) {
            grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]); // 上个或左个路径更小的那个
        }
    }
    return grid[row - 1][col - 1];
};

// 最大子序和：preSum = Math.max(prevSum + item, item)
var maxSubArray = function (nums) {
    let preSum = 0,
        maxSum = nums[0];
    nums.forEach((item) => {
        preSum = Math.max(preSum + item, item); // 以当前item结尾的最大子序和: 如果加上前边的还不如自己本身大，那当前最大和为自己
        maxSum = Math.max(maxSum, preSum);
    });
    return maxSum;
};

// 最长回文子串
// dp[i][j]代表从s[i, j]是否回文
// dp[i][j] = dp[i+1][j-1] && s[i] === s[j]
// 初始时中间一个数为true, 两边相等则再为true
var longestPalindrome = function (s) {
    let begin = 0,
        maxLen = 1;

    // 初始化!!：当i===j即只子串只有一个字符时为回文
    const n = s.length;
    const dp = [];
    for (let i = 0; i < n; i++) {
        dp[i] = [];
        for (let j = 0; j < n; j++) {
            dp[i][j] = i === j;
        }
    }

    for (let j = 1; j < s.length; j++) {
        // 子串终点
        for (let i = 0; i < j; i++) {
            // 子串起点
            if (s[i] !== s[j]) {
                dp[i][j] = false;
            } else {
                if (j - i === 1) {
                    // 从初始化和这里开始：除去相等的头尾中间最多剩一个字符时肯定是回文串
                    dp[i][j] = true;
                } else {
                    // 状态转移方程
                    dp[i][j] = dp[i + 1][j - 1];
                }
            }

            // 更新最大回文串位置
            if (dp[i][j] && j - i + 1 > maxLen) {
                maxLen = j - i + 1;
                begin = i;
            }
        }
    }
    return s.substring(begin, begin + maxLen);
};

// 从前序遍历和中序遍历构造二叉树
// preorder = [根节点，左子树，右子树]
// inorder = 【左子树，根节点，右子树】
var buildTree = function (preorder, inorder) {
    if (!preorder.length) return null;
    let root = new TreeNode(preorder[0]);
    let mid = inorder.findIndex((number) => number === root.val); // 中序遍历中定位根节点的位置（则得之两颗子树节点个数）
    root.left = buildTree(preorder.slice(1, mid + 1), inorder.slice(0, mid)); // 两颗左子树
    root.right = buildTree(
        preorder.slice(mid + 1, preorder.length),
        inorder.slice(mid + 1, inorder.length)
    ); // 两颗右子树
    return root;
};

// 爬楼梯
// f(n) = f(n-1) + f(n-2) 从前往后推导方案

// var climbStairs = function(n) {
//     let a = 0, b = 0, c = 1 // a和b分别代表走到第n-1和n-2梯的方案
//     for (let i =0; i <n; i++) {
//         a = b
//         b = c
//         c = a + b // 更新c
//     }
//     return c
// };

// fibonacci
// f(n) = f(n-1) + f(n-2)  和爬楼梯区别是先算curr

// var fibonacci = function(n) {
//      let a = 0, b = 1, curr = 1
//     for (let i =0; i <n; i++) {
//         curr = a + b // 更新curr
//         a = b
//         b = curr
//     }
//     return curr
// };
// 先计算后再更新梯子

// 买卖股票
// 不断更新最低点min和差值diff(反正不断更新最低点时diff肯定会增加）

// 最大子序和：dp
// preSum代表当前数截止的最大和
// preSum = Math.max(prevSum + item, item)
// 前面和与自己本身比出当前截止最大和，再和res比

// 最长上升子序列: dp
// dp[i]表示以i为终点的最长上升子序列长度，先定一个i
// dp[i] = Math.max(dp[i], dp[j] + 1)

// 最长公共子数组: dp
// 倒着开始，dp[i][j]表示从i到j的最长子数组长度
// dp[i][j] = A[i] == B[j] ? dp[i + 1][j + 1] + 1 : 0;

// 最小路径和: dp
// 上或左最小，首排首列单独处理
// dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];

// 长度最小的子数组: 滑动窗口
// 滑动窗口先right++遍历，再内循环left++直到sum>=target记录一次最小长度

// 最长回文子串：dp
// 定义：dp[i][j]表示s[i…j]是否为回文串
// 状态转移方程：
// 	s[i] === s[j] && dp[i][j] = dp[i+1][j-1]
// 	（特殊情况：当j === i+1时为true）
// 初始值：当i===j时即只有一个字符时为true
