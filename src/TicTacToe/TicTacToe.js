import React from 'react';
import Square from './Square';
import Board from './Board';
import './TicTacToe.css';

class TicTacToe extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

export default TicTacToe;
