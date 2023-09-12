import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
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
      // wait a few seconds for game to be published, then redirect to game page.
      setTimeout(() => {
        navigate("/games/" + response.data.codename);
      }, 2000);
    });
  };

  useEffect(() => {
    // fetch all games from collection and set into state.
    getAllGames().then((response) => setGames(response.sort(sortByGameNumber)));
  }, []);
  return (
    <>
      {loading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon icon={faSpinner} spin />
          <p>Loading...</p>
        </div>
      )}
      {!loading && (
        <>
          <h1> Tic Tac Toe! </h1>
          <button onClick={onButtonClick}> Create Game </button>
          <h3>Game list:</h3>
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
