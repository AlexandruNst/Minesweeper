var grid;
var sqPerLine = 20;
var mines = 10;
var w;



function setup() {
    createCanvas(500, 500);

    grid = create2DArray();
    w = width / sqPerLine;
    fillGrid();
    fillMines();
    fillNeighbours();
}

function draw() {
    background(150);

    gridShow();

    //noLoop();
}

function create2DArray() {

    var arr = new Array(sqPerLine);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(sqPerLine);
    }

    return arr;
}

function fillGrid() {

    // while (mines > 0) {
    //     var col = floor(random(sqPerLine));
    //     var row = floor(random(sqPerLine));
    //
    //     grid[col][row].mine = true;
    //
    //     mines--;
    // }

    strokeWeight(2);
    stroke(0);

    for (var i = 0; i < sqPerLine; i++) {
        for (var j = 0; j < sqPerLine; j++) {

            var cell = {
                mine: false,
                revealed: true,
                neighbours: 0
            };

            grid[i][j] = cell;
            fill(255);
            rect(i * w, j * w, w, w);
        }
    }
}

function fillMines() {

    while (mines > 0) {
        var col = floor(random(sqPerLine));
        var row = floor(random(sqPerLine));
        // console.log("setting grid[" + col + "][" + row + "] as mine");
        //
        // console.log(grid[col][row].mine);

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
    for (var i = 0; i < sqPerLine; i++) {
        for (var j = 0; j < sqPerLine; j++) {
            //console.log(grid[i][j].mine);
            if (grid[i][j].mine == true) {
                fill(0, 255, 0);
            } else {
                fill(255);
            }
            rect(i * w, j * w, w, w);

        }
    }

    for (var i = 0; i < sqPerLine; i++) {
        for (var j = 0; j < sqPerLine; j++) {
            //console.log(grid[i][j].mine);


            if (!grid[i][j].mine && !grid[i][j].neighbours == 0) {
                //stroke(0);
                fill(0);
                strokeWeight(1);

                textAlign(CENTER);
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