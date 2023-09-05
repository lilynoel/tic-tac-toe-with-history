import React, { useEffect, useState } from "react";
import {
  createNewGame,
  getAllGames,
  nextGameNum,
} from "../../utilities/kontent-utils";
import { Link, useNavigate } from "react-router-dom";
import { deliveryClient } from "../../config/client";
import { sortByGameNumber } from "../../utilities/array-utils";

const GameList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState([]);
  const onButtonClick = () => {
    // figure out what the next game number should be.
    const nextNum = nextGameNum(games);
    // create a new game
    createNewGame(nextNum).then((response) => {
      setLoading(true);
      setTimeout(() => {
        navigate("/games/" + response.data.codename);
      }, 2000);
    });
  };

  useEffect(() => {
    // fetch all games from collection and set into state.
    getAllGames().then((response) => setGames(response.sort(sortByGameNumber)));
    // this is a hack to refresh page. will fix :-)
    deliveryClient
      // retrieves game 1, and all linked items attached to game 1.
      .item("game_1")
      .depthParameter(1)
      .toPromise()
      .then((response) => {});
  }, []);
  return (
    <>
      {loading && <p>Loading...</p>}
      {!loading && (
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
      )}
    </>
  );
};

export default GameList;
