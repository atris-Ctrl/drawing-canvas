import { useDraw } from "../contexts/DrawProvider";
import Button from "./Button";
import ColorPicker from "./colors/ColorPicker";
import GradientDiv from "./GradientDiv";
import StickersPlane from "./stickers/StickersPlane";
import "xp.css/dist/XP.css";
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
    <div className="tools-div border-[#7e8acf] p-6 shadow-lg w-80 space-y-6  text-gray-800 text-lg border-4 border-black-300">
      <GradientDiv>
        <label className="block text-2xl font-semibold">
          🖌️ Brush Size: {brushSize}
        </label>
        <input
          type="range"
          min="1"
          max="100"
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
          className="w-full accent-white"
        />
      </GradientDiv>

      <GradientDiv>
        <div className="space-y-3">
          <label className="block text-2xl font-semibold">
            🌫️ Brush Opacity: {brushOpacity}
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={brushOpacity}
            onChange={(e) => setBrushOpacity(e.target.value)}
            className="w-full accent-white"
          />
        </div>
      </GradientDiv>

      <GradientDiv>
        <div>
          <label className="text-2xl font-semibold mb-2">🎨 Brush Color</label>
          <ColorPicker />
        </div>
      </GradientDiv>

      <div className="flex justify-between">
        <Button
          onClick={() => setPenMode("eraser")}
          title="Eraser"
          styleClass={
            penMode === "eraser" ? "bg-pink-600 scale-115 shadow-md" : ""
          }
        >
          {/* <img src="/stickers/eraser.png"></img> */}

          <i className="fa-solid fa-eraser text-xl" />
        </Button>
        <Button
          onClick={() => setPenMode("pen")}
          title="Pen"
          styleClass={
            penMode === "pen" ? "bg-pink-600 scale-115 shadow-md" : ""
          }
        >
          {/* <img src="/stickers/pen.png"></img> */}
          <i className="fa-solid fa-pencil text-xl" />
        </Button>
        <Button
          onClick={() => setPenMode("sticker")}
          title="Sticker"
          styleClass={
            penMode === "sticker" ? "bg-pink-600 scale-115 shadow-md" : ""
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
