import { createContext, useContext, useState } from "react";

const DrawContext = createContext();
const RECENT_COLORS_SIZE = 5;
function DrawProvider({ children }) {
  // zoom in and out
  // layers
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
  const [penMode, setPenMode] = useState("pen");
  const [recentColors, setRecentColors] = useState([]);
  function onSaveDrawing() {
    // Convert canvas to image
    // document
    //   .getElementById("btn-download")
    //   .addEventListener("click", function (e) {
    //     var canvas = document.querySelector("#my-canvas");
    //     var dataURL = canvas.toDataURL("image/jpeg", 1.0);
    //     downloadImage(dataURL, "my-canvas.jpeg");
    //   });
    // function downloadImage(data, filename = "untitled.jpeg") {
    //   var a = document.createElement("a");
    //   a.href = data;
    //   a.download = filename;
    //   document.body.appendChild(a);
    //   a.click();
    // }
  }
  function handleAddColor(color) {
    setRecentColors((colors) => {
      if (colors.length == RECENT_COLORS_SIZE) {
        colors.shift();
      }
      return [...colors, color];
    });
  }
  return (
    <DrawContext.Provider
      value={{
        brushColor,
        penMode,
        isSticker,
        setSticker,
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
