import client from "../config/client";

export async function getAllGames() {
  const allItems = await client.listContentItems().toPromise();
  // filtering all items by collection. Is there a better way to do this with MAPI?
  const games = allItems.data.items.filter(
    (item) => item.collection.id === "e3cca0c7-4e62-42fa-9d6a-222137b3a2e7"
  );
  console.log(games);
  return games;
}

export async function getGameById(id) {
  const game = await client
    .viewLanguageVariant()
    .byItemId(id)
    .byLanguageCodename("default")
    .toPromise();
  
  // extract data from response. 
  const { elements } = game.data;
  const winner = elements[0].value;
  const draw = elements[1].value;
  const currentPlayer = elements[2].value;
  const movesRefs = elements[3].value;
  console.log(movesRefs);
  // get all moves related to this game
  const movesPromise = movesRefs.map((ref) => getMoveById(ref.id));
  // fetch concurrently :-)
  const movesData = await Promise.all(movesPromise);
  // extract data from moves.
  const moves = movesData.map((movedData) => {
    const { elements } = movedData.data;
    const coordinate = elements[0].value;
    const symbol = elements[1].value;
    return { coordinate, symbol };
  });
  // turn data into board array.
  const board = translateMovesToBoard(moves);
  // useable data for react. 
  return { winner, draw, currentPlayer, board };
}

// function to get an individual move by id
function getMoveById(id) {
  return client
    .viewLanguageVariant()
    .byItemId(id)
    .byLanguageCodename("default")
    .toPromise();
}

// function to translate moves to the board
function translateMovesToBoard(moves) {
  const board = Array(9).fill("");
  moves.forEach((move) => {
    board[move.coordinate] = move.symbol;
  });
  return board;
}

// function to create a new game
export async function createNewGame(num) {
  const response = await client
    .addContentItem()
    .withData({
      name: "Game " + num,
      codename: "game_" + num,
      type: { codename: "game" },
      collection: { codename: "games_collection" },
    })
    .toPromise();
  const { id } = response.data;
  const defaultState = {
    draw: "false",
    winner: "",
    // randomly generates starting player (usually chooses "X" though?), 
    // doesn't seem to be equally half and half, needs more attention. 
    currentPlayer: Math.random() > 0.5 ? "X" : "O",
  };
  // updates content of freshly created game.
  const game = await updateGameById(id, defaultState);
  return game;
}


// function to generate new game number
export function nextGameNum(games) {
  const last = games[games.length - 1];
  const lastNum = last.codename.split("_")[1];
  return parseInt(lastNum) + 1;
}

// function to update an existing game in Kontent.ai app. 
export async function updateGameById(id, gameState) {
  const response = await client
    .upsertLanguageVariant()
    .byItemId(id)
    .byLanguageCodename("default")
    .withData((builder) => {
      return {
        elements: [
          builder.textElement({
            element: { codename: "current_player" },
            value: gameState.currentPlayer,
          }),
          builder.textElement({
            element: { codename: "winner" },
            value: gameState.winner,
          }),
          builder.textElement({
            element: { codename: "draw" },
            value: String(gameState.draw),
          }),
        ],
      };
    })
    .toPromise();
  return response;
}
