import Stickers from './Stickers';
import '../../../winxp/theme.css';
function StickersPlane() {
  return (
    <div className="window w-50 h-50">
      <div className="title-bar">
        <div className="title-bar-text">Stickersss</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <div class="window-body">
        <Stickers />
      </div>
    </div>
  );
}

export default StickersPlane;
