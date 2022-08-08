import React from "react"
import Option from "./Option"
import he from "he";

export default function Question(props) {

    const { question, correct_answer, allOptions } = props.questionObj
    const { questionNumber, handleAnswerChange, userAnswers, showAnswers } = props


    const optionElems = allOptions.map((option, index) => {
        return <Option key={index}
            option={he.decode(option)}
            questionNumber={questionNumber}
            correct={showAnswers ? option === correct_answer : undefined}
            handleAnswerChange={handleAnswerChange}
            userAnswers={userAnswers}
            showAnswers={showAnswers} />
    })

    return (
        <div className="question">
            <h1>{he.decode(question)}</h1>
            <div className="options-container">
                {optionElems}
            </div>
        </div>
    )
}