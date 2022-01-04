import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Row } from "./Row";

const MIN_GRID_SIZE = 3;
const DEFAULT_GRID_SIZE = 15;
const MAX_GRID_SIZE = 40;
const buttonShortcutSizes = [5, 10, 15, 20, 30, 40];

const createEmptyGrid = (size) => {
  let emptyGrid = [];
  for (let i = 0; i < size; i++) {
    emptyGrid.push(new Array(size).fill(false));
  }

  return emptyGrid;
};

const getResizedGrid = (grid, size) => {
  const oldSize = grid.length;
  let newGrid = _.cloneDeep(grid);

  if (size > oldSize) {
    // add columns
    newGrid.forEach((row) => {
      for (let i = 0; i < size - oldSize; i++) {
        row.push(false);
      }
    });

    // add rows
    for (let i = 0; i < size - oldSize; i++) {
      newGrid.push(new Array(size).fill(false));
    }
  } else {
    // remove columns
    newGrid.forEach((row) => row.splice(size, oldSize - size));

    //remove rows
    newGrid.splice(size, oldSize - size);
  }

  return newGrid;
};

// thanks pythagoras
const distanceBetween = (x1, y1, x2, y2) => {
  const xDiff = x1 - x2;
  const yDiff = y1 - y2;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
};

// create a grid of distances, while keeping track of the min and max
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
            totalDistance += distanceBetween(
              gridRowIndex,
              squareIndex,
              rowIndex,
              colIndex
            );
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
  const [gridSizeDisplay, setGridSizeDisplay] = useState(DEFAULT_GRID_SIZE);
  const [grid, setGrid] = useState(createEmptyGrid(gridSize));
  const [dragMeansSelect, setDragMeansSelect] = useState(true);
  const distances = calculateDistanceGrid(grid);
  const gridIsEmpty = !grid.some((row) => row.some((square) => !!square));

  // any time we set the grid size, update the display grid size and the grid itself
  useEffect(() => {
    setGridSizeDisplay(gridSize);
    setGrid(getResizedGrid(grid, gridSize));
  }, [gridSize]);

  // only allow validated values for grid size
  const protectedSetGridSize = (size) => {
    setGridSize(Math.max(MIN_GRID_SIZE, Math.min(size, MAX_GRID_SIZE)));
  };

  // without the third arg, its a pure toggle. with the third arg, we set the value based on
  // whether this dragging instance should be selecting or de-selecting squares
  const toggleSquare = (rowIndex, colIndex, dragged) => {
    setGrid((prevGrid) => {
      const gridCopy = _.cloneDeep(prevGrid);
      gridCopy[rowIndex][colIndex] = dragged
        ? dragMeansSelect
        : !gridCopy[rowIndex][colIndex];
      return gridCopy;
    });
  };

  const handleGridSizeDisplayChange = (e) => {
    let size = parseInt(e.target.value, 10);
    if (!size) {
      size = "";
    }

    setGridSizeDisplay(size);
  };

  // 'enter' causes submit
  const handleGridSizeKeyPress = (e) => {
    if (e.key === "Enter") {
      protectedSetGridSize(gridSizeDisplay);
    }
  };

  // tabbing or clicking out causes submit
  const handleGridSizeBlur = () => {
    protectedSetGridSize(gridSizeDisplay);
  };

  const handleResetClick = () => {
    setGrid(createEmptyGrid(gridSize));
  };

  return (
    <div className={gridIsEmpty ? "" : "nonEmptyGrid"}>
      <div className="controls flexDiv">
        <button
          className="control"
          onClick={() => protectedSetGridSize(gridSize - 1)}
        >
          -
        </button>
        {buttonShortcutSizes.map((size) => (
          <button
            key={size}
            className="control"
            onClick={() => protectedSetGridSize(size)}
          >
            {size}x{size}
          </button>
        ))}
        <button
          className="control"
          onClick={() => protectedSetGridSize(gridSize + 1)}
        >
          +
        </button>
        <div className="control">
          <input
            value={gridSizeDisplay}
            onChange={handleGridSizeDisplayChange}
            onKeyPress={handleGridSizeKeyPress}
            onBlur={handleGridSizeBlur}
          />
          x
          <input
            value={gridSizeDisplay}
            onChange={handleGridSizeDisplayChange}
            onKeyPress={handleGridSizeKeyPress}
            onBlur={handleGridSizeBlur}
          />
        </div>
        <div className="control">
          <button className="control" onClick={handleResetClick}>
            Reset Grid
          </button>
        </div>
      </div>
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
    </div>
  );
};
