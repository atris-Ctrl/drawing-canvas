export function formatTime(secs) {
  const minutes = Math.floor(secs / 60) || 0;
  const seconds = Math.floor(secs % 60) || 0;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
export const musicPath = '/assets/audio';

export function jumpSong(direction, currentIndex) {
  let index = direction + currentIndex;
  if (index >= 3) {
    index = 0;
  }
  return index;
}

export const progressPercent = (progress, duration) => {
  return duration ? (progress / duration) * 100 : 0;
};
