import { useDraw } from '../DrawProvider';
import Color from './Color';
import './colorpicker.css';
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
      <div className="cp_wrapper">
        <input
          type="color"
          id="color-pick"
          value={brushColor}
          onChange={handleColor}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {recentColors.map((color) => (
          <Color key={color} colorCode={color} onClick={changeColor}></Color>
        ))}
      </div>
    </div>
  );
}

export default ColorPicker;
