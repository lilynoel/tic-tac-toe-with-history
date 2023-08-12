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
  return game.data;
}
