import { useState } from "react";
import { checkWinner, checkDraw } from "../../utilities/game-utils";
import {
  createMove,
  getGameById,
  updateGameToDraw,
  updateGameToWon,
} from "../../utilities/kontent-utils";
import styles from "./styles.module.scss";
import { useParams } from "react-router-dom";

const Cell = ({
  symbol,
  coordinate,
  gameState,
  setGameState,
  setStep,
  step,
  maxStep,
}) => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const updateBoard = async (index) => {
    // don't allow moves to be created out of step so moves are not overwritten.
    if (step !== maxStep) {
      return;
    }
    // don't allow move creation if game has been won.
    if (gameState.winner) {
      return;
    }
    const copy = [...gameState.board];

    // set loading state before sending request
    setLoading(true);

    // don't overwrite existing moves.
    if (copy[index]) {
      return;
    }
    copy[index] = gameState.currentPlayer;

    // create move in kontent.ai
    const response = await createMove(
      gameState.id,
      coordinate,
      gameState.currentPlayer,
      gameState
    );
    console.log(response, gameState.id);
    // check if latest move finishes game.
    const winner = checkWinner(copy);
    const draw = checkDraw(copy);
    if (winner) {
      const updatedState = {
        ...gameState,
        board: copy,
        winner: gameState.currentPlayer,
      };
      // if game is won, update kontent.ai
      updateGameToWon(gameState.id, gameState.currentPlayer);
      setGameState(updatedState);
    } else if (draw) {
      const updatedState = {
        ...gameState,
        board: copy,
        draw: "true",
      };
      // if game is draw, update kontent.ai
      await updateGameToDraw(gameState.id);
      setGameState(updatedState);
    } else {
      // otherwise, increase step and update game state.
      setStep((step) => step + 1);
      setGameState({
        ...gameState,
        board: copy,
        currentPlayer: gameState.currentPlayer === "X" ? "O" : "X",
      });
    }
    setTimeout(() => {
      // getGameById(id).then((response) => {

      // Even manually fetching doesn't give published response, have to physically refresh page.
      //   console.log(response)
      //   setGameState(response)
      // });

      // This should manually refresh the page, but delivery API sends cached response?
      // In theory this should work but it doesn't...
      document.location.reload();
    }, 6000);
  };

  // Grey out background of cell while loading is true.
  const classNames = [styles.cell, `${loading ? styles.loading : ""}`].join(
    " "
  );
  return (
    // calls update board function when cell is clicked.
    <div onClick={() => updateBoard(coordinate)} className={classNames}>
      {symbol}
    </div>
  );
};

export default Cell;
