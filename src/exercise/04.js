// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from "../utils";

function Board({squares, setSquares}) {
   
  const nextPlayer = calculateNextValue(squares);
  const winner = calculateWinner(squares);  
  const status = calculateStatus(winner, squares, nextPlayer);

  function selectSquare(square) {
    
    if (winner !== null)
    {
      console.log("We've got a winner");
      return;
    }

    if (squares[square] !== null)
    {
      console.log("This position is already filled");
      return;
    }
    
    squares[square] = nextPlayer;
    setSquares(squares);
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>      
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>

    </div>
  )
}

function History() {

  


  return (
    <ol>
      <li><button>Move 1</button></li>
      <li><button>Move 2</button></li>
      <li><button>Move 3</button></li>
      <li><button>Move 4</button></li>
    </ol>
  );
}

function Game() {

  // const[squares, setSquares] = useLocalStorageState("tictactoe", Array(9).fill(null));
  const initialState = Array(9).fill(null);

  const[history, setHistory] = useLocalStorageState("ticTacToeHistory", [initialState]);
  const[step, setStep] = useLocalStorageState("ticTacToeStep", 0);

  function restart() {    
    const resetHistory = [initialState];
    setHistory(resetHistory);
    setStep(0);
  }

  const setSquares = (squares) => { 
    
    const newHistory = [...history];
    const newSquares = [...squares];

    newHistory.push(newSquares);
    setHistory(newHistory);
    
    setStep((currentStep) => { 
      return currentStep + 1;    
     });
   };

  const squares = history[step];     
  
  return (
    <React.Fragment>
      <div className="game">
        <div className="game-board">
          <p>Step:{step}</p>
          <Board squares={squares} setSquares={setSquares} />
          <button className="restart" onClick={restart}>
            restart
          </button>
        </div>
        <div>
          <History step={step} />
        </div>
      </div>
    </React.Fragment>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextPlayer) {
  if (winner) return `Winner: ${winner}`

  const returnStatus = squares.every(position => position !== null)
    ? `Scratch: Cat's game`
    : `Next player: ${nextPlayer}`
  console.log('Return status:', returnStatus)
  return returnStatus
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const countX = squares.filter(square => square === "X").length;
  const countO = squares.filter(square => square === "O").length;
  console.log("X Count, O count:", countX, countO);
  if (countX === 0)
    return "X";

  return countO >= countX ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
