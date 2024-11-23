import React, { useState, useCallback } from 'react'
import { checkWin } from '../../utils';
import './chess.css';

const COUNT = 9; // Board width - 1

function Chess() {
  let [ positions, setPositions ] = useState([]);

  const onClick = useCallback((row_index, col_index) => {
    if (positions.find(p => p.row_index === row_index && p.col_index === col_index)) {
      alert('Can not put chess in this place');
    }

    const posi = {
      row_index,
      col_index,
    };
    const new_positions = positions.slice(0);

    if (positions.length % 2 === 1) {
      posi.isBlack = true;
    } else {
      posi.isBlack = false;
    }

    new_positions.push(posi);
    setPositions(new_positions);

    // first render this step, then check win
    setTimeout(() => {
      checkWin(new_positions);
      if (new_positions.length === COUNT * COUNT) {
        alert('Game is over, tied');
      }
    }, 1)
  }, [positions]);

  let matrix = new Array(COUNT).fill(1);
  matrix = matrix.map(i => new Array(COUNT).fill(1));

  const renderItem = (row_index, col_index) => {
    let item = positions.find(p => p.row_index === row_index && p.col_index === col_index);
    if (item) {
      return (
        <div className={`position ${item.isBlack ? 'position-black' : 'position-white'}`}></div>
      );
    } else {
      return null;
    }
  }

  return (
    <div className="chess">
      {matrix.map((row, row_index) => {
        return (
          <div className='row' key={row_index}>
            {row.map((col, col_index) => {
              return (
                <div className='column' key={col_index} onClick={() => onClick(row_index, col_index)}>
                  {renderItem(row_index, col_index)}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  )
}

Chess.propTypes = {}

export default Chess
