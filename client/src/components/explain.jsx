import React from 'react';
import Button from 'react-bootstrap/Button';

function Explain(props) {
    return (
        <div className="Question" style={{ display: props.showExplain ? "inline-block" : "none" }}>
            <h1>ברוכים הבאים למשחק סולמות ונחשים!</h1>
            <p>במשחק זה, בכל פעם שתרצו לעלות בסולם או לרדת בנחש, תופיע לפניכם שאלה. <br></br>
            עליכם לענות נכונה על השאלה בכדי לעלות בסולם, או בכדי להימנע מלרדת מהנחש.<br></br>
            בהצלחה, סומכים עליכם!</p>
            {/* <p style={{ marginTop: "10vh" }}>לחצו על הכפתור בכדי להתחיל</p> */}
            <Button className="startGameButton" variant="outline-secondary" onClick={props.showGame} style={{ marginTop: "15vh" }}>לחץ עליי בכדי להתחיל</Button>
        </div>
    );
}

export default Explain;