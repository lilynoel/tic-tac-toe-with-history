import React, { useEffect, useState } from "react";
import {
  createNewGame,
  getAllGames,
  nextGameNum,
} from "../../utilities/kontent-utils";
import { Link } from "react-router-dom";

const GameList = () => {
  const [games, setGames] = useState([]);
  const [count, setCount] = useState(0);
  const onButtonClick = () => {
    // figure out what the next game number should be.
    const nextNum = nextGameNum(games);
    // create a new game
    createNewGame(nextNum).then((response) => setCount(count + 1));
  };
  useEffect(() => {
    // fetch all games from collection and set into state.
    getAllGames().then((response) => setGames(response));
    // this is a hack to refresh page. will fix :-)
  }, [count]);
  return (
    <>
      <h1> This is the game list! </h1>
      <button onClick={onButtonClick}> Create Game </button>
      <br></br>
      <ul>
        {games.map((game) => {
          return (
            <li key={game.id}>
              <Link to={`/games/${game.id}`}>{game.name}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default GameList;
