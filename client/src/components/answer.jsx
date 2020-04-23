import React from 'react';
import Button from 'react-bootstrap/Button';

function Answer(props) {
    return (
        <div>
            <Button className={"answer " + props.name} variant="outline-secondary" onClick={props.checkAnswer} name={props.name}>{props.value}</Button>
        </div>
    );
}

export default Answer;