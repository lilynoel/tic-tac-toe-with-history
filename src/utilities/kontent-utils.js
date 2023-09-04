import client, { deliveryClient } from "../config/client";
import { v4 as uuidv4 } from "uuid";

export async function getAllGames() {
  // const allItems = await client.listContentItems().toPromise();
  // // filtering all items by collection. Is there a better way to do this with MAPI?
  // const games = allItems.data.items.filter(
  //   (item) => item.collection.id === "e3cca0c7-4e62-42fa-9d6a-222137b3a2e7"
  // );
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
  return { winner, draw, currentPlayer, board, id };
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
  await publishById(id);
  return game;
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

export async function createMove(gameId, coordinate, symbol, gameState) {
  try {
    const response = await client
      .addContentItem()
      .withData({
        name: uuidv4(),
        coordinate: coordinate,
        symbol: symbol,
        type: { codename: "move" },
        collection: { codename: "default" },
      })
      .toPromise();
    const { id } = response.data;
    const move = updateMoveById(id, { symbol, coordinate });
    const updatedGameResponse = await linkMoveToGame(gameId, id, gameState);
    return updatedGameResponse;
  } catch (e) {
    console.log(e);
  }
}

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

async function publishById(id) {
  const response = await client
    .publishLanguageVariant()
    .byItemId(id)
    .byLanguageCodename("default")
    .withoutData()
    .toPromise();
  return response;
}

async function createNewVersion(gameId) {
  const response = await client
    .createNewVersionOfLanguageVariant()
    .byItemId(gameId)
    .byLanguageCodename("default")
    .toPromise();
  return response;
}

async function linkMoveToGame(gameId, moveId, gameState) {
  const gameResponse = await client
    .viewLanguageVariant()
    .byItemId(gameId)
    .byLanguageCodename("default")
    .toPromise();
  const moves = gameResponse.data.elements[3].value.map((move) => move.id);
  moves.push(moveId);
  await createNewVersion(gameId);
  const { currentPlayer } = gameState;
  const newPlayer = currentPlayer === "X" ? "O" : "X";
  const response = await client
    .upsertLanguageVariant()
    .byItemId(gameId)
    .byLanguageCodename("default")
    .withData((builder) => {
      return {
        elements: [
          builder.linkedItemsElement({
            element: { codename: "move" },
            value: moves.map((id) => ({ id })),
          }),
          builder.textElement({
            element: { codename: "current_player" },
            value: newPlayer,
          }),
        ],
      };
    })
    .toPromise();
  const newPublishedGameResponse = await publishById(gameId);
  await publishById(moveId);
  return newPublishedGameResponse;
}

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
