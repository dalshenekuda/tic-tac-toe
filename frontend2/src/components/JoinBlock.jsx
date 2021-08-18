import React from 'react';
import axios from 'axios';
import '../index.css'

function JoinBlock({onLogin}) {
    const [roomId, setRoomId] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [isLoading, setLoading] = React.useState(false);

    const onEnter = async () => {
        if (!roomId || !userName) {
            return alert('Incorrect data ');
        }
        const obj = {
            roomId,
            userName,
        };
        setLoading(true);
        const {data} = await axios.post('/rooms', obj);

        if (!data.roomIsFull) {
            onLogin(obj);

        } else {
            alert("Room is full")
            setLoading(false);
        }
    };

    return (
        <div className="join-block">
            <h2 className="mode">For solo mode, enter the number of player - "0"</h2>
            <input
                type="text"
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />
            <input
                type="number"
                placeholder="Number of player"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <button disabled={isLoading} onClick={onEnter} className="btn btn-success">
                {isLoading ? 'Enter...' : 'Enter'}
            </button>
        </div>
    );
}

export default JoinBlock;
