import React from 'react'
import './board.css';

const COUNT = 10;

function Board() {
  let matrix = new Array(COUNT).fill(1);
  matrix = matrix.map(i => new Array(COUNT).fill(1));
  return (
    <div className="board">
      {matrix.map((row, row_index) => {
        return (
          <div className='row' key={row_index}>
            {row.map((col, col_index) => {
              return (
                <div className='column' key={col_index}></div>
              );
            })}
          </div>
        );
      })}
    </div>
  )
}

Board.propTypes = {}

export default Board
