import { useState } from 'react'
import './App.css'
import { checkBoard } from './game'

function App() {
  const blankBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]

  const [player, setPlayer] = useState('X')
  const [gameBoard, setGameBoard] = useState(blankBoard)
  const [winner, setWinner] = useState(null)

  const nextTurn = () => {
    if (player === 'X') {
      setPlayer('O')
    } else {
      setPlayer('X')
    }
  }
  const handleClick = (e) => {
    e.target.innerHTML = player
    const rowId = Number(e.target.parentNode.id)
    const itemId = Number(e.target.id)
    // go through copy and update value at position
    // listcopy[itemId][rowId] = 'O'
    let copy = [...gameBoard]
    copy[itemId][rowId] = player
    setGameBoard(copy)
    nextTurn()
    const result = checkBoard(copy)
    console.log(result.outcome)
    if (result.outcome == 'win') {

      setWinner(`Winner is ${result.winner}`)
    }

    else if (result.outcome == 'tie') {
      setWinner('Tie')
    }
  }

  return (
    <>
      {winner}
      <h1 className='mb-4'>Tic Tac Toe</h1>
      <div className='columns-3'>
        {gameBoard.map((row, rowindex) => {
          return <div className='' id={rowindex.toString()}>{
            row.map((string, itemIdx) => {
              return <div onClick={handleClick} id={itemIdx.toString()} className=' grid-cols-3  w-20 h-20 flex justify-center items-center m-0 gap-6 shadow-2xl shadow-white'></div>
            })
          }</div>
        })}
      </div>
      <br>
      </br>

      <button onClick={() => {
        setWinner(null)
        window.location.reload()
      }}>Play Again</button>
    </>
  )
}

export default App
