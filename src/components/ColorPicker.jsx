import { useDraw } from "../contexts/DrawProvider";
import Button from "./Button";

function ColorPicker() {
  const { recentColors, handleAddColor, brushColor, setBrushColor } = useDraw();
  function handColor(e) {
    const color = e.target.value;
    handleAddColor(color);
    setBrushColor(color);
  }
  return (
    <div>
      <input
        type="color"
        id="color-pick"
        value={brushColor}
        onChange={handColor}
      ></input>
      {recentColors.map((color) => (
        <span key={color}>{color}</span>
      ))}
    </div>
  );
}

export default ColorPicker;
