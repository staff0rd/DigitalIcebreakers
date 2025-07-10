import { Paper, Typography } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";
import { Idea } from "./Idea";

interface DraggableIdeaCardProps {
  idea: Idea;
  showNames: boolean;
  panOffset: { x: number; y: number };
  onBringToFront: (cardId: string) => void;
}

const DraggableIdeaCard = ({ idea, showNames, panOffset, onBringToFront }: DraggableIdeaCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id: idea.id });
  
  const textRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(16);
  
  useEffect(() => {
    if (isDragging) {
      onBringToFront(idea.id);
    }
  }, [isDragging, idea.id, onBringToFront]);
  
  // Auto-resize text to fit in card
  useEffect(() => {
    const calculateFontSize = () => {
      if (!textRef.current) return;
      
      const cardWidth = 180;
      const cardHeight = 180;
      const padding = 32;
      const nameHeight = showNames ? 20 : 0;
      
      const maxWidth = cardWidth - padding;
      const maxHeight = cardHeight - padding - nameHeight;
      
      const testElement = document.createElement('div');
      testElement.style.position = 'absolute';
      testElement.style.visibility = 'hidden';
      testElement.style.fontFamily = 'Roboto, sans-serif';
      testElement.style.lineHeight = '1.2';
      testElement.style.wordBreak = 'break-word';
      testElement.style.textAlign = 'center';
      testElement.style.width = `${maxWidth}px`;
      testElement.textContent = idea.idea;
      document.body.appendChild(testElement);
      
      let bestSize = 8;
      
      for (let size = 48; size >= 8; size -= 2) {
        testElement.style.fontSize = `${size}px`;
        
        if (testElement.offsetHeight <= maxHeight) {
          bestSize = size;
          break;
        }
      }
      
      document.body.removeChild(testElement);
      setFontSize(bestSize);
    };
    
    // Use a timeout to ensure DOM is ready when cards are positioned
    const timeoutId = setTimeout(calculateFontSize, 0);
    
    return () => clearTimeout(timeoutId);
  }, [idea.idea, showNames, idea.x, idea.y]);
  
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    position: 'absolute' as const,
    left: (idea.x || 0) + panOffset.x,
    top: (idea.y || 0) + panOffset.y,
    zIndex: idea.zIndex,
  };
  
  if (idea.x === undefined || idea.y === undefined) {
    return null;
  }
  
  return (
    <Paper 
      ref={setNodeRef}
      style={style}
      elevation={2} 
      sx={{ 
        p: 2, 
        m: 1, 
        width: 180,
        height: 180,
        backgroundColor: `#${idea.color.toString(16).padStart(6, '0')}`,
        cursor: 'grab',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        '&:hover': {
          elevation: 4,
        },
        '&:active': {
          cursor: 'grabbing',
        }
      }}
      {...attributes}
      {...listeners}
      role="article"
    >
      <Typography 
        ref={textRef}
        variant="body1" 
        sx={{ 
          wordBreak: 'break-word',
          fontSize: `${fontSize}px`,
          lineHeight: 1.2,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {idea.idea}
      </Typography>
      {showNames && (
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 1, 
            display: 'block', 
            opacity: 0.7,
            fontSize: '12px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%'
          }}
        >
          {idea.playerName}
        </Typography>
      )}
    </Paper>
  );
};

export default DraggableIdeaCard;