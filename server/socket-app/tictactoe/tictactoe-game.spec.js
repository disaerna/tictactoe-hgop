let should = require('should');
let _ = require('lodash');

let TictactoeState = require('./tictactoe-state')(inject({}));

let tictactoe = require('./tictactoe-game')(inject({
    TictactoeState
}));

let createEvent = {
    type: "GameCreated",
    user: {
        userName: "TheGuy"
    },
    name: "TheFirstGame",
    timeStamp: "2014-12-02T11:29:29"
};

let joinEvent = {
    type: "GameJoined",
    user: {
        userName: "Gummi"
    },
    name: "TheFirstGame",
    timeStamp: "2014-12-02T11:29:29"
};


describe('create game command', function() {


    let given, when, then;

    beforeEach(function(){
        given=undefined;
        when=undefined;
        then=undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function(actualEvents){
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });


    it('should emit game created event', function(){

        given = [];
        when =
            {
                id:"123987",
                type: "CreateGame",
                user: {
                    userName: "TheGuy"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29"
            };
        then = [
            {
                type: "GameCreated",
                user: {
                    userName: "TheGuy"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29",
                side:'X'
            }
        ];

    })
});


describe('join game command', function () {

    let given, when, then;

    beforeEach(function () {
        given = undefined;
        when = undefined;
        then = undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function (actualEvents) {
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });


    it('should emit game joined event...', function () {

        given = [{
            type: "GameCreated",
            user: {
                userName: "TheGuy"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        }
        ];
        when =
            {
                type: "JoinGame",
                user: {
                    userName: "Gummi"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:30:29"
            };
        then = [
            {
                type: "GameJoined",
                user: {
                    userName: "Gummi"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:30:29",
                side:'O'
            }
        ];

    });

    it('should emit FullGameJoinAttempted event when game full', function () {
        given = [
            {
                type: "GameCreated",
                user: {
                    userName: "TheGuy"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29"
            },

            {
                type: "JoinGame",
                user: {
                    userName: "Gummi"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29"
            }
        ];
        when =
            {
                type: "JoinGame",
                user: {
                    userName: "Unnsteinn"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29"
            };
        then = [
            {
                type: "FullGameJoinAttempted",
                user: {
                    userName: "Unnsteinn"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29",
            }
        ];

    });
});


describe('place move command', function() {
    
    
        let given, when, then;
    
        beforeEach(function(){
            given=undefined;
            when=undefined;
            then=undefined;
        });
    
        afterEach(function () {
            tictactoe(given).executeCommand(when, function(actualEvents){
                should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
            });
        });

        it('should emit MovePlaced on first game move', function(){
            given = [{
                    type: "GameCreated",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29"
                },
                {
                    type: "GameJoined",
                    user: {
                        userName: "Gummi"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29"
                },
            ];
            when = 
            {
                type: "PlaceMove",
                user: {
                    userName: "TheGuy"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29",
                side: 'X',
                y: 0,
                x: 0
            };

            then = [
                {
                    type: "MovePlaced",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'X',
                    y: 0,
                    x: 0
                }
            ];
        });

        it('should emit IllegalMove when square is already occupied', function(){
            given = [{
                    type: "GameCreated",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29"
                },
                {
                    type: "GameJoined",
                    user: {
                        userName: "Gummi"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29"
                },
                {
                    type: "PlaceMove",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'X',
                    y: 0,
                    x: 0
                }
            ];
            when = 
            {
                type: "PlaceMove",
                user: {
                    userName: "Gummi"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:30:29",
                side: 'O',
                y: 0,
                x: 0
            }

            then = [
                {
                    type: "IllegalMove",
                    user: {
                        userName: "Gummi"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:30:29",
                    side: 'O',
                    y: 0,
                    x: 0
                }
            ];
        });

        it('should emit NotYourMove if attempting to make move out of turn', function(){
            given = [{
                type: "GameCreated",
                user: {
                    userName: "TheGuy"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29"
            },
            {
                type: "GameJoined",
                user: {
                    userName: "Gummi"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29"
            },
            {
                type: "MovePlaced",
                user: {
                    userName: "TheGuy"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29",
                side: 'X',
                y: 0,
                x: 0
            },
            {
                type: "MovePlaced",
                user: {
                    userName: "Gummi"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:30:29",
                side: 'O',
                y: 1,
                x: 0
            }
        ];
        when = {
            type: "PlaceMove",
            user: {
                userName: "Gummi"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:33:29",
            side: 'O',
            y: 2,
            x: 0
        }

        then = [
            {
                type: "NotYourMove",
                user: {
                    userName: "Gummi"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:33:29",
                side: 'O',
                y: 2,
                x: 0
            }
        ];
    });

    it('should emit game won on horizontal', function(){
        given = [
            {
                type: "GameCreated",
                user: {
                    userName: "TheGuy"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29"
            },
            {
                type: "GameJoined",
                user: {
                    userName: "Gummi"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29"
            },
            {
                type: "MovePlaced",
                user: {
                    userName: "TheGuy"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29",
                side: 'X',
                y: 0,
                x: 0
            },
            {
                type: "MovePlaced",
                user: {
                    userName: "Gummi"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29",
                side: 'O',
                y: 1,
                x: 0
            },
            {
                type: "MovePlaced",
                user: {
                    userName: "TheGuy"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29",
                side: 'X',
                y: 0,
                x: 1
            },
            {
                type: "MovePlaced",
                user: {
                    userName: "Gummi"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29",
                side: 'O',
                y: 1,
                x: 1
            }
            ];
            when = 
            {
                type: "PlaceMove",
                user: {
                    userName: "TheGuy"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:30:29",
                side: 'X',
                y: 0,
                x: 2
            };

            then = [
                {
                    type: "GameWon",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:30:29",
                    side: 'X',
                    y: 0,
                    x: 2
                }
            ];
        });
        it('should emit game won on vertical', function(){
            given = [
                {
                    type: "GameCreated",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29"
                },
                {
                    type: "GameJoined",
                    user: {
                        userName: "Gummi"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29"
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'X',
                    y: 0,
                    x: 0
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "Gummi"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'O',
                    y: 2,
                    x: 2
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'X',
                    y: 1,
                    x: 0
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "Gummi"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'O',
                    y: 2,
                    x: 1
                }
                ];
                when = 
                {
                    type: "PlaceMove",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:30:29",
                    side: 'X',
                    y: 2,
                    x: 0
                };
    
                then = [
                    {
                        type: "GameWon",
                        user: {
                            userName: "TheGuy"
                        },
                        name: "TheFirstGame",
                        timeStamp: "2014-12-02T11:30:29",
                        side: 'X',
                        y: 2,
                        x: 0
                    }
                ];
            });
        it('should emit game won on diagonal downwards', function(){
            given = [
                {
                    type: "GameCreated",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29"
                },
                {
                    type: "GameJoined",
                    user: {
                        userName: "Gummi"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29"
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'X',
                    y: 0,
                    x: 0
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "Gummi"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'O',
                    y: 2,
                    x: 0
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'X',
                    y: 1,
                    x: 1
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "Gummi"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'O',
                    y: 1,
                    x: 0
                }
                ];
                when = 
                {
                    type: "PlaceMove",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:30:29",
                    side: 'X',
                    y: 2,
                    x: 2
                };
    
                then = [
                    {
                        type: "GameWon",
                        user: {
                            userName: "TheGuy"
                        },
                        name: "TheFirstGame",
                        timeStamp: "2014-12-02T11:30:29",
                        side: 'X',
                        y: 2,
                        x: 2
                    }
                ];
            });
            it('should emit game won on diagonal upwards', function(){
                given = [
                    {
                        type: "GameCreated",
                        user: {
                            userName: "TheGuy"
                        },
                        name: "TheFirstGame",
                        timeStamp: "2014-12-02T11:29:29"
                    },
                    {
                        type: "GameJoined",
                        user: {
                            userName: "Gummi"
                        },
                        name: "TheFirstGame",
                        timeStamp: "2014-12-02T11:29:29"
                    },
                    {
                        type: "MovePlaced",
                        user: {
                            userName: "TheGuy"
                        },
                        name: "TheFirstGame",
                        timeStamp: "2014-12-02T11:29:29",
                        side: 'X',
                        y: 2,
                        x: 0
                    },
                    {
                        type: "MovePlaced",
                        user: {
                            userName: "Gummi"
                        },
                        name: "TheFirstGame",
                        timeStamp: "2014-12-02T11:29:29",
                        side: 'O',
                        y: 0,
                        x: 0
                    },
                    {
                        type: "MovePlaced",
                        user: {
                            userName: "TheGuy"
                        },
                        name: "TheFirstGame",
                        timeStamp: "2014-12-02T11:29:29",
                        side: 'X',
                        y: 1,
                        x: 1
                    },
                    {
                        type: "MovePlaced",
                        user: {
                            userName: "Gummi"
                        },
                        name: "TheFirstGame",
                        timeStamp: "2014-12-02T11:29:29",
                        side: 'O',
                        y: 1,
                        x: 0
                    }
                    ];
                    when = 
                    {
                        type: "PlaceMove",
                        user: {
                            userName: "TheGuy"
                        },
                        name: "TheFirstGame",
                        timeStamp: "2014-12-02T11:30:29",
                        side: 'X',
                        y: 0,
                        x: 2
                    };
        
                    then = [
                        {
                            type: "GameWon",
                            user: {
                                userName: "TheGuy"
                            },
                            name: "TheFirstGame",
                            timeStamp: "2014-12-02T11:30:29",
                            side: 'X',
                            y: 0,
                            x: 2
                        }
                    ];
                });
        it('should emit game draw when neither wins', function(){
            given = [
                {
                    type: "GameCreated",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29"
                },
                {
                    type: "GameJoined",
                    user: {
                        userName: "Gummi"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29"
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'X',
                    y: 0,
                    x: 0
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "Gummi"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'O',
                    y: 0,
                    x: 1
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'X',
                    y: 0,
                    x: 2
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "Gummi"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'O',
                    y: 1,
                    x: 0
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'X',
                    y: 1,
                    x: 1
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "Gummi"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'O',
                    y: 2,
                    x: 0
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'X',
                    y: 1,
                    x: 2
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "Gummi"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'O',
                    y: 2,
                    x: 2
                }
                ];
                when = 
                {
                    type: "PlaceMove",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:30:29",
                    side: 'X',
                    y: 2,
                    x: 1
                };
                then = [
                    {
                        type: "Draw",
                        user: {
                            userName: "TheGuy"
                        },
                        name: "TheFirstGame",
                        timeStamp: "2014-12-02T11:30:29",
                        side: 'X',
                        y: 2,
                        x: 1
                    }
                ];
            });
        it('should not emit game draw when win on last move', function(){
            given = [
                {
                    type: "GameCreated",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29"
                },
                {
                    type: "GameJoined",
                    user: {
                        userName: "Gummi"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29"
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'X',
                    y: 0,
                    x: 0
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "Gummi"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'O',
                    y: 0,
                    x: 1
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'X',
                    y: 0,
                    x: 2
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "Gummi"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'O',
                    y: 1,
                    x: 1
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'X',
                    y: 1,
                    x: 0
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "Gummi"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'O',
                    y: 1,
                    x: 2
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'X',
                    y: 2,
                    x: 1
                },
                {
                    type: "MovePlaced",
                    user: {
                        userName: "Gummi"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:29:29",
                    side: 'O',
                    y: 2,
                    x: 2
                }
                ];
                when = 
                {
                    type: "PlaceMove",
                    user: {
                        userName: "TheGuy"
                    },
                    name: "TheFirstGame",
                    timeStamp: "2014-12-02T11:30:29",
                    side: 'X',
                    y: 2,
                    x: 0
                };
                then = [
                    {
                        type: "GameWon",
                        user: {
                            userName: "TheGuy"
                        },
                        name: "TheFirstGame",
                        timeStamp: "2014-12-02T11:30:29",
                        side: 'X',
                        y: 2,
                        x: 0
                    }
                ];
            });
});    