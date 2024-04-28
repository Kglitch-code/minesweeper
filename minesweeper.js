let board = [];
let rows = 9;
let columns = 9;

let mines = 10;
let mineLocation = [];
let flag = false;

let gameOver = false;

window.onload = function(){
    startGame();
}

function addMines(){
    let minesRemain = mines;
    while(minesRemain > 0){
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if(!mineLocation.includes(id)){
            mineLocation.push(id);
            minesRemain --;
        }
    }
}

function startGame(){

    //counts the mines 
    document.getElementById("minesCount").innerText = mines;
    addMines();

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

// Update the currently hovered div
function handleMouseOver(event) {
    hoveredTile = event.target;
}

//Remove currently hovered div once nothing is hovered
function handleMouseOut(event) {
    hoveredTile = null
}

//Check for a key being released (Space bar)
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

//Check for left click
document.addEventListener("click", function(e) {
    if(hoveredTile){
        console.log('Left Click pressed over:', hoveredTile.id);
        let coords = hoveredTile.id.split("-");
        tileClear(parseInt(coords[0]), parseInt(coords[1]));
        // revealAll();
    }
    else{
        console.log("Left Click pressed over nothing")
    }
});

//Check for right click
document.addEventListener("contextmenu", function(e) {
    if(hoveredTile){
        e.preventDefault();
        console.log('Right Click pressed over:', hoveredTile.id);
        let coords = hoveredTile.id.split("-");
        tileFlag(parseInt(coords[0]), parseInt(coords[1]));
    }
    else{
        console.log("Right Click pressed over nothing")
    }
});


//=============================================
//
// Flagging+Clearing Controls
//
//=============================================

function getNearbyTilesNum(x, y){
    let num = 0;
    for(let i = x-1; i <= x+1; i++){
        if(i >= 0 && i < rows){
            for(let j = y-1; j <= y+1; j++){
                if(j >= 0 && j < columns){
                    if(mineLocation.includes(i+"-"+j)){
                        num +=1;
                    }
                }
            }
        }
    }
    return num
}

//Reveal the whole board 
function revealAll(){
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[i].length; j++){
            if(board[i][j].className == "tile blank"){
                if(mineLocation.includes(i+"-"+j)){
                    board[i][j].className = "tile clicked";
                    board[i][j].innerHTML = "💣";
                }
                else{
                    let num = getNearbyTilesNum(i, j);
                    if(num != 0){
                        board[i][j].className = "tile clicked bomb-" + num;
                        board[i][j].innerHTML = num;
                    }
                    else{ //Num is 0
                        board[i][j].className = "tile clicked";
                    }
                }
            }
            else{
                console.log(0);
            }
        }
    }
}

function tileClear(i, j){
    if(board[i][j].className == "tile blank"){
        if(mineLocation.includes(i+"-"+j)){
            revealAll();
        }
        else{
            let num = getNearbyTilesNum(i, j);
            if(num != 0){
                board[i][j].className = "tile clicked bomb-" + num;
                board[i][j].innerHTML = num;
            }
            else{//Num is 0
                board[i][j].className = "tile clicked";

                //Check surrounding tiles
                for(let k = i-1; k <= i+1; k++){
                    if(k >= 0 && k < rows){
                        for(let l = j-1; l <= j+1; l++){
                            if(l >= 0 && l < columns){
                                if(k!=i || j!=l){
                                    tileClear(k, l)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return;
}

function tileFlag(i, j){
    if(board[i][j].className == "tile blank"){
        board[i][j].className = "tile flag";
        board[i][j].innerHTML = "🚩";
    }
    else if(board[i][j].className == "tile flag"){
        board[i][j].className = "tile blank";
        board[i][j].innerHTML = "";
    }
    return;
}