import Cell from "../Cell";
import styles from "./styles.module.scss";

const Board = ({ board, gameState, setGameState }) => {
  return (
    <section className={styles.board}>
      {board.map((symbol, index) => (
        <Cell
          key={index}
          coordinate={index}
          symbol={symbol}
          gameState={gameState}
          setGameState={setGameState}
        />
      ))}
    </section>
  );
};

export default Board;
