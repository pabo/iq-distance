import React, { useState } from "react";
import "./App.css";
import _ from "lodash";


const Square = ({ selected, rowIndex, colIndex, toggleSquare, distances }) => {
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

const Row = ({ rowData, rowIndex, toggleSquare, distances }) => {
  return (
    <div className="flexDiv">
      {rowData.map((data, colIndex) => {
        return (
          <Square
            key={colIndex}
            distances={distances}
            toggleSquare={toggleSquare}
            rowIndex={rowIndex}
            colIndex={colIndex}
            selected={!!data}
          />
        );
      })}
    </div>
  );
};

const Grid = () => {
  const toggleSquare = (rowIndex, colIndex) => {
    setGrid((prevGrid) => {
      const gridCopy = _.cloneDeep(prevGrid);
      gridCopy[rowIndex][colIndex] = !gridCopy[rowIndex][colIndex];
      return gridCopy;
    });
  };

  const createEmptyGrid = (size) => {
    let emptyGrid = [];
    for (let i = 0; i < size; i++) {
      emptyGrid.push(new Array(size).fill(0));
    }

    return emptyGrid;
  };

 const calculateDistanceGrid = () => {
  const distanceGrid = createEmptyGrid(gridSize);
  let minDistance = 99999999;
  let maxDistance = 0;

  grid.forEach((row, rowIndex) => {
    row.forEach((square, colIndex) => {
      let totalDistance = 0;

      grid.forEach((gridRow, gridRowIndex) => {
        gridRow.forEach((gridSquare, gridSquareIndex) => {
          if (gridSquare) {
            const rowDiff = gridRowIndex - rowIndex;
            const colDiff = gridSquareIndex - colIndex;
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

  const [gridSize, setGridSize] = useState(15);
  const [grid, setGrid] = useState(createEmptyGrid(gridSize));
  const distances = calculateDistanceGrid(grid);

  const gridIsEmpty = !grid.some((row) => row.some((square) => !!square));

  return (
    <div className={gridIsEmpty ? "" : "nonEmptyGrid"}>
      {grid.map((row, rowIndex) => {
        return (
          <Row
            key={rowIndex}
            toggleSquare={toggleSquare}
            grid={grid}
            distances={distances}
            rowData={row}
            rowIndex={rowIndex}
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

export const App = () => {
  return (
    <div>
      <Grid />
    </div>
  );
};
