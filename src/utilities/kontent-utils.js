import client from "../config/client";

export async function getAllGames() {
  const allItems = await client.listContentItems().toPromise();
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
  const { elements } = game.data;
  const winner = elements[0].value;
  const draw = elements[1].value;
  const currentPlayer = elements[2].value;
  const movesRefs = elements[3].value;
  console.log(movesRefs);
  const movesPromise = movesRefs.map((ref) => getMoveById(ref.id));
  const movesData = await Promise.all(movesPromise);
  const moves = movesData.map((movedData) => {
    const { elements } = movedData.data;
    const coordinate = elements[0].value;
    const symbol = elements[1].value;
    return { coordinate, symbol };
  });
  const board = translateMovesToBoard(moves);
  return { winner, draw, currentPlayer, board };
}

function getMoveById(id) {
  return client
    .viewLanguageVariant()
    .byItemId(id)
    .byLanguageCodename("default")
    .toPromise();
}

function translateMovesToBoard(moves) {
  const board = Array(9).fill("");
  moves.forEach((move) => {
    board[move.coordinate] = move.symbol;
  });
  return board;
}

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
    currentPlayer: Math.random() > 0.5 ? "X" : "O",
  };
  const game = await updateGameById(id, defaultState);
  return game;
}

export function nextGameNum(games) {
  const last = games[games.length - 1];
  const lastNum = last.codename.split("_")[1];
  return parseInt(lastNum) + 1;
}

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
