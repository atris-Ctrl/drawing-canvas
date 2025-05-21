import { useEffect } from 'react';
import { ACTIONS, GAME_STATE } from './config';

function formatTime(seconds) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

function StopWatch({ gameState, dispatch, time }) {
  useEffect(() => {
    let timer;
    if (gameState === GAME_STATE.RUNNING)
      timer = setInterval(() => dispatch({ type: ACTIONS.TICK }), 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  return <div>Time : {formatTime(time)}</div>;
}

export default StopWatch;
