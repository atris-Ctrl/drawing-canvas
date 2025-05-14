const flagPath = 'assets/minesweeper/flag';
const emojiPath = 'assets/minesweeper/emoji';
const numberPath = 'assets/minesweeper/number';
export const CellStates = {
  FLAG: 'flag',
  BOMB: 'bomb',
  EMPTY: 'empty',
  MISFLAG: 'misFlagged',
  BOMBEND: 'bombEnd',
};

export const settings = {
  beginner: {
    N_ROW: 8,
    N_COL: 8,
    N_BOMBS: 5,
  },
  intermediate: {
    N_ROW: 9,
    N_COL: 9,
    N_BOMBS: 40,
  },
  expert: {
    N_ROW: 16,
    N_COL: 30,
    N_BOMBS: 99,
  },
};

export const emojiPaths = {
  dead: `${emojiPath}/dead.png`,
  ohh: `${emojiPath}/ohh.png`,
  smile: `${emojiPath}/smile.png`,
  win: `${emojiPath}/win.png`,
};

export const numberPaths = {
  stop: `${numberPath}/digit-.png`,
  1: `${numberPath}/digit1.png`,
  2: `${numberPath}/digit2.png`,
  3: `${numberPath}/digit3.png`,
  4: `${numberPath}/digit4.png`,
  5: `${numberPath}/digit5.png`,
  6: `${numberPath}/digit6.png`,
  7: `${numberPath}/digit7.png`,
  8: `${numberPath}/digit8.png`,
  9: `${numberPath}/digit9.png`,
  0: `${numberPath}/digit0.png`,
};
export const GAME_STATE = {
  START: 'start',
  RUNNING: 'running',
  WIN: 'win',
  LOST: 'over',
};

export const flagPaths = {
  1: `${flagPath}/open1.png`,
  2: `${flagPath}/open2.png`,
  3: `${flagPath}/open3.png`,
  4: `${flagPath}/open4.png`,
  5: `${flagPath}/open5.png`,
  6: `${flagPath}/open6.png`,
  7: `${flagPath}/open7.png`,
  8: `${flagPath}/open8.png`,
  checked: `${flagPath}/checked.png`,
  misFlagged: `${flagPath}/misflagged.png`,
  flag: `${flagPath}/flag.png`,
  bomb: `${flagPath}/mine2.png`,
  empty: `${flagPath}/empty.png`,
  bombEnd: `${flagPath}/mine-death.png`,
};

export function isWithinBound(row, col, N_ROW, N_COL) {
  if (row < 0 || col < 0 || row >= N_ROW || col >= N_COL) return false;
  return true;
}

function isMine(board, row, col) {
  const N_ROW = board.length;
  const N_COL = board[0].length;
  if (!isWithinBound(row, col, N_ROW, N_COL)) return false;
  if (board[row][col].isMine) {
    return true;
  }
  return false;
}

export function countMine(board, level) {
  const { N_ROW, N_COL } = settings[level];
  for (let i = 0; i < N_ROW; i++) {
    for (let j = 0; j < N_COL; j++) {
      const count =
        isMine(board, i - 1, j - 1) +
        isMine(board, i - 1, j) +
        isMine(board, i - 1, j + 1) +
        isMine(board, i, j - 1) +
        isMine(board, i, j + 1) +
        isMine(board, i + 1, j - 1) +
        isMine(board, i + 1, j) +
        isMine(board, i + 1, j + 1);
      board[i][j].count = count;
    }
  }
}

function shuffle(arr) {
  let i, j, temp;
  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random(i + 1) * arr.length);
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
}

export function placeMine(board, level) {
  const { N_ROW, N_COL, N_BOMBS } = settings[level];

  const size = N_ROW * N_COL;
  let order = new Array(size);
  const mineCoords = [];

  for (let i = 0; i < size; i++) {
    order[i] = i;
  }
  shuffle(order);
  let row, col;
  for (let i = 0; i < N_BOMBS; i++) {
    row = Math.floor(order[i] / N_COL);
    col = order[i] % N_COL;
    board[row][col].isMine = true;
    mineCoords.push(`${row},${col}`);
  }
  return mineCoords;
}
export function initBoard(level) {
  const N_ROW = settings[level].N_ROW;
  const N_COL = settings[level].N_COL;
  let board = new Array(N_ROW);
  for (let i = 0; i < N_ROW; i++) {
    board[i] = Array.from({ length: N_COL }, (_, j) => {
      return { count: 0, isMine: false };
    });
  }
  const mineCoords = placeMine(board, level);
  countMine(board, level);
  return { board, mineCoords };
}
