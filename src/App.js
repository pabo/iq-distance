import React, {Fragment, useState} from 'react';
import './App.css';
import _ from 'lodash';


const handleSquareClick = (e, rowIndex, colIndex, setGrid) => {
  console.log("e", e)
  console.log("row", rowIndex)
  console.log("col", colIndex)
  setGrid(prevGrid => {
    const gridCopy = _.cloneDeep(prevGrid);
    gridCopy[rowIndex][colIndex] = !gridCopy[rowIndex][colIndex];
    console.log("setting grid to ", gridCopy)
    return gridCopy;
  });
}

const Square = ({enabled, rowIndex, colIndex, setGrid}) => {
  return <div
    className={enabled ? 'square-enabled' : 'square'}
    onClick={(e) => handleSquareClick(e, rowIndex, colIndex, setGrid)}></div>
}

const Row = ({rowData, rowIndex, setGrid}) => {
  return <div>
    {rowData.map((data, colIndex) => {
      return <Square setGrid={setGrid} rowIndex={rowIndex} colIndex={colIndex} enabled={!!data} />
    })}
  </div>
}

const Grid = () => {
  const [grid, setGrid] = useState([
    [0,0,0,0,0],
    [0,0,1,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ]);

  console.log("grid rendering and state is ", grid)

  return <div>
    {grid.map((row, rowIndex) => {
      return <Row setGrid={setGrid} rowData={row} rowIndex={rowIndex} />
    })}
  </div>
}

export const App = () => {
  return <div>
    Here's what's up
    <Grid />
  </div>
}
