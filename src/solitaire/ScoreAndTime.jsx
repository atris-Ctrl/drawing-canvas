import { isWinnable } from './config';
import StopWatch from './StopWatch';
function ScoreAndTime({ score, dispatch, gameState }) {
  return (
    <div className="flex w-full items-center justify-between bg-[#ece9d8] px-2 py-1 font-extrabold text-black">
      <div className="flex-1"></div>
      <div className="flex items-center space-x-4">
        <div className="text-right">Score: {score}</div>
        <StopWatch gameState={gameState} />
        <button
          onClick={() => dispatch({ type: 'UNDO' })}
          className="border bg-gray-200 px-2 py-1 hover:bg-gray-300"
        >
          Undo
        </button>
        <button
          onClick={() => console.log(isWinnable(gameState))}
          className="border bg-gray-200 px-2 py-1 hover:bg-gray-300"
        >
          Check Winnability
        </button>
      </div>
    </div>
  );
}

export default ScoreAndTime;
