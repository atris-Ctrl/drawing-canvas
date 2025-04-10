import { useState, useEffect } from "react";
import "./App.css";
import Button from "./components/Button";
import Cursor from "./components/Cursor";
import DrawingCanvas from "./components/DrawingCanvas";
import { DrawProvider } from "./contexts/DrawProvider";
import ToolBar from "./components/ToolBar";
function App() {
  // const [dimensions, setDimensions] = useState({
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  // });
  const [isVisible, setIsVisible] = useState(true);
  const pr = window.devicePixelRatio;
  const dimensions = {
    width: window.innerWidth * pr,
    height: window.innerHeight * pr,
  };

  return (
    <div className="layout-div">
      <DrawProvider>
        {/* <Cursor /> */}
        {isVisible ? (
          <ToolBar onVisible={setIsVisible} />
        ) : (
          <div>
            <Button onClick={() => setIsVisible((isVisible) => !isVisible)}>
              open
            </Button>
          </div>
        )}
        <div className="canvas-div">
          <DrawingCanvas dimensions={dimensions} />
        </div>
      </DrawProvider>
    </div>
  );
}

export default App;
