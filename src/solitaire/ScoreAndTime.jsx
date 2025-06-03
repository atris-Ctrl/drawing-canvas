import Modal from '../ui/Modal';
import CardBackSelectionWindow from './CardSelection';
import { isWinnable } from './config';
import StopWatch from './StopWatch';
function ScoreAndTime({ score, dispatch, gameState, cardBack }) {
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
        <Modal.Open opens="settings">
          <button>Open deck</button>
        </Modal.Open>
        <div className="absolute left-1/2 top-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2 transform">
          <Modal.Window name="settings" title="Card Selection">
            <CardBackSelectionWindow dispatch={dispatch} cardBack={cardBack} />
          </Modal.Window>
        </div>
      </div>
    </div>
  );
}

export default ScoreAndTime;
