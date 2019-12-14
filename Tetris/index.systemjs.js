System.register([], function (exports_1, context_1) {
    "use strict";
    var MyApp;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            MyApp = /** @class */ (function () {
                function MyApp() {
                    this._lastFPS = new Date();
                    this.keytimer = 0;
                    this.paused = false;
                    /* KEYBOARD CONTROLS */
                    this.dropKey = false;
                    /* TOUCH CONTROLS */
                    this.touchDirection = '';
                    this.touchX_Start = 0;
                    this.touchY_Start = 0;
                    this.touch_threshold = 20;
                    this.lastTouch = new Date();
                    this.touchTimer = 0;
                    this.touchMoved = false;
                    //draw:boolean = false;
                    this.lastCalledTime = new Date();
                    this.fpscounter = 0;
                    this.currentfps = 0;
                    this.bindRivets();
                    this.createGameTable();
                    this.initGame();
                    requestAnimationFrame(this.requestNextFrame);
                    $('#header')[0].addEventListener('touchstart', function (e) { e.stopPropagation(); }, false);
                    $('#header')[0].addEventListener('touchend', function (e) { e.stopPropagation(); }, false);
                    $('#divMain')[0].addEventListener('touchstart', this.touchStart, false);
                    $('#divMain')[0].addEventListener('touchend', this.touchEnd, false);
                    $('#divMain')[0].addEventListener('touchmove', this.touchMove, false);
                    // document.addEventListener( 'keypress', this.keyPress, false );
                    document.onkeydown = this.keyDown; //function(ev){console.log(ev)};
                    document.onkeyup = this.keyUp;
                    // $('#btnStart')[0].addEventListener( 'touchstart', this.dontPrevent, false );
                    // document.getElementById('btnStart').ontouchmove = function(e){};
                }
                MyApp.prototype.keyDown = function (event) {
                    var app = window.myApp;
                    // if (event.key=='ArrowLeft')
                    //     app.moveLeft();
                    // if (event.key=='ArrowRight')
                    //     app.moveRight();
                    // if (event.key=='ArrowDown')
                    //     app.moveDown();
                    // if (event.key=='ArrowUp')
                    //     app.rotate();
                    if (event.key == 'ArrowDown' || event.key == 'Down')
                        app.downKey = true;
                    if (event.key == 'ArrowLeft' || event.key == 'Left') {
                        app.leftKey = true;
                        app.keytimer++;
                    }
                    if (event.key == 'ArrowRight' || event.key == 'Right') {
                        app.rightKey = true;
                        app.keytimer++;
                    }
                    if (event.key == 'a' && !app.dropKey) {
                        app.drop();
                        app.dropKey = true;
                    }
                    if (event.key == 'p') {
                        app.btnPause();
                    }
                    if (event.key == 'n') {
                        app.newGame_Click();
                    }
                };
                MyApp.prototype.keyUp = function (event) {
                    var app = window.myApp;
                    // console.log(event);
                    if (event.key == 'a') {
                        app.dropKey = false;
                    }
                    if (event.key == 'ArrowUp' || event.key == 'Up')
                        app.upKey = true;
                    if (event.key == 'ArrowDown' || event.key == 'Down')
                        app.downKey = false;
                    if (event.key == 'ArrowLeft' || event.key == 'Left') {
                        app.leftKey = false;
                        app.keytimer = 0;
                    }
                    if (event.key == 'ArrowRight' || event.key == 'Right') {
                        app.rightKey = false;
                        app.keytimer = 0;
                    }
                };
                MyApp.prototype.touchStart = function (event) {
                    var app = window.myApp;
                    //PREVENT DOUBLE TAP ZOOM ON IOS
                    var delta = (new Date().getTime() - app.lastTouch.getTime());
                    if (delta < 500) {
                        event.preventDefault();
                    }
                    app.lastTouch = new Date();
                    app.touchX_Start = event.touches[0].clientX;
                    app.touchY_Start = event.touches[0].clientY;
                    app.touchTimer = 0;
                    app.touchMoved = false;
                };
                MyApp.prototype.touchMove = function (event) {
                    event.preventDefault();
                    var app = window.myApp;
                    var leftCounter = 0;
                    var rightCounter = 0;
                    var upCounter = 0;
                    var downCounter = 0;
                    if (event.touches[0].clientX < app.touchX_Start - app.touch_threshold) {
                        leftCounter = app.touchX_Start - event.touches[0].clientX;
                        // app.touchDirection = 'left';
                    }
                    if (event.touches[0].clientX > app.touchX_Start + app.touch_threshold) {
                        rightCounter = event.touches[0].clientX - app.touchX_Start;
                        // app.touchDirection = 'right';
                    }
                    if (event.touches[0].clientY < app.touchY_Start - app.touch_threshold) {
                        upCounter = app.touchY_Start - event.touches[0].clientY;
                        // app.touchDirection = 'up';
                    }
                    if (event.touches[0].clientY > app.touchY_Start + app.touch_threshold) {
                        downCounter = event.touches[0].clientY - app.touchY_Start;
                        // app.touchDirection = 'down';
                    }
                    if (leftCounter > 0 || rightCounter > 0 || upCounter > 0 || downCounter > 0) {
                        var greatest = app.findGreatest([leftCounter, rightCounter, upCounter, downCounter]);
                        if (greatest == 0)
                            app.touchDirection = 'left';
                        if (greatest == 1)
                            app.touchDirection = 'right';
                        if (greatest == 2)
                            app.touchDirection = 'up';
                        if (greatest == 3)
                            app.touchDirection = 'down';
                    }
                    // if (app.touchDirection == 'left')
                    // {
                    //     app.touchTimer++;
                    //     if (app.touchTimer>3)
                    //     {
                    //         app.moveLeft();
                    //         app.touchTimer = 0;
                    //         app.touchMoved = true;
                    //     }
                    // }
                    // if (app.touchDirection == 'right')
                    // {
                    //     app.touchTimer++;
                    //     if (app.touchTimer>3)
                    //     {
                    //         app.moveRight();
                    //         app.touchTimer = 0;
                    //         app.touchMoved = true;
                    //     }
                    // }
                };
                MyApp.prototype.touchEnd = function (event) {
                    var app = window.myApp;
                    if (app.paused)
                        return;
                    if (app.touchDirection == 'left') {
                        // if (!app.touchMoved)
                        app.moveLeft();
                    }
                    if (app.touchDirection == 'right') {
                        // if (!app.touchMoved)
                        app.moveRight();
                    }
                    // if (app.touchDirection=='up')
                    //     app.rotate();
                    if (app.touchDirection == 'down') {
                        app.drop();
                    }
                    if (app.touchDirection == '') {
                        // let xDistance = Math.abs(event.touches[0].clientX-this.touchX_Start);
                        // let yDistance = Math.abs(event.touches[0].clientY-this.touchY_Start);
                        // if (xDistance+yDistance<8)
                        app.rotate();
                    }
                    // app.downKey = false;
                    app.touchDirection = '';
                    // app.leftKey = false;
                    // app.rightKey = false;
                };
                MyApp.prototype.findGreatest = function (nums) {
                    var greatest = 0;
                    var greatestIndex = 0;
                    for (var i = 0; i < nums.length; i++) {
                        if (nums[i] > greatest) {
                            greatestIndex = i;
                            greatest = nums[i];
                        }
                    }
                    return greatestIndex;
                };
                MyApp.prototype.bindRivets = function () {
                    rivets.bind($('body'), { data: this });
                };
                MyApp.prototype.getRandomNumber = function (max) {
                    return Math.floor(Math.random() * Math.floor(max));
                };
                MyApp.prototype.newGame_Click = function () {
                    this.reset();
                };
                MyApp.prototype.initGame = function () {
                    // this.currentTime = new Date();
                    this.fps = 0;
                    this.gameOver = false;
                    this.startGame = false;
                    this.nextLevel = 0;
                    this.timer = 0;
                    this.piece = 0;
                    this.state = 0;
                    this.centX = 0;
                    this.centY = 0;
                    this.score = 0;
                    this.level = 0;
                    this.lines = 0;
                    this.nextPiece = this.getRandomNumber(7) + 1;
                    this.toClear = false;
                    this.toMakePiece = true;
                    this.upKey = false;
                    this.downKey = false;
                    this.leftKey = false;
                    this.rightKey = false;
                    this.gameMatrix = [];
                    this.gameMatrixBuffer = [];
                    this.delay = 32;
                    for (var i = 0; i < 20; i++) {
                        var arr1 = [];
                        var arr2 = [];
                        this.gameMatrix.push(arr1);
                        this.gameMatrixBuffer.push(arr2);
                        for (var j = 0; j < 10; j++) {
                            this.gameMatrix[i][j] = 0;
                            this.gameMatrixBuffer[i][j] = 0;
                        }
                    }
                    this.nextPieceMatrix = [];
                    for (var i = 0; i < 4; i++) {
                        var arr3 = [];
                        this.nextPieceMatrix.push(arr3);
                        for (var j = 0; j < 5; j++)
                            this.nextPieceMatrix[i][j] = 0;
                    }
                };
                MyApp.prototype.reset = function () {
                    this.paused = false;
                    this.gameOver = false;
                    this.startGame = true;
                    for (var i = 0; i < 4; i++) {
                        for (var j = 0; j < 7; j++)
                            this.nextPieceMatrix[i][j] = 0;
                    }
                    this.nextLevel = 0;
                    this.timer = 0;
                    this.piece = 0;
                    this.state = 0;
                    this.centX = 0;
                    this.centY = 0;
                    this.score = 0;
                    this.level = 1;
                    this.lines = 0;
                    this.nextPiece = this.getRandomNumber(7) + 1;
                    this.toClear = false;
                    this.toMakePiece = true;
                    this.upKey = false;
                    this.downKey = false;
                    this.leftKey = false;
                    this.rightKey = false;
                    this.gameMatrix = [];
                    this.gameMatrixBuffer = [];
                    for (var i = 0; i < 20; i++) {
                        var arr1 = [];
                        var arr2 = [];
                        this.gameMatrix.push(arr1);
                        this.gameMatrixBuffer.push(arr2);
                        for (var j = 0; j < 10; j++) {
                            this.gameMatrix[i][j] = 0;
                            this.gameMatrixBuffer[i][j] = 0;
                        }
                    }
                };
                MyApp.prototype.gameLoop = function () {
                    //program loop
                    if (!this.startGame) {
                        return;
                    }
                    if (this.paused) {
                        return;
                    }
                    if (this.level == 1)
                        this.levelSpeed = 30;
                    if (this.level == 2)
                        this.levelSpeed = 25;
                    if (this.level == 3)
                        this.levelSpeed = 20;
                    if (this.level == 4)
                        this.levelSpeed = 17;
                    if (this.level == 5)
                        this.levelSpeed = 14;
                    if (this.level == 6)
                        this.levelSpeed = 10;
                    if (this.level == 7)
                        this.levelSpeed = 8;
                    if (this.level == 8)
                        this.levelSpeed = 5;
                    if (this.level == 9)
                        this.levelSpeed = 3;
                    if (this.level == 10)
                        this.levelSpeed = 2;
                    if (this.timer == -1)
                        this.checkMatrix();
                    if (this.toClear)
                        this.timer--;
                    else
                        this.timer++;
                    if (this.timer == -24) {
                        this.clearBlocks();
                        this.toClear = false;
                        this.timer = 0;
                    }
                    if (this.toMakePiece && this.timer >= 0) {
                        this.makePiece();
                        this.toMakePiece = false;
                    }
                    if (this.upKey && !this.toClear) {
                        this.rotate();
                        this.upKey = false;
                    }
                    if (this.downKey && !this.toClear)
                        this.moveDown();
                    if (this.leftKey && !this.toClear && this.keytimer != 2) {
                        this.moveLeft();
                        this.keytimer++;
                    }
                    if (this.rightKey && !this.toClear && this.keytimer != 2) {
                        this.moveRight();
                        this.keytimer++;
                    }
                    if (this.timer == this.levelSpeed) {
                        this.timer = 0;
                        this.moveDown();
                    }
                    this.findShadow();
                };
                MyApp.prototype.gameover = function () {
                    this.startGame = false;
                    for (var i = 0; i < 4; i++)
                        for (var j = 0; j < 5; j++)
                            this.nextPieceMatrix[i][j] = 0;
                    for (var i = 0; i < 20; i++) {
                        for (var j = 0; j < 10; j++) {
                            this.gameMatrix[i][j] = 0;
                            this.gameMatrixBuffer[i][j] = 0;
                        }
                    }
                    this.gameOver = true;
                };
                MyApp.prototype.makePiece = function () {
                    this.piece = this.nextPiece;
                    this.nextPiece = this.getRandomNumber(7) + 1;
                    for (var i = 0; i < 4; i++)
                        for (var j = 0; j < 7; j++)
                            this.nextPieceMatrix[i][j] = 0;
                    if (this.gameMatrix[1][4] != 0) {
                        this.gameover();
                        return;
                    }
                    if (this.nextPiece == 1) {
                        this.nextPieceMatrix[1][2] = 1;
                        this.nextPieceMatrix[2][2] = 1;
                        this.nextPieceMatrix[2][1] = 1;
                        this.nextPieceMatrix[2][3] = 1;
                    }
                    if (this.nextPiece == 2) {
                        this.nextPieceMatrix[1][3] = 2;
                        this.nextPieceMatrix[1][2] = 2;
                        this.nextPieceMatrix[2][2] = 2;
                        this.nextPieceMatrix[2][1] = 2;
                    }
                    if (this.nextPiece == 3) {
                        this.nextPieceMatrix[1][1] = 3;
                        this.nextPieceMatrix[1][2] = 3;
                        this.nextPieceMatrix[2][2] = 3;
                        this.nextPieceMatrix[2][3] = 3;
                    }
                    if (this.nextPiece == 4) {
                        this.nextPieceMatrix[1][3] = 4;
                        this.nextPieceMatrix[2][3] = 4;
                        this.nextPieceMatrix[2][2] = 4;
                        this.nextPieceMatrix[2][1] = 4;
                    }
                    if (this.nextPiece == 5) {
                        this.nextPieceMatrix[1][1] = 5;
                        this.nextPieceMatrix[2][1] = 5;
                        this.nextPieceMatrix[2][2] = 5;
                        this.nextPieceMatrix[2][3] = 5;
                    }
                    if (this.nextPiece == 6) {
                        this.nextPieceMatrix[1][3] = 6;
                        this.nextPieceMatrix[1][2] = 6;
                        this.nextPieceMatrix[2][2] = 6;
                        this.nextPieceMatrix[2][3] = 6;
                    }
                    if (this.nextPiece == 7) {
                        this.nextPieceMatrix[0][2] = 7;
                        this.nextPieceMatrix[1][2] = 7;
                        this.nextPieceMatrix[2][2] = 7;
                        this.nextPieceMatrix[3][2] = 7;
                    }
                    if (this.piece == 1) {
                        this.gameMatrixBuffer[0][5] = 1;
                        this.gameMatrixBuffer[1][5] = 1;
                        this.gameMatrixBuffer[1][4] = 1;
                        this.gameMatrixBuffer[1][6] = 1;
                        this.centX = 5;
                        this.centY = 1;
                        this.state = 1;
                    }
                    if (this.piece == 2) {
                        this.gameMatrixBuffer[0][5] = 2;
                        this.gameMatrixBuffer[0][4] = 2;
                        this.gameMatrixBuffer[1][4] = 2;
                        this.gameMatrixBuffer[1][3] = 2;
                        this.centX = 4;
                        this.centY = 1;
                        this.state = 1;
                    }
                    if (this.piece == 3) {
                        this.gameMatrixBuffer[0][3] = 3;
                        this.gameMatrixBuffer[0][4] = 3;
                        this.gameMatrixBuffer[1][4] = 3;
                        this.gameMatrixBuffer[1][5] = 3;
                        this.centX = 4;
                        this.centY = 1;
                        this.state = 1;
                    }
                    if (this.piece == 4) {
                        this.gameMatrixBuffer[0][5] = 4;
                        this.gameMatrixBuffer[1][5] = 4;
                        this.gameMatrixBuffer[1][4] = 4;
                        this.gameMatrixBuffer[1][3] = 4;
                        this.centX = 4;
                        this.centY = 1;
                        this.state = 1;
                    }
                    if (this.piece == 5) {
                        this.gameMatrixBuffer[0][3] = 5;
                        this.gameMatrixBuffer[1][3] = 5;
                        this.gameMatrixBuffer[1][4] = 5;
                        this.gameMatrixBuffer[1][5] = 5;
                        this.centX = 4;
                        this.centY = 1;
                        this.state = 1;
                    }
                    if (this.piece == 6) {
                        this.gameMatrixBuffer[0][5] = 6;
                        this.gameMatrixBuffer[0][4] = 6;
                        this.gameMatrixBuffer[1][4] = 6;
                        this.gameMatrixBuffer[1][5] = 6;
                    }
                    if (this.piece == 7) {
                        this.gameMatrixBuffer[0][5] = 7;
                        this.gameMatrixBuffer[1][5] = 7;
                        this.gameMatrixBuffer[2][5] = 7;
                        this.gameMatrixBuffer[3][5] = 7;
                        this.centX = 5;
                        this.centY = 1;
                        this.state = 1;
                    }
                    if (this.gameMatrix[1][4] != 0)
                        this.gameover();
                };
                MyApp.prototype.moveLeft = function () {
                    var success = true;
                    for (var i = 0; i < 10; i++) {
                        for (var j = 0; j < 20; j++) {
                            if (this.gameMatrixBuffer[j][i] != 0 && i == 0)
                                success = false;
                            if (this.gameMatrixBuffer[j][i] != 0 && i != 0 && this.gameMatrix[j][i - 1] != 0)
                                success = false;
                        }
                    }
                    if (success) {
                        this.centX -= 1;
                        for (var i = 1; i < 10; i++) {
                            for (var j = 0; j < 20; j++) {
                                if (this.gameMatrixBuffer[j][i] != 0) {
                                    this.gameMatrixBuffer[j][i - 1] = this.gameMatrixBuffer[j][i];
                                    this.gameMatrixBuffer[j][i] = 0;
                                }
                            }
                        }
                    }
                };
                MyApp.prototype.moveRight = function () {
                    var success = true;
                    for (var i = 9; i > -1; i--) {
                        for (var j = 0; j < 20; j++) {
                            if (this.gameMatrixBuffer[j][i] != 0 && i == 9)
                                success = false;
                            if (this.gameMatrixBuffer[j][i] != 0 && i != 9 && this.gameMatrix[j][i + 1] != 0)
                                success = false;
                        }
                    }
                    if (success) {
                        this.centX += 1;
                        for (var i = 8; i > -1; i--) {
                            for (var j = 0; j < 20; j++) {
                                if (this.gameMatrixBuffer[j][i] != 0) {
                                    this.gameMatrixBuffer[j][i + 1] = this.gameMatrixBuffer[j][i];
                                    this.gameMatrixBuffer[j][i] = 0;
                                }
                            }
                        }
                    }
                };
                MyApp.prototype.drop = function () {
                    while (this.toMakePiece == false) {
                        this.moveDown();
                    }
                };
                MyApp.prototype.findShadow = function () {
                    //initialize shadowFinderMatrix
                    if (!this.shadowFinderMatrix) {
                        this.shadowFinderMatrix = [];
                        for (var i = 0; i < 20; i++) {
                            var arr1 = [];
                            this.shadowFinderMatrix.push(arr1);
                            for (var j = 0; j < 10; j++) {
                                this.shadowFinderMatrix[i][j] = 0;
                            }
                        }
                    }
                    //copy gameMatrixBuffer to shadowFinderMatrix
                    for (var i = 0; i < 20; i++) {
                        for (var j = 0; j < 10; j++) {
                            this.shadowFinderMatrix[i][j] = this.gameMatrixBuffer[i][j];
                        }
                    }
                    var shadowFound = false;
                    var preventInfiniteLoopCounter = 0;
                    while (shadowFound == false) {
                        preventInfiniteLoopCounter++;
                        if (preventInfiniteLoopCounter > 20)
                            break;
                        for (var i = 0; i < 10; i++) {
                            for (var j = 0; j < 20; j++) {
                                if (this.shadowFinderMatrix[j][i] != 0 && j == 19)
                                    shadowFound = true;
                                if (this.shadowFinderMatrix[j][i] != 0 && j != 19 && this.gameMatrix[j + 1][i] != 0)
                                    shadowFound = true;
                            }
                        }
                        if (!shadowFound) {
                            for (var i = 19; i > -1; i--) {
                                for (var j = 0; j < 10; j++) {
                                    if (this.shadowFinderMatrix[i][j] != 0) {
                                        this.shadowFinderMatrix[i + 1][j] = this.shadowFinderMatrix[i][j];
                                        this.shadowFinderMatrix[i][j] = 0;
                                    }
                                }
                            }
                        }
                    }
                };
                MyApp.prototype.moveDown = function () {
                    var success = true;
                    for (var i = 0; i < 10; i++) {
                        for (var j = 0; j < 20; j++) {
                            if (this.gameMatrixBuffer[j][i] != 0 && j == 19)
                                success = false;
                            if (this.gameMatrixBuffer[j][i] != 0 && j != 19 && this.gameMatrix[j + 1][i] != 0)
                                success = false;
                        }
                    }
                    if (success) {
                        this.centY += 1;
                        for (var i = 19; i > -1; i--) {
                            for (var j = 0; j < 10; j++) {
                                if (this.gameMatrixBuffer[i][j] != 0) {
                                    this.gameMatrixBuffer[i + 1][j] = this.gameMatrixBuffer[i][j];
                                    this.gameMatrixBuffer[i][j] = 0;
                                }
                            }
                        }
                        this.timer = 0;
                    }
                    else {
                        for (var i = 0; i < 20; i++) {
                            for (var j = 0; j < 10; j++) {
                                if (this.gameMatrixBuffer[i][j] != 0) {
                                    this.gameMatrix[i][j] = this.gameMatrixBuffer[i][j];
                                    this.gameMatrixBuffer[i][j] = 0;
                                }
                            }
                        }
                        this.toMakePiece = true;
                        this.timer = -1;
                    }
                };
                MyApp.prototype.rotate = function () {
                    if (this.piece == 1) {
                        if (this.state == 1) {
                            if (this.centY != 19 && this.gameMatrix[this.centY + 1][this.centX] == 0) {
                                this.gameMatrixBuffer[this.centY + 1][this.centX] = this.piece;
                                this.gameMatrixBuffer[this.centY][this.centX - 1] = 0;
                                this.state = 2;
                                return;
                            }
                        }
                        if (this.state == 2) {
                            if (this.centX != 0 && this.gameMatrix[this.centY][this.centX - 1] == 0) {
                                this.gameMatrixBuffer[this.centY][this.centX - 1] = this.piece;
                                this.gameMatrixBuffer[this.centY - 1][this.centX] = 0;
                                this.state = 3;
                                return;
                            }
                        }
                        if (this.state == 3) {
                            if (this.gameMatrix[this.centY - 1][this.centX] == 0) {
                                this.gameMatrixBuffer[this.centY - 1][this.centX] = this.piece;
                                this.gameMatrixBuffer[this.centY][this.centX + 1] = 0;
                                this.state = 4;
                                return;
                            }
                        }
                        if (this.state == 4) {
                            if (this.centX != 9 && this.gameMatrix[this.centY][this.centX + 1] == 0) {
                                this.gameMatrixBuffer[this.centY][this.centX + 1] = this.piece;
                                this.gameMatrixBuffer[this.centY + 1][this.centX] = 0;
                                this.state = 1;
                                return;
                            }
                        }
                    } //this.piece 1
                    if (this.piece == 2) {
                        if (this.state == 1) {
                            if (this.centY != 19 && this.gameMatrix[this.centY + 1][this.centX] == 0 && this.gameMatrix[this.centY - 1][this.centX - 1] == 0) {
                                this.gameMatrixBuffer[this.centY + 1][this.centX] = this.piece;
                                this.gameMatrixBuffer[this.centY - 1][this.centX - 1] = this.piece;
                                this.gameMatrixBuffer[this.centY - 1][this.centX] = 0;
                                this.gameMatrixBuffer[this.centY - 1][this.centX + 1] = 0;
                                this.state = 2;
                                return;
                            }
                        }
                        if (this.state == 2) {
                            if (this.centX != 9 && this.gameMatrix[this.centY - 1][this.centX] == 0 && this.gameMatrix[this.centY - 1][this.centX + 1] == 0) {
                                this.gameMatrixBuffer[this.centY - 1][this.centX] = this.piece;
                                this.gameMatrixBuffer[this.centY - 1][this.centX + 1] = this.piece;
                                this.gameMatrixBuffer[this.centY + 1][this.centX] = 0;
                                this.gameMatrixBuffer[this.centY - 1][this.centX - 1] = 0;
                                this.state = 1;
                                return;
                            }
                        }
                    } //this.piece 2
                    if (this.piece == 3) {
                        if (this.state == 1) {
                            if (this.centY != 19 && this.gameMatrix[this.centY + 1][this.centX] == 0 && this.gameMatrix[this.centY - 1][this.centX + 1] == 0) {
                                this.gameMatrixBuffer[this.centY + 1][this.centX] = this.piece;
                                this.gameMatrixBuffer[this.centY - 1][this.centX + 1] = this.piece;
                                this.gameMatrixBuffer[this.centY - 1][this.centX] = 0;
                                this.gameMatrixBuffer[this.centY - 1][this.centX - 1] = 0;
                                this.state = 2;
                                return;
                            }
                        }
                        if (this.state == 2) {
                            if (this.centX != 0 && this.gameMatrix[this.centY - 1][this.centX] == 0 && this.gameMatrix[this.centY - 1][this.centX - 1] == 0) {
                                this.gameMatrixBuffer[this.centY - 1][this.centX] = this.piece;
                                this.gameMatrixBuffer[this.centY - 1][this.centX - 1] = this.piece;
                                this.gameMatrixBuffer[this.centY + 1][this.centX] = 0;
                                this.gameMatrixBuffer[this.centY - 1][this.centX + 1] = 0;
                                this.state = 1;
                                return;
                            }
                        }
                    } //this.piece 3
                    if (this.piece == 4) {
                        if (this.state == 1) {
                            if (this.centY != 19 && this.gameMatrix[this.centY - 1][this.centX] == 0 && this.gameMatrix[this.centY + 1][this.centX] == 0 && this.gameMatrix[this.centY + 1][this.centX + 1] == 0) {
                                this.gameMatrixBuffer[this.centY - 1][this.centX] = this.piece;
                                this.gameMatrixBuffer[this.centY + 1][this.centX] = this.piece;
                                this.gameMatrixBuffer[this.centY + 1][this.centX + 1] = this.piece;
                                this.gameMatrixBuffer[this.centY][this.centX - 1] = 0;
                                this.gameMatrixBuffer[this.centY][this.centX + 1] = 0;
                                this.gameMatrixBuffer[this.centY - 1][this.centX + 1] = 0;
                                this.state = 2;
                                return;
                            }
                        }
                        if (this.state == 2) {
                            if (this.centX != 0 && this.gameMatrix[this.centY][this.centX - 1] == 0 && this.gameMatrix[this.centY + 1][this.centX - 1] == 0 && this.gameMatrix[this.centY][this.centX + 1] == 0) {
                                this.gameMatrixBuffer[this.centY][this.centX - 1] = this.piece;
                                this.gameMatrixBuffer[this.centY + 1][this.centX - 1] = this.piece;
                                this.gameMatrixBuffer[this.centY][this.centX + 1] = this.piece;
                                this.gameMatrixBuffer[this.centY + 1][this.centX] = 0;
                                this.gameMatrixBuffer[this.centY + 1][this.centX + 1] = 0;
                                this.gameMatrixBuffer[this.centY - 1][this.centX] = 0;
                                this.state = 3;
                                return;
                            }
                        }
                        if (this.state == 3) {
                            if (this.gameMatrix[this.centY - 1][this.centX] == 0 && this.gameMatrix[this.centY - 1][this.centX - 1] == 0 && this.gameMatrix[this.centY + 1][this.centX] == 0) {
                                this.gameMatrixBuffer[this.centY - 1][this.centX] = this.piece;
                                this.gameMatrixBuffer[this.centY - 1][this.centX - 1] = this.piece;
                                this.gameMatrixBuffer[this.centY + 1][this.centX] = this.piece;
                                this.gameMatrixBuffer[this.centY][this.centX - 1] = 0;
                                this.gameMatrixBuffer[this.centY + 1][this.centX - 1] = 0;
                                this.gameMatrixBuffer[this.centY][this.centX + 1] = 0;
                                this.state = 4;
                                return;
                            }
                        }
                        if (this.state == 4) {
                            if (this.centX != 9 && this.gameMatrix[this.centY][this.centX - 1] == 0 && this.gameMatrix[this.centY][this.centX + 1] == 0 && this.gameMatrix[this.centY - 1][this.centX + 1] == 0) {
                                this.gameMatrixBuffer[this.centY][this.centX - 1] = this.piece;
                                this.gameMatrixBuffer[this.centY][this.centX + 1] = this.piece;
                                this.gameMatrixBuffer[this.centY - 1][this.centX + 1] = this.piece;
                                this.gameMatrixBuffer[this.centY - 1][this.centX] = 0;
                                this.gameMatrixBuffer[this.centY - 1][this.centX - 1] = 0;
                                this.gameMatrixBuffer[this.centY + 1][this.centX] = 0;
                                this.state = 1;
                                return;
                            }
                        }
                    } //this.piece 4
                    if (this.piece == 5) {
                        if (this.state == 1) {
                            if (this.centY != 19 && this.gameMatrix[this.centY - 1][this.centX] == 0 && this.gameMatrix[this.centY + 1][this.centX] == 0 && this.gameMatrix[this.centY - 1][this.centX + 1] == 0) {
                                this.gameMatrixBuffer[this.centY - 1][this.centX] = this.piece;
                                this.gameMatrixBuffer[this.centY + 1][this.centX] = this.piece;
                                this.gameMatrixBuffer[this.centY - 1][this.centX + 1] = this.piece;
                                this.gameMatrixBuffer[this.centY][this.centX - 1] = 0;
                                this.gameMatrixBuffer[this.centY][this.centX + 1] = 0;
                                this.gameMatrixBuffer[this.centY - 1][this.centX - 1] = 0;
                                this.state = 2;
                                return;
                            }
                        }
                        if (this.state == 2) {
                            if (this.centX != 0 && this.gameMatrix[this.centY][this.centX - 1] == 0 && this.gameMatrix[this.centY + 1][this.centX + 1] == 0 && this.gameMatrix[this.centY][this.centX + 1] == 0) {
                                this.gameMatrixBuffer[this.centY][this.centX - 1] = this.piece;
                                this.gameMatrixBuffer[this.centY + 1][this.centX + 1] = this.piece;
                                this.gameMatrixBuffer[this.centY][this.centX + 1] = this.piece;
                                this.gameMatrixBuffer[this.centY + 1][this.centX] = 0;
                                this.gameMatrixBuffer[this.centY - 1][this.centX + 1] = 0;
                                this.gameMatrixBuffer[this.centY - 1][this.centX] = 0;
                                this.state = 3;
                                return;
                            }
                        }
                        if (this.state == 3) {
                            if (this.gameMatrix[this.centY - 1][this.centX] == 0 && this.gameMatrix[this.centY + 1][this.centX - 1] == 0 && this.gameMatrix[this.centY + 1][this.centX] == 0) {
                                this.gameMatrixBuffer[this.centY - 1][this.centX] = this.piece;
                                this.gameMatrixBuffer[this.centY + 1][this.centX - 1] = this.piece;
                                this.gameMatrixBuffer[this.centY + 1][this.centX] = this.piece;
                                this.gameMatrixBuffer[this.centY][this.centX - 1] = 0;
                                this.gameMatrixBuffer[this.centY + 1][this.centX + 1] = 0;
                                this.gameMatrixBuffer[this.centY][this.centX + 1] = 0;
                                this.state = 4;
                                return;
                            }
                        }
                        if (this.state == 4) {
                            if (this.centX != 9 && this.gameMatrix[this.centY][this.centX - 1] == 0 && this.gameMatrix[this.centY][this.centX + 1] == 0 && this.gameMatrix[this.centY - 1][this.centX - 1] == 0) {
                                this.gameMatrixBuffer[this.centY][this.centX - 1] = this.piece;
                                this.gameMatrixBuffer[this.centY][this.centX + 1] = this.piece;
                                this.gameMatrixBuffer[this.centY - 1][this.centX - 1] = this.piece;
                                this.gameMatrixBuffer[this.centY - 1][this.centX] = 0;
                                this.gameMatrixBuffer[this.centY + 1][this.centX] = 0;
                                this.gameMatrixBuffer[this.centY + 1][this.centX - 1] = 0;
                                this.state = 1;
                                return;
                            }
                        }
                    } //this.piece 5
                    if (this.piece == 7) {
                        if (this.state == 1) {
                            if (this.centX != 0 && this.centX != 1 && this.centX != 9 && this.gameMatrix[this.centY][this.centX - 1] == 0 && this.gameMatrix[this.centY][this.centX - 2] == 0 && this.gameMatrix[this.centY][this.centX + 1] == 0) {
                                this.gameMatrixBuffer[this.centY][this.centX - 1] = this.piece;
                                this.gameMatrixBuffer[this.centY][this.centX - 2] = this.piece;
                                this.gameMatrixBuffer[this.centY][this.centX + 1] = this.piece;
                                this.gameMatrixBuffer[this.centY - 1][this.centX] = 0;
                                this.gameMatrixBuffer[this.centY + 1][this.centX] = 0;
                                this.gameMatrixBuffer[this.centY + 2][this.centX] = 0;
                                this.state = 2;
                                return;
                            }
                        }
                        if (this.state == 2) {
                            if (this.centY != 19 && this.centY != 18 && this.gameMatrix[this.centY - 1][this.centX] == 0 && this.gameMatrix[this.centY + 1][this.centX] == 0 && this.gameMatrix[this.centY + 2][this.centX] == 0) {
                                this.gameMatrixBuffer[this.centY + 2][this.centX] = this.piece;
                                this.gameMatrixBuffer[this.centY + 1][this.centX] = this.piece;
                                this.gameMatrixBuffer[this.centY - 1][this.centX] = this.piece;
                                this.gameMatrixBuffer[this.centY][this.centX - 1] = 0;
                                this.gameMatrixBuffer[this.centY][this.centX - 2] = 0;
                                this.gameMatrixBuffer[this.centY][this.centX + 1] = 0;
                                this.state = 1;
                                return;
                            }
                        }
                    } //this.piece 7
                };
                MyApp.prototype.checkMatrix = function () {
                    for (var i = 0; i < 20; i++) {
                        var temp = true;
                        for (var j = 0; j < 10; j++) {
                            if (this.gameMatrix[i][j] == 0)
                                temp = false;
                        }
                        if (temp) {
                            for (var k = 0; k < 10; k++)
                                this.gameMatrix[i][k] = 8;
                            this.toClear = true;
                        }
                    }
                    if (this.toClear) { }
                    //TODO blockclear.play();
                    else {
                        //TODO dropblock.play();
                        this.score++;
                    }
                };
                MyApp.prototype.clearBlocks = function () {
                    var tempLines = 0;
                    for (var i = 0; i < 20; i++) {
                        var temp = false;
                        for (var j = 0; j < 10; j++) {
                            if (this.gameMatrix[i][j] == 8) {
                                temp = true;
                                for (var k = i; k > 0; k--) {
                                    this.gameMatrix[k][j] = this.gameMatrix[k - 1][j];
                                }
                                this.gameMatrix[0][j] = 0;
                            }
                        }
                        if (temp)
                            tempLines++;
                    }
                    if (tempLines == 1)
                        this.score += 50;
                    if (tempLines == 2)
                        this.score += 100;
                    if (tempLines == 3)
                        this.score += 300;
                    if (tempLines == 4)
                        this.score += 1000;
                    this.lines += tempLines;
                    this.nextLevel += tempLines;
                    if (this.nextLevel >= 10) {
                        //TODO newlevel.play();
                        this.nextLevel -= 10;
                        this.level++;
                    }
                    else
                        ; //TODO blockcleared.play();
                };
                // public void paint()
                // {
                //     if (this.paused)
                //     {
                //     }
                //     else if (!this.gameOver)
                //     {
                //         draw next piece
                //         for (int i = 0; i < 4; i++)
                //         {
                //             for (int j = 0; j < 7; j++)
                //             {
                //                 if (nextPieceMatrix[i][j] == 1)
                //                 {
                //                     addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Blue,Colors.White);
                //                 }
                //                 if (nextPieceMatrix[i][j] == 2)
                //                 {
                //                     addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Orange, Colors.White);
                //                 }
                //                 if (nextPieceMatrix[i][j] == 3)
                //                 {
                //                     addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Purple, Colors.White);
                //                 }
                //                 if (nextPieceMatrix[i][j] == 4)
                //                 {
                //                     addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Red, Colors.White);
                //                 }
                //                 if (nextPieceMatrix[i][j] == 5)
                //                 {
                //                     addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Cyan, Colors.White);
                //                 }
                //                 if (nextPieceMatrix[i][j] == 6)
                //                 {
                //                     addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Green, Colors.White);
                //                 }
                //                 if (nextPieceMatrix[i][j] == 7)
                //                 {
                //                     addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Yellow, Colors.White);
                //                 }
                //             }
                //         }
                //         for (let i = 0; i < 20; i++)
                //         {
                //             for (let j = 0; j < 10; j++)
                //             {
                //                 if (gameMatrixBuffer[i][j] == 1)
                //                 {
                //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Blue, Colors.White);
                //                 }
                //                 if (gameMatrixBuffer[i][j] == 2)
                //                 {
                //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Orange, Colors.White);
                //                 }
                //                 if (gameMatrixBuffer[i][j] == 3)
                //                 {
                //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Purple, Colors.White);
                //                 }
                //                 if (gameMatrixBuffer[i][j] == 4)
                //                 {
                //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Red, Colors.White);
                //                 }
                //                 if (gameMatrixBuffer[i][j] == 5)
                //                 {
                //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Cyan, Colors.White);
                //                 }
                //                 if (gameMatrixBuffer[i][j] == 6)
                //                 {
                //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Green, Colors.White);
                //                 }
                //                 if (gameMatrixBuffer[i][j] == 7)
                //                 {
                //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Yellow, Colors.White);
                //                 }
                //                 //for clearing purposes
                //                 if (gameMatrix[i][j] == 8)
                //                 {
                //                     addBlock(150 + (20 * j), 50 + (20 * i), c, Color.FromArgb(0,0,0,0));
                //                 }
                //                 if (gameMatrix[i][j] == 1)
                //                 {
                //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Blue, Color.FromArgb(0, 0, 0, 0));
                //                 }
                //                 if (gameMatrix[i][j] == 2)
                //                 {
                //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Orange, Color.FromArgb(0, 0, 0, 0));
                //                 }
                //                 if (gameMatrix[i][j] == 3)
                //                 {
                //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Purple, Color.FromArgb(0, 0, 0, 0));
                //                 }
                //                 if (gameMatrix[i][j] == 4)
                //                 {
                //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Red, Color.FromArgb(0, 0, 0, 0));
                //                 }
                //                 if (gameMatrix[i][j] == 5)
                //                 {
                //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Cyan, Color.FromArgb(0, 0, 0, 0));
                //                 }
                //                 if (gameMatrix[i][j] == 6)
                //                 {
                //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Green, Color.FromArgb(0, 0, 0, 0));
                //                 }
                //                 if (gameMatrix[i][j] == 7)
                //                 {
                //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Yellow, Color.FromArgb(0, 0, 0, 0));
                //                 }
                //             }
                //         }
                //     }
                // }
                /* MY FUNCTIONS */
                MyApp.prototype.requestNextFrame = function () {
                    var app = window.myApp;
                    app.gameLoop();
                    app.newPaint();
                    requestAnimationFrame(app.requestNextFrame);
                };
                MyApp.prototype.getMessage = function () {
                    return 'New Game';
                    // if (!this.draw)
                    //     return 'start drawing';
                    // else
                    //     return 'stop drawing';
                };
                MyApp.prototype.countFPS = function () {
                    this.fpscounter++;
                    var delta = (new Date().getTime() - this.lastCalledTime.getTime()) / 1000;
                    if (delta > 1) {
                        this.currentfps = this.fpscounter;
                        this.fpscounter = 0;
                        this.lastCalledTime = new Date();
                        // $("#fps").html(this.currentfps.toString());
                    }
                };
                MyApp.prototype.getRandomColor = function () {
                    var letters = '0123456789ABCDEF';
                    var color = '#';
                    for (var i = 0; i < 6; i++) {
                        color += letters[Math.floor(Math.random() * 16)];
                    }
                    return color;
                };
                MyApp.prototype.newPaint = function () {
                    var _this = this;
                    this.countFPS();
                    var xCounter = -1;
                    var yCounter = 0;
                    var randBlock = 0;
                    var elements = $("[tetris-block]");
                    var myElements = [];
                    for (var i = 0; i < elements.length; i++)
                        myElements.push(elements[i]);
                    var randomColor = this.getRandomColor();
                    myElements.forEach(function (element) {
                        xCounter++;
                        if (xCounter == 10) {
                            xCounter = 0;
                            yCounter++;
                        }
                        if (xCounter == 0) {
                            randBlock = _this.getRandomNumber(10);
                        }
                        var x = parseInt(element.attributes["x"].value);
                        var y = parseInt(element.attributes["y"].value);
                        if (_this.gameMatrixBuffer[y][x] == 8 || _this.gameMatrix[y][x] == 8) {
                            element.style["background-color"] = randomColor;
                        }
                        else if (_this.gameMatrixBuffer[y][x] > 0 || _this.gameMatrix[y][x] > 0) {
                            var color = 'blue';
                            // if (this.gameMatrixBuffer[y][x] == 1 || this.gameMatrix[y][x] == 1) color = 'darkblue';
                            // if (this.gameMatrixBuffer[y][x] == 2 || this.gameMatrix[y][x] == 2) color = 'darkorange';
                            // if (this.gameMatrixBuffer[y][x] == 3 || this.gameMatrix[y][x] == 3) color = 'rgb(90, 34, 107)';
                            // if (this.gameMatrixBuffer[y][x] == 4 || this.gameMatrix[y][x] == 4) color = 'darkred';
                            // if (this.gameMatrixBuffer[y][x] == 5 || this.gameMatrix[y][x] == 5) color = 'darkcyan';
                            // if (this.gameMatrixBuffer[y][x] == 6 || this.gameMatrix[y][x] == 6) color = 'darkgreen';
                            // if (this.gameMatrixBuffer[y][x] == 7 || this.gameMatrix[y][x] == 7) color = 'rgb(209, 209, 0)';
                            element.style["background-color"] = color;
                        }
                        else if (_this.shadowFinderMatrix && _this.shadowFinderMatrix[y][x] > 0)
                            element.style["background-color"] = 'grey';
                        else
                            element.style["background-color"] = 'white';
                    });
                    //draw next puiece
                    xCounter = -1;
                    yCounter = 0;
                    elements = $("[nextpiece-block]");
                    myElements = [];
                    for (var i = 0; i < elements.length; i++)
                        myElements.push(elements[i]);
                    myElements.forEach(function (element) {
                        xCounter++;
                        if (xCounter == 7) {
                            xCounter = 0;
                            yCounter++;
                        }
                        var x = parseInt(element.attributes["x"].value);
                        var y = parseInt(element.attributes["y"].value);
                        if (_this.nextPieceMatrix[y][x] > 0 || _this.nextPieceMatrix[y][x] > 0) {
                            var color = 'blue';
                            element.style["background-color"] = color;
                        }
                        else
                            element.style["background-color"] = 'white';
                    });
                };
                MyApp.prototype.btnClick = function () {
                    this.reset();
                };
                MyApp.prototype.btnPause = function () {
                    if (this.paused)
                        this.paused = false;
                    else
                        this.paused = true;
                };
                MyApp.prototype.getPauseButtonText = function () {
                    if (this.paused)
                        return "Resume";
                    else
                        return "Pause";
                };
                MyApp.prototype.createGameTable = function () {
                    var tableHtml = '';
                    var boxSize = 20;
                    var windowHeight = window.innerHeight;
                    var windowWidth = window.innerWidth;
                    // console.log(windowHeight,windowWidth);
                    if (windowHeight > 800) {
                        var extraSpace = windowHeight - 800;
                        extraSpace = extraSpace / 20;
                        boxSize += extraSpace;
                    }
                    tableHtml += '<table style="margin: 0px auto;">';
                    for (var i = 0; i < 20; i++) {
                        tableHtml += "<tr>";
                        for (var j = 0; j < 10; j++) {
                            var piece = ' ';
                            tableHtml += "<td tetris-block x='" + j + "' y='" + i +
                                "' style='width:" + boxSize + "px;height:" + boxSize + "px;background-color:lightblue;" +
                                "border:1px black solid;font-size: .75rem;'>" + piece + "</td>";
                        }
                        tableHtml += "</tr>";
                    }
                    tableHtml += "</table>";
                    $("#gamediv").html(tableHtml);
                    var nextPieceHtml = '<table style="">';
                    for (var i = 0; i < 4; i++) {
                        nextPieceHtml += "<tr>";
                        for (var j = 0; j < 5; j++) {
                            var piece = ' ';
                            nextPieceHtml += "<td nextpiece-block x='" + j + "' y='" + i +
                                "' style='width:" + boxSize + "px;height:" + boxSize + "px;background-color:white;" +
                                "border:1px black solid;font-size: .75rem;'>" + piece + "</td>";
                        }
                        nextPieceHtml += "</tr>";
                    }
                    nextPieceHtml += "</table>";
                    $("#nextpiecediv").html(nextPieceHtml);
                    // let gameDivHeight:number = $("#gamediv").height();
                    // console.log(gameDivHeight,windowHeight);
                    // $("#gamediv")[0].style["margin-top"] = (windowHeight-gameDivHeight-140) + 'px';
                };
                return MyApp;
            }());
            exports_1("MyApp", MyApp);
            window.myApp = new MyApp();
        }
    };
});
//# sourceMappingURL=index.js.map