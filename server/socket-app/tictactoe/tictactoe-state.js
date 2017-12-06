const _ = require('lodash');

module.exports = function (injected) {
    var gamefull = false;
    var board = [];
    var player;
    for(let y=0;y<3;y++){
        let cells = [];
        for(let x=0;x<3;x++){
            cells.push('-');
        }
        board.push(cells);
    }

    return function (history) {
        function processEvent(event) {
            if(event.type === "GameJoined"){
                gamefull = true;
                return;
            }
            if(event.type === "GameWon"){
                console.log("GameWon By player" + player);
                return;
            }
            if(event.type === "Draw"){
                console.log("Draw!");
                return;
            }
            if(event.type === "MovePlaced"){
                updateBoard(event);
            }
            if(event.type === "IllegalMove"){
                console.log("Illegal move");
            }
            
        }

        function processEvents(history) {
            _.each(history, processEvent);
        }
        
        function gameWon(y,x,p){
            // update board
            player = p;
            board[y][x] = p;
            // check horizontal --
            if ((board[0][0] === p && board[0][1] === p && board[0][2] === p) ||
            (board[1][0] === p && board[1][1] === p && board[1][2] === p) ||
            (board[2][0] === p && board[2][1] === p && board[2][2] === p)){
                clearBoard();
                return true;
            }
            // vertical
            if  ((board[0][0] === p && board[1][0] === p && board[2][0] === p) ||
            (board[0][1] === p && board[1][1] === p && board[2][1] === p) ||
            (board[0][2] === p && board[1][2] === p && board[2][2] === p)) {
                clearBoard();
                return true;
            }
            // downwards diagonal
            if  (board[0][0] === p && board[1][1] === p && board[2][2] === p){
                clearBoard();
                return true;
            }
            // upwards diagonal
            if  (board[2][0] === p && board[1][1] === p && board[0][2] === p) {
                clearBoard();
                return true;
            }
            return false;
        }
        function draw(){
            for(let y=0;y<3;y++){
                for(let x=0;x<3;x++){
                    if(board[y][x] === '-'){
                       return false; 
                    }
                }
            }
            clearBoard();
            return true;
        }

        function clearBoard(){
            for(let y=0;y<3;y++){
                for(let x=0;x<3;x++){
                    board[y][x] = '-';
            }}
        }

        function wrongPlayer(p){
            if(player === p){
                return true;
            }
            return false;
        }

        function illegalMove(y,x){
            if(board[y][x] === 'X' || board[y][x] === 'O'){
                return true;
            }
            return false;

        }
        function updateBoard(event){
            var y = event.y;
            var x = event.x;
            player = event.side;
            if(event.side === 'X'){
                board[y][x] = 'X';
            }
            else{
                board[y][x] = 'O';
            }
        }

        function getBoard(){
            return board;
        }
        
        function gameFull(){
            return gamefull;
        }

        processEvents(history);

        return {
            draw: draw,
            gameWon: gameWon,
            wrongPlayer: wrongPlayer,
            illegalMove: illegalMove,
            updateBoard: updateBoard,
            gameFull: gameFull,
            getBoard: getBoard,
            processEvents: processEvents,
        }
    };
};
