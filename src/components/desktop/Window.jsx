import Draggable from 'react-draggable';
function Window({
  title = 'Window',
  icon,
  children,
  style,
  onClick,
  className,
}) {
  return (
    <div className="window w-fit" style={style}>
      <div className="title-bar">
        <div className="title-bar-text">
          <span
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {icon && (
              <img
                src={icon}
                alt="icon"
                style={{ height: '16px', width: '16px' }}
              />
            )}
            {title}
          </span>
        </div>
        <div className="title-bar-controls">
          {/* <button aria-label="Minimize"></button> */}
          {/* <button aria-label="Maximize"></button> */}
          <button onClick={onClick} aria-label="Close"></button>
        </div>
      </div>
      <div className="window-body">{children}</div>
    </div>
  );
}

export default Window;
