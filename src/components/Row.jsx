import React from "react";
import { Square } from "./Square";

export const Row = ({ rowIndex, rowData, distances, toggleSquare, setDragMeansSelect }) => {
  return (
    <div className="flexDiv">
      {rowData.map((selected, colIndex) => {
        return (
          <Square
            key={colIndex}
            distances={distances}
            toggleSquare={toggleSquare}
            rowIndex={rowIndex}
            colIndex={colIndex}
            selected={!!selected}
            setDragMeansSelect={setDragMeansSelect}
          />
        );
      })}
    </div>
  );
};
