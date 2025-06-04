import {
  FaPlay,
  FaPause,
  FaStop,
  FaBackward,
  FaForward,
  FaUndo,
  FaSyncAlt,
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
    handleNextSong,
    handlePrevSong,
    toggleAutoPlay,
    handleLoop,
    isLoop,
    isAutoPlay,
    volume,
  } = useAudio();

  // Helper for keyboard accessibility
  const handleKeyDown = (callback) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  return (
    <div className="mx-auto mt-6 flex w-fit items-center rounded-lg border border-gray-300 bg-gray-100 px-6 py-3 shadow-lg">
      <div
        onClick={handlePrevSong}
        onKeyDown={handleKeyDown(handlePrevSong)}
        role="button"
        tabIndex={0}
        title="Previous"
        className="mx-1 flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-blue-100"
        style={{ width: 40, height: 40 }}
      >
        <FaStepBackward className="h-6 w-6 text-gray-700" />
      </div>

      <div
        onClick={() => setIsPlaying((prev) => !prev)}
        onKeyDown={handleKeyDown(() => setIsPlaying((prev) => !prev))}
        role="button"
        tabIndex={0}
        title={isPlaying ? 'Pause' : 'Play'}
        className="mx-2 flex cursor-pointer items-center justify-center rounded-full bg-white p-3 shadow hover:bg-blue-200"
        style={{ width: 56, height: 56, boxShadow: '0 2px 8px #b0b0b0' }}
      >
        {isPlaying ? (
          <FaPause className="h-8 w-8" />
        ) : (
          <FaPlay className="h-8 w-8" />
        )}
      </div>

      <div
        onClick={handleStop}
        onKeyDown={handleKeyDown(handleStop)}
        role="button"
        tabIndex={0}
        title="Stop"
        className="mx-1 flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-blue-100"
        style={{ width: 40, height: 40 }}
      >
        <FaStop className="h-6 w-6" />
      </div>

      <div
        onClick={handleNextSong}
        onKeyDown={handleKeyDown(handleNextSong)}
        role="button"
        tabIndex={0}
        title="Next"
        className="mx-1 flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-blue-100"
        style={{ width: 40, height: 40 }}
      >
        <FaStepForward className="h-6 w-6 text-gray-700" />
      </div>

      <div
        onClick={toggleAutoPlay}
        onKeyDown={handleKeyDown(toggleAutoPlay)}
        role="button"
        tabIndex={0}
        title={isAutoPlay ? "Disable Autoplay" : "Enable Autoplay"}
        className="mx-1 flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-blue-100"
        style={{ width: 40, height: 40 }}
      >
        <FaSyncAlt
          className={`h-6 w-6 ${isAutoPlay ? 'text-green-600' : 'text-gray-500'}`}
        />
      </div>

      <div
        onClick={handleLoop}
        onKeyDown={handleKeyDown(handleLoop)}
        role="button"
        tabIndex={0}
        title={isLoop ? "Disable Loop" : "Enable Loop"}
        className="mx-1 flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-blue-100"
        style={{ width: 40, height: 40 }}
      >
        <FaUndo
          className={`h-5 w-5 ${isLoop ? 'text-green-600' : 'text-gray-500'}`}
        />
      </div>

      <div className="ml-4 flex items-center">
        <VolumeSlider />
      </div>
    </div>
  );
}

export default PlaybackControls;
