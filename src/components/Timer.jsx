import React from "react"

export default function Timer(props) {
    const {minutes, seconds} = props.timeLeft
    
    let className = "timer"
    if (minutes < 1 && seconds <= 10) {
        className += " red"
    } else if (minutes < 1) {
        className += " orange"
    }
    
    return (
        <p className={className}>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>
    )
}