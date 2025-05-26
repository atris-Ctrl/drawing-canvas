import { useState } from 'react';
import Window from './Window';

function ClosableWindow({ title, icon, menuItems, children }) {
  const [open, setOpen] = useState(true);
  if (!open) return;
  return (
    <Window
      title={title}
      icon={icon}
      menuItems={menuItems}
      closeButton={() => setOpen(false)}
    >
      {children}
    </Window>
  );
}

export default ClosableWindow;
