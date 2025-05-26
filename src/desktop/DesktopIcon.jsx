import { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';

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
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  return (
    <div>
      <Draggable>
        <div
          onClick={handleClick}
          onDoubleClick={onDoubleClick}
          className={`h-30 w-20 cursor-pointer select-none text-center`}
        >
          <div
            className={`flex flex-col items-center py-[1px] ${
              selected && 'border border-dashed border-white'
            } hover:bg-blue-200/50`}
          >
            <img
              src={iconSrc}
              onDragStart={(e) => e.preventDefault()}
              alt="icon"
              className="w-10"
            />
            <span className="text-wrap text-sm font-bold text-white drop-shadow">
              {label}
            </span>
          </div>
        </div>
      </Draggable>
    </div>
  );
}

export default DesktopIcon;
