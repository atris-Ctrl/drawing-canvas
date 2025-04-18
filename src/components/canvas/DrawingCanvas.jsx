import { useEffect, useRef, useState } from "react";
import { useDraw } from "../../contexts/DrawProvider";
import Cursor from "../Cursor/Cursor";

function getMousePos(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function DrawingCanvas({ dimensions, imgSrc }) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastXYRef = useRef({ x: 0, y: 0 });
  const brushColorRef = useRef();
  const brushSizeRef = useRef();
  const brushOpacityRef = useRef();
  const penModeRef = useRef();

  const { width, height } = dimensions;
  const {
    brushSize,
    brushOpacity,
    penMode,
    brushColor,
    clearCanvas,
    setClearCanvas,
  } = useDraw();

  useEffect(() => {
    brushColorRef.current = brushColor;
  }, [brushColor]);

  useEffect(() => {
    brushSizeRef.current = brushSize;
  }, [brushSize]);

  useEffect(() => {
    brushOpacityRef.current = brushOpacity;
  }, [brushOpacity]);

  useEffect(() => {
    penModeRef.current = penMode;
  }, [penMode]);

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
      if (!isDrawingRef.current) return;

      const pos = getMousePos(canvas, e);
      const last = lastXYRef.current;

      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      lastXYRef.current = { x: pos.x, y: pos.y };
    };

    const startDrawing = (e) => {
      const pos = getMousePos(canvas, e);
      const penMode = penModeRef.current;
      ctx.globalCompositeOperation = "source-over";

      if (penMode == "sticker") {
        const img = new Image();
        img.src = "stickers/test.png";
        img.onload = function () {
          const width = this.width;
          const height = this.height;

          ctx.drawImage(img, pos.x - width / 2, pos.y - height / 2);
        };
        return;
      }
      lastXYRef.current = { x: pos.x, y: pos.y };
      isDrawingRef.current = true;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = brushSizeRef.current;
      ctx.globalAlpha = brushOpacityRef.current / 100;

      if (penMode == "pen") {
        ctx.strokeStyle = brushColorRef.current;
      } else if (penMode == "eraser") {
        ctx.globalCompositeOperation = "destination-out";
      }
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x + 0.001, pos.y + 0.001);
      ctx.stroke();
    };

    const endDrawing = () => {
      isDrawingRef.current = false;
      ctx.closePath();
    };

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
  }, [width, height]);

  return (
    <>
      <Cursor canvasRef={canvasRef} />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ display: "block", cursor: "none" }}
      />
    </>
  );
}

export default DrawingCanvas;
