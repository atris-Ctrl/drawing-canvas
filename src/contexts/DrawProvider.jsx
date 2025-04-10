import { createContext, useContext, useState } from "react";

const DrawContext = createContext();

function DrawProvider({ children }) {
  // zoom in and out
  // remember recent color
  // remove the cursror
  // history
  // sticker
  // color pattern

  const [brushColor, setBrushColor] = useState("#c0392b");
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [clearCanvas, setClearCanvas] = useState(false);
  const [isSticker, setSticker] = useState(false);
  const [penMode, setPenMode] = useState(false);
  const [recentColors, setRecentColors] = useState([]);
  function onSaveDrawing() {}
  function handleAddColor(color) {
    setRecentColors((colors) => [...colors, color]);
  }
  return (
    <DrawContext.Provider
      value={{
        brushColor,
        penMode,
        setPenMode,
        brushSize,
        brushOpacity,
        recentColors,
        handleAddColor,
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
