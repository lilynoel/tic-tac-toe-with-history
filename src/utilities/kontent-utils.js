import client from "../config/client";

export async function getAllGames() {
  const allItems = await client.listContentItems().toPromise();
  const games = allItems.data.items.filter(
    (item) => item.collection.id === "e3cca0c7-4e62-42fa-9d6a-222137b3a2e7"
  );
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
