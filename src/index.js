import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button
      style={props.highlight ? { color: "red" } : {}}
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        highlight={this.props.highlights[i]}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const rows = 3;
    const arr = Array(rows).fill(null);
    return (
      <div>
        {arr.map((_, x) => {
          return (
            <div key={x} className="board-row">
              {arr.map((_, y) => {
                return this.renderSquare(x * arr.length + y);
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          point: [0, 0],
        },
      ],
      xIsNext: true,
      stepNumber: 0,
      reverse: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          point: [i % 3, Math.floor(i / 3)],
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const point = `(${step.point[0]}, ${step.point[1]})`;
      const desc = move ? `Go to move ${point} # ${move}` : "Go to game start";
      return (
        <li key={move}>
          <button
            style={
              move === this.state.stepNumber
                ? { fontWeight: "bold" }
                : { fontWeight: "inherit" }
            }
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    const highlights = Array(9).fill(null);

    if (winner) {
      status = "Winner: " + winner.Winner;
      const points = winner?.Points || [];

      points.map((i) => {
        highlights[i] = true;
      });
    } else {
      status = "Next is: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            highlights={highlights}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.reverse ? moves.reverse() : moves}</ol>
          <button
            onClick={() => this.setState({ reverse: !this.state.reverse })}
          >
            {this.state.reverse ? "升序" : "降序"}
          </button>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        Points: [a, b, c],
        Winner: squares[a],
      };
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
