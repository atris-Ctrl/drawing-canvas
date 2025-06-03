import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { useAudio } from './AudioProvider';

function VolumeSlider() {
  const { volume, handleVolume } = useAudio();

  return (
    <div className="flex w-full items-center space-x-3 rounded bg-gray-100 px-2 py-1">
      <div>
        {volume > 0 ? (
          <FaVolumeUp className="h-6 w-6 text-gray-700" title="Volume On" />
        ) : (
          <FaVolumeMute className="h-6 w-6 text-gray-700" title="Muted" />
        )}
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolume}
        className="w-full accent-blue-600"
        style={{ accentColor: '#2563eb' }} // fallback for accent color
      />
      <span className="w-8 text-right text-xs text-gray-700">{volume}%</span>
    </div>
  );
}

export default VolumeSlider;
