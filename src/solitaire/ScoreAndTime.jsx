import { createDealAction, createResetAction } from './config';
import StopWatch from './StopWatch';

function ScoreAndTime({ score, time, dispatch, gameState }) {
  return (
    <div className="mt-8 flex">
      <div>Score: {score} &nbsp;&nbsp;</div>
      <StopWatch time={time} dispatch={dispatch} gameState={gameState} />
      <button onClick={() => dispatch(createResetAction())}>Reset</button>
      <button onClick={() => dispatch(createDealAction(1))}>DRAW ONE</button>
      <button onClick={() => dispatch(createDealAction(3))}>DRAW THREE</button>
    </div>
  );
}

export default ScoreAndTime;
