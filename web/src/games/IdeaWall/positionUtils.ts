import { Idea } from './Idea';

export interface Position {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

const CARD_SIZE = 180;
const CARD_MARGIN = 20;
const EFFECTIVE_CARD_SIZE = CARD_SIZE + CARD_MARGIN;

export const doRectanglesOverlap = (rect1: Rectangle, rect2: Rectangle): boolean => {
  return !(
    rect1.x + rect1.width <= rect2.x ||
    rect2.x + rect2.width <= rect1.x ||
    rect1.y + rect1.height <= rect2.y ||
    rect2.y + rect2.height <= rect1.y
  );
};

export const positionToRectangle = (position: Position): Rectangle => ({
  x: position.x,
  y: position.y,
  width: CARD_SIZE,
  height: CARD_SIZE,
});

export const isPositionWithinWidthBounds = (position: Position, viewportWidth: number): boolean => {
  return (
    position.x >= 0 &&
    position.y >= 0 &&
    position.x + CARD_SIZE <= viewportWidth
  );
};

export const findNonOverlappingPosition = (
  existingIdeas: Idea[],
  viewportWidth: number,
  viewportHeight: number
): Position => {
  const positionedIdeas = existingIdeas.filter(idea => idea.x !== undefined && idea.y !== undefined);
  
  const existingRects = positionedIdeas.map(idea => 
    positionToRectangle({ x: idea.x!, y: idea.y! })
  );
  
  const maxCols = Math.floor(viewportWidth / EFFECTIVE_CARD_SIZE);
  
  let row = 0;
  while (true) {
    for (let col = 0; col < maxCols; col++) {
      const position: Position = {
        x: col * EFFECTIVE_CARD_SIZE + CARD_MARGIN,
        y: row * EFFECTIVE_CARD_SIZE + CARD_MARGIN,
      };
      
      const candidateRect = positionToRectangle(position);
      const hasOverlap = existingRects.some(rect => doRectanglesOverlap(candidateRect, rect));
      
      if (!hasOverlap && isPositionWithinWidthBounds(position, viewportWidth)) {
        return position;
      }
    }
    row++;
    
    if (row > 100) {
      break;
    }
  }
  
  return {
    x: CARD_MARGIN,
    y: CARD_MARGIN,
  };
};