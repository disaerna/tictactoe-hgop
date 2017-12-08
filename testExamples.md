# Test examples for unit tests

## Create game command

* Should emit game created event
    *  **When** The Guy creates a new game **then** a new game is created.

## Join game command

* Should emit game joined event
    * **Given** that a game is already created by The Guy. **When** Gummi joins the game **then** he and The Guy are both in the game.

* Should emit FullGameJoinAttempted when game full
    * **Given** that a game has been created by The Guy and Gummi has joined the game. **When** Unnsteinn tries to join the game as well **then** he can't because the game is full. 
   
## Place move command

* Should emit MovePlaced on first game move
    * **Given** that a game has been created by the Guy and Gummi has joined the game. **When** The Guy places X on [0.0] **then** the move has been placed and X is in [0.0].

* Should emit IllegalMove when square is already occupied
    * **Given** that a game has been created by the Guy and Gummi has joined the game. The guy has made the first move on [0.0]. **When** Gummi tries to place O in the same square **then** he should get "IllegalMove".

* Should emit NotYourMove if attempting to make move out of turn
    * **Given** that a game has been created by the Guy and Gummi has joined the game. The guy has placed X on [0.0]. Gummi places O on [1.0]. **When** Gummi tries to make a move again **then** he should get "NotYourMove".

* Should emit game won on horizontal
    * **Given** that a game has been created by the Guy and Gummi has joined the game. The guy has placed X on [0.0]. Gummi has placed O on [1.0]. The guy has placed X on [0.1]. Gummi has placed O on [1.1]. **When** The Guy places X on [0.2] **then** he should get "GameWon".

* Should emit game won on vertical
    * **Given** that a game has been created by the Guy and Gummi has joined the game. The guy has placed X on [0.0]. Gummi has placed O on [2.2]. The guy has placed X on [1.0]. Gummi has placed O on [2.1]. **When** The Guy places X on [2.0] **then** he should get "GameWon".

* Should emit game won on downwards diagonal
    * **Given** that a game has been created by the Guy and Gummi has joined the game. The guy has placed X on [0.0]. Gummi has placed O on [2.0]. The guy has placed X on [1.1]. Gummi has placed O on [1.10. **When** The Guy places X on [2.2] **then** he should get "GameWon".

* Should emit game won on upwards diagonal
    * **Given** that a game has been created by the Guy and Gummi has joined the game. The guy has placed X on [2.0]. Gummi has placed O on [0.0]. The guy has placed X on [1.1]. Gummi has placed O on [1.0]. **When** The Guy places X on [0.2] **then** he should get "GameWon".

* Should not emit game draw if won on last move
    * **Given** that a game has been created by the Guy and Gummi has joined the game. The guy has placed X on [0.0]. Gummi has placed O on [0.1]. The guy has placed X on [0.2]. Gummi has placed O on [1.1]. The guy has placed X on [1.0]. Gummi has placed O on [1.2]. The guy places X on [2.1]. Gummi has placed O on [2.2] **When** The Guy places X on [2.0] **then** he should get "GameWon".

* Should emit game draw when neither wins
    * **Given** that a game has been created by the Guy and Gummi has joined the game. The guy has placed X on [0.0]. Gummi has placed O on [0.1]. The guy has placed X on [0.2]. Gummi has placed O on [1.0]. The guy has placed X on [1.1]. Gummi has placed O on [2.0]. The guy places X on [1.2]. Gummi has placed O on [2.2] **When** The Guy places X on [2.1] **then** the game is a "Draw".
