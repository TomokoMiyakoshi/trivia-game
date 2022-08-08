import React from "react"

export default function Option(props) {
    const {questionNumber, correct, handleAnswerChange, option, userAnswers, showAnswers} = props
    let extraClasses
    if (showAnswers) {
        if (correct) {
            extraClasses = "correct-option" 
        } else if (userAnswers[questionNumber] === option) {
            extraClasses = "wrong-option"
        }
    } else if (userAnswers[questionNumber] === option) {
        extraClasses = "selected-option" 
    }

    return (
        <div>
            <input id={option} type="radio"
                    onChange={!showAnswers ? handleAnswerChange : undefined}
                    value={option}
                    name={questionNumber}
                    checked={userAnswers[questionNumber] === option}
            />
            <label className={`option ${extraClasses}`} htmlFor={option}>{option}</label>
        </div>
            
    )
}