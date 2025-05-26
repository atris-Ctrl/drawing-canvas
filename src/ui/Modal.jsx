import { cloneElement, createContext, useContext, useState } from 'react';
import Draggable from 'react-draggable';
import useOutsideClick from '../useOutsideClick';

const ModalContext = createContext();

function Open({ children, opens: openWindowName }) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, { onClick: () => open(openWindowName) });
}

function Modal({ children }) {
  const [openName, setOpenName] = useState('');
  const close = () => setOpenName('');
  const open = setOpenName;
  return (
    <ModalContext.Provider value={{ open, close, openName }}>
      {children}
    </ModalContext.Provider>
  );
}

function WindowWithMenu({
  name,
  title = 'Window',
  icon,
  menuItems = [],
  children,
}) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);
  if (openName !== name) return;
  return (
    <div ref={ref} className="window active inline-block w-fit">
      <div className="title-bar w-full">
        <div className="title-bar-text flex w-fit items-center">
          {icon && <img src={icon} className="mr-1 h-auto w-4" />}
          {title}
        </div>
        <div className="title-bar-buttons flex shrink-0">
          <button data-close="" onClick={close} />
        </div>
      </div>

      <div className="window-body bg-[#c0c0c0]">
        <ul role="menubar" className="flex w-fit">
          {menuItems.map((menu, i) => (
            <li
              key={i}
              tabIndex="0"
              aria-haspopup={true}
              className="group relative cursor-pointer"
            >
              <u>{menu.underline}</u>
              {menu.label.slice(1)}
              <ul
                role="menu"
                className="absolute left-0 z-50 hidden border border-gray-400 bg-white p-1 group-hover:block group-focus:block"
              >
                {menu.items.map((item, j) => (
                  <li key={j} tabIndex="0" onClick={item.action}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.label}
                      </a>
                    ) : (
                      item.label
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className="inline-block">
          {cloneElement(children, { onCloseModal: close })}
        </div>
      </div>
    </div>
  );
}
Modal.Open = Open;
Modal.Window = WindowWithMenu;

export default Modal;
