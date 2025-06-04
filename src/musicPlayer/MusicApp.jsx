import ClosableWindow from '../ui/ClosableWindow';
import { AudioProvider } from './AudioProvider';
import MusicList from './MusicList';
import MusicPlayer from './MusicPlayer';

function MusicApp() {
  return (
    <AudioProvider>
      <ClosableWindow title="Music Player">
        <div className="flex">
          <MusicPlayer />
          <MusicList />
        </div>
      </ClosableWindow>
    </AudioProvider>
  );
}

export default MusicApp;
