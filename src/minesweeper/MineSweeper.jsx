import { useReducer, useEffect } from 'react';
import Window from '../components/desktop/Window';
import { flagPaths, numberPaths, settings, emojiPaths } from './config';

function initBoard(level) {
  const N_ROW = settings[level].N_ROW;
  const N_COL = settings[level].N_COL;
  let board = new Array(N_ROW);
  for (let i = 0; i < N_ROW; i++) {
    board[i] = Array.from({ length: N_COL }, (_, j) => {
      return { count: 0, isMine: false, isRevealed: false };
    });
  }
  placeMine(board, level);
  countMine(board, level);
  return board;
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
function isWithinBound(row, col, N_ROW, N_COL) {
  if (row < 0 || col < 0 || row >= N_ROW || col >= N_COL) return false;
  return true;
}

function countMine(board, level) {
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

function placeMine(board, level) {
  const { N_ROW, N_COL, N_BOMBS } = settings[level];
  const size = N_ROW * N_COL;
  let order = new Array(size);

  for (let i = 0; i < size; i++) {
    order[i] = i;
  }
  shuffle(order);
  let row, col;
  for (let i = 0; i < N_BOMBS; i++) {
    row = Math.floor(order[i] / N_COL);
    col = order[i] % N_COL;
    board[row][col].isMine = true;
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

const initialState = {
  level: 'beginner',
  board: initBoard('beginner'),
  revealed: new Set(),
  flagged: new Set(),
  settings: {},
  gameState: 'start',
  time: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'REVEAL_CELL':
      const { row, col } = action.payload;
      const { board, revealed, gameState, flagged, level } = state;
      let newGameState = gameState;
      if (gameState === 'start') {
        newGameState = 'running';
      }
      const { N_ROW: numRows, N_COL: numCols } = settings[level];
      const key = `${row},${col}`;
      if (gameState === 'over' || revealed.has(key) || flagged.has(key))
        return state;

      const newRevealed = new Set(revealed);
      const newFlagged = new Set(flagged);
      const visited = new Set();
      const queue = [[row, col]];

      while (queue.length > 0) {
        const [r, c] = queue.shift();
        const key = `${r},${c}`;

        if (
          !isWithinBound(r, c, numRows, numCols) ||
          visited.has(key) ||
          newRevealed.has(key)
        )
          continue;

        const cell = board[r][c];
        newRevealed.add(key);
        if (newFlagged.has(key)) {
          newFlagged.delete(key);
        }
        visited.add(key);

        if (cell.isMine)
          return { ...state, gameState: 'over', revealed: newRevealed };

        if (cell.count === 0 && !cell.isMine) {
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              queue.push([r + dx, c + dy]);
            }
          }
        }
      }

      return {
        ...state,
        revealed: newRevealed,
        gameState: newGameState,
        flagged: newFlagged,
      };

    case 'TOGGLE_FLAG':
      if (state.gameState === 'over') return state;
      const { row: toggleRow, col: toggleCol } = action.payload;
      const toggleKey = `${toggleRow},${toggleCol}`;
      if (state.revealed.has(toggleKey)) return state;
      const newFlaggedFlag = new Set(state.flagged);

      if (newFlaggedFlag.has(toggleKey)) {
        newFlaggedFlag.delete(toggleKey);
      } else {
        newFlaggedFlag.add(toggleKey);
      }

      return { ...state, flagged: newFlaggedFlag };

    case 'RESET_GAME':
      return { ...initialState, board: initBoard(state.level) };

    case 'TICK':
      if (state.gameState === 'running')
        return { ...state, time: state.time + 1 };
      return state;
    case 'CHECK_WIN':
      const totalCells = N_ROW * N_COL;
      const revealedCells = revealed.size;
      const isWin = revealedCells === totalCells - N_BOMBS;
      return { ...state, gameState: isWin ? 'won' : state.gameState };
    default:
      throw new Error('Unknown action');
  }
}
const borderStyle =
  'border-b-2 border-l-2 border-r-2 border-t-2 border-b-[#7a7a7a] border-l-white border-r-[#7a7a7a] border-t-white';

const sunkenBorderStyle =
  'border-b-2 border-l-2 border-r-2 border-t-2 border-b-white border-l-[#7a7a7a] border-r-white border-t-[#7a7a7a]';

function MineSweeper() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { board, level, revealed, flagged, gameState, time } = state;
  const { N_ROW, N_COL, N_BOMBS } = settings[level];
  const fixedArrayRow = Array.from(Array(N_COL).keys());
  const remainingBombs = N_BOMBS - flagged.size;
  return (
    <Window icon="/assets/minesweeper/mine.png" title="Minesweeper">
      <div
        className={`flex flex-col items-center bg-[#c0c0c0] p-2 ${sunkenBorderStyle}`}
      >
        <div
          className={`space-between flex bg-gray-300 px-3 py-1 ${sunkenBorderStyle}`}
        >
          <NumberStyle number={remainingBombs}></NumberStyle>
          <div
            className={borderStyle}
            onClick={() => dispatch({ type: 'RESET_GAME' })}
          >
            <img src={emojiPaths.smile}></img>
          </div>
          <StopWatch gameState={gameState} dispatch={dispatch} time={time} />
        </div>
        <div className="inline-block">
          {fixedArrayRow.map((row) => (
            <Row
              board={board}
              key={row}
              row={row}
              dispatch={dispatch}
              revealed={revealed}
              flagged={flagged}
            />
          ))}
        </div>
      </div>
    </Window>
  );
}

function StopWatch({ gameState, dispatch, time }) {
  useEffect(() => {
    let timer;
    if (gameState !== 'running') return;
    timer = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  return (
    <div>
      <NumberStyle number={time} />
    </div>
  );
}

function Row({ row, revealed, dispatch, board, flagged }) {
  const N_ROW = board.length;
  const fixedArrayCol = Array.from(Array(N_ROW).keys());
  return (
    <div className="flex">
      {fixedArrayCol.map((col) => {
        const key = `${row},${col}`;
        return (
          <Cell
            key={key}
            isRevealed={revealed.has(key)}
            dispatch={dispatch}
            row={row}
            col={col}
            board={board}
            isFlagged={flagged.has(key)}
          />
        );
      })}
    </div>
  );
}

const CellStates = {
  FLAG: 'flag',
  BOMB: 'bomb',
  EMPTY: 'empty',
};

function Cell({ row, col, isRevealed, dispatch, board, isFlagged }) {
  const cell = board[row][col];
  let content;
  if (isFlagged) {
    content = CellStates.FLAG;
  } else if (isRevealed) {
    content = cell.isMine ? CellStates.BOMB : cell.count || CellStates.EMPTY;
  }

  function handleRightClick(e) {
    e.preventDefault();
    dispatch({ type: 'TOGGLE_FLAG', payload: { row, col } });
  }
  function handleClick() {
    dispatch({ type: 'REVEAL_CELL', payload: { row, col } });
  }

  return (
    <div
      onContextMenu={handleRightClick}
      onClick={handleClick}
      className={`flex h-4 w-4 select-none items-center justify-center ${
        isRevealed ? 'border-[1px] border-[#7a7a7a]' : borderStyle
      }`}
    >
      {isRevealed && (
        <img src={flagPaths[content]} alt={content} className="h-3 w-3" />
      )}
      {isFlagged && <img src={flagPaths[content]} alt="flag"></img>}
    </div>
  );
}
function NumberStyle({ number }) {
  let numberStr = String(number).padStart(3, '0');
  return (
    <div className="flex">
      <img src={numberPaths[numberStr[0]]} />
      <img src={numberPaths[numberStr[1]]} />
      <img src={numberPaths[numberStr[2]]} />
    </div>
  );
}
export default MineSweeper;
