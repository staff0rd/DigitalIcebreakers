import { useState, useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { ideaWallWithStorageAtom, updatePanOffsetAtom } from "./atoms";

export const useCanvasPanning = () => {
  const gameState = useAtomValue(ideaWallWithStorageAtom);
  const updatePanOffset = useSetAtom(updatePanOffsetAtom);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panStartOffset, setPanStartOffset] = useState({ x: 0, y: 0 });

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setPanStartOffset(gameState.panOffset);
      e.preventDefault();
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      updatePanOffset({
        x: panStartOffset.x + deltaX,
        y: panStartOffset.y + deltaY,
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsPanning(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        const deltaX = e.clientX - panStart.x;
        const deltaY = e.clientY - panStart.y;
        updatePanOffset({
          x: panStartOffset.x + deltaX,
          y: panStartOffset.y + deltaY,
        });
      }
    };

    if (isPanning) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isPanning, panStart, panStartOffset, updatePanOffset]);

  return {
    isPanning,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
  };
};