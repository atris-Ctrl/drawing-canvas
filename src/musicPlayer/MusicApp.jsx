import { AudioProvider } from './AudioProvider';
import MusicList from './MusicList';
import MusicPlayer from './MusicPlayer';

function MusicApp() {
  return (
    <AudioProvider>
      <div className="flex">
        <MusicPlayer />
        <MusicList />
      </div>
    </AudioProvider>
  );
}

export default MusicApp;
