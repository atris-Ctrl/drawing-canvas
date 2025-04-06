import { useDraw } from "../contexts/DrawProvider";
import Button from "./Button";

function ToolBar({ onVisible }) {
  const {
    brushSize,
    brushColor,
    brushOpacity,
    isErasing,
    setIsErasing,
    setBrushOpacity,
    setBrushSize,
    setBrushColor,
    setClearCanvas,
    setIsVisible,
  } = useDraw();
  return (
    <div className="tools-div">
      <h3>Tools</h3>
      <Button onClick={() => setIsErasing((isErasing) => !isErasing)}>
        Erase
      </Button>
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
      <label>Color</label>
      <input
        type="color"
        id="color-pick"
        value={brushColor}
        onChange={(e) => setBrushColor(e.target.value)}
      ></input>
      <Button
        className="border-purple-200 text-purple-600"
        onClick={() => setClearCanvas(true)}
      >
        Clear
      </Button>
      <Button>Save</Button>
      <Button onClick={() => onVisible((isVisible) => !isVisible)}>
        Close
      </Button>
    </div>
  );
}

export default ToolBar;
