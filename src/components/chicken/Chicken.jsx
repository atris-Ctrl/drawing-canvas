import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
const texts = [
  "Hello World",
  "This is Chicken Bun!",
  "Me want to play a game!",
  "Bye",
];

function Chicken() {
  const dialogueBoxRef = useRef();
  const [textInd, setTextInd] = useState(0);

  useEffect(() => {
    const dialogueBox = dialogueBoxRef.current;
    const handleMouseDown = () => {
      setTextInd((ind) => (ind === texts.length - 1 ? 0 : ind + 1));
    };
    dialogueBox.addEventListener("mousedown", handleMouseDown);
    return () => {
      dialogueBox.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <Draggable>
      <div className="w-fit flex flex-col items-center">
        <div
          ref={dialogueBoxRef}
          className="bg-[#f0f0f0] border-[4px] border-[#7d7373] text-[#625d5d] p-4 rounded max-w-xs text-center cursor-pointer relative"
        >
          <p className="p-3 select-none text-lg whitespace-pre-wrap break-words">
            {texts[textInd]}
          </p>
          <div
            className="absolute right-3 transform -translate-x-1/2 animate-bounce"
            style={{
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "15px solid #676161",
            }}
          ></div>
        </div>
        <img
          className="w-48 h-auto"
          src="/assets/chickenbun-big.gif"
          onDragStart={(e) => e.preventDefault()}
        />
      </div>
    </Draggable>
  );
}

export default Chicken;
