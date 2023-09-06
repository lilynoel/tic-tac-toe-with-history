import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Board from "../../components/Board";
import {
  getGameById,
  translateMovesToBoard,
} from "../../utilities/kontent-utils";

function Game() {
  // get id from url
  const navigate = useNavigate();
  const { id } = useParams();
  const [gameState, setGameState] = useState(null);
  const [board, setBoard] = useState(null);
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);

  // fetch game by id when component mounts or when id changes
  useEffect(() => {
    // set game into state (To do: handle invalid id to avoid app crash)
    getGameById(id).then((response) => {
      setGameState(response);
    }, []);
  });
  useEffect(() => {
    if (!gameState) {
      return;
    }
    setMaxStep(gameState.moves.length);
  }, [gameState]);
  useEffect(() => {
    if (!gameState) {
      return;
    }
    const slice = gameState.moves.slice(0, step);
    console.log(slice);
    const board = translateMovesToBoard(slice);
    console.log(board);
    setBoard(board);
  }, [step]);

  return (
    <>
      <button onClick={() => navigate("/")}>Return to game list</button>
      <h1> This is the game page! </h1>
      {gameState && !gameState.winner && (
        <h2> Current Player: {gameState.currentPlayer}</h2>
      )}
      {gameState && gameState.winner && <h2> Winner: {gameState.winner}</h2>}
      {gameState && gameState.draw === "true" && <h2> It's a draw! </h2>}
      {board && (
        <Board
          step={step}
          maxStep={maxStep}
          board={board}
          id={gameState.id}
          gameState={gameState}
          setStep={setStep}
          // Passing function instead of using context. Context was a bit confusing for me at this stage.
          // Passing a function here required more code, but was better suited to my current level of experience.
          setGameState={setGameState}
        />
      )}
      <br />

     <button disabled={step < 1} onClick={() => setStep(step - 1)}> ⇤ </button>
     <button disabled={step >= maxStep} onClick={() => setStep(step + 1)}> ⇥ </button>
      {gameState && gameState.moves && (
        <span style={{marginLeft: "5px"}} >
          Move {step} out of {maxStep}
        </span>
      )}
    </>
  );
}

export default Game;
