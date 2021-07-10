import React from 'react';
import Square from './Square';
import Board from './Board';
import ScoreBoard from './ScoreBoard';
import './TicTacToe.css';

class TicTacToe extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //initialize squares & history data, a null array[9]
            history: [
                {
                    squares: Array(9).fill(null),
                },
            ],
            stepNumber: 0,
            xIsNext: true,
            scoreOfX: 0,
            scoreOfO: 0,
            winnerStatus: 0,
            gameIsEnd: false,
        };
    }

    /*
    componentDidMount() {
        //get winner status
        const currentWinnerStatus = this.state.winnerStatus;
        //if game is not finished, 则结算游戏结果
        if (!this.state.gameIsEnd) {
            this.handleAddScoreAndGameWin(currentWinnerStatus);
            console.log(this.state.scoreOfX);
        }
    }
    */

    restartGame() {
        this.setState({
            history: [
                {
                    squares: Array(9).fill(null),
                },
            ],
            stepNumber: 0,
            xIsNext: true,
            gameIsEnd: false,
        });
    }

    calculateWinner(squares) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        //current winner could be 'X', 'O', 'DRAW', null
        let currentWinner = this.state.winnerStatus;
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (
                squares[a] &&
                squares[a] === squares[b] &&
                squares[a] === squares[c]
            ) {
                currentWinner = squares[a];
                return currentWinner;
            } else if (!currentWinner && this.state.stepNumber === 9) {
                //if no one wins and board is full, set game to draw
                currentWinner = 'DRAW';
                return currentWinner;
            }
        }
        return null;
    }

    handleAddScoreAndGameWin(winnerStatus) {
        //if someone wins and game just end, add score and set game to end
        if (winnerStatus && winnerStatus === 'O') {
            this.setState({
                scoreOfO: this.state.scoreOfO + 100,
                gameIsEnd: true,
            });
        } else if (winnerStatus && winnerStatus === 'X') {
            this.setState({
                scoreOfX: this.state.scoreOfX + 100,
                gameIsEnd: true,
            });
        } else if (winnerStatus === 'DRAW') {
            this.setState({
                gameIsEnd: true,
            });
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            //X is next when step is even number
            xIsNext: step % 2 === 0,
        });
    }

    revertAStep() {
        //TODO: roll back one step
        //only keep the [0, stepNumber) element of history
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        //cut off the last one history square
        const newHistory = history.slice(0, -1);

        //fetch the last one squares history
        const current = history[history.length - 1];

        //no param slice() : copy the array
        //const squares = current.squares.slice();

        const winnerStatusAfterRevert = this.calculateWinner(current.squares);
        let winnerSta;
        let gameIsEndSta;
        //after revert, if no win status
        if (!winnerStatusAfterRevert) {
            winnerSta = 0;
            gameIsEndSta = false;
        }

        //update the state
        this.setState({
            history: newHistory,
            stepNumber: history.length - 2,
            xIsNext: !this.state.xIsNext,
            winnerStatus: winnerSta,
            gameIsEnd: gameIsEndSta,
        });
    }

    handleSquareClick(i) {
        //only keep the [0, stepNumber) element of history
        const history = this.state.history.slice(0, this.state.stepNumber + 1);

        //fetch the last one squares history
        const current = history[history.length - 1];

        //no param slice() : copy the array
        const squares = current.squares.slice();

        //check winner status
        let currentWinnerStatus = this.calculateWinner(squares);

        //如果游戏已结束，或当前单击的格子被点过，do nothing.
        if (currentWinnerStatus || squares[i]) {
            console.log('currentWinnerStatus: ' + currentWinnerStatus);
            return;
        }

        //update marks in grids 落子
        const mark = this.state.xIsNext ? 'X' : 'O';
        squares[i] = mark;
        this.setState({
            //update squares changes
            history: history.concat([
                {
                    squares: squares,
                },
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });

        //落子之后，再次更新Board state
        currentWinnerStatus = this.calculateWinner(squares);
        this.setState({
            winnerStatus: currentWinnerStatus,
        });

        //根据目前得到的winnerState，更新其他相关state
        if (!this.state.gameIsEnd) {
            this.handleAddScoreAndGameWin(currentWinnerStatus);
            console.log(this.state.scoreOfX);
        }
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        //calculate if there is a winner
        const winner = current ? this.calculateWinner(current.squares) : null;
        const step = this.state.stepNumber;

        //go back to previous steps
        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        //referesh game status when has winner/draw
        let status;
        if (winner && winner !== 'DRAW') {
            status = 'Winner: ' + winner;
        }
        if (!winner) {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        } else if (winner === 'DRAW') {
            status = 'Draw! Start Again';
        }

        return (
            <div>
                <ScoreBoard
                    scoreOfX={this.state.scoreOfX}
                    scoreOfO={this.state.scoreOfO}
                />

                <div className="game">
                    <div className="game-board">
                        <Board
                            squares={current.squares}
                            onClick={(i) => this.handleSquareClick(i)}
                        />
                    </div>
                    <div className="game-info">
                        <div>{status}</div>
                        {step > 0 && !this.state.gameIsEnd && (
                            <button onClick={() => this.revertAStep()}>
                                {'Revert'}
                            </button>
                        )}
                        {!winner && <ol>{moves}</ol>}
                        {winner && (
                            <button onClick={() => this.restartGame()}>
                                {'restart'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default TicTacToe;
