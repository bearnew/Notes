/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function (board, word) {
    const m = board.length;
    const n = board[0].length;
    // 起点的4个方向坐标（右、左、下、上）
    const direction = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
    ];
    // 标记坐标是否访问过
    const visited = Array.from({ length: m }, () => new Array(n).fill(false));

    const check = (i, j, word, k) => {
        console.log("aaa", i, j, board[i][j], word[k]);
        if (board[i][j] !== word[k]) {
            // 这个坐标的值和单词的第k个值不相等，这条路径搜索失败
            return false;
        } else if (k === word.length - 1) {
            // 坐标值和第k个值相等，且是最后1位，全部搜索成功
            return true;
        }
        // 标识i j坐标被访问过了
        visited[i][j] = true;
        let result = false;
        for (const [x, y] of direction) {
            let newi = x + i; // 4个方向上的横坐标
            let newj = y + j; // 4个方向上的纵坐标
            if (newi >= 0 && newi < m && newj >= 0 && newj < n) {
                // 在m*n的网格内
                if (!visited[newi][newj]) {
                    const flag = check(newi, newj, word, k + 1);
                    if (flag) {
                        result = true;
                        break;
                    }
                }
            }
        }

        // 未搜索到，回溯
        visited[i][j] = false;
        return result;
    };

    for (var i = 0; i < m; i++) {
        for (var j = 0; j < n; j++) {
            const flag = check(i, j, word, 0);
            if (flag) return true;
        }
    }

    return false;
};

console.log("aaaa");
console.log(
    exist(
        [
            ["A", "A", "A", "A", "A", "A"],
            ["A", "A", "A", "A", "A", "A"],
            ["A", "A", "A", "A", "A", "A"],
            ["A", "A", "A", "A", "A", "A"],
            ["A", "A", "A", "A", "A", "A"],
            ["A", "A", "A", "A", "A", "A"],
        ],
        "AAAAAAAAAAAAAAB"
    )
);
