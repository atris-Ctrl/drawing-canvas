import { useAudio } from './AudioProvider';

function MusicList() {
  const { playList, jumpSongByIndex, songIndex } = useAudio();

  return (
    <div className="max-h-64 overflow-y-auto rounded border bg-slate-300">
      <div className="flex flex-col">
        {playList.map((song, i) => (
          <div
            key={i}
            onClick={() => jumpSongByIndex(i)}
            className={`w-40 cursor-pointer px-1 py-2 transition ${
              i === songIndex ? 'bg-blue-800 text-white' : 'hover:bg-blue-100'
            }`}
          >
            {song.songTitle}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MusicList;
