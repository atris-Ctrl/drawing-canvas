import { useEffect } from 'react';
import { formatTime, progressPercent } from './config';
import { useAudio } from './AudioProvider';
import ProgressBar from './ProgressBar';
import VolumeSlider from './VolumeSlider';
import PlaybackControls from './PlayBackControls';

function MusicPlayer() {
  const {
    playList,
    initSound,
    animationRef,
    soundRef,
    isPlaying,
    songIndex,
    playSong,
    pauseSong,
  } = useAudio();
  const data = playList[songIndex];

  useEffect(() => {
    const sound = soundRef.current;
    if (!sound) return;
    if (isPlaying) {
      playSong();
    } else {
      pauseSong();
    }
  }, [isPlaying, soundRef]);

  return (
    <div className="h-auto rounded bg-slate-300 p-4">
      <h2 className="mb-2 font-bold">{data.songTitle}</h2>
      <ProgressBar />
      <PlaybackControls />
    </div>
  );
}

export default MusicPlayer;
