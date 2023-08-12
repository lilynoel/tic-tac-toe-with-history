import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getGameById } from "../../utilities/kontent-utils";

function Game() {
  const { id } = useParams();
  useEffect(() => {
    getGameById(id).then((response) => {
      console.log(response);
    });
  }, [id]);
  return <h1> This is the game page! </h1>;
}

export default Game;
