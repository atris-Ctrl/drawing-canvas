import { useAudio } from './AudioProvider';
import ProgressBar from './ProgressBar';
import PlaybackControls from './PlayBackControls';

function MusicPlayer() {
  const { playList, songIndex } = useAudio();
  const currentSong = playList?.[songIndex];

  if (!currentSong) {
    return null; // or a loading state
  }

  return (
    <div className="h-auto rounded bg-slate-300 p-4">
      <h2 className="mb-2 font-bold">{currentSong.songTitle}</h2>
      <ProgressBar />
      <PlaybackControls />
    </div>
  );
}

export default MusicPlayer;
