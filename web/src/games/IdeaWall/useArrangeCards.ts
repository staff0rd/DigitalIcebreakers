import { useEffect, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { ideaWallWithStorageAtom, arrangeIdeasInGridAtom } from "./atoms";

export const useArrangeCards = () => {
  const gameState = useAtomValue(ideaWallWithStorageAtom);
  const arrangeIdeasInGrid = useSetAtom(arrangeIdeasInGridAtom);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameState.pendingArrange && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const viewportWidth = containerRect.width;
      const viewportHeight = Math.max(containerRect.height, window.innerHeight - 100);
      
      arrangeIdeasInGrid({
        viewportWidth,
        viewportHeight,
      });
    }
  }, [gameState.pendingArrange, arrangeIdeasInGrid]);

  return {
    containerRef,
  };
};