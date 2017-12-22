var grid;
var sqPerLine = 20;
var mines = 60;
var w;



function setup() {
    createCanvas(900, 900);

    grid = create2DArray();
    w = width / sqPerLine;
    fillGrid();
    fillMines();
    fillNeighbours();
}

function draw() {
    background(150);


    gridShow();
    showTime();

}

function create2DArray() {

    var arr = new Array(sqPerLine);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(sqPerLine);
    }

    return arr;
}

function fillGrid() {

    for (var i = 0; i < sqPerLine; i++) {
        for (var j = 0; j < sqPerLine; j++) {

            var cell = {
                mine: false,
                revealed: false,
                neighbours: 0,
                flag: false
            };

            grid[i][j] = cell;
        }
    }
}

function fillMines() {

    while (mines > 0) {
        var col = floor(random(sqPerLine));
        var row = floor(random(sqPerLine));

        grid[col][row].mine = true;
        mines--;
    }
}

function fillNeighbours() {

    for (var i = 0; i < sqPerLine; i++) {
        for (var j = 0; j < sqPerLine; j++) {
            grid[i][j].neighbours = countNeighbours(i, j);

        }
    }
}

function gridShow() {

    strokeWeight(2);
    stroke(0);

    for (var i = 0; i < sqPerLine; i++) {
        for (var j = 0; j < sqPerLine; j++) {
            if (grid[i][j].revealed == false) {
                fill(190);
                rect(i * w, j * w, w, w);
                if (grid[i][j].flag) {
                    strokeWeight(3);
                    line(i * w + w / 4, j * w + w / 8, i * w + w / 4, j * w + w - w / 8);
                    fill(255, 0, 0);
                    rect(i * w + w / 4, j * w + w / 8, w / 2, w / 3);
                    strokeWeight(2);
                }
            } else if (grid[i][j].mine == true) {
                fill(255);
                rect(i * w, j * w, w, w);
                // draw mine
                fill(0);
                ellipse(i * w + w / 2, j * w + w / 2, w - w / 4, w - w / 4);
            } else {
                fill(255);
                rect(i * w, j * w, w, w);
            }
        }
    }

    for (var i = 0; i < sqPerLine; i++) {
        for (var j = 0; j < sqPerLine; j++) {
            if (!grid[i][j].mine && !grid[i][j].neighbours == 0 && grid[i][j].revealed) {
                fill(0);
                strokeWeight(1);

                textAlign(CENTER);
                textSize(w / 2);
                text(grid[i][j].neighbours, i * w + w / 2, j * w + w / 2 + 4);
            }
        }
    }
}

function countNeighbours(i, j) {

    var neighbours = 0;

    for (var x = -1; x <= 1; x++) {
        for (var y = -1; y <= 1; y++) {
            if (i + x >= 0 && i + x < sqPerLine && j + y >= 0 && j + y < sqPerLine) {
                if (!(x == 0 && y == 0)) {
                    if (grid[i + x][j + y].mine) {
                        neighbours++;
                    }
                }
            }
        }
    }

    return neighbours;
}

function mousePressed() {

    var col = floor(mouseX / w);
    var row = floor(mouseY / w);


    if (mouseButton == LEFT) {
        if (grid[col][row].mine) {
            gameOver();
        } else if (!grid[col][row].flag) {
            grid[col][row].revealed = true;
            if (grid[col][row].mine == false && grid[col][row].neighbours == 0) {
                revealNeighbours(col, row);
            }
        }
    }

    if (mouseButton == RIGHT) {
        grid[col][row].flag = !grid[col][row].flag;
    }
}

function revealNeighbours(i, j) {

    for (var x = -1; x <= 1; x++) {
        for (var y = -1; y <= 1; y++) {
            if (i + x >= 0 && i + x < sqPerLine && j + y >= 0 && j + y < sqPerLine) {
                if (!(x == 0 && y == 0)) {
                    if (grid[i + x][j + y].revealed == false) {
                        if (!grid[i + x][j + y].flag) {
                            grid[i + x][j + y].revealed = true;
                            if (grid[i + x][j + y].neighbours == 0) {
                                revealNeighbours(i + x, j + y);
                            }
                        }
                    }
                }
            }
        }
    }
}

function gameOver() {

    for (var i = 0; i < sqPerLine; i++) {
        for (var j = 0; j < sqPerLine; j++) {
            grid[i][j].revealed = true;
        }
    }
}

function showTime() {
    textSize(30);

    var secFromFrames = floor(frameCount / 60);
    var sec = secFromFrames % 60;
    var min = floor(sec / 60);

    if (min < 10) {
        if (sec < 10) {
            text("0" + min + " : " + "0" + sec, 400, 400);

        } else {
            text("0" + min + " : " + sec, 400, 400);
        }
    } else {
        if (sec < 10) {
            text(min + " : " + "0" + sec, 400, 400);
        } else {
            text(min + " : " + sec, 400, 400);
        }
    }

    //text(min + " : " + sec, 400, 400);

}