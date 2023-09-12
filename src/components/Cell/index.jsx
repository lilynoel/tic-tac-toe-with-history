import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { checkWinner, checkDraw } from "../../utilities/game-utils";
import {
  createMove,
  translateMovesToBoard,
  updateGameToDraw,
  updateGameToWon,
} from "../../utilities/kontent-utils";
import styles from "./styles.module.scss";

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

  const updateBoard = async (index) => {
    // don't allow moves to be created out of step so moves are not overwritten.
    if (step !== maxStep) {
      return;
    }
    // don't allow move creation if game has been won.
    if (gameState.winner) {
      return;
    }
    const currentMoves = [...gameState.moves];
    const copy = translateMovesToBoard(currentMoves);

    // don't overwrite existing moves.
    if (copy[index]) {
      return;
    }
    copy[index] = gameState.currentPlayer;
    setLoading(true);
    // create move in kontent.ai
    // get updated moves back from kontent.ai
    const [response, moves] = await createMove(
      gameState.id,
      coordinate,
      gameState.currentPlayer,
      gameState
    );
    const responseStatus = response?.debug?.response?.rawResponse?.status;
    // if there is an error, do not update game state.
    if (!responseStatus || responseStatus < 200 || responseStatus > 399) {
      return;
    }

    // check if latest move finishes game.
    const winner = checkWinner(copy);
    const draw = checkDraw(copy);
    console.log(gameState.board, copy);
    // create new state object.
    const newState = { ...gameState };
    // add updated moves to new state object.
    newState.moves = moves;
    // if there is a winner, add winner. Add draw if there is a draw.
    if (winner) {
      newState.winner = winner;
      // update game in kontent.ai to won, if there is a winner.
      await updateGameToWon(gameState.id, gameState.currentPlayer);
    } else if (draw) {
      newState.draw = "true";
      // update game in kontent.ai to draw, if there is a draw.
      await updateGameToDraw(gameState.id);
    }
    // if the game isn't won or draw, switch player.
    if (!newState.winner && newState.draw === "false") {
      newState.currentPlayer = newState.currentPlayer === "X" ? "O" : "X";
    }
    // update step and state.
    setStep((step) => step + 1);
    setGameState(newState);
    // turn off loading.
    setLoading(false);
  };

  return (
    // calls update board function when cell is clicked.
    <div
      style={loading ? { backgroundColor: "grey" } : {}}
      onClick={() => updateBoard(coordinate)}
      className={styles.cell}
    >
      {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : symbol}
    </div>
  );
};

export default Cell;
