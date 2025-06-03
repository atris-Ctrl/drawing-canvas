import {
  FaPlay,
  FaPause,
  FaStop,
  FaBackward,
  FaForward,
  FaUndo,
  FaSyncAlt,
  FaVolumeUp,
  FaVolumeMute,
  FaStepBackward,
  FaStepForward,
} from 'react-icons/fa';
import { useAudio } from './AudioProvider';
import VolumeSlider from './VolumeSlider';

function PlaybackControls() {
  const {
    isPlaying,
    setIsPlaying,
    handleStop,
    handleFastSkip,
    handleSkipSong,
    setIsAutoPlay,
    setIsLoop,
    isLoop,
    isAutoPlay,
    volume,
  } = useAudio();

  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
      <button onClick={() => handleSkipSong(-1)} title="Previous">
        <FaStepBackward className="h-6 w-6 text-gray-700" />
      </button>

      <button onClick={() => handleFastSkip(-5)} title="-5 seconds">
        <FaBackward className="h-6 w-6 text-gray-700" />
      </button>

      <button
        onClick={() => setIsPlaying((prev) => !prev)}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <FaPause className="h-8 w-8 text-blue-700" />
        ) : (
          <FaPlay className="h-8 w-8 text-blue-700" />
        )}
      </button>

      <button onClick={handleStop} title="Stop">
        <FaStop className="h-6 w-6 text-red-500" />
      </button>

      <button onClick={() => handleFastSkip(5)} title="+5 seconds">
        <FaForward className="h-6 w-6 text-gray-700" />
      </button>

      <button onClick={() => handleSkipSong(1)} title="Next">
        <FaStepForward className="h-6 w-6 text-gray-700" />
      </button>

      <button onClick={() => setIsAutoPlay((prev) => !prev)} title="AutoPlay">
        <FaSyncAlt
          className={`h-6 w-6 ${isAutoPlay ? 'text-green-600' : 'text-gray-500'}`}
        />
      </button>

      <button onClick={() => setIsLoop((prev) => !prev)} title="Loop">
        <FaUndo
          className={`h-5 w-5 ${isLoop ? 'text-green-600' : 'text-gray-500'}`}
        />
      </button>

      <VolumeSlider />
    </div>
  );
}

export default PlaybackControls;
