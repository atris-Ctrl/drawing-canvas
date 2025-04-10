import { useEffect, useRef, useState } from "react";
import { useDraw } from "../contexts/DrawProvider";

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
      lastXYRef.current = { x: pos.x, y: pos.y };
      isDrawingRef.current = true;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = brushSizeRef.current;
      ctx.globalAlpha = brushOpacityRef.current / 100;

      if (!penModeRef.current) {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = brushColorRef.current;
      } else {
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
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: "block" }}
    />
  );
}

export default DrawingCanvas;
