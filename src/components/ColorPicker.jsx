import { useDraw } from "../contexts/DrawProvider";
import Button from "./Button";
import Color from "./Color";

function ColorPicker() {
  const { recentColors, handleAddColor, brushColor, setBrushColor } = useDraw();
  function handleColor(e) {
    const color = e.target.value;
    handleAddColor(color);
    setBrushColor(color);
  }

  function changeColor() {}
  return (
    <div>
      <input
        type="color"
        id="color-pick"
        value={brushColor}
        onChange={handleColor}
      ></input>
      <div className="flex gap-1">
        {recentColors.map((color) => (
          <Color colorCode={color}></Color>
        ))}
      </div>
    </div>
  );
}

export default ColorPicker;
