// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'

function Board() {
  
  const getOrDefault = (key) => { 
    const storedState = window.localStorage.getItem(key);
    if (!storedState)
    {
      return Array(9).fill(null);
    }

    return JSON.parse(storedState);
   };


  const[squares, setSquares] = React.useState(getOrDefault("tictactoe"));  
  const [nextPlayer, setNextPlayer] = React.useState(() => calculateNextValue(squares));
  let [winner, setWinner] = React.useState(calculateWinner(squares));  
  let [status, setStatus] = React.useState(calculateStatus(winner, squares, nextPlayer));

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

    const next = calculateNextValue(newSquares);
    setNextPlayer(next);

    const gotWinner = calculateWinner(newSquares);
    setWinner(gotWinner);
    setStatus(calculateStatus(gotWinner, newSquares, next));

    // interessante : we should update this with the "useEffect" and not on every click
    window.localStorage.setItem("tictactoe", JSON.stringify(newSquares));
  }

  function restart() {
    const newSquares = Array(9).fill(null);
    setSquares(newSquares);
    setWinner(null);

    const next = calculateNextValue(newSquares);
    setNextPlayer(next);
        
    setStatus(calculateStatus(null, newSquares, next));
    window.localStorage.removeItem("tictactoe");
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
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
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
