const flagPath = 'assets/minesweeper/flag';
const emojiPath = 'assets/minesweeper/emoji';
const numberPath = 'assets/minesweeper/number';
export const settings = {
  beginner: {
    N_ROW: 8,
    N_COL: 8,
    N_BOMBS: 10,
  },
  intermediate: {
    N_ROW: 9,
    N_COL: 9,
    N_BOMBS: 40,
  },
  expert: {
    N_ROW: 30,
    N_COL: 16,
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
};
