import React from 'react'

import '../index.css'

const Square = (props) => {

    return (
        <button disabled={+props.whoMove!==+props.userName ||props.winner=="X" ||props.winner=="O"} className="square" onClick={props.onClick}>{props.value}</button>
    )
}

export default Square
