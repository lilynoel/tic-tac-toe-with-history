# Tic Tac Toe (with history!)

Initially I created a version of Tic Tac Toe that was a single game, 
https://github.com/lilynoel/react-tic-tac-toe


Original approach did not meet the project spec.

This approach uses much more Kontent.ai functionality (creating new content items, fetching all content items, using collections). This application uses React Router DOM to support multiple pages. 

- GameList fetches all games from Games Collection in Kontent project and renders links to each game. 

- Game uses params to fetch content item by id. Each game has a current player, winner and draw element. But moves, are linked content items from the content model. This is a work in progress, moves can be added through Kontent.ai UI, and do render successfully, but there is no functionality to create new moves through the app yet. 

- All Kontent related functions are in utils (kontent-utils).


