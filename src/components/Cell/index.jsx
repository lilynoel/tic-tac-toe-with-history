import { checkWinner, checkDraw } from "../../utilities/game-utils";
import {
  createMove,
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
      return setGameState(updatedState);
    } else {
      // otherwise, increase step and update game state.
      setStep((step) => step + 1);
      setGameState({
        ...gameState,
        board: copy,
        currentPlayer: gameState.currentPlayer === "X" ? "O" : "X",
      });
    }
  };
  return (
    // calls update board function when cell is clicked. 
    <div onClick={() => updateBoard(coordinate)} className={styles.cell}>
      {symbol}
    </div>
  );
};

export default Cell;
