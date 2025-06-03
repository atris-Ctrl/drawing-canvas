import { useAudio } from './AudioProvider';
import ProgressBar from './ProgressBar';
import PlaybackControls from './PlayBackControls';

function MusicPlayer() {
  const { playList, songIndex } = useAudio();
  const data = playList[songIndex];

  return (
    <div className="h-auto rounded bg-slate-300 p-4">
      <h2 className="mb-2 font-bold">{data.songTitle}</h2>
      <ProgressBar />
      <PlaybackControls />
    </div>
  );
}

export default MusicPlayer;
