import {
  useState, MouseEvent,
  useEffect
} from 'react'
import './App.css'
import { Board } from './game'
import TicTacToe from './TicTacToe'
import Lobby from './Lobby'

function App() {




  return (
    <>
      {/* <TicTacToe /> */}
      <Lobby />
    </>
  )
}

export default App
