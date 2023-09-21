import React from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rollCount, setRollCount] = React.useState(0)
    const [gameTime, setGameTime] = React.useState(0)
    const [timerRunning, setTimerRunning] = React.useState(false)

    const bestTime = JSON.parse(localStorage.getItem("bestTime"))
    const bestRollCount = JSON.parse(localStorage.getItem("bestRollCount"))

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    React.useEffect(() => {
        let interval;
        if (timerRunning) {
            interval = setInterval(() => {
                setGameTime(prevGameTime => prevGameTime + 10);
            }, 10)
        } else if (!timerRunning) {
            clearInterval(interval)
        }
        return () => clearInterval(interval);
    }, [timerRunning])

    React.useEffect(() => {
        if (tenzies) {
            setTimerRunning(false)
        }
    }, [tenzies])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }

    function rollDice() {
        if (!tenzies) {
            if (!timerRunning) {
                setTimerRunning(true)
            }
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ?
                    die :
                    generateNewDie()
            }))
            setRollCount(prevRollCount => prevRollCount + 1)
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setTimerRunning(false)

            if (bestTime) {
                if (bestTime > gameTime) {
                    localStorage.setItem("bestTime", JSON.stringify(gameTime))
                }
            } else {
                localStorage.setItem("bestTime", JSON.stringify(gameTime))
            }

            if (bestRollCount) {
                if (bestRollCount > rollCount) {
                    localStorage.setItem("bestRollCount", JSON.stringify(rollCount))
                }
            } else {
                localStorage.setItem("bestRollCount", JSON.stringify(rollCount))
            }
            setGameTime(0)
            setRollCount(0)
        }
    }

    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ?
                Object.assign(die, { isHeld: !die.isHeld }) :
                die
        }))
    }

    const diceElements = dice.map(die => (
        <Die
            key={die.id}
            value={die.value}
            isHeld={die.isHeld}
            holdDice={() => holdDice(die.id)}
        />
    ))

    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same.
                Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <div className="instructions">
                Your time:
                <span> {("0" + Math.floor((gameTime / 60000) % 60)).slice(-2)}:</span>
                <span>{("0" + Math.floor((gameTime / 1000) % 60)).slice(-2)}:</span>
                <span>{("0" + Math.floor((gameTime / 10) % 100)).slice(-2)}</span>
            </div>
            <p className="instructions">You rolled the dice: {rollCount} {rollCount === 1 ? "time" : "times"}</p>
            <button
                className="roll-dice"
                onClick={rollDice}
            >
                {tenzies ? "New Game" : timerRunning ? "Roll" : "Start"}
            </button>

            {bestTime
                ? <div className="instructions">
                    Best time:
                    <span> {("0" + Math.floor((bestTime / 60000) % 60)).slice(-2)}:</span>
                    <span>{("0" + Math.floor((bestTime / 1000) % 60)).slice(-2)}:</span>
                    <span>{("0" + Math.floor((bestTime / 10) % 100)).slice(-2)}</span>
                </div>
                : <div className="instructions">Best time: 00:00:00</div>}

            {bestRollCount
                ? <p className="instructions">Lowest number of dice rolls: {bestRollCount}
                    {bestRollCount === 1 ? " time" : " times"}</p>
                : <p className="instructions">Lowest number of dice rolls: 0</p>}
        </main>
    )
}