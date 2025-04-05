import { useEffect, useRef } from "react";
import "./cursorStyle.css";
import { useDraw } from "../contexts/DrawProvider";

function Cursor() {
  const cursorRef = useRef(null);
  const { brushSize, brushColor } = useDraw();
  const style = {
    width: `${brushSize}px`,
    height: `${brushSize}px`,
    backgroundColor: brushColor,
  };
  useEffect(() => {
    const cursor = cursorRef.current;

    if (!cursor) return;
    function updatePosition(e) {
      const x = e.clientX;
      const y = e.clientY;
      cursor.style.transform = `translate3d(${x - cursor.clientWidth / 2}px, ${
        y - cursor.clientHeight / 2
      }px, 0)`;
    }
    window.addEventListener("mousemove", updatePosition);
    return () => {
      window.removeEventListener("mousemove", updatePosition);
    };
  }, []);

  return (
    <div>
      <div className="main-cursor" ref={cursorRef}>
        <div style={style} className="main-cursor-background"></div>
      </div>
    </div>
  );
}

export default Cursor;
