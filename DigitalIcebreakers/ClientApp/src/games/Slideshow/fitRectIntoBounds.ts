interface Rect {
    width: number,
    height: number;
}

export function fitRectIntoBounds(rect: Rect, bounds: Rect) {
 var rectRatio = rect.width / rect.height;
 var boundsRatio = bounds.width / bounds.height;

 var newDimensions: Rect = { width: 0, height: 0};

 // Rect is more landscape than bounds - fit to width
 if(rectRatio > boundsRatio) {
   newDimensions.width = bounds.width;
   newDimensions.height = rect.height * (bounds.width / rect.width);
 }
 // Rect is more portrait than bounds - fit to height
 else {
   newDimensions.width = rect.width * (bounds.height / rect.height);
   newDimensions.height = bounds.height;
 }

 return newDimensions;
}