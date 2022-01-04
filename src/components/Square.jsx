import React from "react";

const COLOR_SPACE_MAX = 255;

export const Square = ({
  selected,
  rowIndex,
  colIndex,
  toggleSquare,
  distances,
  setDragMeansSelect,
}) => {
  const { maxDistance, minDistance, distanceGrid } = distances;
  const thisDistance = distanceGrid[rowIndex][colIndex];

  const zeroedMax = maxDistance - minDistance;
  const zeroedThis = thisDistance - minDistance;
  const percentThis = zeroedThis / zeroedMax;
  const colorValue = percentThis
    ? COLOR_SPACE_MAX - COLOR_SPACE_MAX * percentThis
    : COLOR_SPACE_MAX;
  const colorString = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;

  const classNames = `
    ${selected ? "square-selected" : "square"} 
    ${thisDistance === minDistance ? "minimum" : ""}
  `;

  const handleMouseDown = () => {
    toggleSquare(rowIndex, colIndex);
    setDragMeansSelect(!selected);
  };

  const handleMouseEnter = (e) => {
    if (e.buttons === 1) {
      toggleSquare(rowIndex, colIndex, true);
    }
  };

  return (
    <div
      className={classNames}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      style={{ backgroundColor: colorString }}
    >
      {thisDistance}
    </div>
  );
};
