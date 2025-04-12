import { useDraw } from "../contexts/DrawProvider";
import Button from "./Button";
import ColorPicker from "./ColorPicker";
import StickersPlane from "./StickersPlane";

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

      <>
        <Button
          onClick={() => {
            setPenMode("eraser");
          }}
        >
          <i className="fa-solid fa-eraser">Eraser</i>
        </Button>
        <Button
          onClick={() => {
            setPenMode("pen");
          }}
        >
          <i className="fa-solid fa-pencil">Pencil</i>
        </Button>
        <Button onClick={() => setPenMode("sticker")}>
          <i className="fa-regular fa-note-sticky">Sticker</i>
        </Button>
      </>
      <Button onClick={() => setClearCanvas(true)}>Clear</Button>
      <Button>Save</Button>

      <Button onClick={() => onVisible((isVisible) => !isVisible)}>
        Close
      </Button>
      <StickersPlane />
    </div>
  );
}

export default ToolBar;
