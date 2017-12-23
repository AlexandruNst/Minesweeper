var grid;
var sqPerLine = 20;
var allMines = 60;
var timerWidth = 120;
var happyReset = true;
var w;
var d;

var startMin;
var startSec;

var sec = 0;
var mins = 0;

var prevSec = 0;
var prevMin = 0;

var over = false;
var firstClick = false;


function setup() {

    createCanvas(800 + timerWidth, 800);

    grid = create2DArray();
    w = (width - timerWidth) / sqPerLine;
    fillGrid();
    fillMines();
    fillNeighbours();

    startSec = second();
    startMin = minute();


}

function draw() {

    background(255);

    gridShow();
    showResetButton(happyReset);

    if (!firstClick) {
        showDefaultTimer();
    } else {
        if (over == false) {
            showTime();
        } else {
            showEndTimer();
        }

    }

    d = dist(width - timerWidth + timerWidth / 2, height / 3, mouseX, mouseY);
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

    var mines = allMines;

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

function mouseClicked() {

    var col = floor(mouseX / w);
    var row = floor(mouseY / w);

    if (d <= (timerWidth - timerWidth * 0.3) / 2) {
        //loop();
        newGame();
    } else if (mouseButton == LEFT) {
        firstClick = true;
        if (grid[col][row].mine) {
            gameOver();
        } else if (!grid[col][row].flag) {
            grid[col][row].revealed = true;
            if (grid[col][row].mine == false && grid[col][row].neighbours == 0) {
                revealNeighbours(col, row);
            }
        }
    }

    if (mouseButton == CENTER) {
        // newGame();
        grid[col][row].flag = !grid[col][row].flag;
    }
}

/////////////////////////////////////////////////

function doubleClicked() {
    var col = floor(mouseX / w);
    var row = floor(mouseY / w);


    grid[col][row].flag = !grid[col][row].flag;
    console.log("THIS SHOULD HAPPEN");
}

////////////////////////////////////////////////

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

    over = true;

    for (var i = 0; i < sqPerLine; i++) {
        for (var j = 0; j < sqPerLine; j++) {
            grid[i][j].revealed = true;
        }
    }

    happyReset = false;
}

function showTime() {

    var currentSec = second();
    var currentMin = minute();

    if (currentSec != startSec && currentSec != prevSec) {
        sec++;
        prevSec = currentSec;
    }
    if (sec >= 60) {
        sec -= 60;
        mins++;
    }

    textSize(30);
    textAlign(LEFT);
    strokeWeight(1);
    stroke(0);
    fill(0);

    if (mins >= 60) {
        text("> 1 hour", width, 2 * ((width - timerWidth) / 3));

    } else if (mins < 10) {
        if (sec < 10) {
            text("0" + mins + " : " + "0" + sec, width - timerWidth + timerWidth / 15, 2 * ((width - timerWidth) / 3));

        } else {
            text("0" + mins + " : " + sec, width - timerWidth + timerWidth / 15, 2 * ((width - timerWidth) / 3));
        }
    } else {
        if (sec < 10) {
            text(mins + " : " + "0" + sec, width - timerWidth + timerWidth / 15, 2 * ((width - timerWidth) / 3));
        } else {
            text(mins + " : " + sec, width - timerWidth + timerWidth / 15, 2 * ((width - timerWidth) / 3));
        }
    }
}

function showResetButton(happiness) {

    fill(255, 255, 0);
    stroke(0);
    strokeWeight(3);
    ellipse(width - timerWidth + timerWidth / 2, height / 3, timerWidth - timerWidth * 0.3, timerWidth - timerWidth * 0.3);

    stroke(0);
    strokeWeight(timerWidth * 0.12);
    point(width - timerWidth * 0.5 - (timerWidth - timerWidth * 0.3) / 4, height / 3 - (timerWidth - timerWidth * 0.3) * 0.12);
    point(width - timerWidth * 0.5 + (timerWidth - timerWidth * 0.3) / 4, height / 3 - (timerWidth - timerWidth * 0.3) * 0.12);

    strokeWeight(3);
    if (happiness) {
        //happy mouth
        arc(width - timerWidth + timerWidth / 2, height / 3, (timerWidth - timerWidth * 0.3) * 0.6, (timerWidth - timerWidth * 0.3) * 0.6, 0 + PI * 0.1, PI - PI * 0.1);
    } else {
        //sad mouth
        arc(width - timerWidth + timerWidth / 2, height / 3 + (timerWidth - timerWidth * 0.3) * 0.35, (timerWidth - timerWidth * 0.3) * 0.6, (timerWidth - timerWidth * 0.3) * 0.6, PI + PI * 0.1, TWO_PI - PI * 0.1);
    }
}

function newGame() {

    fillGrid();
    fillMines();
    fillNeighbours();

    gridShow();

    happyReset = true;
    over = false;
    firstClick = false;

    resetTimer();
}

// function changeHappiness() {
//
//     happyReset = !happyReset;
// }

function resetTimer() {

    startSec = second();
    sec = 0;
    mins = 0;
}

function showEndTimer() {

    textSize(30);
    textAlign(LEFT);
    strokeWeight(1);
    stroke(0);
    fill(0);

    if (mins >= 60) {
        text("> 1 hour", width, 2 * ((width - timerWidth) / 3));

    } else if (mins < 10) {
        if (sec < 10) {
            console.log("THIS SHOULD HAPPEN");

            text("0" + mins + " : " + "0" + sec, width - timerWidth + timerWidth / 15, 2 * ((width - timerWidth) / 3));

        } else {
            text("0" + mins + " : " + sec, width - timerWidth + timerWidth / 15, 2 * ((width - timerWidth) / 3));
        }
    } else {
        if (sec < 10) {
            text(mins + " : " + "0" + sec, width - timerWidth + timerWidth / 15, 2 * ((width - timerWidth) / 3));
        } else {
            text(mins + " : " + sec, width - timerWidth + timerWidth / 15, 2 * ((width - timerWidth) / 3));
        }
    }
}

function showDefaultTimer() {

    textSize(30);
    textAlign(LEFT);
    strokeWeight(1);
    stroke(0);
    fill(0);

    text("00 : 00", width - timerWidth + timerWidth / 15, 2 * ((width - timerWidth) / 3));

}