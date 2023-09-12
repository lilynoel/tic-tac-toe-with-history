# Tic Tac Toe (with history!)

[Try it out!](https://tictactoe-with-history.netlify.app)

- GameList fetches all games from Games Collection in Kontent project and renders links to each game. (gamelist > index.jsx line 29)

- Game uses params (game > index.jsx line 13) to fetch content item by codename using the delivery API. Each game has a current player, winner and draw element. But moves, are linked content items from the content model. Moves are resolved by the delivery API. 

- All Kontent.ai related functions are in utils (kontent-utils.js). Functions to fetch data use the delivery API, functions to create and update data use the management API. 

- Move history is handled with local state within the game component. A slice of the moves data is taken based on the step state. (game > index.jsx, line 33) This data renders the board. 

- Not styled. It's "rustic"...