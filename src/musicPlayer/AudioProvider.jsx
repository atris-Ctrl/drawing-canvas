import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { musicPath } from './config';
import { Howl } from 'howler';

const AudioContext = createContext();

const initialPlayList = [
  {
    songTitle: 'Proi Proi',
    file: 'test1.mp3',
    howl: null,
    duration: 0,
  },
  {
    songTitle: 'Eva',
    file: 'test.mp3',
    howl: null,
    duration: 0,
  },
  {
    songTitle: 'WildFire',
    file: 'test2.mp3',
    howl: null,
    duration: 0,
  },
];

function AudioProvider({ children }) {
  const animationRef = useRef(null);
  const progressRef = useRef(null);
  const soundRef = useRef(null);
  const wasPlayingRef = useRef(false);
  const playListRef = useRef(initialPlayList);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [songIndex, setSongIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isLoop, setIsLoop] = useState(false);

  function handleLoop() {
    setIsLoop(!isLoop);
  }

  const loadHowl = (index) => {
    const musicFile = playListRef.current[index];
    
    if (musicFile.howl) {
      setDuration(musicFile.duration);
      return musicFile.howl;
    }

    const howl = new Howl({
      src: `${musicPath}/${musicFile.file}`,
      autoplay: isAutoPlay,
      loop: isLoop,
      volume: volume / 100,
      onload: () => {
        const songDuration = howl.duration();
        musicFile.duration = songDuration;
        setDuration(songDuration);
      },
      onend: () => {
        if (howl.loop()) {
          howl.seek(0);
          setIsPlaying(true);
        } else  {
          const nextIndex = (index + 1) % playListRef.current.length;
          jumpSongByIndex(nextIndex);
        }
      },
    });

    musicFile.howl = howl;
    return howl;
  };

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.loop(isLoop);
    }
  }, [isLoop]);

  function playSong() {
    if (soundRef.current) {
      soundRef.current.play();
      if (!isDragging) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        animationRef.current = requestAnimationFrame(animateProgress);
      }
    }
  }

  function pauseSong() {
    if (soundRef.current) {
      soundRef.current.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }

  function stopSong() {
    if (soundRef.current) {
      soundRef.current.stop();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setIsPlaying(false);
      setProgress(0);
      setIsDragging(false);
    }
  }

  const initSound = (index) => {
    if (soundRef.current) {
      soundRef.current.unload();
    }

    soundRef.current = loadHowl(index);
  };

  async function skipSong(index) {
    stopSong();
    setSongIndex(index);
    const howl = initSound(index);
  }

  const animateProgress = useCallback(() => {
    const sound = soundRef.current;
    if (sound && !isDragging) {
      const seek = sound.seek();
      if (seek !== undefined && seek !== null) {
        const boundedSeek = Math.min(Math.max(0, seek), duration);
        setProgress(boundedSeek);
      }
      animationRef.current = requestAnimationFrame(animateProgress);
    }
  }, [isDragging, duration]);

  const handleStop = () => {
    const sound = soundRef.current;
    if (sound) stopSong();
  };

  useEffect(() => {
    const sound = soundRef.current;
    if (!sound) return;

    if (isPlaying && !isDragging) {
      playSong();
    } else {
      pauseSong();
    }
  }, [isPlaying, isDragging]);

  const handleVolume = (e) => {
    const newVolume = Number(e.target.value);
    if (soundRef.current) {
      soundRef.current.fade(volume / 100, newVolume / 100, 200);
    }
    setVolume(newVolume);
  };

  function handleDragStart() {
    if (!soundRef.current) return;
    wasPlayingRef.current = isPlaying;
    setIsDragging(true);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (isPlaying) {
      pauseSong();
    }
  }

  function handleDragEnd() {
    if (!soundRef.current || !progressRef.current) return;
    const percent = Number(progressRef.current.value);
    const newSeek = Math.min(Math.max(0, (percent / 100) * duration), duration);
    soundRef.current.seek(newSeek);
    setProgress(newSeek);
    setIsDragging(false);
    if (wasPlayingRef.current) {
      setIsPlaying(true);
    }
  }

  function handleProgressBar() {
    if (!soundRef.current || !progressRef.current || !isDragging) return;
    const percent = Number(progressRef.current.value);
    const newSeek = Math.min(Math.max(0, (percent / 100) * duration), duration);
    setProgress(newSeek);
  }

  function handleFastSkip(value) {
    if (!soundRef.current) return;
    const currentSeek = soundRef.current.seek();
    const seekTime = Math.min(Math.max(0, currentSeek + value), duration);
    soundRef.current.seek(seekTime);
  }

  function handleSkipSong(value) {
    const newIndex = (songIndex + value + playListRef.current.length) % playListRef.current.length;
    skipSong(newIndex);
  }

  function jumpSongByIndex(index) {
    if (index >= 0 && index < playListRef.current.length) {
      skipSong(index);
    }
  }

  function toggleAutoPlay() {
    const currentAutoPlay = !isAutoPlay;
    setIsAutoPlay(currentAutoPlay);
    if (soundRef.current) {
      soundRef.current.autoplay(currentAutoPlay);
    }
  }

  const cleanup = useCallback(() => {
    playListRef.current.forEach((song) => {
      if (song.howl) {
        song.howl.unload();
        song.howl = null;
      }
    });
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  useEffect(() => {
    initSound(songIndex);
    return cleanup;
  }, []);

  const value = {
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    progress,
    duration,
    songIndex,
    isLoop,
    isAutoPlay,
    handleLoop,
    handleVolume,
    handleStop,
    handleNextSong: () => handleSkipSong(1),
    handlePrevSong: () => handleSkipSong(-1),
    progressRef,
    handleProgressBar,
    handleDragStart,
    handleDragEnd,
    playList: playListRef.current,
    toggleAutoPlay,
    handleFastSkip,
    handleSkipSong,
    jumpSongByIndex,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}

function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

export { AudioProvider, useAudio };
