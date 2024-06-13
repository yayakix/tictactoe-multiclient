import {
  useState, MouseEvent
} from 'react'
import './App.css'
import { Board, checkBoard } from './game'

function App() {
  const blankBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ] satisfies Board

  const [player, setPlayer] = useState('X')
  const [gameBoard, setGameBoard] = useState(blankBoard)
  const [winner, setWinner] = useState<string | null>(null)

  const nextTurn = () => {
    if (player === 'X') {
      setPlayer('O')
    } else {
      setPlayer('X')
    }
  }
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {

    e.currentTarget.innerHTML = player
    const parentRow = e.currentTarget.parentNode as HTMLElement
    const rowId = Number(parentRow.id)
    const childItem = e.target as HTMLElement
    const itemId = Number(childItem.id)
    // go through copy and update value at position
    // listcopy[itemId][rowId] = 'O'
    let copy = [...gameBoard]
    copy[itemId][rowId] = player
    setGameBoard(copy)
    nextTurn()
    // how to get rid of error
    const result = checkBoard(copy)
    console.log(result.outcome)
    if (result.outcome == 'win') {
      setWinner(result.winner)
    }
    else if (result.outcome == 'tie') {
      setWinner('Tie')
    }
  }

  return (
    <>
      <h1 className='mb-4'>Tic Tac Toe</h1>
      {winner && <>{winner == 'Tie' ? <>Tie game</> : <>{winner} wins</>} </>}
      {!winner && <>{player}'s Turn</>}
      <div className='columns-3 bg-red-50'>
        {gameBoard.map((row, rowindex) => {
          return <div className='' id={rowindex.toString()}>{
            row.map((_string, itemIdx) => {
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
