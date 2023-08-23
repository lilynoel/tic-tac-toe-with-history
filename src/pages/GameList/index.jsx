import React, { useEffect, useState } from "react";
import {
  createNewGame,
  getAllGames,
  nextGameNum,
} from "../../utilities/kontent-utils";
import { Link } from "react-router-dom";
import { deliveryClient } from "../../config/client";

const GameList = () => {
  const [games, setGames] = useState([]);
  const [count, setCount] = useState(0);
  const onButtonClick = () => {
    // figure out what the next game number should be.
    const nextNum = nextGameNum(games);
    // create a new game
    createNewGame(nextNum).then((response) => setCount(count + 1));
  };
  console.log(games);
  useEffect(() => {
    // fetch all games from collection and set into state.
    getAllGames().then((response) => setGames(response));
    // this is a hack to refresh page. will fix :-)
    deliveryClient
      // retrieves game 1, and all linked items attached to game 1.
      .item("game_1")
      .depthParameter(1)
      .toPromise()
      .then((response) => {
        console.log(response);
      });
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
              <Link to={`/games/${game.codename}`}>{game.name}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default GameList;
