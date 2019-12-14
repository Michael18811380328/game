const CELL_TYPE = Object.freeze({
  EMPTY: "EMPTY",
  FOOD: "FOOD",
  SNAKE: "SNAKE"
});

const DIRECTION = Object.freeze({
  NONE: "NONE",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  UP: "UP",
  DOWN: "DOWN"
});

// Object.freeze 表示冻结一个对象（对象的属性不能增删改，对象的原型不能改变）
// 定义了单元格的类型（三种，空单元格，食物单元格）和方向的类型（上下左右无）


// [单元格：传入三个变量，返回一个单元格对象（具有行列和类型属性）]
function Cell(row, column, cellType) {
  return {
    row: row,
    column: column, 
    cellType: cellType
  }
}

// [蛇 对象，传入单元格，开始的长度，和背景画布 ]
function Snake(cell, startingLength, board) {

  // 设置传入的单元格属性是蛇
  let head = cell;
  // 蛇的全部
  let snakeParts = [];
  head.cellType = CELL_TYPE.SNAKE;

  // 将蛇头放在蛇的部分中；
  snakeParts.push(head);

  // 获取蛇的初始长度，获取身体的部分（一个竖行），把身体的部分设置成蛇属性，并放在蛇的身体里
  for(let i = 0; i < startingLength - 1; i++) {
    let bodyPart = board.cells[head.row + (i + 1)][head.column];
    bodyPart.cellType = CELL_TYPE.SNAKE;
    snakeParts.push( bodyPart )
  }

  // 生长：将这个单元格放入蛇的身体里
  let grow = function() {
    snakeParts.push(head);
  }

  // 移动函数
  let move = function(nextCell) {
    // 获取下一个单元格的属性
    let cellType = nextCell.cellType;
    // 获取蛇尾，同时蛇身体减去1
    let tail = snakeParts.pop();
    // 设置蛇尾的属性是空
    tail.cellType = CELL_TYPE.EMPTY;

    // 设置下一个单元格是蛇头，设置单元格的属性并放在蛇的部分中
    head = nextCell;
    head.cellType = CELL_TYPE.SNAKE;
    snakeParts.unshift(head);
    // 蛇的中间每一个部分的属性设置为蛇
    snakeParts.forEach(function(part) {
      part.cellType = CELL_TYPE.SNAKE;
    });
    // 把下一个单元格的属性返回（下一个属性可能是食物、蛇身体、边界、或者空）
    return cellType;
  }

  // 检查崩溃（游戏结束）
  let checkCrash = function(nextCell) {
    // 如果下一个节点是未定义（边界），崩溃
    let crashed = ( typeof nextCell === 'undefined' );
    if( !crashed ) {
      crashed = snakeParts.some(function(cell) {
        // 如果下一个单元格是蛇身体的一部分（行列号相同），判断崩溃
        return (cell.row === nextCell.row && cell.column === nextCell.column);
      });
    }
    // 返回崩溃情况
    return crashed;
  }

  // API：返回蛇头（当前传入的单元格）
  let getHead = function() {
    return head;
  }

  return {
    getHead: getHead,
    grow: grow,
    move: move,
    checkCrash: checkCrash
  }
}

// Board 函数（棋盘函数）
// Array.from(arr, function) 第一个参数是伪数组或者可遍历对象（Set Map 对象），可以转化成一个数组。第二个参数是 map 函数，将第一个函数（数组）的每一项进行处理，然后处理返回值。这样可以产生一个二维数组嵌套；原本 from API 可以对一个数组进行预处理，然后产生另一个数组（浅拷贝）。

function Board(rowCount, columnCount) {
  // 创建一个二维数组（行列数）
  let cells = Array.from(Array(rowCount), () => new Array(columnCount));

  // 把数组的每一项设置成一个Cell对象
  for( let row = 0; row < rowCount; row++ ) {
    for( let column = 0; column < columnCount; column++ ) {
      cells[row][column] = Cell(row, column, CELL_TYPE.EMPTY);
    }
  }

  // 渲染函数（设置食物单元格和蛇单元格的类名样式）
  let render = function() {
    let snakeCssClass = 'snake';
    let foodCssClass = 'food';
    for(let row = 0; row < rowCount; row++) {
      for(let column = 0; column < columnCount; column++) {
        // 获取每一个cell的类型
        let cellType = cells[row][column].cellType;
        // 获取界面上Cell对应的DOM元素
        let element = document.getElementById( row + "_" + column );
        // 根据cell不同，设置界面DOM节点类名（是否是蛇，是否是食物）这里直接改变DOM元素（遍历一次改变类名，性能）
        if( cellType === CELL_TYPE.EMPTY ) {
          element.classList.remove(snakeCssClass);
          element.classList.remove(foodCssClass);
        }
        else if( cellType === CELL_TYPE.SNAKE ) {
          element.classList.add(snakeCssClass);
          element.classList.remove(foodCssClass);
        }
        else if( cellType === CELL_TYPE.FOOD ) {
          element.classList.add(foodCssClass);
          element.classList.remove(snakeCssClass);
        }
      }
    }
  }

  // 放置食物
  let placeFood = function() {
    // 获取可以放置食物的单元格数组
    let availableCells = getAvailableCells();
    // 获取一个随机整数（小于食物单元格的数量），并将对应的单元格设置为食物；
    let cellIndex = getRandomInteger(0, availableCells.length);
    availableCells[cellIndex].cellType = CELL_TYPE.FOOD;
    // 这里可以改成多个食物：在多个单元格设置食物（需要if判断cellIndex的数量）
    // availableCells[cellIndex + 1].cellType = CELL_TYPE.FOOD;
    // availableCells[cellIndex - 1].cellType = CELL_TYPE.FOOD;
  }

  // 获取可以放置食物的单元格数组：遍历二维数组，如果单元格是空的，返回这个单元格
  let getAvailableCells = function() {
    let availableCells = [];
    for (let row = 0; row < rowCount; row++) {
      for (let column = 0; column < columnCount; column++) {
        if (cells[row][column].cellType === CELL_TYPE.EMPTY) {
          availableCells.push(cells[row][column]);
        }
      }
    }
    return availableCells;
  }

  // API 获取列数量（外部暴露属性）
  let getColumnCount = function() {
    return columnCount;
  }

  // 获取行数量
  let getRowCount = function() {
    return rowCount;
  }

  // 返回棋盘对象：获取行数量、列数量、单元格序列、放置食物函数，渲染函数
  return {
    getRowCount: getRowCount,
    getColumnCount: getColumnCount,
    cells: cells,
    placeFood: placeFood,
    render: render
  } 
}

// 获取两个数之间的随机整数（
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * ( max - min )) + min;
}

// 主函数
function Game(snake, board) {
  // 设置基本参数
  let directions = [];
  let direction = DIRECTION.NONE;
  let gameOver = false;
  let score = 0;

  // 更新
  let update = function(snake, board) {
    // 如果游戏没有结束并且第一个单元格不是 none
    if (!gameOver && getFirstDirection() !== DIRECTION.NONE) {
      // 获取下一个单元格
      let nextCell = getNextCell(snake.getHead(), board);

      // 根据下个单元格，如果崩溃了
      if (snake.checkCrash(nextCell)) {
        // 清空方向并设置游戏结束
        directions = [];
        direction = DIRECTION.NONE;
        gameOver = true;
        modal.style.display = "block";
        let message = "Game Over! You scored " + score + "  points!";
        document.getElementById("message").innerHTML = message;
        // 设置界面的提示信息
      } else {
        // 如果没有崩溃，那么将蛇移动到下一个单元格，分数增加，蛇增加，重新放置食物
        let nextCellType = snake.move(nextCell);
        if (nextCellType == CELL_TYPE.FOOD) {
          score += 100;
          snake.grow();
          board.placeFood();
        }
      }
    }
  };

  // 获取下一个单元格（传入蛇头和界面背景）
  let getNextCell = function(snakeHead, board) {
    // 获取蛇头的行列
    let row = snakeHead.row;
    let column = snakeHead.column;
    // 获取第一个方向
    direction = getFirstDirection();

    if (direction === DIRECTION.RIGHT) {
      column++;
    }
    else if (direction === DIRECTION.LEFT) {
      column--;
    }
    else if (direction === DIRECTION.UP) {
      row--;
    }
    else if (direction === DIRECTION.DOWN) {
      row++;
    }

    // 根据方向，修改蛇头的位置；如果下一个方向在界面内部（行列号位于范围内，设置下一个单元格）
    let nextCell;
    if (row > -1 && row < board.getRowCount() && column > -1 && column < board.getColumnCount()) {
      nextCell = board.cells[row][column];
    }
    // 把方向的最后一个值去掉
    directions.shift();
    // 返回下一个单元格（如果下一个单元格是边界外部，那么返回的是undefined）
    return nextCell;
  };

  // 增加方向（将新的方向放在列表中）
  let addDirection = function(newDirection){
    directions.push(newDirection);
  }

  // 获取第一个方向（如果长度大于0，那么返回第一个长度，否则返回Direction 就是none）
  let getFirstDirection = function() {
    let result = direction;
    if (directions.length > 0) {
      result = directions[0];
    }
    return result;
  }

  // 获取最后一个方向
  let getLastDirection = function() {
    let result = direction;
    if (directions.length > 0){
      result = directions[directions.length - 1];
    }
    return result;
  }

  // 获取超出最大距离的方向（如果当前数组的长度大于3，就是true ）
  let exceededMaxDirections = function() {
    return directions.length > 3;
  }

  // 返回相关函数
  return {
    exceededMaxDirections: exceededMaxDirections,
    getLastDirection: getLastDirection,
    addDirection: addDirection,
    update: update
  };
}

// 初始化单元格：输入界面中列的数量
function initializeCells(columnCount) {
  let row = 0;
  let column = 0;
  let cells = document.querySelectorAll('.cell');
  // 获取全部的单元格
  cells.forEach(function(cell) {
    cell.id = row + "_" + column;
    cell.classList = "";
    cell.classList.add("cell");
    // 设置单元格的类是cell,ID是行号和列号
    // 如果一行单元格的长度大于列数量，就换行
    column++;
    if (column >= columnCount) {
      column = 0;
      row++;
    }
  });
  // 这里的cell是DOM结构的伪数组（深复制）所以直接改变属性即可
}

// 监听按键：控制蛇的移动方向：update 点击某个按键可以暂停游戏，再次点击可以继续游戏（设置一个变量游戏是否暂停的函数）
function listenForInput(game) {
  let firstTime = true;

  let movingVertically = function() {
    // 上一次的操作是垂直操作（不是左右），并且游戏没有超出最大的方向
    return !game.exceededMaxDirections() && game.getLastDirection() !== DIRECTION.RIGHT && game.getLastDirection() !== DIRECTION.LEFT;
  };
  let movingHorizontally = function() {
    // 上一次的操作是水平操作（不是上下），并且游戏没有超出最大的方向
    return !game.exceededMaxDirections() && game.getLastDirection() !== DIRECTION.UP && game.getLastDirection() !== DIRECTION.DOWN;
  };
  let changeDirection = function(event) {
    // 首次加载时，向上运动（这个参数可以变成其他方向）
    if( firstTime ) {
      game.addDirection( DIRECTION.UP );
      firstTime = false;
    } else {
      const LEFT_ARROW = 37;
      const RIGHT_ARROW = 39;
      const UP_ARROW = 38;
      const DOWN_ARROW = 40;
      // 如果点击左右键，并且最近一次操作不是左右操作，那么左转弯
      // update 使用键盘的 asdw 也可以改变方向（针对于笔记本电脑上下左右不好用的情况，或者让用户自定义操作键）
      if( event.keyCode == LEFT_ARROW && movingVertically() ) {
        game.addDirection( DIRECTION.LEFT );
      } else if( event.keyCode == RIGHT_ARROW && movingVertically() ) {
        game.addDirection( DIRECTION.RIGHT );
      } else if( event.keyCode == UP_ARROW && movingHorizontally() ) {
        game.addDirection( DIRECTION.UP );
      } else if( event.keyCode == DOWN_ARROW && movingHorizontally() ) {
        game.addDirection( DIRECTION.DOWN );
      }
    }
  };
  document.onkeydown = null;
  document.addEventListener('keydown', changeDirection);
}

// 新游戏，初始化界面的高度和宽度，蛇的初始长度
function newGame() {
  // 这里的参数可以自定义
  const rowCount = 20;
  const columnCount = 20;
  const startingLength = 5;

  // 新建一个背景（根据行列的尺寸）
  let board = Board(rowCount, columnCount);

  // 获取面板中间的单元格作为开始单元格
  let rowIndex = Math.floor(rowCount/2);
  let columnIndex = Math.floor(columnCount/2);
  // 创建蛇（根据开始单元格、开始长度、面板参数）
  let snake = Snake( board.cells[rowIndex][columnIndex], startingLength, board );

  // 创建游戏
  let game = Game(snake, board);

  // 初始化单元格数据
  initializeCells(columnCount);

  // 放置食物
  board.placeFood();

  // 渲染背景
  board.render();

  // 监听键盘输入事件
  listenForInput(game);

  // 设置间隔，每200ms更新一次界面（可以自定义更新速度，根据蛇的长度，或者用户自定义难度）
  let interval = setInterval(function() { 
    game.update(snake, board);
    board.render();
  }, 200);
  // 返回间隔
  return interval;
}

// 获取界面的 modal 对话框
let modal = document.getElementById("modal");
// 获取关闭对话框关闭按钮
let closeModalButton = document.getElementsByClassName("close")[0];
// 点击关闭对话框，就开始新的游戏
closeModalButton.onclick = function() {
  modal.style.display = "none";
  clearInterval(snakeGame);
  snakeGame = newGame();
}
// 创建新的游戏
let snakeGame = newGame();