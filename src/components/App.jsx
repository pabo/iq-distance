import React, { useState } from "react";
import _ from "lodash";
import { Row } from "./Row";

const DEFAULT_GRID_SIZE = 15;
const createEmptyGrid = (size) => {
  let emptyGrid = [];
  for (let i = 0; i < size; i++) {
    emptyGrid.push(new Array(size).fill(false));
  }

  return emptyGrid;
};

const calculateDistanceGrid = (grid) => {
  const distanceGrid = createEmptyGrid(grid.length);
  let minDistance = Number.MAX_SAFE_INTEGER;
  let maxDistance = 0;

  grid.forEach((row, rowIndex) => {
    row.forEach((square, colIndex) => {
      let totalDistance = 0;

      grid.forEach((gridRow, gridRowIndex) => {
        gridRow.forEach((squareIsSelected, squareIndex) => {
          if (squareIsSelected) {
            const rowDiff = gridRowIndex - rowIndex;
            const colDiff = squareIndex - colIndex;
            const distance = Math.sqrt(rowDiff * rowDiff + colDiff * colDiff);
            totalDistance += distance;
          }
        });
      });

      const distanceDisplay = parseFloat(totalDistance.toFixed(2));
      distanceGrid[rowIndex][colIndex] = distanceDisplay;

      // don't consider this square for max and min if its selected
      if (!square) {
        maxDistance = Math.max(distanceDisplay, maxDistance);
        minDistance = Math.min(distanceDisplay, minDistance);
      }
    });
  });

  return {
    distanceGrid,
    minDistance,
    maxDistance,
  };
};

export const App = () => {
  const [gridSize, setGridSize] = useState(DEFAULT_GRID_SIZE);
  const [grid, setGrid] = useState(createEmptyGrid(gridSize));
  const [dragMeansSelect, setDragMeansSelect] = useState(true);
  const distances = calculateDistanceGrid(grid);
  const gridIsEmpty = !grid.some((row) => row.some((square) => !!square));

  const toggleSquare = (rowIndex, colIndex, dragged ) => {
    setGrid((prevGrid) => {
      const gridCopy = _.cloneDeep(prevGrid);
      gridCopy[rowIndex][colIndex] = dragged ? dragMeansSelect : !gridCopy[rowIndex][colIndex];
      return gridCopy;
    });
  };

  const handleResetClick = () => {
    setGrid(createEmptyGrid(gridSize));
  };

  const handleGridSizeChange = (e) => {
    let size = parseInt(e.target.value, 10);
    if (!size) {
      size = 0;
    }

    setGridSize(size);
    setGrid(createEmptyGrid(size));
  };

  return (
    <div className={gridIsEmpty ? "" : "nonEmptyGrid"}>
      {grid.map((row, rowIndex) => {
        return (
          <Row
            key={rowIndex}
            rowIndex={rowIndex}
            rowData={row}
            grid={grid}
            distances={distances}
            toggleSquare={toggleSquare}
            setDragMeansSelect={setDragMeansSelect}
          />
        );
      })}
      <br />
      Grid size: <input value={gridSize} onChange={handleGridSizeChange} />
      <br />
      <button onClick={handleResetClick}>Reset Grid</button>
    </div>
  );
};
