import { useState } from "react";
import Draggable from "react-draggable";

function CommandPrompt() {
  const [command, setCommand] = useState("");
  return (
    <Draggable>
      <div className="window w-fit h-fit">
        <div className="title-bar">
          <div className="title-bar-text">Command Prompt</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div className="window-body">
          <pre>
            Microsoft&#10094;R&#10095; Windows DOS &#10094;C&#10095; Copyright
            Microsoft Corp 1990-2001.
            <p>
              C:/WINDOWS/SYSTEM32 You can build a command line easily with a
              window and pre tag
            </p>
            <input
              className="bg-black"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
            />
          </pre>
        </div>
      </div>
    </Draggable>
  );
}

export default CommandPrompt;
