console.log("aaaa");
var result = solveSudoku([
    ["5", "3", ".", ".", "7", ".", ".", ".", "."],
    ["6", ".", ".", "1", "9", "5", ".", ".", "."],
    [".", "9", "8", ".", ".", ".", ".", "6", "."],
    ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
    ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
    ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
    [".", "6", ".", ".", ".", ".", "2", "8", "."],
    [".", ".", ".", "4", "1", "9", ".", ".", "5"],
    [".", ".", ".", ".", "8", ".", ".", "7", "9"],
]);
console.log("11111", result);

/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solveSudoku = function (board) {
    var rowUsed = Array.from({ length: 9 }, () => {
        return new Array(9).fill(false);
    });
    var colUsed = Array.from({ length: 9 }, () => {
        return new Array(9).fill(false);
    });
    var cubeUsed = Array.from({ length: 3 }, () => {
        return Array.from({ length: 3 }, () => {
            return new Array(9).fill(false);
        });
    });

    var rowLen = board.length;
    var colLen = board[0].length;
    for (var i = 0; i < rowLen; i++) {
        for (var j = 0; j < colLen; j++) {
            var num = board[i][j];
            if (num !== ".") {
                rowUsed[i][num] = true;
                colUsed[j][num] = true;
                cubeUsed[Math.floor(i / 3)][Math.floor(j / 3)][num] = true;
            }
        }
    }

    recusive(board, rowUsed, colUsed, cubeUsed, 0, 0);
    return board;

    function recusive(board, rowUsed, colUsed, cubeUsed, row, col) {
        if (col === colLen) {
            row++;
            col = 0;
            if (row === rowLen) {
                return true;
            }
        }

        console.log("tttt", row, col);
        if (board[row][col] === ".") {
            // 空，进行填充
            for (var num = 0; num <= 9; num++) {
                var canFill = !(
                    rowUsed[row][num] ||
                    colUsed[col][num] ||
                    cubeUsed[Math.floor(row / 3)][Math.floor(col / 3)][num]
                );
                console.log("aaaa", canFill);
                if (canFill) {
                    rowUsed[row][num] = true;
                    colUsed[col][num] = true;
                    cubeUsed[Math.floor(row / 3)][Math.floor(col / 3)][
                        num
                    ] = true;

                    board[row][col] = String(num);
                    if (
                        recusive(
                            board,
                            rowUsed,
                            colUsed,
                            cubeUsed,
                            row,
                            col + 1
                        )
                    ) {
                        return true;
                    } else {
                        board[row][col] = ".";
                        rowUsed[row][num] = false;
                        colUsed[col][num] = false;
                        cubeUsed[Math.floor(row / 3)][Math.floor(col / 3)][
                            num
                        ] = false;
                    }
                }
            }
        } else {
            return recusive(board, rowUsed, colUsed, cubeUsed, row, col + 1);
        }
        return false;
    }
};
