import Cell from "../Cell";
// using sass for styles in this project.
import styles from "./styles.module.scss";

const Board = ({ board, gameState, setGameState, id }) => {
  return (
    <section className={styles.board}>
      {board.map((symbol, index) => (
        <Cell
          key={index}
          coordinate={index}
          symbol={symbol}
          // passing game state and setter into cell.
          gameState={gameState}
          setGameState={setGameState}
        />
      ))}
    </section>
  );
};

export default Board;
