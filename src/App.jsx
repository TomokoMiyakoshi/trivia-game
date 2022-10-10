
import './App.css'
import React, { useState, useEffect, useRef } from "react"
import Question from "./components/Question"
import Timer from "./components/Timer"
import yellowBlob from "./assets/yellow-blob.svg"
import blueBlob from "./assets/blue-blob.svg"

export default function App() {
  console.log("rendered")
  const [playing, setPlaying] = useState(false)
  const [difficulty, setDifficulty] = useState("easy")
  const [showAnswers, setShowAnswers] = useState(false)
  const [questions, setQuestions] = useState([])
  const [userAnswers, setUserAnswers] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
    4: ""
  })
  const userAnswersRef = useRef(userAnswers)
  const questionsRef = useRef(questions)
  useEffect(() => {
    questionsRef.current = questions
  }, [questions])

  const [score, setScore] = useState(0)
  const defaultTimeLeft = {
    minutes: 3,
    seconds: 0
  }
  const [timeLeft, setTimeLeft] = useState(defaultTimeLeft)

  function decreaseTimeLeft() {
    setTimeLeft(prevTimeLeft => ({
      minutes: prevTimeLeft.seconds === 0 ? prevTimeLeft.minutes - 1 : prevTimeLeft.minutes,
      seconds: prevTimeLeft.seconds === 0 ? 59 : prevTimeLeft.seconds - 1
    }))
  }

  useEffect(() => {
    if (playing) {
      const timeLeft = setInterval(() => {
        decreaseTimeLeft()
      }, 1000)

      const timeout = setTimeout(() => {
        setShowAnswers(true)
      }, (defaultTimeLeft.minutes * 60 + defaultTimeLeft.seconds) * 1000)

      return () => {
        clearInterval(timeLeft)
        clearTimeout(timeout)
      }
    }
  }, [playing])

  function handleAnswerChange(event) {
    const { name, value, checked } = event.target
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [name]: value
    }))
    userAnswersRef.current = userAnswers
  }

  function handleDifficultyChange(event) {
    const { value } = event.target
    setDifficulty(value)
  }


  useEffect(() => {
    // fetch questions after difficulty is selected/changed, not after start game is clicked
    fetch(`https://opentdb.com/api.php?amount=5&difficulty=${difficulty}&type=multiple`)
      .then(res => res.json())
      .then(newQuestions => processNewQuestions((newQuestions)))
  }, [difficulty])

  function getAllOptions(q) {
    const randomIndex = Math.floor(Math.random() * 3)
    const allOptions = [...q.incorrect_answers]
    allOptions.splice(randomIndex, 0, q.correct_answer)
    return allOptions
  }

  function processNewQuestions(newQuestions) {
    const newQuestionsArray = newQuestions.results.map(q => ({
      ...q,
      allOptions: getAllOptions(q)
    }))
    setQuestions(newQuestionsArray)
  }

  const questionElems = questions.map((q, index) => {
    return (
      <Question questionObj={q}
        key={index}
        questionNumber={index}
        handleAnswerChange={handleAnswerChange}
        userAnswers={userAnswers}
        showAnswers={showAnswers} />
    )
  })


  function startGame(event) {
    event.preventDefault()
    setTimeLeft(defaultTimeLeft)
    setPlaying(true)
  }


  function resetGame(event) {
    event.preventDefault()
    setShowAnswers(false)
    setPlaying(false)
    setUserAnswers({
      0: "",
      1: "",
      2: "",
      3: "",
      4: ""
    })
  }

  function handleCheckAnswers(event) {
    event.preventDefault()
    checkAnswers()
  }

  useEffect(() => {
    const correctAnswers = questions.map(q => q.correct_answer)
    let newScore = 0
    correctAnswers.forEach((ans, index) => {
      if (userAnswers[index] === ans) {
        newScore++
      }
    })
    setScore(newScore)
  }, [showAnswers])

  function checkAnswers() {
    setShowAnswers(true)
  }

  return (
    <main>
      {
        playing ?
          <form className="quiz-page">
            <div>
              <h1 className="heading">Quizzical</h1>
              {!showAnswers && <Timer timeLeft={timeLeft} />}
            </div>

            <div className="questions-container">
              {questionElems}
            </div>
            {showAnswers && <p className="score">Your score: {score}/5</p>}
            {showAnswers ?
              <button className="restart" onClick={resetGame}>Play again</button> :
              <button className="check" onClick={handleCheckAnswers}>Check answers</button>}
          </form> :
          <div className="intro-page">
            <img className="yellow-blob" src={yellowBlob} />
            <img className="blue-blob" src={blueBlob} />
            <h1>Quizzical</h1>
            <form className="difficulty">
              <h1>Select Difficulty</h1>
              <div>
                <input id="easy" type="radio"
                  onChange={handleDifficultyChange}
                  value="easy"
                  name="difficulty"
                  checked={difficulty === "easy"}
                />
                <label htmlFor="easy">Easy</label>
              </div>
              <div>
                <input id="medium" type="radio"
                  onChange={handleDifficultyChange}
                  value="medium"
                  name="difficulty"
                  checked={difficulty === "medium"}
                />
                <label htmlFor="medium">Medium</label>
              </div>
              <div>
                <input id="hard" type="radio"
                  onChange={handleDifficultyChange}
                  value="hard"
                  name="difficulty"
                  checked={difficulty === "hard"}
                />
                <label htmlFor="hard">Hard</label>
              </div>
              <button className="start-btn" onClick={startGame}>Start quiz</button>
            </form>
          </div>
      }
    </main>

  )
}