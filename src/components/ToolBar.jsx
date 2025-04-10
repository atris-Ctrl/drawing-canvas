import { useDraw } from "../contexts/DrawProvider";
import Button from "./Button";
import ColorPicker from "./ColorPicker";

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
    <div className="tools-div">
      <h3>Tools</h3>
      <>
        <Button
          onClick={() => {
            setPenMode("eraser");
          }}
        >
          <i class="fa-solid fa-eraser"></i>
        </Button>
        <Button
          onClick={() => {
            setPenMode("pen");
          }}
        >
          <i class="fa-solid fa-pencil"></i>
        </Button>
        <Button onClick={() => setPenMode("sticker")}>
          <i class="fa-regular fa-note-sticky"></i>
        </Button>
      </>
      <label>Brush size {brushSize}</label>
      <input
        type="range"
        min="1"
        max="100"
        value={brushSize}
        onChange={(e) => setBrushSize(e.target.value)}
      />
      <label>Brush opacity {brushOpacity}</label>
      <input
        type="range"
        min="1"
        max="100"
        value={brushOpacity}
        onChange={(e) => setBrushOpacity(e.target.value)}
      />
      <label>Brush Color</label>
      <ColorPicker />

      <Button onClick={() => setClearCanvas(true)}>Clear</Button>
      <Button>Save</Button>

      <Button onClick={() => onVisible((isVisible) => !isVisible)}>
        Close
      </Button>
    </div>
  );
}

export default ToolBar;
