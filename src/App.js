import React, {useState} from 'react';
import './App.css';
import _ from 'lodash';

const handleSquareClick = (e, rowIndex, colIndex, setGrid) => {
  setGrid(prevGrid => {
    const gridCopy = _.cloneDeep(prevGrid);
    gridCopy[rowIndex][colIndex] = !gridCopy[rowIndex][colIndex];
    return gridCopy;
  });
}

const calculateDistanceGrid = (grid) => {
  const distanceGrid = _.cloneDeep(grid); // lazy way to get the right size grid
  let minDistance = 255;
  let maxDistance = 0;

  grid.forEach((row, rowIndex)  => {
      row.forEach((square, colIndex) => {

        let distance = 0;

        grid.forEach((gridRow, gridRowIndex)  => {
          gridRow.forEach((gridSquare, gridSquareIndex) => {
            if (gridSquare) {
              const rowDiff = gridRowIndex - rowIndex;
              const colDiff = gridSquareIndex - colIndex;
              const hypotenuse = Math.sqrt(rowDiff*rowDiff + colDiff*colDiff);
              distance += hypotenuse;
            }
          })
        })

        const truncDistance = parseFloat(distance.toFixed(2));

        distanceGrid[rowIndex][colIndex] = truncDistance;

        // only set max and min if this square isnt selected
        if (!square) {
          maxDistance = Math.max(truncDistance, maxDistance);
          minDistance = Math.min(truncDistance, minDistance);
        }
    })
  })

  return {
    distanceGrid,
    minDistance,
    maxDistance
  };

}

const Square = ({enabled, rowIndex, colIndex, setGrid, distances}) => {
  const {maxDistance, minDistance, distanceGrid} = distances;
  const thisDistance = distanceGrid[rowIndex][colIndex];

  const zeroedMax = maxDistance - minDistance;
  const zeroedThis = thisDistance - minDistance;
  const percentThis = zeroedThis / zeroedMax;
  const colorValue = 255 - 255 * percentThis;
  const colorString = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;

  const classNames = `
    ${enabled ? 'square-enabled' : 'square'} 
    ${thisDistance === minDistance ? 'minimum' : ''}
  `

  return <div
    className={classNames}
    onClick={(e) => handleSquareClick(e, rowIndex, colIndex, setGrid)}
    style={{"background-color": colorString}}>
      { thisDistance }
    </div>
}

const Row = ({rowData, rowIndex, grid, setGrid, distances}) => {
  return <div className="flexDiv">
    {rowData.map((data, colIndex) => {
      return <Square distances={distances} setGrid={setGrid} grid={grid} rowIndex={rowIndex} colIndex={colIndex} enabled={!!data} />
    })}
  </div>
}

const Grid = () => {
  // const [grid, setGrid] = useState([
  //   [0,0,0],
  //   [0,0,0],
  //   [0,0,0],
  // ]);

  const emptyGrid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ];

  const [grid, setGrid] = useState(emptyGrid);
  const distances = calculateDistanceGrid(grid);

  // const {maxDistance, minDistance, distanceGrid} = distances;

  return <div>
    {grid.map((row, rowIndex) => {
      return <Row setGrid={setGrid} grid={grid} distances={distances} rowData={row} rowIndex={rowIndex} />
    })}
    <button onClick={() => setGrid(emptyGrid)}>Reset Grid</button>
  </div>
}

export const App = () => {
  return <div>
    <Grid />
  </div>
}
