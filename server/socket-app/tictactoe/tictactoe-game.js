//import { applyEach } from "../../../../../../../../Library/Caches/typescript/2.6/node_modules/@types/async";


module.exports = function(injected){
    let TictactoeState = injected('TictactoeState');

    return function(history){

        let gameState = TictactoeState(history);

        return {
            executeCommand: function(cmd, eventHandler){
                function applyEvents(events, moreEvents){
                    gameState.processEvents(events);
                    eventHandler(events);
                }

                let cmdHandlers = {
                    "CreateGame": function (cmd) {
                        applyEvents([{
                            gameId: cmd.gameId,
                            type: "GameCreated",
                            user: cmd.user,
                            name: cmd.name,
                            timeStamp: cmd.timeStamp,
                            side:'X'
                        }]);

                    },
                    "JoinGame": function (cmd) {
                        if(gameState.gameFull()){
                            applyEvents( [{
                                gameId: cmd.gameId,
                                type: "FullGameJoinAttempted",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp
                            }]);
                            return;
                        }

                        applyEvents([{
                            gameId: cmd.gameId,
                            type: "GameJoined",
                            user: cmd.user,
                            name: cmd.name,
                            timeStamp: cmd.timeStamp,
                            side:'O'
                        }]);
                    },
                    "LeaveGame": function (cmd) {
                        applyEvents([{
                            gameId: cmd.gameId,
                            type: "GameLeft",
                            user: cmd.user,
                            name: cmd.name,
                            timeStamp: cmd.timeStamp
                        }]);
                    },
                    "PlaceMove": function(cmd){
                        if(gameState.illegalMove(cmd.y, cmd.x)){
                            applyEvents([{
                                gameId: cmd.gameId,
                                type: "IllegalMove",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp,
                                side: cmd.side,
                                y: cmd.y,
                                x: cmd.x
                            }]);
                            return;
                        }
                        if(gameState.wrongPlayer(cmd.side)){
                            applyEvents([{
                                gameId: cmd.gameId,
                                type: "NotYourMove",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp,
                                side: cmd.side,
                                y: cmd.y,
                                x: cmd.x
                            }]);
                            return;
                        }
                        if(gameState.gameWon(cmd.y, cmd.x, cmd.side)){
                            applyEvents([{
                                gameId: cmd.gameId,
                                type: "GameWon",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp,
                                side: cmd.side,
                                y: cmd.y,
                                x: cmd.x
                            }]);
                            return;
                        }
                        if(gameState.draw()){
                            applyEvents([{
                                gameId: cmd.gameId,
                                type: "Draw",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp,
                                side: cmd.side,
                                y: cmd.y,
                                x: cmd.x
                            }]);
                            return;
                        }
                        applyEvents([{
                            gameId: cmd.gameId,
                            type: "MovePlaced",
                            user: cmd.user,
                            name: cmd.name,
                            timeStamp: cmd.timeStamp,
                            side: cmd.side,
                            y: cmd.y,
                            x: cmd.x
                        }]);
                        

                        // Check here for conditions which prevent command from altering state



                    },
                    "RequestGameHistory": function(cmd){
                        // Game does not handle this query command, is declared here for making tests more robust.
                    }
                };

                if(!cmdHandlers[cmd.type]){
                    throw new Error("I do not handle command of type " + cmd.type)
                }
                cmdHandlers[cmd.type](cmd);
            }
        }
    }
};

