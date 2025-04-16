import { useState } from "react";
import "../App.css";
import Button from "../components/Button";
import DrawingCanvas from "../components/DrawingCanvas";
import { DrawProvider } from "../contexts/DrawProvider";
import ToolBar from "../components/ToolBar";
import Header from "../components/Header";

function DrawApp() {
  const [isVisible, setIsVisible] = useState(true);
  const pr = window.devicePixelRatio;
  const dimensions = {
    width: window.innerWidth * pr,
    height: window.innerHeight * pr,
  };

  return (
    <div>
      <Header />
      <div className="layout-div flex flex-row h-screen">
        <DrawProvider>
          {isVisible ? (
            <ToolBar onVisible={setIsVisible} />
          ) : (
            <div>
              <Button onClick={() => setIsVisible((isVisible) => !isVisible)}>
                open
              </Button>
            </div>
          )}
          <div className="canvas-div h-screen">
            <DrawingCanvas dimensions={dimensions} />
          </div>
        </DrawProvider>
      </div>
    </div>
  );
}

export default DrawApp;
