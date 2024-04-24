let board = [];
let rows = 9;
let columns = 9;

let mines = 10;
// let location = [];
let flag = false;

let gameOver = false;

window.onload = function(){
    startGame();
}

function startGame(){

    //counts the mines 
    document.getElementById("minesCount").innerText = mines;
    
    //populates the board with blank divs
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {
            //<div id="0-0"></div>
            let tile = document.createElement("div");
            tile.id = i.toString() + "-" + j.toString();
            // tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}
      
