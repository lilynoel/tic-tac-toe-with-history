export function sortByGameNumber(a, b) {
  const gameOne = parseInt(a.name.split(" ")[1]);
  const gameTwo = parseInt(b.name.split(" ")[1]);
  return gameOne - gameTwo;
}
