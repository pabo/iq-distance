import React, { useState } from "react";
import "./App.css";
import _ from "lodash";

const handleSquareClick = (e, rowIndex, colIndex, setGrid) => {
  setGrid((prevGrid) => {
    const gridCopy = _.cloneDeep(prevGrid);
    gridCopy[rowIndex][colIndex] = !gridCopy[rowIndex][colIndex];
    return gridCopy;
  });
};

const calculateDistanceGrid = (grid) => {
  const distanceGrid = _.cloneDeep(grid); // lazy way to get the right size grid
  let minDistance = 255;
  let maxDistance = 0;

  grid.forEach((row, rowIndex) => {
    row.forEach((square, colIndex) => {
      let distance = 0;

      grid.forEach((gridRow, gridRowIndex) => {
        gridRow.forEach((gridSquare, gridSquareIndex) => {
          if (gridSquare) {
            const rowDiff = gridRowIndex - rowIndex;
            const colDiff = gridSquareIndex - colIndex;
            const hypotenuse = Math.sqrt(rowDiff * rowDiff + colDiff * colDiff);
            distance += hypotenuse;
          }
        });
      });

      const truncDistance = parseFloat(distance.toFixed(2));

      distanceGrid[rowIndex][colIndex] = truncDistance;

      // only set max and min if this square isnt selected
      if (!square) {
        maxDistance = Math.max(truncDistance, maxDistance);
        minDistance = Math.min(truncDistance, minDistance);
      }
    });
  });

  return {
    distanceGrid,
    minDistance,
    maxDistance,
  };
};

const Square = ({ enabled, rowIndex, colIndex, setGrid, distances }) => {
  const { maxDistance, minDistance, distanceGrid } = distances;
  const thisDistance = distanceGrid[rowIndex][colIndex];

  const zeroedMax = maxDistance - minDistance;
  const zeroedThis = thisDistance - minDistance;
  const percentThis = zeroedThis / zeroedMax;
  const colorValue = percentThis ? 255 - 255 * percentThis : 255;
  const colorString = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;

  const classNames = `
    ${enabled ? "square-enabled" : "square"} 
    ${thisDistance === minDistance ? "minimum" : ""}
  `;

  return (
    <div
      className={classNames}
      onClick={(e) => handleSquareClick(e, rowIndex, colIndex, setGrid)}
      style={{ backgroundColor: colorString }}
    >
      {thisDistance}
    </div>
  );
};

const Row = ({ rowData, rowIndex, grid, setGrid, distances }) => {
  return (
    <div className="flexDiv">
      {rowData.map((data, colIndex) => {
        return (
          <Square
            key={colIndex}
            distances={distances}
            setGrid={setGrid}
            grid={grid}
            rowIndex={rowIndex}
            colIndex={colIndex}
            enabled={!!data}
          />
        );
      })}
    </div>
  );
};

const Grid = () => {
  const createEmptyGrid = (size) => {
    let emptyGrid = [];
    for (let i = 0; i < size; i++) {
      emptyGrid.push(new Array(size).fill(0));
    }

    return emptyGrid;
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
            setGrid={setGrid}
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
