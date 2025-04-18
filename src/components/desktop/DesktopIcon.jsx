import { useRef, useEffect, useState } from "react";
import Draggable from "react-draggable";

function DesktopIcon({ iconSrc, label, onDoubleClick }) {
  const [selected, setSelected] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation(); // prevent parent clicks
    setSelected(true);
  };

  // Deselect on click anywhere else
  useEffect(() => {
    const handleWindowClick = () => {
      setSelected(false);
    };
    window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, []);

  return (
    <div>
      <Draggable>
        <div
          onClick={handleClick}
          onDoubleClick={onDoubleClick}
          className={`w-fit h-fit absolute w-20 text-center cursor-pointer select-none`}
        >
          <div
            className={`flex flex-col items-center py-1  ${
              selected ? "border border-dashed border-white" : ""
            } hover:bg-blue-200/50`}
          >
            <img
              src={iconSrc}
              onDragStart={(e) => e.preventDefault()}
              alt="icon"
              className="w-12 h-12 mb-1"
            />
            <span className="text-sm text-white drop-shadow font-bold">
              {label}
            </span>
          </div>
        </div>
      </Draggable>
    </div>
  );
}

export default DesktopIcon;
