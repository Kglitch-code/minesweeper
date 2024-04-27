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
            tile.setAttribute("class", "tile blank")
            tile.addEventListener('mouseover', handleMouseOver);
            tile.addEventListener('mouseout', handleMouseOut);
            // tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

//=============================================
//
// Controls/Event Listeners
//
//=============================================
let hoveredTile = null

function handleMouseOver(event) {
    // Update the currently hovered div
    hoveredTile = event.target;
    // console.log(hoveredTile)
}

function handleMouseOut(event) {
    hoveredTile = null
}

document.addEventListener("keyup", function(e) {
    if (e.key == " " ||
        e.code == "Space"     
    ) {
        if(hoveredTile){
            console.log('Space bar pressed over:', hoveredTile.id);
        }
        else{
            console.log("Space bar pressed over nothing")
        }
    }
});

document.addEventListener("click", function(e) {
    if(hoveredTile){
        console.log('Left Click pressed over:', hoveredTile.id);
    }
    else{
        console.log("Left Click pressed over nothing")
    }
});

document.addEventListener("contextmenu", function(e) {
    if(hoveredTile){
        e.preventDefault();
        console.log('Right Click pressed over:', hoveredTile.id);
    }
    else{
        console.log("Right Click pressed over nothing")
    }
});