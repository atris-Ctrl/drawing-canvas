import { memo, useEffect, useState } from 'react';
import { ACTIONS, GAME_STATE } from './config';

function formatTime(seconds) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

function StopWatch({ gameState }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timer;
    if (gameState === GAME_STATE.RUNNING) {
      timer = setInterval(() => setTime((prevTime) => prevTime + 1), 1000);
    } else if (gameState === GAME_STATE.IDLE) {
      setTime(0);
    }

    return () => clearInterval(timer);
  }, [gameState]);

  return <div>Time : {formatTime(time)}</div>;
}

export default memo(StopWatch);
