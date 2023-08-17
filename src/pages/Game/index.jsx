import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Board from "../../components/Board";
import { getGameById } from "../../utilities/kontent-utils";

function Game() {
  // get id from url
  const { id } = useParams();
  const [gameState, setGameState] = useState(null);

  // fetch game by id when component mounts or when id changes
  useEffect(() => {

    // set game into state (To do: handle invalid id to avoid app crash)
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
          // Passing function instead of using context. Context was a bit confusing for me at this stage. 
          // Passing a function here required more code, but was better suited to my current level of experience.
          setGameState={setGameState}
        />
      )}
    </>
  );
}

export default Game;
