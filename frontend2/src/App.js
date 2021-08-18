import React, {useEffect, useReducer} from 'react';
import axios from 'axios';

import socket from './socket';

import reducer from './reducer';
import JoinBlock from './components/JoinBlock';
import Game from "./components/Game";

function App() {

  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    messages: [],
    board:(Array(9).fill(null)),
    winner:false,
    xMove:true,
    whoMove:false,
    clicks:0

  });

  const onLogin = async (obj) => {

    dispatch({
      type: 'JOINED',
      payload: obj,
    });

    const { data } = await axios.get(`/rooms/${obj.roomId}`);

    socket.emit('ROOM:JOIN', obj);
    dispatch({
      type: 'SET_DATA',
      payload: data,
    });

  };

  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users,
    });
  };

  const addMove = (move) => {
    console.log(move)
    dispatch({
      type: 'NEW_MOVE',
      payload: move,

    });
  };

  const clearDesk = (res) => {
    console.log(res)
    dispatch({
      type: 'CLEAR_DESK',
      payload: res,

    });
  };


  useEffect(() => {
    socket.on('ROOM:SET_USERS', setUsers);
    socket.on('ROOM:NEW_MOVE', addMove);
    socket.on('ROOM:CLEAR_DESK', clearDesk);
  }, []);

  window.socket = socket;

  return (
    <div className="wrapper">

      {!state.joined ? (
        <JoinBlock onLogin={onLogin} />
      ) : (
          <Game {...state} onAddMove={addMove}/>
      )}
    </div>
  );
}

export default App;
