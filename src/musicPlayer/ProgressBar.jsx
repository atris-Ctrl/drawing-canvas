import { useAudio } from './AudioProvider';
import { formatTime, progressPercent } from './config';

function ProgressBar() {
  const {
    progress,
    duration,
    progressRef,
    handleProgressBar,
    handleDragStart,
    handleDragEnd,
  } = useAudio();

  const percent = progressPercent(progress, duration);

  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between font-mono text-sm text-gray-700">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="relative h-3 w-full">
        <div className="absolute left-2 top-0 z-0 h-2 w-full overflow-hidden rounded-full bg-gray-300">
          <div
            className="h-full bg-green-500"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        <input
          ref={progressRef}
          type="range"
          min="0"
          max="100"
          value={percent}
          onChange={handleProgressBar}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
          className="absolute left-0 top-0 z-10 h-3 w-full cursor-pointer appearance-none bg-transparent"
          style={{
            height: '12px',
          }}
        />
      </div>

      <style jsx>{`
        input[type='range'] {
          height: 12px;
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          margin-top: -2px;
          transition: transform 0.1s ease-in-out;
          transform: scale(1.2);
        }
        input[type='range']::-webkit-slider-runnable-track {
          height: 12px;
          border-radius: 9999px;
          background: transparent;
        }
        input[type='range']::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border: none;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          transform: scale(1.2);
        }
        input[type='range']::-moz-range-track {
          height: 12px;
          border-radius: 9999px;
          background: transparent;
        }
        input[type='range']::-ms-fill-lower,
        input[type='range']::-ms-fill-upper {
          height: 12px;
          border-radius: 9999px;
          background: transparent;
        }
        input[type='range']::-ms-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}

export default ProgressBar;
