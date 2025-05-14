import { useReducer, useEffect } from 'react';
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
  initBoard,
} from './config';
import '../winxp/theme.min.css';

function WindowWithMenu({ dispatch, children }) {
  return (
    <div className="window active inline-block">
      <div className="title-bar w-full">
        <div className="title-bar-text flex w-fit items-center">
          <img src="assets/minesweeper/mine.png" className="h-auto w-4" />
          Minesweeper
        </div>
        <div className="title-bar-buttons flex shrink-0">
          {/* <button data-minimize="" /> */}
          {/* <button data-maximize="" /> */}
          <button data-close="" />
        </div>
      </div>

      <div className="window-body inline-block bg-[#c0c0c0]">
        <ul role="menubar" className="flex w-fit">
          <li
            tabIndex="0"
            aria-haspopup={true}
            className="group relative cursor-pointer"
          >
            <u>G</u>ame
            <ul
              role="menu"
              className="absolute left-0 hidden border border-gray-400 bg-white p-1 group-hover:block group-focus:block"
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
              <li tabIndex="0">
                <a
                  href="https://github.com/atris-Ctrl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </a>
              </li>
            </ul>
          </li>
        </ul>

        <div className="inline-block">{children}</div>
      </div>
    </div>
  );
}

//   close it,

const initialState = {
  level: 'beginner',
  board: [],
  mineCoords: [],
  clickedBombed: {},
  revealed: new Set(),
  flagged: new Set(),
  settings: {},
  gameState: GAME_STATE.START,
  time: 0,
};

function initializeState(level) {
  const { board, mineCoords } = initBoard(level);
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
      const {
        N_ROW: numRows,
        N_COL: numCols,
        N_BOMBS: numBombs,
      } = settings[level];
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
          const clickedBomb = { row: r, col: c };
          revealMineCoords.forEach((coords) => newRevealed.add(coords));
          newFlagged.forEach((coords) => newRevealed.add(coords));

          return {
            ...state,
            gameState: GAME_STATE.LOST,
            revealed: newRevealed,
            clickedBomb,
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
      const isWin = revealedCells === totalCells - numBombs;
      newGameState = isWin ? GAME_STATE.WIN : newGameState;
      return {
        ...state,
        revealed: newRevealed,
        gameState: newGameState,
        flagged: newFlagged,
      };

    case 'TOGGLE_FLAG':
      if (state.gameState !== GAME_STATE.RUNNING) return state;
      const { N_BOMBS } = settings[state.level];
      const { row: toggleRow, col: toggleCol } = action.payload;
      const toggleKey = `${toggleRow},${toggleCol}`;
      if (state.revealed.has(toggleKey)) return state;
      const newFlaggedFlag = new Set(state.flagged);
      if (newFlaggedFlag.has(toggleKey)) {
        newFlaggedFlag.delete(toggleKey);
      } else {
        if (newFlaggedFlag.size < N_BOMBS) newFlaggedFlag.add(toggleKey);
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

const borderStyle = (borderSize = 4) =>
  `border-b-${borderSize} border-l-${borderSize} border-r-${borderSize} border-t-${borderSize} border-b-[#7a7a7a] border-l-white border-r-[#7a7a7a] border-t-white`;

const sunkenBorderStyle = (borderSize = 2) =>
  `border-b-${borderSize} border-l-${borderSize} border-r-${borderSize} border-t-${borderSize} border-b-white border-l-[#7a7a7a] border-r-white border-t-[#7a7a7a]`;

function MineSweeper() {
  const [state, dispatch] = useReducer(reducer, 'beginner', initializeState);
  const { level, flagged, gameState, time, board, revealed, clickedBomb } =
    state;
  const { N_ROW, N_BOMBS } = settings[level];
  const fixedArrayRow = Array.from(Array(N_ROW).keys());
  const remainingBombs = N_BOMBS - flagged.size;

  return (
    <WindowWithMenu dispatch={dispatch}>
      <div
        className={`m-0 inline-flex flex-col gap-2 bg-[#c0c0c0] ${borderStyle()}`}
      >
        <div
          className={`flex justify-between px-1.5 py-1 ${sunkenBorderStyle(2)}`}
        >
          <NumberStyle number={remainingBombs} />
          <EmojiButton gameState={gameState} dispatch={dispatch} />
          <StopWatch gameState={gameState} dispatch={dispatch} time={time} />
        </div>
        <div className={`inline-block ${sunkenBorderStyle(4)}`}>
          {fixedArrayRow.map((row) => (
            <Row
              key={row}
              row={row}
              dispatch={dispatch}
              revealed={revealed}
              flagged={flagged}
              board={board}
              level={level}
              clickedBomb={clickedBomb}
              gameState={gameState}
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
      className={`${borderStyle()} m-1 flex h-7 w-7 items-center justify-center active:bg-[#7a7a7a]`}
      onClick={() => dispatch({ type: 'RESET_GAME' })}
    >
      <img src={emoji} alt="emoji" />
    </div>
  );
}
const Row = function Row({
  row,
  dispatch,
  revealed,
  flagged,
  board,
  level,
  gameState,
  clickedBomb,
}) {
  const { N_COL } = settings[level];
  const fixedArrayCol = Array.from(Array(N_COL).keys());
  return (
    <div className="flex">
      {fixedArrayCol.map((col) => {
        const key = `${row},${col}`;
        return (
          <Cell
            clickedBomb={clickedBomb}
            key={key}
            row={row}
            col={col}
            gameState={gameState}
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

function Cell({
  row,
  col,
  isRevealed,
  dispatch,
  board,
  isFlagged,
  gameState,
  clickedBomb,
}) {
  const cell = board[row][col];
  let baseContent = null;
  let overlayContent = null;
  const isLost = gameState === GAME_STATE.LOST;
  const isClickedBomb =
    isRevealed &&
    cell.isMine &&
    isLost &&
    clickedBomb?.row === row &&
    clickedBomb?.col === col;
  const isMisflag = isFlagged && isRevealed && !cell.isMine && isLost;
  const showFlag = isFlagged && (!isRevealed || (!cell.isMine && isLost));

  if (isRevealed && !isMisflag) {
    baseContent = isClickedBomb
      ? CellStates.BOMBEND
      : cell.isMine
        ? CellStates.BOMB
        : cell.count || CellStates.EMPTY;
  }
  // Overlay content
  if (isMisflag) {
    overlayContent = CellStates.MISFLAG;
  } else if (showFlag) {
    overlayContent = CellStates.FLAG;
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
      disabled={isLost || gameState === GAME_STATE.WIN}
      className={`flex h-5 w-5 select-none items-center justify-center ${
        !isRevealed && !isFlagged && gameState === GAME_STATE.RUNNING
          ? 'active:bg-[#7a7a7a]'
          : ''
      } ${isRevealed ? 'border-[0.5px] border-[#7a7a7a]' : borderStyle(4)}`}
    >
      {overlayContent && (
        <img
          className="left-0 top-0 h-full w-full"
          src={flagPaths[overlayContent]}
          alt="flag"
        ></img>
      )}
      {baseContent && (
        <img
          src={flagPaths[baseContent]}
          alt={baseContent}
          className="h-full w-full"
        />
      )}
    </div>
  );
}

function NumberStyle({ number }) {
  let numberStr = String(number).padStart(3, '0');

  return (
    <div className={`flex ${sunkenBorderStyle()}`}>
      <img
        className="h-8 w-auto"
        src={numberPaths[numberStr[0]]}
        alt={numberStr[0]}
      />
      <img
        className="h-8 w-auto"
        src={numberPaths[numberStr[1]]}
        alt={numberStr[1]}
      />
      <img
        className="h-8 w-auto"
        src={numberPaths[numberStr[2]]}
        alt={numberStr[2]}
      />
    </div>
  );
}

export default MineSweeper;
