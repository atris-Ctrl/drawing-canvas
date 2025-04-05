import { createContext, useContext, useState } from "react";

const DrawContext = createContext();

function DrawProvider({ children }) {
  const [brushColor, setBrushColor] = useState("#c0392b");
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [clearCanvas, setClearCanvas] = useState(false);
  const [isErasing, setIsErasing] = useState(false);

  function onSaveDrawing() {}
  return (
    <DrawContext.Provider
      value={{
        brushColor,
        brushSize,
        brushOpacity,
        clearCanvas,
        setClearCanvas,
        setBrushColor,
        setBrushOpacity,
        setBrushSize,
      }}
    >
      {children}
    </DrawContext.Provider>
  );
}

function useDraw() {
  const context = useContext(DrawContext);
  if (context === undefined) {
    throw new Error("useDraw must be used within a DrawProvider");
  }
  return context;
}

export { DrawProvider, useDraw };
