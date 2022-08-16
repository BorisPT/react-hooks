// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
// import {useLocalStorageState} from "../utils";

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
    
    const newSquares = [...squares];
    newSquares[square] = nextPlayer;
    setSquares(newSquares);
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

function History({total, currentStep, setIndex}) {

  const handleOnClick = (index) => { 
    setIndex(index);
   };

  const moves = [];
  for(let i = 0; i < total; i++)
  {
    const destination = i === 0 ? "game start" : `move #${i}`;
    const currentMove = i === currentStep ? "(current)" : "";

    const stepName = `Go to ${destination} ${currentMove}`;
    moves.push(<li key={Math.random().toString()}>
      <button disabled={i === currentStep} onClick={handleOnClick.bind(null, i)}>
        {stepName}
      </button>
      </li>);
  }

  return (
    <ol>
      {moves}
    </ol>
  );
}

function Game() {
  
  //const initialState = Array(9).fill(null);

  const[gameHistory, setGameHistory] = React.useState([Array(9).fill(null)]);
  const[step, setStep] = React.useState(0);

  function restart() {    
    const resetHistory = [Array(9).fill(null)];
    setGameHistory(resetHistory);
    setStep(0);
  }

  console.log("Game history (main): ", gameHistory);

  const setSquares = (squares) => { 

    console.log("Game history (setSquares): ", gameHistory);
        
    const newSquares = [...squares];

    const newGameHistory = [...gameHistory, newSquares];
    // newGameHistory.push(newSquares);

    setGameHistory(newGameHistory);
    
    setStep(step+1);
   };

   const setCurrentStep = (index) => { 
    setStep(index);
    };


  const squares = gameHistory[step];     
  
  return (
    <React.Fragment>
      <div className="game">
        <div className="game-board">          
          <Board squares={squares} setSquares={setSquares} />
          <button className="restart" onClick={restart}>
            restart
          </button>
        </div>
        <div>
          <History total={gameHistory.length} currentStep={step} setIndex={setCurrentStep} />
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
  
  return returnStatus
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const countX = squares.filter(square => square === "X").length;
  const countO = squares.filter(square => square === "O").length;
  
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
