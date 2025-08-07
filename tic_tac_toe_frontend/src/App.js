import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Returns the winner ('X' or 'O'), null if no winner yet, or 'draw' if draw.
 * @param {Array} squares - Array of 9 elements representing the board.
 * PUBLIC_INTERFACE
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[b] === squares[c]
    ) {
      return squares[a];
    }
  }
  if (squares.every((s) => s)) return "draw";
  return null;
}

/**
 * A single square on the tic tac toe board.
 * PUBLIC_INTERFACE
 */
function Square({ value, onClick, isWinning }) {
  return (
    <button
      className={`ttt-square${isWinning ? " winning" : ""}`}
      onClick={onClick}
      aria-label={value ? `Square ${value}` : "Empty square"}
    >
      {value}
    </button>
  );
}

/**
 * The tic tac toe board.
 * PUBLIC_INTERFACE
 */
function Board({ squares, onSquareClick, winningLine }) {
  // Generate 3x3 board
  function renderSquare(i) {
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        isWinning={winningLine && winningLine.includes(i)}
      />
    );
  }
  return (
    <div className="ttt-board">
      {[0, 1, 2].map((row) => (
        <div className="ttt-board-row" key={row}>
          {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
        </div>
      ))}
    </div>
  );
}

/**
 * Main App - Tic Tac Toe Game
 * PUBLIC_INTERFACE
 */
function App() {
  // 'X' always starts
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameStatus, setGameStatus] = useState("playing"); // "playing" | "won" | "draw"
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);

  // For responsive theme coloring (not dark mode toggle per requirements)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  // Check for a winner
  useEffect(() => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    const winnerVal = calculateWinner(board);
    if (winnerVal && winnerVal !== "draw") {
      setGameStatus("won");
      setWinner(winnerVal);
      // find which line is winning
      for (let line of lines) {
        const [a, b, c] = line;
        if (
          board[a] &&
          board[a] === board[b] &&
          board[b] === board[c]
        ) {
          setWinningLine(line);
          break;
        }
      }
    } else if (winnerVal === "draw") {
      setGameStatus("draw");
      setWinner(null);
      setWinningLine(null);
    } else {
      setGameStatus("playing");
      setWinner(null);
      setWinningLine(null);
    }
  }, [board]);

  // Handle a move
  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    if (board[index] || gameStatus !== "playing") return;
    const nextBoard = board.slice();
    nextBoard[index] = isXNext ? "X" : "O";
    setBoard(nextBoard);
    setIsXNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus("playing");
    setWinner(null);
    setWinningLine(null);
  }

  let statusMsg;
  if (gameStatus === "won")
    statusMsg = (
      <span>
        <span className="status--emoji">🎉</span>
        Winner:{" "}
        <span className="status--winner">
          {winner}
        </span>
      </span>
    );
  else if (gameStatus === "draw")
    statusMsg = (
      <span>
        <span className="status--emoji">🤝</span>
        It's a draw!
      </span>
    );
  else
    statusMsg = (
      <span>
        <span className="status--emoji">⏳</span>
        Next turn: <span className="status--next">{isXNext ? "X" : "O"}</span>
      </span>
    );

  return (
    <div className="App">
      <main className="ttt-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status">{statusMsg}</div>
        <Board
          squares={board}
          onSquareClick={handleSquareClick}
          winningLine={winningLine}
        />
        <div className="ttt-controls">
          <button className="ttt-btn ttt-btn--red" onClick={handleRestart}>
            Restart Game
          </button>
        </div>
        <footer className="ttt-footer">
          <span>
            Two-player mode <strong>(X and O take turns)</strong>
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
