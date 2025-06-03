import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { jumpSong, musicPath } from './config';
import { Howl } from 'howler';
const AudioContext = createContext();

function AudioProvider({ children }) {
  const animationRef = useRef(null);
  const progressRef = useRef(null);
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [songIndex, setSongIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const playList = [
    {
      songTitle: 'Proi Proi',
      file: 'test1.mp3',
      howl: null,
    },
    {
      songTitle: 'Eva',
      file: 'test.mp3',
      howl: null,
    },
    {
      songTitle: 'WildFire',
      file: 'test2.mp3',
      howl: null,
    },
  ];
  function playSong() {
    soundRef.current.play();
    cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(animateProgress);
  }

  function pauseSong() {
    soundRef.current.pause();
    cancelAnimationFrame(animationRef.current);
  }
  function stopSong() {
    soundRef.current.stop();
    cancelAnimationFrame(animationRef.current);
    setIsPlaying(false);
    setProgress(0);
    setIsDragging(false);
  }

  const initSound = (index) => {
    const musicFile = playList[index];
    soundRef.current = new Howl({
      src: `${musicPath}/${musicFile.file}`,
      autoplay: isAutoPlay,
      loop: isLoop,
      html5: true,
      volume: volume / 100,
      onload: () => {
        setDuration(soundRef.current.duration());
      },
      onend: () => {
        setIsPlaying(false);
        cancelAnimationFrame(animationRef.current);
      },
    });
  };

  async function skipSong(index) {
    stopSong();
    initSound(index);
    setIsPlaying(true);
    playSong();
  }
  const animateProgress = () => {
    const sound = soundRef.current;
    if (sound && !isDragging) {
      const seek = sound.seek();
      setProgress(seek);
      animationRef.current = requestAnimationFrame(animateProgress);
    }
  };
  const handleStop = () => {
    const sound = soundRef.current;
    if (sound) stopSong();
  };

  const handleVolume = (e) => {
    const newVolume = Number(e.target.value);
    soundRef.current.fade(volume / 100, newVolume / 100, 200);
    setVolume(newVolume);
  };
  function handleDragStart() {
    setIsDragging(true);
    setIsPlaying(false);
  }

  function handleDragEnd() {
    if (soundRef.current) {
      setIsPlaying(true);
      const percent = Number(progressRef.current.value); // slider value
      const newSeek = (percent / 100) * duration;
      soundRef.current.seek(newSeek);
      setProgress(newSeek);
    }
    cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(animateProgress);
    setIsDragging(false);
  }

  function handleProgressBar() {
    if (soundRef.current && soundRef.current) {
      const percent = Number(progressRef.current.value);
      const newSeek = (percent / 100) * duration;
      setProgress(newSeek);
    }
  }

  function handleFastSkip(value) {
    if (!isPlaying || !soundRef.current) return;
    const seekTime = soundRef.current.seek() + value;
    if (seekTime > duration) {
      soundRef.current.seek(duration);
      return;
    } else if (seekTime < 0) {
      soundRef.current.seek(0);
      return;
    }
    soundRef.current.seek(soundRef.current.seek() + value);
  }

  function handleSkipSong(value) {
    const newIndex = jumpSong(value, songIndex);
    setSongIndex(newIndex);
    skipSong(newIndex);
  }

  useEffect(() => {
    initSound(songIndex);
    return () => {
      soundRef.current.unload(); // Clean up sound
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const value = {
    playList,
    initSound,
    animationRef,
    progressRef,
    soundRef,
    isPlaying,
    volume,
    progress,
    duration,
    songIndex,

    isDragging,
    isAutoPlay,
    isLoop,
    handleProgressBar,
    handleSkipSong,
    handleFastSkip,
    handleVolume,
    handleStop,
    handleDragEnd,
    handleDragStart,
    setProgress,
    setDuration,
    setIsPlaying,
    playSong,
    stopSong,
    pauseSong,
  };
  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}

function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined)
    throw new Error('useAudio must be used within a Audioprovider');
  return context;
}

export { useAudio, AudioProvider };
