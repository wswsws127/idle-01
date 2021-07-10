import React from 'react';
import './TicTacToe.css';

function ScoreBoard(props) {
    return (
        <div className="score-board">
            <div>{'Score of X: ' + (props.scoreOfX ? props.scoreOfX : 0)}</div>

            <div>{'Score of O: ' + (props.scoreOfO ? props.scoreOfO : 0)}</div>
        </div>
    );
}

export default ScoreBoard;
