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
    const nextNum = nextGameNum(games);
    createNewGame(nextNum).then((response) => setCount(count + 1));
  };
  useEffect(() => {
    getAllGames().then((response) => setGames(response));
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
