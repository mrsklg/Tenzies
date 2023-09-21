import React from "react"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    
    const dots = []
    
    for (let i = 0; i < props.value; i++) {
        dots.push(<div className="dot" key={i}></div>)
    }
    
    return (
        <div 
            className={`die-face dice-${props.value}`}
            style={styles}
            onClick={props.holdDice}
        >
            {dots}
        </div>
    )
}
            // <h2 className="die-num">{props.value}</h2>