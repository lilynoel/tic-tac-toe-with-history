import Cell from "../Cell";
// using sass for styles in this project.
import styles from "./styles.module.scss";

const Board = ({ board, gameState, setGameState, setStep, step, maxStep }) => {
  return (
    <section className={styles.board}>
      {board.map((symbol, index) => (
        <Cell
          step={step}
          maxStep={maxStep}
          key={index}
          coordinate={index}
          symbol={symbol}
          // passing game state and setter into cell.
          setStep={setStep}
          gameState={gameState}
          setGameState={setGameState}
        />
      ))}
    </section>
  );
};

export default Board;
