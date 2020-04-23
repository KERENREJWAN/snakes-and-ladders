import React from 'react';
import Button from 'react-bootstrap/Button';

function Cube(props) {
    return (
        <div className="Cube">
            <img src={props.showDiceGif ? "../dice gif.gif" : "../dice2.png"} alt="cube" className="Cubw" />
            <h5>מספר הצעדים:</h5>
            <h2>{props.steps}</h2>
            <Button className="Button" onClick={props.rollDice} variant="outline-secondary" disabled={!props.allowClick || props.explainIsShown}>הגרל מספר</Button>
        </div>
    );
}

export default Cube;