import React, {useContext, useState} from 'react'
import Board from './Board'

import '../index.css'
import socket from "../socket";

const Game = ({ board, winner, userName, roomId, xMove, whoMove,clicks }) => {

    const onSendMove = (index) => {

        console.log(clicks)
        socket.emit('ROOM:NEW_MOVE', {
            userName,
            roomId,
            index,
        });
    };

    const clearDesk = () => {
        socket.emit('ROOM:CLEAR_DESK', {
            roomId
        });
    }

    return (
         <div className="wrapper1">
             {(winner=="X" ||winner=="O"||clicks>8) && <button className="start__btn" onClick={clearDesk}> Clear desk </button>}
            <Board squares={board} whoMove={whoMove} userName={userName} winner={winner} click={onSendMove} />
            <p className="game__info">
                { (winner=="X" ||winner=="O") ? 'Winner ' + winner : 'Move  ' + ( whoMove) }

            </p>
        </div>
    )
}

export default Game
