import { checkWinner, checkDraw } from "../../utilities/game-utils";
import {
  createMove,
  updateGameToDraw,
  updateGameToWon,
} from "../../utilities/kontent-utils";
import styles from "./styles.module.scss";

const Cell = ({ symbol, coordinate, gameState, setGameState }) => {
  // not quite finished. Needs to create move.
  const updateBoard = async (index) => {
    if (gameState.winner) {
      return;
    }
    const copy = [...gameState.board];
    if (copy[index]) {
      return;
    }
    copy[index] = gameState.currentPlayer;

    const response = await createMove(
      gameState.id,
      coordinate,
      gameState.currentPlayer,
      gameState
    );
    console.log(response, gameState.id);
    const winner = checkWinner(copy);
    const draw = checkDraw(copy);
    if (winner) {
      const updatedState = {
        ...gameState,
        board: copy,
        winner: gameState.currentPlayer,
      };
      updateGameToWon(gameState.id, gameState.currentPlayer);
      setGameState(updatedState);
    } else if (draw) {
      const updatedState = {
        ...gameState,
        board: copy,
        draw: "true",
      };
      await updateGameToDraw(gameState.id);
      return setGameState(updatedState);
    } else {
      setGameState({
        ...gameState,
        board: copy,
        currentPlayer: gameState.currentPlayer === "X" ? "O" : "X",
      });
    }
  };
  return (
    <div onClick={() => updateBoard(coordinate)} className={styles.cell}>
      {symbol}
    </div>
  );
};

export default Cell;
