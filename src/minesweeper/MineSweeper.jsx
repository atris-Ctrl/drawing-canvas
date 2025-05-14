import { useReducer, useEffect, memo } from 'react';
import {
  flagPaths,
  numberPaths,
  settings,
  emojiPaths,
  isWithinBound,
  countMine,
  placeMine,
  CellStates,
  GAME_STATE,
} from './config';
import '../winxp/theme.min.css';

function initBoard(level) {
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
function WindowWithMenu({ dispatch, children }) {
  return (
    <div className="window active">
      <div className="title-bar">
        <div className="title-bar-text">Minesweeper</div>
        <div className="title-bar-buttons">
          <button data-minimize="" />
          <button data-maximize="" />
          <button data-close="" />
        </div>
      </div>
      <div className="windowXP-body">
        <ul role="menubar" className="flex">
          <li
            tabIndex="0"
            aria-haspopup={true}
            className="group relative cursor-pointer"
          >
            <u>S</u>ettings
            <ul
              role="menu"
              className="absolute left-0 top-full hidden border border-gray-400 bg-white p-1 group-hover:block group-focus:block"
            >
              <li
                tabIndex="0"
                onClick={() =>
                  dispatch({ type: 'CHANGE_LEVEL', payload: 'beginner' })
                }
              >
                Beginner
              </li>
              <li
                tabIndex="0"
                onClick={() =>
                  dispatch({ type: 'CHANGE_LEVEL', payload: 'intermediate' })
                }
              >
                Intermediate
              </li>
              <li
                tabIndex="0"
                onClick={() =>
                  dispatch({ type: 'CHANGE_LEVEL', payload: 'expert' })
                }
              >
                Expert
              </li>
            </ul>
          </li>
          <li
            tabIndex="0"
            aria-haspopup={true}
            className="group relative cursor-pointer"
          >
            <u>H</u>elp
            <ul
              role="menu"
              className="absolute left-0 top-full hidden border border-gray-400 bg-white p-1 group-hover:block group-focus:block"
            >
              <li tabIndex="0">Github</li>
            </ul>
          </li>
        </ul>

        <div>{children}</div>
      </div>
    </div>
  );
}
// game state name , ui row. link github, close it,  fix windowXP, add bomb images, cross if wrong flag added, fix cell ui

const initialState = {
  level: 'beginner',
  board: [],
  mineCoords: [],
  revealed: new Set(),
  flagged: new Set(),
  settings: {},
  gameState: GAME_STATE.START,
  time: 0,
};

function initializeState(level) {
  const { board, mineCoords } = initBoard(level);
  console.log('called INIT STATE');
  return {
    ...initialState,
    level,
    board,
    mineCoords,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'REVEAL_CELL':
      const { row, col } = action.payload;
      const {
        board,
        revealed,
        gameState,
        flagged,
        level,
        mineCoords: revealMineCoords,
      } = state;
      let newGameState = gameState;
      if (gameState === GAME_STATE.START) {
        newGameState = GAME_STATE.RUNNING;
      }
      const { N_ROW: numRows, N_COL: numCols, N_BOMBS } = settings[level];
      const key = `${row},${col}`;
      if (
        newGameState !== GAME_STATE.RUNNING ||
        revealed.has(key) ||
        flagged.has(key)
      )
        return state;

      const newRevealed = new Set(revealed);
      const newFlagged = new Set(flagged);
      const visited = new Set();
      const queue = [[row, col]];

      while (queue.length > 0) {
        const [r, c] = queue.pop();
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

        if (cell.isMine) {
          revealMineCoords.forEach((coords) => newRevealed.add(coords));
          return {
            ...state,
            gameState: GAME_STATE.LOST,
            revealed: newRevealed,
          };
        }
        if (cell.count === 0 && !cell.isMine) {
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              queue.push([r + dx, c + dy]);
            }
          }
        }
      }

      const totalCells = numRows * numCols;
      const revealedCells = newRevealed.size;
      const isWin = revealedCells === totalCells - N_BOMBS;
      newGameState = isWin ? GAME_STATE.WIN : newGameState;
      return {
        ...state,
        revealed: newRevealed,
        gameState: newGameState,
        flagged: newFlagged,
      };

    case 'TOGGLE_FLAG':
      if (state.gameState !== GAME_STATE.RUNNING) return state;
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
      const currentLevel = state.level;
      return { ...initializeState(currentLevel) };

    case 'CHANGE_LEVEL':
      const newLevel = action.payload;
      return { ...initializeState(newLevel) };
    case 'TICK':
      if (state.gameState === GAME_STATE.RUNNING)
        return { ...state, time: state.time + 1 };
      return state;

    default:
      throw new Error('Unknown action');
  }
}

const borderStyle =
  'border-b-4 border-l-4 border-r-4 border-t-4 border-b-[#7a7a7a] border-l-white border-r-[#7a7a7a] border-t-white';

const sunkenBorderStyle =
  'border-b-2 border-l-2 border-r-2 border-t-2 border-b-white border-l-[#7a7a7a] border-r-white border-t-[#7a7a7a]';

function MineSweeper() {
  const [state, dispatch] = useReducer(reducer, 'beginner', initializeState);
  const { level, flagged, gameState, time, board, revealed } = state;
  const { N_ROW, N_BOMBS } = settings[level];
  const fixedArrayRow = Array.from(Array(N_ROW).keys());
  const remainingBombs = N_BOMBS - flagged.size;

  return (
    <WindowWithMenu dispatch={dispatch}>
      <div
        className={`m-0 flex flex-col items-center gap-2 bg-[#c0c0c0] ${borderStyle}`}
      >
        <div className={`flex w-full ${sunkenBorderStyle}`}>
          <NumberStyle number={remainingBombs} />
          <EmojiButton gameState={gameState} dispatch={dispatch} />
          <StopWatch gameState={gameState} dispatch={dispatch} time={time} />
        </div>
        <div className={`inline-block w-full ${sunkenBorderStyle}`}>
          {fixedArrayRow.map((row) => (
            <Row
              key={row}
              row={row}
              dispatch={dispatch}
              revealed={revealed}
              flagged={flagged}
              board={board}
              level={level}
            />
          ))}
        </div>
      </div>
    </WindowWithMenu>
  );
}

function StopWatch({ gameState, dispatch, time }) {
  useEffect(() => {
    let timer;
    if (gameState === GAME_STATE.RUNNING)
      timer = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  return <NumberStyle number={time} />;
}

function EmojiButton({ gameState, dispatch }) {
  const emoji = (() => {
    switch (gameState) {
      case GAME_STATE.RUNNING:
        return emojiPaths.smile;
      case GAME_STATE.LOST:
        return emojiPaths.dead;
      case GAME_STATE.WIN:
        return emojiPaths.win;
      case '?':
        return emojiPaths.ohh;
      default:
        return emojiPaths.smile;
    }
  })();

  return (
    <div
      className={`${borderStyle} m-1 flex h-7 w-7 items-center justify-center active:bg-[#7a7a7a]`}
      onClick={() => dispatch({ type: 'RESET_GAME' })}
    >
      <img src={emoji} alt="emoji" />
    </div>
  );
}
const Row = function Row({ row, dispatch, revealed, flagged, board, level }) {
  const { N_COL } = settings[level];
  const fixedArrayCol = Array.from(Array(N_COL).keys());
  return (
    <div className="flex">
      {fixedArrayCol.map((col) => {
        const key = `${row},${col}`;
        return (
          <Cell
            key={key}
            row={row}
            col={col}
            isRevealed={revealed.has(key)}
            isFlagged={flagged.has(key)}
            dispatch={dispatch}
            board={board}
          />
        );
      })}
    </div>
  );
};

const Cell = function Cell({
  row,
  col,
  isRevealed,
  dispatch,
  board,
  isFlagged,
}) {
  const cell = board[row][col];
  let content;
  if (isFlagged) {
    if (isRevealed && !cell.isMine && gameState === 'over') {
      content = CellStates.WRONG_FLAG;
    } else {
      content = CellStates.FLAG;
    }
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
      className={`flex h-5 w-5 select-none items-center justify-center active:bg-[#7a7a7a] ${
        isRevealed ? 'border-[1px] border-[#7a7a7a]' : borderStyle
      }`}
    >
      {isRevealed && (
        <img src={flagPaths[content]} alt={content} className="h-4 w-4" />
      )}
      {isFlagged && <img src={flagPaths[content]} alt="flag"></img>}
    </div>
  );
};
function NumberStyle({ number }) {
  let numberStr = String(number).padStart(3, '0');
  return (
    <div className={`flex ${sunkenBorderStyle}`}>
      <img src={numberPaths[numberStr[0]]} />
      <img src={numberPaths[numberStr[1]]} />
      <img src={numberPaths[numberStr[2]]} />
    </div>
  );
}
export default MineSweeper;
