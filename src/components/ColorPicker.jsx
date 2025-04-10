import { useDraw } from "../contexts/DrawProvider";

function ColorPicker() {
  const { recentColors, handleAddColor, brushColor, setBrushColor } = useDraw();

  return (
    <div>
      <input
        type="color"
        id="color-pick"
        value={brushColor}
        onChange={(e) => setBrushColor(e.target.value)}
      ></input>
      {recentColors.map((color) => {
        <span>H</span>;
      })}
    </div>
  );
}

export default ColorPicker;
