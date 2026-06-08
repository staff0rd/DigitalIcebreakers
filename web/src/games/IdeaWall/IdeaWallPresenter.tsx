import { useAtomValue, useSetAtom } from "jotai";
import { ideaWallWithStorageAtom, updateIdeaPositionAtom, bringCardToFrontAtom } from "./atoms";
import { Box, Typography } from "@mui/material";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DraggableIdeaCard from "./DraggableIdeaCard";
import { useCanvasPanning } from "./useCanvasPanning";
import { useArrangeCards } from "./useArrangeCards";
import { useAutoPositioning } from "./useAutoPositioning";

const IdeaWallPresenter = () => {
  const gameState = useAtomValue(ideaWallWithStorageAtom);
  const updateIdeaPosition = useSetAtom(updateIdeaPositionAtom);
  const bringCardToFront = useSetAtom(bringCardToFrontAtom);
  
  const {
    isPanning,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
  } = useCanvasPanning();
  
  const { containerRef } = useArrangeCards();
  
  useAutoPositioning(containerRef);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    
    if (delta.x !== 0 || delta.y !== 0) {
      const activeIdea = gameState.ideas.find((idea) => idea.id === active.id);
      if (activeIdea) {
        const newX = (activeIdea.x || 0) + delta.x;
        const newY = (activeIdea.y || 0) + delta.y;
        
        updateIdeaPosition({
          id: active.id as string,
          x: Math.max(0, newX),
          y: Math.max(0, newY),
        });
      }
    }
  };

  return (
    <Box 
      ref={containerRef}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      sx={{ 
        p: 2, 
        position: 'relative', 
        minHeight: '100vh',
        overflow: 'hidden',
        cursor: isPanning ? 'grabbing' : 'grab',
        userSelect: 'none'
      }}
    >
      {gameState.ideas.length > 0 ? (
        <DndContext 
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          {gameState.ideas.map((idea) => (
            <DraggableIdeaCard 
              key={idea.id} 
              idea={idea} 
              showNames={gameState.showNames}
              panOffset={gameState.panOffset}
              onBringToFront={bringCardToFront}
            />
          ))}
        </DndContext>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh' 
        }}>
          <Typography variant="h6" sx={{ opacity: 0.6 }}>
            Waiting on ideas...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default IdeaWallPresenter;
