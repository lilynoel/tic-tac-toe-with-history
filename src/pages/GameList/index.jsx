import React, { useEffect, useState } from "react";
import { getAllGames } from "../../utilities/kontent-utils";
import { Link } from "react-router-dom";

const GameList = () => {
  const [games, setGames] = useState([]);
  useEffect(() => {
    getAllGames().then((response) => setGames(response));
  }, []);
  return (
    <>
      <h1> This is the game list! </h1>
      {games.map((game) => {
        return (
          <Link to={`/games/${game.id}`} key={game.id}>
            {game.name}
          </Link>
        );
      })}
    </>
  );
};

export default GameList;
