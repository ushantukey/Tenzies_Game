import React from 'react'
import Dice from './Dice'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

function App() {
  const [dices, setDices] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [roll, setRoll] = React.useState(0)
  const [start, setStart] = React.useState(false)
  const [seconds, setSeconds] = React.useState(0)
  const [minutes, setMinutes] = React.useState(1)
  const [hours, setHours] = React.useState(0)
  const [gameOver, setGameOver] = React.useState(false)

  React.useEffect(() => {
    let timer = setInterval(() => {
      if (!start || tenzies || gameOver) return

      if (hours === 0 && minutes === 0 && seconds === 0) {
        setStart(false)
        setGameOver(true)
        return
      }

      if (seconds > 0) {
        setSeconds(sec => sec - 1)
      } else if (minutes > 0) {
        setMinutes(min => min - 1)
        setSeconds(59)
      } else if (hours > 0) {
        setHours(hr => hr - 1)
        setMinutes(59)
        setSeconds(59)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [start, seconds, minutes, hours, tenzies, gameOver])

  React.useEffect(() => {
    const value = dices[0].value
    const isHeld = dices.every(dice => dice.isHeld)
    const sameValue = dices.every(dice => dice.value === value)
    if (sameValue && isHeld) {
      setTenzies(true)
      setStart(false)
    }
  }, [dices])

  function allNewDice() {
    const newArray = []
    for (let i = 0; i < 10; i++) {
      newArray.push({
        id: nanoid(),
        value: Math.floor(Math.random() * 6) + 1,
        isHeld: false
      })
    }
    return newArray
  }

  function holdDice(id) {
    if (tenzies || gameOver) return
    setStart(true)
    setDices(dices =>
      dices.map(dice =>
        dice.id === id ? { ...dice, isHeld: !dice.isHeld } : dice
      )
    )
  }

  function rollDice() {
    if (tenzies || gameOver) {
      resetGame()
      return
    }

    if (roll >= 14) { 
      setStart(false)
      setGameOver(true)
      return
    }

    setDices(dices =>
      dices.map(dice =>
        dice.isHeld ? dice : { ...dice, value: Math.floor(Math.random() * 6) + 1 }
      )
    )
    setRoll(r => r + 1)
  }

  function resetGame() {
    setDices(allNewDice())
    setTenzies(false)
    setGameOver(false)
    setRoll(0)
    setStart(false)
    setSeconds(0)
    setMinutes(1)
    setHours(0)
  }

  const diceElements = dices.map(dice => (
    <Dice
      key={dice.id}
      value={dice.value}
      isHeld={dice.isHeld}
      id={dice.id}
      holdDice={() => holdDice(dice.id)}
    />
  ))

  return (
    <main>
      {tenzies && <Confetti />}
      {!start && !gameOver && !tenzies && <h1 className="title">Tenzies</h1>}
      {!start && !gameOver && !tenzies && (
        <>
          <p className="instructions">
            Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
          </p>
          <div className="rules-box">
            <p className="rules">⏱ You have 1 minute to win the game</p>
            <p className="rules">🎲 Maximum 15 rolls allowed</p>
          </div>
        </>
      )}

      {(start || tenzies || gameOver) && (
        <div className='start-menu'>
          <h1 className='timer'>
            Time {String(hours).padStart(2, '0')}:
            {String(minutes).padStart(2, '0')}:
            {String(seconds).padStart(2, '0')}
          </h1>
          <h1 className='count-roll'>Count: {roll}</h1>
        </div>
      )}
      
      {gameOver && !tenzies && <h1 className="title">⛔ Game Over</h1>}

      <div className='dice-container'>
        {diceElements}
      </div>

      <button onClick={rollDice} className='roll-button'>
        {tenzies || gameOver ? 'New Game' : 'Roll'}
      </button>
    </main>
  )
}

export default App
