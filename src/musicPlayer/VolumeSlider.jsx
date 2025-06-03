import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { useAudio } from './AudioProvider';

function VolumeSlider() {
  const { volume, handleVolume } = useAudio();

  return (
    <>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolume}
        className="w-full"
      />
      <div className="mb-2">
        <span className="text-sm">{volume}%</span>
        {volume > 0 ? (
          <FaVolumeUp className="h-5 w-5 text-gray-700" title="Volume On" />
        ) : (
          <FaVolumeMute className="h-5 w-5 text-gray-700" title="Muted" />
        )}
      </div>
    </>
  );
}

export default VolumeSlider;
