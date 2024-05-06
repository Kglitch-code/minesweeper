let board = [];
let rows = 9;
let columns = 9;

let mines = 10;
let minesRemaining = mines;
let squaresRemaining = rows*columns-mines;
let mineLocation = [];
let flag = false;

let gameOver = false;

var socket = io.connect('/');
let playerCount = 0
// let roomCode = ''

window.onload = function(){
    startGame();
}

///////////////////////////////////////////////////
///NOTE
//gameStatus does not update on the html side but its supposed to for game ready and waiting for player
//not sure how to fix this rn
////////////////////////////////////

//connect players
//both join the same room (currently different boards
socket.on('connect', function(){
    //create new game if
    if(playerCount < 2) {
        // socket.emit('new_game_or_join', {room_code: roomCode});
        console.log( {room_code:roomCode})
        socket.emit('join_game', data = { "room_code": roomCode, "username": username, "game_id": "3"});
       // socket.emit('waiting_for_player') //wait for another player
        playerCount +=1;
    }
    if (playerCount == 1) {
        console.log({ room_code: roomCode })
        socket.emit('join_game', data = { "room_code": roomCode, "username": username, "game_id": "3"});
        playerCount +=1;
       // socket.emit('game_ready') //game ready to play
    }
    if (playerCount > 2){
        console.log("error, room is full", {room_code:roomCode});
    }
});

//var playerCounter = 0;
socket.on('join_confirmation', function(data) {
    let playerCounter = data.numUsersInRoom
    console.log(playerCounter);
    console.log(data.message);
    if (playerCounter = 1){
        document.getElementById('gameStatus').textContent = 'Game ready! Waiting for other player...';
    }
    else if (playerCounter = 2){
        document.getElementById('gameStatus').textContent = 'Both players have joined';
    }
});





// Handle custom server responses
socket.on("response", function(msg) {
    console.log("Server response:", msg);
});


// socket.on('waiting_for_player', function(data) {
//     console.log(data.message);
//     document.getElementById('gameStatus').textContent = data.message;
// });
//
// socket.on('game_ready', function(data) {
//     console.log(data.message);
//     document.getElementById('gameStatus').textContent = data.message;
// });

// Additional handling for game_over event if applicable
socket.on('game_over', function(msg) {
    console.log(msg.message);
    document.getElementById('gameStatus').textContent = 'Game Over: ' + msg.result;
});




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

function setMinesCount(){
    document.getElementById("minesCount").innerText = minesRemaining;
}

function startGame(){

    //counts the mines 
    setMinesCount();
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

//winner of the game and send to the backend
function winGame(gameId, currentUserId, opponentId){
    revealAll(true);
    alert("You Won")

    //parse the data by game_id, winner is current user, loser is opposite id
    const data = {
        game_id: gameId,
        result: {
            winner_id: currentUserId, //user who triggered this is winner
            loser_id: opponentId,
            room: roomCode
        }
    };
    socket.emit('end_game', data);
    return;
}

//loser of the game and send to backend
function LoseGame(gameId, currentUserId, opponentId){
    revealAll(false);
    alert("You Lost")
    //send data to backend
    const data = {
        game_id: gameId,
        result: {
            winner_id: currentUserId, //user who triggered this function is loser
            loser_id: opponentId,
            room: roomCode
        }
    };
    socket.emit('end_game', data);
    return;
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
            // console.log('Space bar pressed over:', hoveredTile.id);
            let coords = hoveredTile.id.split("-");
            spacePressed(parseInt(coords[0]), parseInt(coords[1]));
        }
        else{
            // console.log("Space bar pressed over nothing")
        }
    }
});

//Check for left click
document.addEventListener("click", function(e) {
    if(hoveredTile){
        // console.log('Left Click pressed over:', hoveredTile.id);
        let coords = hoveredTile.id.split("-");
        tileClear(parseInt(coords[0]), parseInt(coords[1]));
        // revealAll();
    }
    else{
        // console.log("Left Click pressed over nothing")
    }
});

//Check for right click
document.addEventListener("contextmenu", function(e) {
    if(hoveredTile){
        e.preventDefault();
        // console.log('Right Click pressed over:', hoveredTile.id);
        let coords = hoveredTile.id.split("-");
        tileFlag(parseInt(coords[0]), parseInt(coords[1]));
    }
    else{
        // console.log("Right Click pressed over nothing")
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

function getNearbyFlagsNum(x, y){
    let num = 0;
    for(let i = x-1; i <= x+1; i++){
        if(i >= 0 && i < rows){
            for(let j = y-1; j <= y+1; j++){
                if(j >= 0 && j < columns){
                    if(board[i][j].className == "tile flag"){
                        num +=1;
                    }
                }
            }
        }
    }
    return num
}

//Reveal the whole board 
function revealAll(didWin){
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[i].length; j++){
            if(board[i][j].className == "tile blank"){
                if(mineLocation.includes(i+"-"+j)){
                    if(didWin){
                        board[i][j].className = "tile flag";
                        board[i][j].innerHTML = "🚩";
                    }
                    else{
                        board[i][j].className = "tile clicked";
                        board[i][j].innerHTML = "💣";
                    }
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

function clearSurrounding(i, j){
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

function tileClear(i, j){
    if(board[i][j].className == "tile blank"){
        if(mineLocation.includes(i+"-"+j)){
            LoseGame();
        }
        else{
            let num = getNearbyTilesNum(i, j);
            socket.emit('message', "Clear: " +i+", "+j);
            if(num != 0){
                board[i][j].className = "tile clicked bomb-" + num;
                board[i][j].innerHTML = num;
            }
            else{//Num is 0
                board[i][j].className = "tile clicked";
                clearSurrounding(i, j); //Also clear surrounding tiles
            }
            squaresRemaining-=1;
            if (squaresRemaining <= 0){
                winGame();
            }
        }
    }
    return;
}

function tileFlag(i, j){
    if(board[i][j].className == "tile blank"){
        board[i][j].className = "tile flag";
        board[i][j].innerHTML = "🚩";
        minesRemaining-=1;
        setMinesCount();
        socket.emit('message', "Flag: " +i+", "+j);
    }
    else if(board[i][j].className == "tile flag"){
        board[i][j].className = "tile blank";
        board[i][j].innerHTML = "";
        minesRemaining+=1;
        setMinesCount();
        socket.emit('message', "unFlag: " +i+", "+j);
    }
    return;
}

function spacePressed(i, j){
    if(board[i][j].className == "tile blank"){
        tileFlag(i, j);
    }
    else if(board[i][j].className == "tile flag"){
        tileFlag(i, j);
    }
    else if(board[i][j].innerHTML == getNearbyFlagsNum(i,j)){
        clearSurrounding(i, j);
    }
    return;
}

