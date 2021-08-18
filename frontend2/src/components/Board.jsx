import React from 'react'

import '../index.css'
import Square from './Square'

const Board = ({squares, click, whoMove, userName, winner}) => {
    return (
        <div className="board">
            {
                squares.map((square, i) => (
                    <Square key={i} value={square} whoMove={whoMove} userName={userName} winner={winner}
                            onClick={() => click(i)}/>

                ))
            }
        </div>
    );
}

export default Board
