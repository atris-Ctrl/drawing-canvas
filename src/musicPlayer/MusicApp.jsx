import { AudioProvider } from './AudioProvider';
import MusicPlayer from './MusicPlayer';

function MusicApp() {
  return (
    <AudioProvider>
      <MusicPlayer />
    </AudioProvider>
  );
}

export default MusicApp;
