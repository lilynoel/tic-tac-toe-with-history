import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Board from "../../components/Board";
import {
  getGameById,
  translateMovesToBoard,
} from "../../utilities/kontent-utils";

function Game() {
  // start with an empty board just incase loading takes a while.
  const defaultBoard = Array(9).fill("");
  const navigate = useNavigate();
  // get id from url
  const { id } = useParams();
  const [gameState, setGameState] = useState(null);
  const [board, setBoard] = useState(defaultBoard);
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);

  // fetch game by id when component mounts or when id changes
  useEffect(() => {
    // set game into state (To do: handle invalid id to avoid app crash)
    getGameById(id).then((response) => {
      setGameState(response);
    });
  }, [id]);
  // syncs up steps so whenever we go to a game, we start at the post recent step.
  useEffect(() => {
    if (!gameState) {
      return;
    }
    setMaxStep(gameState.moves.length);
    setStep(gameState.moves.length);
  }, [gameState]);

  // if we change steps, we need to recalculate the board.
  useEffect(() => {
    if (!gameState) {
      return;
    }

    // limit moves to step number.
    const slice = gameState.moves.slice(0, step);
    const board = translateMovesToBoard(slice);
    setBoard(board);
  }, [step, gameState]);

  return (
    <>
     {/* return to game list button */}
      <button onClick={() => navigate("/")}>Return to game list</button>

      <h1> This is the game page! </h1>
      {gameState && !gameState.winner && (
        <h2> Current Player: {gameState.currentPlayer}</h2>
      )}
      {/* conditional rendering based on state */}
      {gameState && gameState.winner && <h2> Winner: {gameState.winner}</h2>}
      {gameState && gameState.draw === "true" && <h2> It's a draw! </h2>}
      {gameState && (
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

      {/* disable buttons if they would take steps out of boundaries.  */}
      <button disabled={step < 1} onClick={() => setStep(step - 1)}>
        {" "}
        ⇤{" "}
      </button>
      <button disabled={step >= maxStep} onClick={() => setStep(step + 1)}>
        {" "}
        ⇥{" "}
      </button>
      {gameState && gameState.moves && (
        <span style={{ marginLeft: "5px" }}>
          Move {step} out of {maxStep}
        </span>
      )}
    </>
  );
}

export default Game;
