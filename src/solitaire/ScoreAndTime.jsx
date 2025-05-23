import { createDealAction, createResetAction, isWinnable } from './config';
import StopWatch from './StopWatch';

function ScoreAndTime({ score, dispatch, gameState }) {
  return (
    <div className="mt-8 flex">
      <div>Score: {score} &nbsp;&nbsp;</div>

      <button onClick={() => dispatch(createResetAction())}>Reset</button>
      <button onClick={() => dispatch(createDealAction(1))}>DRAW ONE</button>
      <button onClick={() => dispatch(createDealAction(3))}>DRAW THREE</button>
      <button>Undo</button>
      <button onClick={() => console.log(isWinnable(state))}>
        Check Winnability
      </button>
    </div>
  );
}

export default ScoreAndTime;
