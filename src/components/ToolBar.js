import { useDraw, useState } from "../context/DrawProvider";

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
      <button onClick={() => setIsErasing((isErasing) => !isErasing)}>
        Erase
      </button>
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
      <button onClick={() => setClearCanvas(true)}>Clear</button>
      <button>Save</button>
      <button onClick={() => onVisible((isVisible) => !isVisible)}>
        close
      </button>
    </div>
  );
}

export default ToolBar;
