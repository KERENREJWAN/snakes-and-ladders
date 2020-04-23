import React from 'react';
import { animations } from 'react-animation';
import Answer from './answer';

function Question(props) {
    return (
        <div className="Question" style={{ display: props.showQuestion ? "inline-block" : "none", animation: props.showQuestion ? animations.popIn : animations.popOut }}>
            <h3 style={{ display: props.isWon ? "inline-block" : "none" }}>כל הכבוד, סיימת את המשחק!</h3>
            <div>
                <h2 style={{ display: props.isWon ? "none" : "inline-block" }}>{props.currentQuestion.question}</h2>
                <Answer value={props.currentQuestion.answer1} checkAnswer={(event) => { props.checkAnswer(event) }} name="answer1" />
                <Answer value={props.currentQuestion.answer2} checkAnswer={(event) => { props.checkAnswer(event) }} name="answer2" />
                <Answer value={props.currentQuestion.answer3} checkAnswer={(event) => { props.checkAnswer(event) }} name="answer3" />
                <Answer value={props.currentQuestion.answer4} checkAnswer={(event) => { props.checkAnswer(event) }} name="answer4" />
            </div>
        </div>
    );
}

export default Question;