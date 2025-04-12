import { useState, useEffect } from "react";
// import CursorImage from "../assets/cursor.png";
function Cursor({ cursor, name }) {
  const smoothFactor = 0.1;
  const [smoothPosition, setSmoothPosition] = useState({
    x: cursor?.x,
    y: cursor?.y,
  });

  useEffect(() => {
    if (!cursor) return;
    let animationFrameId;
    const updatePosition = () => {
      setSmoothPosition((prevPosition) => {
        const dx = cursor.x - prevPosition.x;
        const dy = cursor.y - prevPosition.y;
        const newX = prevPosition.x + dx * smoothFactor;
        const newY = prevPosition.y + dy * smoothFactor;
        if (Math.abs(dx) > 0.1 && Math.abs(dy) > 0.1) {
          animationFrameId = requestAnimationFrame(updatePosition);
        }
        return { x: newX, y: newY };
      });
    };
    animationFrameId = requestAnimationFrame(updatePosition);

    return () => cancelAnimationFrame(animationFrameId);
  }, [cursor]);

  const cursorStyle = {
    position: "fixed",
    left: smoothPosition.x + 12,
    top: smoothPosition.y + 12,
    zIndex: 9999,
    transform: "translate(-50%, -50%)", // Center the cursor
    transition: "left 0.1s linear, top 0.1s linear", // Smooth transition
    pointerEvents: "none", // Ensure the cursor doesn't interfere with clicks
  };

  const imgStyle = {
    width: "70%",
    height: "70%",
    pointerEvents: "none",
  };
  const textStyle = {
    position: "absolute",
    bottom: "100%",
    left: "60%",
    transform: "translateX(-50%)",
    marginBottom: "1px",
    fontSize: "10px",
    whiteSpace: "nowrap", // Prevent text from wrapping
  };

  return (
    <div style={{ position: "relative" }}>
      {cursor.x === null || cursor.y === null ? null : (
        <span style={cursorStyle}>
          {/* <img src={CursorImage} style={imgStyle}></img> */}
          <p style={textStyle}>
            <strong>{name}</strong>
          </p>
        </span>
      )}
    </div>
  );
}

export default Cursor;
