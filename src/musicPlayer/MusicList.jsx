import { useAudio } from './AudioProvider';

function MusicList() {
  const { playList } = useAudio();

  return (
    <div className="flex flex-col">
      All Music
      {playList.map((song, i) => (
        <div key={i}>{song.songTitle}</div>
      ))}
    </div>
  );
}

export default MusicList;
