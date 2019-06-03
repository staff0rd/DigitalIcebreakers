import { Rect } from './Rect';

export function intersects(rect1: Rect, rect2: Rect) {
    var intersects =  rect1.x + rect1.width > rect2.x &&  
        rect1.x < rect2.x + rect2.width &&
        rect1.y + rect1.height > rect2.y &&
        rect1.y < rect2.y + rect2.height;
    return intersects;
}