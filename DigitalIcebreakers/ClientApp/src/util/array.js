const move = (array, index, delta) => {
    //ref: https://gist.github.com/albertein/4496103
    var newIndex = index + delta;
    if (newIndex < 0 || newIndex == array.length) return; //Already at the top or bottom.
    var indexes = [index, newIndex].sort((a, b) => a - b); //Sort the indixes (fixed)
    array.splice(indexes[0], 2, array[indexes[1]], array[indexes[0]]); //Replace from lowest index, two elements, reverting the order
  }

const moveUp = (array, element) => {
    const newArray = [...array];
    move(newArray, element, -1);
    return newArray;
};
  
const moveDown = (array, element) => {
    const newArray = [...array];
    move(newArray, element, 1);
    return newArray;
};

export default {
    moveUp,
    moveDown,
}