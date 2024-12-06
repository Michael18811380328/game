const checkRight = (i, j, map) => {
  let k1 = `${i}-${j}`;
  let k2 = `${i}-${j + 1}`;
  let k3 = `${i}-${j + 2}`;
  let k4 = `${i}-${j + 3}`;
  let k5 = `${i}-${j + 4}`;
  if (map[k1] && map[k2] && map[k3] && map[k4] && map[k5]) {
    return true;
  }
};

const checkBottom = (i, j, map) => {
  let k1 = `${i}-${j}`;
  let k2 = `${i + 1}-${j}`;
  let k3 = `${i + 2}-${j}`;
  let k4 = `${i + 3}-${j}`;
  let k5 = `${i + 4}-${j}`;
  if (map[k1] && map[k2] && map[k3] && map[k4] && map[k5]) {
    return true;
  }
};

const checkRightTop = (i, j, map) => {
  let k1 = `${i}-${j}`;
  let k2 = `${i + 1}-${j - 1}`;
  let k3 = `${i + 2}-${j - 2}`;
  let k4 = `${i + 3}-${j - 3}`;
  let k5 = `${i + 4}-${j - 4}`;
  if (map[k1] && map[k2] && map[k3] && map[k4] && map[k5]) {
    return true;
  }
};

const checkRightBottom = (i, j, map) => {
  let k1 = `${i}-${j}`;
  let k2 = `${i + 1}-${j + 1}`;
  let k3 = `${i + 2}-${j + 2}`;
  let k4 = `${i + 3}-${j + 3}`;
  let k5 = `${i + 4}-${j + 4}`;
  if (map[k1] && map[k2] && map[k3] && map[k4] && map[k5]) {
    return true;
  }
};

const checkWin = (positions) => {
  let positionMap = {};
  for (let i = positions.length - 1; i >= 0; i = i - 2) {
    let current = positions[i];
    let { row_index, col_index } = current;
    let key = `${row_index}-${col_index}`;
    positionMap[key] = true;
  }
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (checkRight(i, j, positionMap) || checkBottom(i, j, positionMap) ||
      checkRightTop(i, j, positionMap) || checkRightBottom(i, j, positionMap)) {
        const lastPosition = positions[positions.length - 1];
        alert(lastPosition.isBlack ? 'black win' : 'white win');
        return true;
      }
    }
  }
};

export { checkWin };
