import Cell from "../Cell";
// using sass for styles in this project.
import styles from "./styles.module.scss";

const Board = ({ board, gameState, setGameState, setStep, step, maxStep }) => {
  return (
    <section className={styles.board}>
      {board.map((symbol, index) => (
        // passing game state and other props to be used in cell.
        <Cell
          step={step}
          maxStep={maxStep}
          key={index}
          coordinate={index}
          symbol={symbol}
          setStep={setStep}
          gameState={gameState}
          setGameState={setGameState}
        />
      ))}
    </section>
  );
};

export default Board;
