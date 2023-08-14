import { checkWinner, checkDraw } from "../../utilities/game-utils";
import styles from "./styles.module.scss";

const Cell = ({ symbol, coordinate, gameState, setGameState }) => {
  const updateBoard = (index) => {
    if (gameState.winner) {
      return;
    }
    const copy = [...gameState.board];
    if (copy[index]) {
      return;
    }
    copy[index] = gameState.currentPlayer;
    const winner = checkWinner(copy);
    const draw = checkDraw(copy);
    if (winner || draw) {
      return;
    }
    console.log("clicked! " + coordinate);
  };
  return (
    <div onClick={() => updateBoard(coordinate)} className={styles.cell}>
      {symbol}
    </div>
  );
};

export default Cell;
