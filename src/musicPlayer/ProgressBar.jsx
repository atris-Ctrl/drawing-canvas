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
      {/* Time Info */}
      <div className="mb-1 flex justify-between font-mono text-sm text-gray-700">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Unified progress bar */}
      <div className="relative h-3 w-full">
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
        />

        <div className="absolute left-0 top-0 z-0 h-3 w-full overflow-hidden rounded-full bg-gray-300">
          <div
            className="h-full bg-blue-600"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>

      {/* Thumb styling */}
      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: white;
          border: 2px solid #3b82f6;
          cursor: pointer;
          margin-top: -6.5px;
          transition: transform 0.1s ease-in-out;
          transform: scale(1.2);
        }

        input[type='range']::-moz-range-thumb {
          height: 16px;
          width: 16px;
          background: white;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default ProgressBar;
