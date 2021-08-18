export default (state, action) => {
  switch (action.type) {

    case 'JOINED':
      return {
        ...state,
        joined: true,
        userName: action.payload.userName,
        roomId: action.payload.roomId,

      };

    case 'SET_DATA':
      return {
        ...state,
        users: action.payload.users,
      };

    case 'SET_USERS':
      return {
        ...state,
        users: action.payload.users,
        whoMove:[action.payload.whoMove]
      };

    case 'NEW_MOVE':{
      return {
         ...state,
        board: [...action.payload.board],
        winner:[action.payload.winner],
        xMove:[action.payload.xMove],
        whoMove:[action.payload.whoMove],
        clicks:[action.payload.clicks],
      };
    }

    case 'CLEAR_DESK':{
      return {
        ...state,
        board: [...action.payload.board],
        winner:[action.payload.winner],
        clicks:0,

      };
    }

    default:
      return state;
  }
};
