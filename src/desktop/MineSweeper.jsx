import { useReducer, useEffect, useState } from 'react';
import {
  flagPaths,
  numberPaths,
  settings,
  emojiPaths,
  isWithinBound,
  CellStates,
  GAME_STATE,
  initBoard,
} from '../minesweeper/config';
import '../winxp/theme.min.css';
import WindowWithMenu from '../minesweeper/WindowWithMenu';
import { FaGithubAlt } from 'react-icons/fa';

const borderStyle = `border-b-4 border-l-4 border-r-4 border-t-4 border-b-[#7a7a7a] border-l-white border-r-[#7a7a7a] border-t-white`;

const sunkenBorderStyle2 =
  'border-b-2 border-l-2 border-r-2 border-t-2 border-b-white border-l-[#7a7a7a] border-r-white border-t-[#7a7a7a]';

const sunkenBorderStyle4 = `border-b-4 border-l-4 border-r-4 border-t-4 border-b-white border-l-[#7a7a7a] border-r-white border-t-[#7a7a7a]`;

// * State Properties:
// * - `board` {Array<Array<Object>>} - The Minesweeper board containing cell data.
// * - `revealed` {Set<string>} - A set of keys representing revealed cells.
// * - `flagged` {Set<string>} - A set of keys representing flagged cells.
// * - `gameState` {string} - The current state of the game (`RUNNING`, `WIN`, `LOST`, etc.).
// * - `level` {string} - The current difficulty level.
// * - `mineCoords` {Array<string>} - The coordinates of all mines on the board.
// * - `time` {number} - The elapsed time in seconds.
// *
const initialState = {
  level: 'beginner',
  board: [],
  mineCoords: [],
  clickedBombed: {},
  revealed: new Set(),
  flagged: new Set(),
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
/**
 * Reducer function to manage the state of the Minesweeper game.
 *
 * Action Types:
 * - `'REVEAL_CELL'`: Reveals a cell on the board. If the cell contains a mine, the game is lost.
 *   - `action.payload.row` {number} - The row index of the cell to reveal.
 *   - `action.payload.col` {number} - The column index of the cell to reveal.
 *
 * - `'TOGGLE_FLAG'`: Toggles a flag on a cell to mark it as a suspected mine.
 *   - `action.payload.row` {number} - The row index of the cell to flag/unflag.
 *   - `action.payload.col` {number} - The column index of the cell to flag/unflag.
 *
 * - `'RESET_GAME'`: Resets the game to its initial state for the current difficulty level.
 *
 * - `'CHANGE_LEVEL'`: Changes the difficulty level and resets the game.
 *   - `action.payload` {string} - The new difficulty level.
 *
 * - `'TICK'`: Increments the game timer by one second if the game is running.
 * @throws {Error} If an unknown action type is provided.
 */
function reducer(state, action) {
  switch (action.type) {
    case 'REVEAL_CELL': {
      const { row, col } = action.payload;
      const { board, revealed, gameState, flagged, level, mineCoords } = state;

      if (gameState !== GAME_STATE.RUNNING && gameState !== GAME_STATE.START) {
        return state;
      }

      const key = `${row},${col}`;
      if (revealed.has(key) || flagged.has(key)) return state;

      const newRevealed = new Set(revealed);
      const newFlagged = new Set(flagged);
      const visited = new Set();
      const queue = [[row, col]];

      while (queue.length > 0) {
        const [r, c] = queue.pop();
        const cellKey = `${r},${c}`;

        if (
          !isWithinBound(r, c, settings[level].N_ROW, settings[level].N_COL) ||
          visited.has(cellKey) ||
          newRevealed.has(cellKey)
        )
          continue;

        const cell = board[r][c];
        newRevealed.add(cellKey);
        if (newFlagged.has(cellKey)) newFlagged.delete(cellKey);
        visited.add(cellKey);

        if (cell.isMine) {
          mineCoords.forEach((coords) => newRevealed.add(coords));
          return {
            ...state,
            gameState: GAME_STATE.LOST,
            revealed: newRevealed,
            clickedBomb: { row: r, col: c },
          };
        }

        if (cell.count === 0) {
          for (let dx = -1; dx <= 1; dx++)
            for (let dy = -1; dy <= 1; dy++) queue.push([r + dx, c + dy]);
        }
      }

      const totalCells = settings[level].N_ROW * settings[level].N_COL;
      const revealedCells = newRevealed.size;
      const isWin = revealedCells === totalCells - settings[level].N_BOMBS;

      return {
        ...state,
        revealed: newRevealed,
        gameState: isWin ? GAME_STATE.WIN : GAME_STATE.RUNNING,
        flagged: newFlagged,
      };
    }

    case 'TOGGLE_FLAG': {
      if (state.gameState !== GAME_STATE.RUNNING) return state;

      const { row, col } = action.payload;
      const key = `${row},${col}`;
      if (state.revealed.has(key)) return state;

      const newFlagged = new Set(state.flagged);
      if (newFlagged.has(key)) newFlagged.delete(key);
      else if (newFlagged.size < settings[state.level].N_BOMBS)
        newFlagged.add(key);

      return { ...state, flagged: newFlagged };
    }

    case 'RESET_GAME':
      return initializeState(state.level);

    case 'CHANGE_LEVEL':
      return initializeState(action.payload);

    case 'TICK':
      if (state.gameState === GAME_STATE.RUNNING)
        return { ...state, time: state.time + 1 };
      return state;

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

function MineSweeper() {
  const [state, dispatch] = useReducer(reducer, 'beginner', initializeState);
  const [onPress, setOnPress] = useState(false);
  const { level, flagged, gameState, time } = state;
  const { N_ROW, N_BOMBS } = settings[level];
  const fixedArrayRow = Array.from(Array(N_ROW).keys());
  const remainingBombs = N_BOMBS - flagged.size;
  const menuItems = [
    {
      label: 'Game',
      underline: 'G',
      items: [
        {
          label: 'Beginner',
          action: () => dispatch({ type: 'CHANGE_LEVEL', payload: 'beginner' }),
        },
        {
          label: 'Intermediate',
          action: () =>
            dispatch({ type: 'CHANGE_LEVEL', payload: 'intermediate' }),
        },
        {
          label: 'Expert',
          action: () => dispatch({ type: 'CHANGE_LEVEL', payload: 'expert' }),
        },
      ],
    },
    {
      label: 'Help',
      underline: 'H',
      items: [
        {
          label: (
            <span className="flex items-center gap-1">
              Github <FaGithubAlt />
            </span>
          ),
          href: 'https://github.com/atris-Ctrl',
        },
      ],
    },
  ];
  return (
    <WindowWithMenu
      menuItems={menuItems}
      title="Mine Sweeper"
      icon="assets/minesweeper/mine.png"
    >
      <div
        className={`m-0 inline-flex flex-col gap-2 bg-[#c0c0c0] ${borderStyle}`}
      >
        <div
          className={`flex justify-between px-1.5 py-1 ${sunkenBorderStyle2}`}
        >
          <NumberStyle number={remainingBombs} />
          <EmojiButton
            gameState={gameState}
            dispatch={dispatch}
            onPress={onPress}
          />
          <StopWatch gameState={gameState} dispatch={dispatch} time={time} />
        </div>
        <div className={`inline-block ${sunkenBorderStyle4}`}>
          {fixedArrayRow.map((row) => (
            <Row
              key={row}
              row={row}
              dispatch={dispatch}
              boardState={state}
              setOnPress={setOnPress}
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

function EmojiButton({ gameState, dispatch, onPress }) {
  let emoji = (() => {
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
  if (onPress) {
    emoji = emojiPaths.ohh;
  }

  return (
    <div
      className={`${borderStyle} m-1 flex h-7 w-7 items-center justify-center active:bg-[#7a7a7a]`}
      onClick={() => dispatch({ type: 'RESET_GAME' })}
    >
      <img src={emoji} alt="emoji" />
    </div>
  );
}
const Row = function Row({ row, dispatch, boardState, setOnPress }) {
  const { revealed, flagged, board, level, gameState, clickedBomb } =
    boardState;
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
            setOnPress={setOnPress}
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
  setOnPress,
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
      onMouseDown={() => setOnPress(true)}
      onMouseUp={() => setOnPress(false)}
      className={`flex h-5 w-5 select-none items-center justify-center ${
        !isRevealed && !isFlagged && gameState === GAME_STATE.RUNNING
          ? 'active:bg-[#7a7a7a]'
          : ''
      } ${isRevealed ? 'border-[0.5px] border-[#7a7a7a]' : borderStyle}`}
    >
      {overlayContent && (
        <img
          className="left-0 top-0 m-0 h-full w-full"
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
    <div className={`flex ${sunkenBorderStyle2}`}>
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
