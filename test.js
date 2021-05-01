/**
 * @param {number} n
 * @return {string[][]}
 */
 var solveNQueens = function(n) {
  var board = new Array(n);
  for (var i = 0; i < n; i++) {
      board[i] = new Array(n).fill('.');
  }

  var cols = new Set(); // 列
  var diag1 = new Set(); // 正对角线
  var diag2 = new Set(); // 反对角线
  var res = [];

  var helper = function(row) {
      if (row === n) {
          var stringsBoard = board.slice();
          for (let i = 0; i < n; i++) {
              stringsBoard[i] = stringsBoard[i].join('');
          }
          res.push(stringsBoard);
          return;
      }

      for (let col = 0; col < n; col++) {
          if (!cols.has(col) && !diag1.has(row + col) && !diag2.has(row - col)) {

              board[row][col] = 'Q';
              cols.add(col);
              diag1.add(row + col);
              diag2.add(row - col);
              
              // 执行2，行3，行4
              helper(row + 1);

              // 行4执行完会
              board[row][col] = '.';  // 撤销该点的皇后
              cols.delete(col);       // 对应的记录也删一下
              diag1.delete(row + col);
              diag2.delete(row - col);

          }
      }
  }

  helper(0);

  console.log('fffffff', res)
  return res;
};

solveNQueens(4)