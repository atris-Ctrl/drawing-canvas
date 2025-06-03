import { Howl, Howler } from 'howler';
import { useCallback, useEffect, useRef, useState } from 'react';
import { formatTime, jumpSong, musicPath, progressPercent } from './config';
import { AudioProvider, useAudio } from './AudioProvider';

function MusicPlayer() {
  const {
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
    isAutoPlay,
    isLoop,
    playSong,
    stopSong,
    pauseSong,
    setDuration,
    setIsPlaying,
    handleFastSkip,
    handleSkipSong,
    handleProgressBar,
    handleStop,
    handleDragStart,
    handleDragEnd,
    handleVolume,
  } = useAudio();
  const data = playList[songIndex];

  useEffect(() => {
    initSound(songIndex);
    return () => {
      soundRef.current.unload(); // Clean up sound
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

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
    <div className="h-auto w-60 rounded bg-slate-300 p-4">
      <h2 className="mb-2 font-bold">Music Player</h2>
      <h3>{data.songTitle} </h3>
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
      </div>

      <input
        ref={progressRef}
        type="range"
        className="p-0"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #253652 ${progressPercent(progress, duration)}%, #d1d5db ${progressPercent(progress, duration)}%, #d1d5db 100%)`,
        }}
        value={progressPercent(progress, duration)}
        onChange={handleProgressBar}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
        id="progress"
        min="0"
        max="100"
      ></input>
      <div className="h-3 w-full bg-gray-400">
        <div
          className="h-3 rounded bg-blue-600"
          style={{ width: `${progressPercent(progress, duration)}%` }}
        />
      </div>
      <p className="mb-2 mt-1 text-sm">
        {formatTime(progress)} / {formatTime(duration)}
      </p>

      <div className="flex gap-2">
        <button onClick={() => setIsPlaying((prev) => !prev)}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={handleStop}>Stop</button>
      </div>
      <button onClick={() => handleFastSkip(5)}>5 sec</button>
      <button onClick={() => handleFastSkip(-5)}>-5 sec</button>
      <button onClick={() => handleSkipSong(-1)}>Prev</button>
      <button onClick={() => handleSkipSong(1)}>Next</button>
      <button onClick={() => setIsAutoPlay((prev) => !prev)}>AutoPlay</button>
      <button onClick={() => setIsLoop((prev) => !prev)}>Loop</button>
    </div>
  );
}

export default MusicPlayer;
