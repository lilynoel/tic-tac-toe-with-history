import client, { deliveryClient } from "../config/client";
import { v4 as uuidv4 } from "uuid";

// Using the delivery client to fetch all items that are of the "game" content type.
export async function getAllGames() {
  const response = await deliveryClient
    .items()
    .equalsFilter("system.type", "game")
    .toPromise();
  return response.data.items.map((item) => {
    return { ...item.elements, ...item.system };
  });
}

// use delivery client to resolve "game" content item and linked "move" items.
export async function getGameById(codename) {
  const response = await deliveryClient
    .item(codename)
    // linked items are being resolved here with the depthParameter
    .depthParameter(1)
    .toPromise();
  const { elements, system } = response.data.item;
  const id = system.id;

  // extract data from response.
  const winner = elements.winner.value;
  const draw = elements.draw.value;
  const currentPlayer = elements.current_player.value;

  // extract data from moves.
  const moves = elements.move.linkedItems.map((moveData) => {
    const coordinate = moveData.elements.coordinate.value;
    const symbol = moveData.elements.symbol.value;
    return { coordinate, symbol };
  });
  // turn data into board array.
  const board = translateMovesToBoard(moves);
  // useable data for react.
  return { winner, draw, currentPlayer, board, id, moves };
}

// function to translate moves to the board
export function translateMovesToBoard(moves) {
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
    // randomly generates starting player.
    currentPlayer: Math.random() > 0.5 ? "X" : "O",
  };
  // updates content of freshly created game.
  const game = await updateGameById(id, defaultState);
  await publishById(id);
  return response;
}

// function to generate new game number
export function nextGameNum(games) {
  const nums = games.map((game) => {
    const num = parseInt(game.name.split(" ")[1]);
    return num;
  });
  const lastNum = Math.max(...nums);
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

// This function creates a move and links it to a game by id.
export async function createMove(gameId, coordinate, symbol, gameState) {
  try {
    const response = await client
      .addContentItem()
      .withData({
        // To ensure unique name for each move.
        name: uuidv4(),
        coordinate: coordinate,
        symbol: symbol,
        type: { codename: "move" },
        collection: { codename: "default" },
      })
      .toPromise();
    const { id } = response.data;
    const move = updateMoveById(id, { symbol, coordinate });
    // This function links the move to the id. It involves several steps.
    // See function for more details.
    const updatedGameResponse = await linkMoveToGame(gameId, id, gameState);
    // copy existing game moves.
    const moves = [...gameState.moves];
    // add new move to array. 
    moves.push({ coordinate, symbol });
    // return moves along with response. 
    return [updatedGameResponse, moves];
  } catch (e) {
    console.log(e);
  }
}

// This updates the move to set symbol and coordinate.
async function updateMoveById(id, data) {
  const response = await client
    .upsertLanguageVariant()
    .byItemId(id)
    .byLanguageCodename("default")
    .withData((builder) => {
      return {
        elements: [
          builder.textElement({
            element: { codename: "symbol" },
            value: data.symbol,
          }),
          builder.textElement({
            element: { codename: "coordinate" },
            value: data.coordinate,
          }),
        ],
      };
    })
    .toPromise();
}

// This will publish any item by its id.
async function publishById(id) {
  const response = await client
    .publishLanguageVariant()
    .byItemId(id)
    .byLanguageCodename("default")
    .withoutData()
    .toPromise();
  return response;
}

// This will create a new version of the content item, it's workflow step will be draft.
async function createNewVersion(gameId) {
  const response = await client
    .createNewVersionOfLanguageVariant()
    .byItemId(gameId)
    .byLanguageCodename("default")
    .toPromise();
  return response;
}

// This function will link a newly created move to an existing game.
async function linkMoveToGame(gameId, moveId, gameState) {
  const gameResponse = await client
    .viewLanguageVariant()
    .byItemId(gameId)
    .byLanguageCodename("default")
    .toPromise();
  // Get the id's of the moves already linked to a game.
  const moves = gameResponse.data.elements[3].value.map((move) => move.id);
  // Add the id from the new move to list of moves.
  moves.push(moveId);
  // Need to create a new version because can't update an already published game.
  await createNewVersion(gameId);
  const { currentPlayer } = gameState;
  // Switch player for next move.
  const newPlayer = currentPlayer === "X" ? "O" : "X";
  const response = await client
    .upsertLanguageVariant()
    .byItemId(gameId)
    .byLanguageCodename("default")
    .withData((builder) => {
      return {
        elements: [
          // Recreate linked items using new move id.
          builder.linkedItemsElement({
            element: { codename: "move" },
            value: moves.map((id) => ({ id })),
          }),
          // Update current player.
          builder.textElement({
            element: { codename: "current_player" },
            value: newPlayer,
          }),
        ],
      };
    })
    .toPromise();
  // Publish new game version and new move so they can be retrieved by delivery API.
  const newPublishedGameResponse = await publishById(gameId);
  await publishById(moveId);
  // console.log(gameResponse);
  // const updatedGame = await getGameById(gameResponse.data._raw.item.codename);
  // return updatedGame;
  console.log(newPublishedGameResponse);
  return newPublishedGameResponse;
}

// Updates the game to show winner. Needs to create a new version and publish.
export async function updateGameToWon(gameId, symbol) {
  await createNewVersion(gameId);
  const response = await client
    .upsertLanguageVariant()
    .byItemId(gameId)
    .byLanguageCodename("default")
    .withData((builder) => {
      return {
        elements: [
          builder.textElement({
            element: { codename: "winner" },
            value: symbol,
          }),
        ],
      };
    })
    .toPromise();
  await publishById(gameId);
}

// Updates the game to reflect a draw.
export async function updateGameToDraw(gameId) {
  await createNewVersion(gameId);
  const response = await client
    .upsertLanguageVariant()
    .byItemId(gameId)
    .byLanguageCodename("default")
    .withData((builder) => {
      return {
        elements: [
          builder.textElement({
            element: { codename: "draw" },
            value: "true",
          }),
        ],
      };
    })
    .toPromise();
  await publishById(gameId);
}
