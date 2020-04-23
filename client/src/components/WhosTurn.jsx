import React from 'react';

function WhosTurn(props) {
    return (
        <div className="whosTurn">
            <h5>תור השחקן:</h5>
            <img src={props.turn === "player1" ? "../player.png" : "../player2.png"} alt="player" />
        </div>
    );
}

export default WhosTurn;