import { useDraw } from './DrawProvider';
import Button from '../../ui/Button';
import ColorPicker from './colors/ColorPicker';
import GradientDiv from '../../ui/GradientDiv';
import StickersPlane from './stickers/StickersPlane';
import 'xp.css/dist/XP.css';
function ToolBar({ onVisible }) {
  const {
    brushSize,
    brushOpacity,
    penMode,
    setPenMode,
    setBrushOpacity,
    setBrushSize,
    setClearCanvas,
  } = useDraw();

  return (
    <div className="tools-div border-black-300 w-80 space-y-6 border-4 border-[#7e8acf] p-6 text-lg text-gray-800 shadow-lg">
      <GradientDiv>
        <label className="block text-2xl font-semibold">
          🖌️ Brush Size: {brushSize}
        </label>
        <div className="bg-[#d8dff8] p-3">
          <input
            type="range"
            min="1"
            max="100"
            value={brushSize}
            onChange={(e) => setBrushSize(e.target.value)}
            className="w-full accent-white"
          />
        </div>
      </GradientDiv>

      <GradientDiv>
        <div className="space-y-3">
          <label className="block text-2xl font-semibold">
            🌫️ Brush Opacity: {brushOpacity}
          </label>
          <div className="bg-[#d8dff8] p-3">
            <input
              type="range"
              min="1"
              max="100"
              value={brushOpacity}
              onChange={(e) => setBrushOpacity(e.target.value)}
              className="w-full accent-white"
            />
          </div>
        </div>
      </GradientDiv>

      <GradientDiv>
        <label className="mb-2 text-2xl font-semibold">🎨 Brush Color</label>
        <div className="bg-[#d8dff8] p-3">
          <ColorPicker />
        </div>
      </GradientDiv>

      <div className="flex justify-between">
        <Button
          onClick={() => setPenMode('eraser')}
          title="Eraser"
          styleClass={
            penMode === 'eraser' ? 'bg-white scale-115 shadow-md' : ''
          }
        >
          <i className="fa-solid fa-eraser text-xl" />
        </Button>
        <Button
          onClick={() => setPenMode('pen')}
          title="Pen"
          styleClass={penMode === 'pen' ? 'bg-white scale-115 shadow-md' : ''}
        >
          <i className="fa-solid fa-pencil text-xl" />
        </Button>
        <Button
          onClick={() => setPenMode('sticker')}
          title="Sticker"
          styleClass={
            penMode === 'sticker' ? 'bg-white scale-115 shadow-md' : ''
          }
        >
          <i className="fa-regular fa-note-sticky text-xl" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-lg">
        <Button onClick={() => setClearCanvas(true)}>🧼 Clear</Button>
        <Button>💾 Save</Button>
        <Button onClick={() => onVisible((isVisible) => !isVisible)}>
          ❌ Close
        </Button>
      </div>

      <StickersPlane />
    </div>
  );
}

export default ToolBar;
