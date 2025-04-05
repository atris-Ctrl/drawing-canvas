import { useEffect, useRef, useState } from "react";
import { useDraw } from "../contexts/DrawProvider";
function getMousePos(canvas, e) {
  var rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function DrawingCanvas({ dimensions, imgSrc }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { width, height } = dimensions;

  const { brushSize, brushOpacity, brushColor, clearCanvas, setClearCanvas } =
    useDraw();
  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext("2d");
  //   window.addEventListener("resize", resizeCanvas, false);
  //   function resizeCanvas() {
  //     canvas.width = window.innerWidth;
  //     canvas.height = window.innerHeight;
  //     redraw();
  //   }
  //   function redraw() {}
  // }, []);

  useEffect(() => {
    if (clearCanvas) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, width, height);
      setClearCanvas(false);
    }
  }, [clearCanvas, width, height, setClearCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (e) => {
      if (!isDrawing) return;

      const pos = getMousePos(canvas, e);
      ctx.lineCap = "round";
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = brushOpacity / 100;
      ctx.strokeStyle = brushColor;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    };

    function startDrawing(e) {
      const pos = getMousePos(canvas, e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      setIsDrawing(true);
    }

    function endDrawing() {
      setIsDrawing(false);
      ctx.closePath();
    }
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDrawing);
    canvas.addEventListener("mouseleave", endDrawing);
    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", endDrawing);
      canvas.removeEventListener("mouseleave", endDrawing);
    };
  }, [width, height, isDrawing, brushColor, brushSize, brushOpacity]);
  const styled = {
    display: "block",
  };
  return (
    <>
      <canvas style={styled} ref={canvasRef} width={width} height={height} />
      {/* <Cursor canvasRef={canvasRef} size={brushSize} color={brushColor} /> */}
    </>
  );
}

export default DrawingCanvas;
