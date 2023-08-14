// Function for checking draw
export function checkDraw(board) {
  return board.every((letter) => letter === "X" || letter === "O");
}

// Function for checking winner
export function checkWinner(board) {
  const horizontalXWin = checkHorizontal("X", board);
  if (horizontalXWin) return "X";

  const horizontalOWin = checkHorizontal("O", board);
  if (horizontalOWin) return "O";

  const verticalXWin = checkVertical("X", board);
  if (verticalXWin) return "X";

  const verticalOWin = checkVertical("O", board);
  if (verticalOWin) return "O";

  const diagonalXWin = checkDiagonal("X", board);
  if (diagonalXWin) return "X";

  const diagonalOWin = checkDiagonal("O", board);
  if (diagonalOWin) return "O";
}

// Checks for 3 consecutive horizontal characters
function checkHorizontal(char, board) {
  console.log("This runs");
  if (board[0] === char && board[1] === char && board[2] === char) {
    return true;
  }
  if (board[3] === char && board[4] === char && board[5] === char) {
    return true;
  }
  if (board[6] === char && board[7] === char && board[8] === char) {
    return true;
  }
}

// Checks for 3 consecutive vertical characters
function checkVertical(char, board) {
  console.log("This runs");
  if (board[0] === char && board[3] === char && board[6] === char) {
    return true;
  }
  if (board[1] === char && board[4] === char && board[7] === char) {
    return true;
  }
  if (board[2] === char && board[5] === char && board[8] === char) {
    return true;
  }
}

// Checks for 3 consecutive diagonal characters
function checkDiagonal(char, board) {
  console.log("This runs");
  if (board[0] === char && board[4] === char && board[8] === char) {
    return true;
  }
  if (board[2] === char && board[4] === char && board[6] === char) {
    return true;
  }
}
