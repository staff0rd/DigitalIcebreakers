import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { ideaWallWithStorageAtom, updateIdeaPositionAtom } from "./atoms";
import { findNonOverlappingPosition } from "./positionUtils";

export const useAutoPositioning = (containerRef: React.RefObject<HTMLDivElement>) => {
  const gameState = useAtomValue(ideaWallWithStorageAtom);
  const updateIdeaPosition = useSetAtom(updateIdeaPositionAtom);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const viewportWidth = containerRect.width;
    const viewportHeight = Math.max(containerRect.height, window.innerHeight - 100);
    
    gameState.ideas.forEach((idea) => {
      if (idea.x === undefined || idea.y === undefined) {
        const position = findNonOverlappingPosition(
          gameState.ideas,
          viewportWidth,
          viewportHeight
        );
        
        updateIdeaPosition({
          id: idea.id,
          x: position.x,
          y: position.y,
        });
      }
    });
  }, [gameState.ideas, updateIdeaPosition, containerRef]);
};