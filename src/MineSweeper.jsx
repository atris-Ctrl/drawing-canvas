import { useReducer, useEffect, useState } from 'react';
import Window from './components/desktop/Window';
import { flagPaths, numberPaths } from './minesweeper/config';

const settings = {
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

const { N_ROW, N_COL, N_BOMBS } = settings['beginner'];
const fixedArrayRow = Array.from(Array(N_COL).keys());
const fixedArrayCol = Array.from(Array(N_ROW).keys());
var board;
initBoard();
function initBoard() {
  board = new Array(N_ROW);
  for (let i = 0; i < N_ROW; i++) {
    board[i] = Array.from({ length: N_COL }, (_, j) => {
      return { count: 0, isMine: false, isReavealed: false };
    });
  }
  placeMine();
  countMine();
}
function isMine(row, col) {
  if (!isWithinBound(row, col)) return false;
  if (board[row][col].isMine) {
    return true;
  }
  return false;
}
function isWithinBound(row, col) {
  if (row < 0 || col < 0 || row >= N_ROW || col >= N_COL) return false;
  return true;
}

function countMine() {
  for (let i = 0; i < N_ROW; i++) {
    for (let j = 0; j < N_COL; j++) {
      const count =
        isMine(i - 1, j - 1) +
        isMine(i - 1, j) +
        isMine(i - 1, j + 1) +
        isMine(i, j - 1) +
        isMine(i, j + 1) +
        isMine(i + 1, j - 1) +
        isMine(i + 1, j) +
        isMine(i + 1, j + 1);
      board[i][j].count = count;
    }
  }
}

function placeMine() {
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

function MineSweeper() {
  const [level, setLevel] = useState('beginner');
  const [revealedBoard, isSetRevealed] = useState(
    Array.from({ length: N_ROW }, () => Array(N_COL).fill(false)),
  );

  const [gameState, setGameState] = useState('running');

  function reset() {
    initBoard();
    isSetRevealed(
      Array.from({ length: N_ROW }, () => Array(N_COL).fill(false)),
    );
  }

  function handleRevealed(i, j, visited = new Set()) {
    if (!isWithinBound(i, j)) return;

    const cell = board[i][j];
    const key = `${i},${j}`;
    if (revealedBoard[i][j] || visited.has(key)) {
      return;
    }
    visited.add(key);
    isSetRevealed((prevBoard) => {
      const newBoard = prevBoard.map((row) => [...row]);
      newBoard[i][j] = true;
      return newBoard;
    });
    if (cell.isMine) {
      setGameState('over');
      //   reset();
    } else if (cell.count === 0) {
      handleRevealed(i - 1, j - 1, visited);
      handleRevealed(i - 1, j, visited);
      handleRevealed(i - 1, j + 1, visited);
      handleRevealed(i, j - 1, visited);
      handleRevealed(i, j + 1, visited);
      handleRevealed(i + 1, j, visited);
      handleRevealed(i + 1, j - 1, visited);
      handleRevealed(i + 1, j + 1, visited);
    }
  }

  return (
    <Window icon="/assets/minesweeper/mine.png" title="Minesweeper">
      <div className="flex flex-col items-center bg-[#c0c0c0] p-2">
        <div className="space-between flex">
          <NumberStyle number={N_BOMBS}></NumberStyle>
          <div>[:)]</div>
          <StopWatch gameState={gameState} />
        </div>
        <div className="inline-block">
          {fixedArrayRow.map((row) => (
            <Row
              key={row}
              row={row}
              rowRevealed={revealedBoard[row]}
              setRevealed={handleRevealed}
            />
          ))}
        </div>
      </div>
    </Window>
  );
}

function StopWatch({ gameState }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timer;
    if (gameState === 'idle') {
      setTime(0);
    } else if (gameState === 'running') {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (gameState === 'over') {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  return (
    <div>
      <NumberStyle number={time} />
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

function Row({ row, rowRevealed, setRevealed }) {
  return (
    <div className="flex">
      {fixedArrayCol.map((col) => (
        <Cell
          key={`${row},${col}`}
          isRevealed={rowRevealed[col]}
          setRevealed={setRevealed}
          row={row}
          col={col}
        />
      ))}
    </div>
  );
}

function Cell({ row, col, isRevealed, setRevealed }) {
  const cell = board[row][col];
  const content = cell.isMine ? 'bomb' : cell.count || 'empty';

  function handleClick(i, j) {
    setRevealed(i, j);
  }

  return (
    <div
      onClick={() => handleClick(row, col)}
      className={`flex h-4 w-4 select-none items-center justify-center ${
        isRevealed
          ? 'border-[1px] border-[#7a7a7a]'
          : 'border-b-2 border-l-2 border-r-2 border-t-2 border-b-[#7a7a7a] border-l-white border-r-[#7a7a7a] border-t-white bg-gray-300'
      } `}
    >
      {isRevealed && (
        <img src={flagPaths[content]} alt={content} className="h-3 w-3" />
      )}
    </div>
  );
}

export default MineSweeper;
