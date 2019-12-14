
function Cell(row, column, opened, flagged, mined, neighborMineCount) {
  // 创建单元格对象（行列，是否打开，是否插旗，是否雷，相邻的雷的个数）ID就是行列号
  return {
    id: row + "" + column,
    row: row,
    column: column,
    opened: opened,
    flagged: flagged,
    mined: mined,
    neighborMineCount: neighborMineCount
  }
}

function Board(boardSize, mineCount) {
  // 创建棋盘对象（棋盘的尺寸，雷的个数）这里传的棋盘的尺寸是一个数值，会渲染一个正方形的棋盘（长宽相等）
  var board = {};
  for (var row = 0; row < boardSize; row++) {
    for (var column = 0; column < boardSize; column++) {
      // 每一个单元格初始化默认的空
      board[row + "" + column] = Cell(row, column, false, false, false, 0);
    }
  }
  // 随机布雷
  board = randomlyAssignMines(board, mineCount);
  // 计算相邻区域的雷的值
  board = calculateNeighborMineCounts(board, boardSize);
  return board;
}

var initializeCells = function(boardSize) {
  // 初始化单元格（传入棋盘尺寸）
  var row = 0;
  var column = 0;
  // 获取每一个单元格
  $(".cell").each(function() {
    // 设置属性、颜色、文字、背景颜色
    $(this).attr("id", row + "" + column).css('color', 'black').text("");
    $('#' + row + "" + column).css('background-image',
      'radial-gradient(#fff,#e6e6e6)');
    column++;
    // 换行
    if (column >= boardSize) {
      column = 0;
      row++;
    }

    $(this).off().click(function(e) {
      // 处理点击事件
      handleClick($(this).attr("id"));
      var isVictory = true;
      var cells = Object.keys(board);
      for (var i = 0; i < cells.length; i++) {
        if (!board[cells[i]].mined && !board[cells[i]].opened) {
          isVictory = false;
          break;
        }
      }
      if (isVictory) {
        gameOver = true;
        $('#messageBox').text('You Win!').css({
          'color': 'white',
          'background-color': 'green'
        });
        clearInterval(timeout);
      }
    });
    $(this).contextmenu(function(e) {
      handleRightClick($(this).attr("id"));
      return false;
    });
  })
}

var handleClick = function(id) {
  // 处理点击事件，区分是否按下ctrl
  if (gameOver) return;
  if (ctrlIsPressed) {
    handleCtrlClick(id);
  } else {
    handleNoCtrlClick(id);
  }
}

var handleNoCtrlClick = function(id) {
  // 根据ID获取cell对象和对应的DOM元素
  var cell = board[id];
  var $cell = $('#' + id);
  // 如果单元格已经打开或者标注旗，return
  if (cell.opened) return;
  if (cell.flagged) return;
  
  if (cell.mined) {
    // 如果点击的单元格是雷，游戏结束，所有雷区的颜色改成红色
    loss();
    // 设置雷区的颜色是红色
    $cell.html(MINE).css('color', 'red');
  } else {
    // 如果不是雷，设置 opened 
    cell.opened = true;
    if (cell.neighborMineCount > 0) {
      // 如果周边雷数量大于0，设置这个单元格的颜色和相邻类的数字
      var color = getNumberColor(cell.neighborMineCount);
      $cell.html(cell.neighborMineCount).css('color', color);
    } else {
      // 如果周边没有雷，设置默认的背景颜色
      $cell.html("").css('background-image', 'radial-gradient(#e6e6e6,#c9c7c7)');
      var neighbors = getNeighbors(id);
      // 获取周边的雷
      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];
        // 如果周边的单元格不是空（不是边界位置），周边的单元格不是插旗或者打开的，点击周边的全部单元格
        if (typeof board[neighbor] !== 'undefined' && !board[neighbor].flagged && !board[neighbor].opened) {
          handleClick(neighbor);
        }
      }
    }
  }
}

var handleCtrlClick = function(id) {
  // 按下ctrl点击单元格（打开这个单元格周边的全部单元格）；
  var cell = board[id];
  var $cell = $('#' + id);

  // 如果这个单元格打开，并且单元格的周边雷的个数大于0
  if (cell.opened && cell.neighborMineCount > 0) {
    var neighbors = getNeighbors(id);
    var flagCount = 0;
    var flaggedCells = [];
    var neighbor;
    // 获取周边单元格、周边插旗的数量
    for (var i = 0; i < neighbors.length; i++) {
      neighbor = board[neighbors[i]];
      if (neighbor.flagged) {
        flaggedCells.push(neighbor);
      }
      flagCount += neighbor.flagged;
    }

    var lost = false;
    if (flagCount === cell.neighborMineCount) {
      for (i = 0; i < flaggedCells.length; i++) {
        if (flaggedCells[i].flagged && !flaggedCells[i].mined) {
          // 如果周边的单元格标注了，但是没有雷，游戏结束
          loss();
          lost = true;
          break;
        }
      }
      if (!lost) {
        // 如果没有结束，相邻的都被点开，并且设置ctrl属性是false
        for (var i = 0; i < neighbors.length; i++) {
          neighbor = board[neighbors[i]];
          if (!neighbor.flagged && !neighbor.opened) {
            ctrlIsPressed = false;
            handleClick(neighbor.id);
          }
        }
      }
    }
  }
}

var handleRightClick = function(id) {
  if (gameOver) return;
  var cell = board[id];
  var $cell = $('#' + id);
  if (cell.opened) return;

  // 如果没有标注，并且剩余的雷数量大于0
  if (!cell.flagged && minesRemaining > 0) {
    cell.flagged = true;
    $cell.html(FLAG).css('color', 'red');
    minesRemaining--;
    // 设置当前单元格是红旗，剩余数量减少1
  } else if (cell.flagged) {
    cell.flagged = false;
    $cell.html("").css('color', 'black');
    minesRemaining++;
  }
  // 更新剩余雷的数量
  $('#mines-remaining').text(minesRemaining);
}

var loss = function() {
  // 单击雷单元格，游戏结束
  gameOver = true;
  // 改变信息栏的文本和颜色
  $('#messageBox').text('Game Over!').css({ 'color': 'white', 'background-color': 'red' });
  var cells = Object.keys(board);
  for (var i = 0; i < cells.length; i++) {
    // 如果一个单元格是雷并且没有标识，设置触碰雷的标志并改变颜色
    if (board[cells[i]].mined && !board[cells[i]].flagged) {
      $('#' + board[cells[i]].id).html(MINE)
        .css('color', 'black');
    }
  }
  // 清空定时器
  clearInterval(timeout);
}

var randomlyAssignMines = function(board, mineCount) {
  // 随机布雷函数，设置空的雷区数组
  var mineCooridinates = [];
  for (var i = 0; i < mineCount; i++) {
    var randomRowCoordinate = getRandomInteger(0, boardSize);
    var randomColumnCoordinate = getRandomInteger(0, boardSize);
    // 获取随机的行列坐标，并设置cell的坐标
    var cell = randomRowCoordinate + "" + randomColumnCoordinate;
    // 如果已有雷区的坐标包括新单元格的坐标，循环获取，直到获取的数值不包括雷（如果雷的密度很大，这里会消耗性能）
    // 可以首先判断雷区的密度，如果密度很大，那么可以将有雷的数组传入，获取新的单元格避免这部分雷区
    // 这里可以优化成 do...while 循环
    while (mineCooridinates.includes(cell)) {
      randomRowCoordinate = getRandomInteger(0, boardSize);
      randomColumnCoordinate = getRandomInteger(0, boardSize);
      cell = randomRowCoordinate + "" + randomColumnCoordinate;
    }
    // 如果单元格没有雷，将这个单元格放在数组中，并设置对应单元格的属性是雷
    mineCooridinates.push(cell);
    board[cell].mined = true;
  }
  return board;
}

var calculateNeighborMineCounts = function(board, boardSize) {
  // 计算相邻的雷的数量
  var cell;
  var neighborMineCount = 0;
  for (var row = 0; row < boardSize; row++) {
    for (var column = 0; column < boardSize; column++) {
      // 遍历每一个单元格，获取这个单元格的ID和对应的单元格对象
      var id = row + "" + column;
      cell = board[id];
      if (!cell.mined) {
        // 如果单元格没有布雷，获取邻居
        var neighbors = getNeighbors(id);
        neighborMineCount = 0;
        // 遍历邻居，获取周边雷区的数量
        for (var i = 0; i < neighbors.length; i++) {
          neighborMineCount += isMined(board, neighbors[i]);
        }
        // 设置当前单元格的雷数量是计算的结果
        cell.neighborMineCount = neighborMineCount;
      }
    }
  }
  return board;
}

var getNeighbors = function(id) {
  // 获取一个单元格相邻八个单元格
  var row = parseInt(id[0]);
  var column = parseInt(id[1]);
  var neighbors = [];
  neighbors.push((row - 1) + "" + (column - 1));
  neighbors.push((row - 1) + "" + column);
  neighbors.push((row - 1) + "" + (column + 1));
  neighbors.push(row + "" + (column - 1));
  neighbors.push(row + "" + (column + 1));
  neighbors.push((row + 1) + "" + (column - 1));
  neighbors.push((row + 1) + "" + column);
  neighbors.push((row + 1) + "" + (column + 1));

  // 如果某一个位置的长度大于2，那么删除这个位置？
  for (var i = 0; i < neighbors.length; i++) {
    if (neighbors[i].length > 2) {
      neighbors.splice(i, 1);
      i--;
      // 不要在循环中改变循环参数
    }
  }

  return neighbors
}

var getNumberColor = function(number) {
  // 根据雷的数量获取不同的颜色
  var color = 'black';
  if (number === 1) {
    color = 'blue';
  } else if (number === 2) {
    color = 'green';
  } else if (number === 3) {
    color = 'red';
  } else if (number === 4) {
    color = 'orange';
  }
  return color;
  // 优化 var colorList = ['balck', 'blue', 'green', 'red', 'orange']; return colorList[number];
}

// 获取某个单元格是否是雷（可以优化）
var isMined = function(board, id) {
  var cell = board[id];
  var mined = 0;
  if (typeof cell !== 'undefined') {
    mined = cell.mined ? 1 : 0;
  }
  return mined;
}

// 获取随机的整数（工具函数）
var getRandomInteger = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var newGame = function(boardSize, mines) {
  // 游戏初始化，设置文字和颜色
  $('#time').text("0");
  $('#messageBox').text('Start sweep mine and this is MC').css({
    'color': 'rgb(255, 255, 153)', 'background-color': 'rgb(102, 178, 255)'
  });
  minesRemaining = mines;
  $('#mines-remaining').text(minesRemaining);
  gameOver = false;
  // 初始化单元格
  initializeCells(boardSize);
  board = Board(boardSize, mines);
  timer = 0;
  // 设置计时器并显示时间
  clearInterval(timeout);
  timeout = setInterval(function() {
    // This will be executed after 1,000 milliseconds
    timer++;
    if (timer >= 999) {
      timer = 999;
    }
    $('#time').text(timer);
  }, 1000);
  return board;
}

var FLAG = "&#9873;"; // unicode 中小旗子标志
var MINE = "&#9881;"; // unicode 中尺寸标志（雷爆炸的效果）
var boardSize = 10; // 设置数量需要和HTML同时改动
var mines = 30;
var timer = 0;
var timeout;
var minesRemaining;

// 监听是都按下ctrl键
$(document).keydown(function(event) {
  if (event.ctrlKey)
    ctrlIsPressed = true;
});
$(document).keyup(function() {
  ctrlIsPressed = false;
});
var ctrlIsPressed = false;
var board = newGame(boardSize, mines);

// 点击开始新的游戏
$('#new-game-button').click(function() {
  board = newGame(boardSize, mines);
})