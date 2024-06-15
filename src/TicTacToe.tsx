import {
    useState, MouseEvent,
    useEffect
} from 'react'
import './App.css'
import { Board } from './game'
import { useParams } from 'react-router-dom';
import Modal from './Modal';

function TicTacToe() {
    const { id } = useParams();
    const blankBoard = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ] satisfies Board

    const [player, setPlayer] = useState('')
    const [gameBoard, setGameBoard] = useState(blankBoard)
    const [gameState, setGameState] = useState<any>({})
    const [poller, setPoller] = useState(0)
    const [cont, setCont] = useState(true)

    useEffect(() => {
        const refresh = () => {
            fetch(`http://localhost:4000/game/${id}`, {
                method: "GET", // or 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include'
                // body: JSON.stringify(data),
            }).then(response => response.json())
                .then(async data => {
                    console.log('what is here', data)
                    setPlayer(data.game.currentPlayer)
                    setGameBoard(data.game.board)
                    setGameState(data.game.winState)
                    setCont(data.game.gameOn)
                }
                );
        }
        refresh()

        if (gameState.outcome == 'win') {
            setCont(false)
        } else if (gameState.outcome == 'tie') {
            setCont(false)
        }
        // settimeouthere
        setTimeout(() => {
            setPoller(poller + 1);
        }, 700);
    }, [poller]);

    const handleMove = (data: { rowId: number; itemId: number }) => {
        fetch(`http://localhost:4000/game/${id}/move`, {
            method: "POST", // or 'PUT'
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(response => response.json())
            .then(data => {
                setPlayer(data.game.currentPlayer)
                setGameBoard(data.game.board)
                setGameState(data.game.winState)
            });
    }

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        // Add text to screen, get the current position, and send that data to handle move
        if (cont) {
            // e.currentTarget.innerHTML = player
            const parentRow = e.currentTarget.parentNode as HTMLElement
            const rowId = Number(parentRow.id)
            const childItem = e.target as HTMLElement
            const itemId = Number(childItem.id)

            handleMove({ rowId: rowId, itemId: itemId })
        }
    }

    return (
        <>
            <h1 className='mb-4 underline'>Tic Tac Toe</h1>
            {cont && <>{player}'s' turn</>}
            {gameState.outcome == 'win' && <>
                <Modal message={player === "X" ? "O wins" : "X wins"} /></>}
            {gameState.outcome == 'tie' && <Modal message={'Tie game'} />}
            <div className='columns-3 bg-red-50 m-2'>
                {gameBoard.map((row, rowindex) => {
                    return <div className='' id={rowindex.toString()}>{
                        row.map((_string, itemIdx) => {
                            return <div onClick={handleClick} id={itemIdx.toString()} className=' grid-cols-3 border border-black w-20 h-20 flex justify-center items-center m-0 gap-6 shadow-2xl shadow-white text-6xl'>{gameBoard[itemIdx][rowindex]}</div>
                        })
                    }</div>
                })}
            </div>
            <br>
            </br>
            <button onClick={() => {
                setCont(true)
                fetch(`http://localhost:4000/game/${id}/restart`, {
                    method: "POST", // or 'PUT'
                    headers: {
                        "Content-Type": "application/json",
                    },
                }).then(response => response.json())
                    .then(data => {
                        setGameBoard(data.game.board)
                    });
                window.location.reload()
            }}>Reset game</button>
            <a href='/'><button>Lobby</button></a>
        </>
    )
}

export default TicTacToe
