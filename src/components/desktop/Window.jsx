import Draggable from "react-draggable";

function Window({ title = "Window", children, style, onClick, className }) {
  return (
    <div className="window w-fit" style={style}>
      <div className="title-bar ">
        <div className="title-bar-text">{title}</div>
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
