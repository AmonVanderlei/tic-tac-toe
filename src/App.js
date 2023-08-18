import './App.css';
import { FaRegCircle, FaTimes } from 'react-icons/fa';
import { useState, useEffect, useCallback } from 'react';

function App() {
  const [menuClass, setMenuClass] = useState('none');
  const [menu, setMenu] = useState(false);
  const [winner, setWinner] = useState(false);
  const [player, setPlayer] = useState(["Player 1", <FaTimes className='player-1'/>]);
  const [board, setBoard] = useState([null, null, null, null, null, null, null, null, null]);
  const [points, setPoints] = useState([0, 0, 0])

  useEffect(() => {
    const savedPoints = localStorage.getItem("points");
    if (savedPoints) {
      setPoints(JSON.parse(savedPoints));
    }
  }, []);

  const setLocalPoints = useCallback((points) => {
    localStorage.setItem("points", JSON.stringify(points));
    setPoints(points);
  }, [setPoints]);

  useEffect(() => {
    if (winner === true) {
      if (player[0] !== 'Velha') {
        const newPoints = [...points]

        if (player[0] === "Player 1") {
          newPoints[0] += 1
        } else {
          newPoints[2] += 1
        }
        newPoints[1] += 1

        setLocalPoints(newPoints)
        setMenu(true)
        setWinner(false)
      }
    };
  }, [winner, player, points, setLocalPoints]);

  useEffect(() => {
    if (menu === true) {
      setMenuClass('span');
    } else {
      setMenuClass('none');
    };
  }, [menu]);

  function verifyWinner(newBoard) {
    const winnerCases = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < winnerCases.length; i++) {
      const notNull = newBoard[winnerCases[i][0]] !== null && newBoard[winnerCases[i][1]] !== null && newBoard[winnerCases[i][2]] !== null;
      if (notNull) {
        if (newBoard[winnerCases[i][0]].props.className === newBoard[winnerCases[i][1]].props.className && newBoard[winnerCases[i][0]].props.className === newBoard[winnerCases[i][2]].props.className) {
          return true;
        }
      }
    }
    return false;
  }

  function verifyDraw(newBoard) {
    if (winner === false) {
      for (let i = 0; i < 9; i++) {
        if (newBoard[i] === null) {
          return false;
        }
      }
      return true;
    }
  }

  function handleClick(index) {
    if (board[index] === null && winner === false) {
      const newBoard = [...board];

      if (player[0] === "Player 1") {
        newBoard[index] = <FaTimes className='player-1' />;
        if (verifyWinner(newBoard)) {
          setWinner(true);
        } else {
          setPlayer(["Player 2", <FaRegCircle className='player-2' />]);
        }

      } else {
        newBoard[index] = <FaRegCircle className='player-2' />;
        if (verifyWinner(newBoard)) {
          setWinner(true);
        } else {
          setPlayer(["Player 1", <FaTimes className='player-1' />]);
        }
      }
      if (verifyDraw(newBoard)) {
        const newPoints = [...points];
        newPoints[1] += 1;

        setLocalPoints(newPoints);
        setPlayer(["Velha", <div><FaRegCircle className='player-2' /><FaTimes className='player-1' /></div>]);
        setWinner(true);
        setMenu(true);
      }
      setBoard(newBoard);
    }
  }

  function nextGame(e) {
    e.preventDefault();
    setWinner(false);
    setBoard([null, null, null, null, null, null, null, null, null]);
    setMenu(false);
  }

  function reset(e) {
    e.preventDefault();
    setWinner(false);
    setLocalPoints([0, 0, 0]);
    setBoard([null, null, null, null, null, null, null, null, null]);
    setMenu(false);
  }

  return (
    <div className="app">
      <div className='top'>
          <h2>TicTacToe</h2>
      </div>
      <div className='main'>
        <div className='board'>
          <div onClick={() => handleClick(0)}>{board[0]}</div>
          <div onClick={() => handleClick(1)}>{board[1]}</div>
          <div onClick={() => handleClick(2)}>{board[2]}</div>
          <div onClick={() => handleClick(3)}>{board[3]}</div>
          <div onClick={() => handleClick(4)}>{board[4]}</div>
          <div onClick={() => handleClick(5)}>{board[5]}</div>
          <div onClick={() => handleClick(6)}>{board[6]}</div>
          <div onClick={() => handleClick(7)}>{board[7]}</div>
          <div onClick={() => handleClick(8)}>{board[8]}</div>
        </div>
        <div className={menuClass}>
          <div className='background'></div>
          <div className='menu'>
            <div className='winner'>
              {player[0] !== 'Velha' ? <b>{player[0]} venceu!</b> : <b>{player[0]}!</b>}
            </div>
            <div className='winnerIcon'>{player[1]}</div>
            <div className='buttons'>
              <button onClick={(e) => reset(e)}><b>Reset</b></button>
              <button onClick={(e) => nextGame(e)}><b>Continuar Jogo</b></button>
            </div>
          </div>
        </div>
      </div>
      <div className='points'>
        <div className='player player-x'>
          <FaTimes className='player-1'/>
          <p className='playerName'>Player 1</p>
          <p className='playerPoints'>{points[0]}</p>
        </div>
        <div className='games'>
          <div className='playing'>
            <div>{player[0]}</div>
            <div>{player[1]}</div>
          </div>
          <p className='gamesP'>Games</p>
          <p className='quantityGames'>{points[1]}</p>
        </div>
        <div className='player player-0'>
          <FaRegCircle className='player-2'/>
          <p className='playerName'>Player 2</p>
          <p className='playerPoints'>{points[2]}</p>  
        </div>  
      </div>      
    </div>
  );
}

export default App;
