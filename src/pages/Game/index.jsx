import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Board from "../../components/Board";
import { getGameById } from "../../utilities/kontent-utils";

function Game() {
  const { id } = useParams();
  const [gameState, setGameState] = useState(null);
  useEffect(() => {
    getGameById(id).then((response) => {
      setGameState(response);
    });
  }, [id]);
  console.log(gameState);
  return (
    <>
      <h1> This is the game page! </h1>
      {gameState && <h2> Current Player: {gameState.currentPlayer}</h2>}
      {gameState && (
        <Board
          board={gameState.board}
          gameState={gameState}
          setGameState={setGameState}
        />
      )}
    </>
  );
}

export default Game;
