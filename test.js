var exsit = function (board, word) {
    const h = board.length; // 有几行
    const w = board[0].length; // 有几列
    const directions = [
        [0, 1], // 右
        [0, -1], // 左
        [1, 0], // 下
        [-1, 0], // 上
    ];

    const visited = new Array(h); // 标记是否访问过数组
    for (let i = 0; i < visited.length; i++) {
        // 初始化
        visited[i] = new Array(w).fill(false);
    }

    const check = (i, j, s, k) => {
        // 从i j出发，搜索s中从k开始的字符
        if (board[i][j] !== s[k]) {
            return false;
        } else if (k === s.length - 1) {
            // 搜索到了word中的最后1位
            return true;
        } else {
            visited[i][j] = true; // 访问过
            let result = false;
            for (const [dx, dy] of directions) {
                let newi = i + dx;
                let newj = j + dy;
                if (newi >= 0 && newi < h && newj >= 0 && newj < w) {
                    // 新坐标位置合法
                    if (!visited[newi][newj]) {
                        const flag = check(newi, newj, s, k + 1);
                        if (flag) {
                            result = true;
                            break;
                        }
                    }
                }
            }

            visited[i][j] = false; // 回溯状态
            return result;
        }
    };

    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            const flag = check(i, j, word, 0);
            if (flag) {
                return true;
            }
        }
    }
    return false;
};
