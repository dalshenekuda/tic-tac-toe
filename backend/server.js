const path = require ('path');
const calculateWinner = require('./algorithm.js')


const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.json());

 __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, '/frontend2/build')));
// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname + '/frontend2/build/index.html'))
// );

const rooms = new Map();

app.get('/rooms/:id', (req, res) => {
    const {id: roomId} = req.params;

    const obj = rooms.has(roomId)
        ? {
            users: [...rooms.get(roomId).get('users').values()],
        }
        : {users: []};
    res.json(obj);
});

app.post('/rooms', (req, res) => {
    const {roomId} = req.body;
    let roomIsFull = false

    if (!rooms.has(roomId)) {
        rooms.set(
            roomId,
            new Map([
                ['users', new Map([])],
                ['board', (Array(9).fill(null))],
                ['xMove', true],
                ['winner', false],
                ['whoMove', false],
                ['clicks', 0]
            ]),
        );
        res.send(roomIsFull);

    } else {
        const users = [...rooms.get(roomId).get('users').values()]
        if (users.length > 1) {
            roomIsFull = true
            res.send({roomIsFull})
        }
    }

    res.send(roomIsFull);
});


io.on('connection', (socket) => {
    socket.on('ROOM:JOIN', ({roomId, userName}) => {
        socket.join(roomId);
        rooms.get(roomId).get('users').set(socket.id, userName);

        rooms.get(roomId).set('whoMove', [...rooms.get(roomId).get('users').values()][0])
        const users = [...rooms.get(roomId).get('users').values()];
        const obj = {
            users: users,
            whoMove: [...rooms.get(roomId).get('users').values()][0]
        }

        io.sockets.in(roomId).emit('ROOM:SET_USERS', obj);

        rooms.get(roomId).set('board', (Array(9).fill(null)))
        const res = {
            'board': rooms.get(roomId).get('board'),
            'winner': false,
        }
        io.sockets.in(roomId).emit('ROOM:CLEAR_DESK', res);

    });


    socket.on('ROOM:NEW_MOVE', ({roomId, index}) => {

        let tmpBoard = rooms.get(roomId).get('board')
        if (tmpBoard[index]) {
            return
        }
        const whoMove = rooms.get(roomId).get('xMove') ? 'X' : 'O'
        rooms.get(roomId).get('board').splice(index, 1, whoMove)
        rooms.get(roomId).set('xMove', !(rooms.get(roomId).get('xMove')))
        const winner = calculateWinner(rooms.get(roomId).get('board'))

        const firstUser = [...rooms.get(roomId).get('users').values()][0]

        // console.log(rooms.get(roomId).get('whoMove'))
        // console.log(firstUser)

        if (rooms.get(roomId).get('whoMove') == firstUser) {
            rooms.get(roomId).set('whoMove', [...rooms.get(roomId).get('users').values()][1])
        } else {
            rooms.get(roomId).set('whoMove', [...rooms.get(roomId).get('users').values()][0])
        }
        rooms.get(roomId).set('clicks', 1 + rooms.get(roomId).get('clicks'))

        const cl = rooms.get(roomId).get('clicks')
        const res = {
            'board': rooms.get(roomId).get('board'),
            'winner': winner,
            'xMove': rooms.get(roomId).get('xMove'),
            'whoMove': rooms.get(roomId).get('whoMove'),
            'clicks': cl
        }
        io.sockets.in(roomId).emit('ROOM:NEW_MOVE', res);
    });

    socket.on('ROOM:CLEAR_DESK', ({roomId}) => {
        rooms.get(roomId).set('winner', false)
        rooms.get(roomId).set('board', (Array(9).fill(null)))
        rooms.get(roomId).set('clicks', 0)
        const res = {
            'board': rooms.get(roomId).get('board'),
            'winner': false,
            'clicks': 0
        }
        io.sockets.in(roomId).emit('ROOM:CLEAR_DESK', res);
    });


    socket.on('disconnect', () => {
        rooms.forEach((value, roomId) => {

            if (value.get('users').delete(socket.id)) {
                console.log(value)
                const users = [...value.get('users').values()];

                rooms.get(roomId).set('board', (Array(9).fill(null)))
                rooms.get(roomId).set('clicks', 0)
                const res = {
                    'board': rooms.get(roomId).get('board'),
                    'winner': false,
                    'whoMove': false
                }
                io.sockets.in(roomId).emit('ROOM:CLEAR_DESK', res);
                if (!rooms.get(roomId).get('users')) {
                    rooms.delete(roomId)
                    return
                }
                io.sockets.in(roomId).emit('ROOM:SET_USERS', users);
            }
        });
    });

    console.log('user connected', socket.id);
});

server.listen(5001, (err) => {
    if (err) {
        throw Error(err);
    }
    console.log('Server is running!');
});
