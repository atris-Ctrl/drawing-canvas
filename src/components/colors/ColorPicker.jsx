import { useDraw } from "../../contexts/DrawProvider";
import Color from "./Color";

function ColorPicker() {
  const { recentColors, handleAddColor, brushColor, setBrushColor } = useDraw();
  function handleColor(e) {
    const color = e.target.value;
    handleAddColor(color);
    setBrushColor(color);
  }

  function changeColor(e) {
    setBrushColor(e.target.id);
  }
  return (
    <div>
      <input
        type="color"
        id="color-pick"
        value={brushColor}
        onChange={handleColor}
      ></input>
      <div className="flex gap-2 flex-wrap">
        {recentColors.map((color) => (
          <Color key={color} colorCode={color} onClick={changeColor}></Color>
        ))}
      </div>
    </div>
  );
}

export default ColorPicker;
