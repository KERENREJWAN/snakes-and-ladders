import React, { useState, useEffect } from 'react';
import Cube from './cube';
import Question from './Question';
import axios from 'axios';
import WhosTurn from './WhosTurn';

function Board(props) {

    const gameId = window.location.pathname.substring(1, window.location.pathname.length);
    const [questionsFromDb, setQuestionsFromDb] = useState({});

    const [gotDataFromDb, setGotDataFromDb] = useState(false);

    useEffect(function () {
        async function getGame() {
            try {
                const response = await axios.get(`/api/subjects/${gameId}`);
                setQuestionsFromDb(response.data.questions);
                setGotDataFromDb(true);
            } catch (error) {
                console.log('error', error);
            }
        }
        getGame();
    }, [props]);

    const DIR_MAT = [
        [1, 0], //Dowm
        [0, 1], //Right
        [-1, 0], //Up
        [0, -1] // Left
    ];

    const DIR_DIFFERENCE = 40;
    var SAFETY_WALL = -2;
    const NUM_FOR_EMPTY = -1;
    var WALL_SIZE = 1;

    const boardArray = [];
    const boardSize = 10;

    let currentRow = 10;
    let currentCol = 1;

    const [position, setPosition] = useState({
        bottom: 4,
        left: 26
    });

    const [player2Position, setPlayer2Position] = useState({
        bottom: 1,
        left: 26
    });

    const [player2PositionInArray, setPlayer2PositionInArray] = useState({
        row: 10,
        col: 1
    });

    const [steps, setSteps] = useState();

    const [positionInArray, setPositionInArray] = useState({
        row: 10,
        col: 1
    });

    const [canTapButton, setCanTapButton] = useState(true);
    const [showDiceGif, setDiceGif] = useState(false);

    let prevEvent;
    const [prevEventState, setPrevEventState] = useState();

    const [isWon, setWon] = useState(false);
    const [showQuestion, setShowQuestion] = useState(false);

    let random;

    const [questionIndex, setQuestionIndex] = useState(0);

    const [turn, setTurn] = useState("player1");

    function rollDice() {
        setDiceGif(true);
        setCanTapButton(false);
        setTimeout(() => {
            setDiceGif(false);
            random = Math.floor(Math.random() * 6) + 1;
            setSteps(random);
            setTimeout(() => {
                document.addEventListener("keydown", movePlayer);
            }, 100);
            currentRow = positionInArray.row;
            currentCol = positionInArray.col;
            prevEvent = prevEventState;
        }, 1000);
    }

    function createBoard() {
        for (let i = 0; i < boardSize + WALL_SIZE * 2; i++) {
            boardArray[i] = [];
            for (let j = 0; j < boardSize + WALL_SIZE * 2; j++) {
                boardArray[i][j] = SAFETY_WALL;
            }
        }

        for (let i = WALL_SIZE; i < boardSize + WALL_SIZE; i++) {
            for (let j = WALL_SIZE; j < boardSize + WALL_SIZE; j++) {
                boardArray[i][j] = NUM_FOR_EMPTY;
            }
        }

        //snakes- the value is where the user will go to.
        boardArray[4][6] = 107;
        boardArray[1][8] = 79;
        boardArray[2][5] = 64;
        boardArray[2][1] = 72;

        //ladders - the value is where the user will go to.
        boardArray[9][8] = 37;
        boardArray[10][5] = 76;
        boardArray[4][2] = 14;
    }

    function movePlayer(event) {
        createBoard();
        let nMyDir = DIR_DIFFERENCE - event.keyCode;
        // Check if the pressd key is one of the arrows
        if ((nMyDir < 4) && (nMyDir >= 1)) {
            currentRow = currentRow + DIR_MAT[nMyDir][0];
            currentCol = currentCol + DIR_MAT[nMyDir][1];
            if (boardArray[currentRow][currentCol] !== SAFETY_WALL && random !== 0) {
                random--;
                //move left
                if (currentRow % 2 === 1 && nMyDir === 3) {
                    setPosition(prevPosition => {
                        return {
                            ...prevPosition,
                            left: prevPosition.left - 5
                        };
                    });
                    //move right
                } else if (currentRow % 2 === 0 && nMyDir === 1) {
                    setPosition(prevPosition => {
                        return {
                            ...prevPosition,
                            left: prevPosition.left + 5
                        };
                    });
                    //move up
                } else if (nMyDir === 2 && (currentCol === 10 || currentCol === 1) && prevEvent !== undefined && (DIR_DIFFERENCE - prevEvent.keyCode) !== 2) {
                    setPosition(prevPosition => {
                        return {
                            ...prevPosition,
                            bottom: prevPosition.bottom + 8.5
                        };
                    });
                    //tapped on the wrong arrow- give the player another move and keep him at his current position.
                } else {
                    random++;
                    currentRow = currentRow - DIR_MAT[nMyDir][0];
                    currentCol = currentCol - DIR_MAT[nMyDir][1];
                }
                setSteps(random);
                //hit a safety wall
            } else if (boardArray[positionInArray.row][positionInArray.col] === SAFETY_WALL || boardArray[currentRow][currentCol] === SAFETY_WALL) {
                currentRow = currentRow - DIR_MAT[nMyDir][0];
                currentCol = currentCol - DIR_MAT[nMyDir][1];
            }
            setPositionInArray(prevPosition => {
                return {
                    row: currentRow,
                    col: currentCol
                }
            });
            //ran out of moves
            if (random === 0) {
                //if he landed on a snake or a ladder, show a question
                if (boardArray[currentRow][currentCol] !== SAFETY_WALL && boardArray[currentRow][currentCol] !== NUM_FOR_EMPTY) {
                    setTimeout(() => {
                        setShowQuestion(true);
                    }, 300);
                } else {
                    movePlayer2();
                }
                document.removeEventListener("keydown", movePlayer);
            }

            //finished the game
            if (currentRow === 1 && currentCol === 1) {
                setWon(true);
            }
        }
        prevEvent = event;
        setPrevEventState(prevEvent);
    }

    function movePlayer2() {
        let player2Random = Math.floor(Math.random() * 6) + 1;
        createBoard();
        let player2CurrentRow = player2PositionInArray.row;
        let player2CurrentCol = player2PositionInArray.col;
        setTimeout(() => {
            setTurn("player2");
        }, 300);
        canMove();
        function canMove() {
            setSteps(player2Random);
            setTimeout(() => {
                if (player2Random > 0) {
                    if (player2CurrentRow % 2 === 1) { //needs to move left
                        if (player2CurrentCol === 1) { //reached the end of the row
                            player2CurrentRow--;
                            player2CurrentCol = 1;
                            setPlayer2Position(prevPosition => {
                                return {
                                    ...prevPosition,
                                    bottom: prevPosition.bottom + 8.5
                                };
                            });
                        } else {
                            player2CurrentCol--;
                            setPlayer2Position(prevPosition => {
                                return {
                                    ...prevPosition,
                                    left: prevPosition.left - 5
                                };
                            });
                        }
                    } else if (player2CurrentRow % 2 === 0) { //move right
                        if (player2CurrentCol === 10) { //reached the end of the row
                            player2CurrentRow--;
                            player2CurrentCol = 10;
                            setPlayer2Position(prevPosition => {
                                return {
                                    ...prevPosition,
                                    bottom: prevPosition.bottom + 8.5
                                };
                            });
                        } else {
                            player2CurrentCol++;
                            setPlayer2Position(prevPosition => {
                                return {
                                    ...prevPosition,
                                    left: prevPosition.left + 5
                                };
                            });
                        }
                    }
                    setPlayer2PositionInArray(prevPosition => {
                        return {
                            row: player2CurrentRow,
                            col: player2CurrentCol
                        }
                    });
                    player2Random--;
                    canMove();
                } else {
                    if (boardArray[player2CurrentRow][player2CurrentCol] !== NUM_FOR_EMPTY) { // on a ladder or snake
                        const newRow = Math.floor(Number(boardArray[player2CurrentRow][player2CurrentCol]) / 10);
                        const newCol = Number(boardArray[player2CurrentRow][player2CurrentCol]) % 10;
                        //this is the 10th row but got caught because of the %10!
                        if (newCol === 0) {
                            newCol = 10;
                        }
                        const diffRow = (newRow - player2CurrentRow) * -1;
                        const diffCol = newCol - player2CurrentCol;
                        //the player has gotten to a ladder and got the right answer or gotten to a snake and got the wrong answer
                        setPlayer2PositionInArray({
                            row: newRow,
                            col: newCol
                        });
                        setPlayer2Position(prevPosition => {
                            return {
                                left: prevPosition.left + (diffCol * 5),
                                bottom: prevPosition.bottom + (diffRow * 8.5)
                            };
                        });
                    }
                    setTurn("player1");
                    setCanTapButton(true);
                }
            }, 500);
        }
    }

    function move(userAnswer) {
        createBoard();
        currentRow = positionInArray.row;
        currentCol = positionInArray.col;
        const newRow = Math.floor(Number(boardArray[currentRow][currentCol]) / 10);
        const newCol = Number(boardArray[currentRow][currentCol]) % 10;
        //this is the 10th row but got caught because of the %10!
        if (newCol === 0) {
            newCol = 10;
        }
        const diffRow = (newRow - currentRow) * -1;
        const diffCol = newCol - currentCol;
        //the player has gotten to a ladder and got the right answer or gotten to a snake and got the wrong answer
        if ((diffRow > 0 && userAnswer === "correct") || (diffRow < 0 && userAnswer === "wrong")) {
            setPositionInArray({
                row: newRow,
                col: newCol
            });
            setPosition(prevPosition => {
                return {
                    left: prevPosition.left + (diffCol * 5),
                    bottom: prevPosition.bottom + (diffRow * 8.5)
                };
            });
        }
        movePlayer2();
    }

    function checkAnswer(event) {
        const answerButton = event.target;
        const chosenAnswer = Number(answerButton.name.charAt(6));
        //if he chose the correct answer
        if (chosenAnswer === questionsFromDb[questionIndex].correctAns) {
            setTimeout(() => {
                answerButton.className += " correctAnswer";
            }, 100);
            setTimeout(() => {
                move("correct");
            }, 1000);
            //if he chose the wrong answer
        } else {
            setTimeout(() => {
                answerButton.className += " wrongAnswer";
            }, 100);
            setTimeout(() => {
                move("wrong");
            }, 1000);
        }
        setTimeout(() => {
            setCanTapButton(true);
            setShowQuestion(false);
            answerButton.classList.remove("wrongAnswer");
            answerButton.classList.remove("correctAnswer");
            setQuestionIndex(prevIndex => { return prevIndex + 1 });
        }, 1000);
    }

    return (
        <div onLoad={createBoard} className="Board">
            <img src="../boardgame.png" alt="board" />
            <img style={{ bottom: position.bottom + "vh", left: position.left + "vw" }} src="../player.png" className="Player" alt="player" />
            <img style={{ bottom: player2Position.bottom + "vh", left: player2Position.left + "vw" }} src="../player2.png" className="Player" alt="player" />
            <Cube steps={steps} rollDice={rollDice} allowClick={canTapButton} explainIsShown={props.disableButton} showDiceGif={showDiceGif} />
            <WhosTurn turn={turn} />
            <Question isWon={isWon} showQuestion={showQuestion} checkAnswer={checkAnswer} currentQuestion={gotDataFromDb ? questionsFromDb[questionIndex] : {}} />
        </div>
    );
}

export default Board;