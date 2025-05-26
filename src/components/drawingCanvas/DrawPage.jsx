import { useState } from 'react';
import Button from '../../ui/Button';
import DrawingCanvas from './DrawingCanvas';
import { DrawProvider } from './DrawProvider';
import ToolBar from './ToolBar';
import Header from '../../ui/Header';
import ClosableWindow from '../../ui/ClosableWindow';

function DrawApp() {
  const [isVisible, setIsVisible] = useState(true);
  const pr = window.devicePixelRatio;
  const dimensions = {
    width: window.innerWidth * pr,
    height: window.innerHeight * pr,
  };

  return (
    <ClosableWindow>
      {/* <Header /> */}
      <div className="flex flex-row">
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
          <div className="h-full">
            <DrawingCanvas dimensions={dimensions} />
          </div>
        </DrawProvider>
      </div>
    </ClosableWindow>
  );
}

export default DrawApp;
