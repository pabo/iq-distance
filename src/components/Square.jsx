import React from "react";

export const Square = ({
  selected,
  rowIndex,
  colIndex,
  toggleSquare,
  distances,
}) => {
  const { maxDistance, minDistance, distanceGrid } = distances;
  const thisDistance = distanceGrid[rowIndex][colIndex];

  const zeroedMax = maxDistance - minDistance;
  const zeroedThis = thisDistance - minDistance;
  const percentThis = zeroedThis / zeroedMax;
  const colorValue = percentThis ? 255 - 255 * percentThis : 255;
  const colorString = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;

  const classNames = `
    ${selected ? "square-selected" : "square"} 
    ${thisDistance === minDistance ? "minimum" : ""}
  `;

  return (
    <div
      className={classNames}
      onClick={() => toggleSquare(rowIndex, colIndex)}
      style={{ backgroundColor: colorString }}
    >
      {thisDistance}
    </div>
  );
};
