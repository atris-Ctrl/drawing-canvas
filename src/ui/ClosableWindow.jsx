import { useState } from 'react';
import Window from './Window';
import Draggable from 'react-draggable';

function ClosableWindow({ title, icon, menuItems, children }) {
  const [open, setOpen] = useState(true);
  if (!open) return;
  return (
    <Draggable 
      handle=".title-bar" 
      bounds="parent" 
      axis="both"
      defaultPosition={{x: 0, y: 0}}
      position={null}
    >
      <div className="window-container" style={{ position: 'absolute', zIndex: 1000 }}>
        <Window
          title={title}
          icon={icon}
          menuItems={menuItems}
          closeButton={() => setOpen(false)}
        >
          {children}
        </Window>
      </div>
    </Draggable>
  );
}

export default ClosableWindow;
