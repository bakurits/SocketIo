let express  = require('express'),
    app      = express(),
    path     = require('path'),
    http     = require('http'),
    socketIO = require('socket.io'),
    server, io;

let onlineUsers      = [],
    players          = [],
    requests         = {}; // key is receiver and values array - senders

app.use(express.static(path.join(__dirname)));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server = http.Server(app);
server.listen(3000);

io = socketIO(server);


function getUserBySid(sid) {
    for(let i = 0; i < onlineUsers.length; i++){
        if(onlineUsers[i].sid == sid) {
            return onlineUsers[i];
        }
    }

    return null;
}

io.on('connection', (socket) => {
    socket.on('newUser', (user) => {
        user.sid = socket.id;
        onlineUsers.push(user);

        socket.broadcast.emit('getOnlineUsers', {
            onlineUsers
        });
    });

    socket.on('sendRequest', (data) => {
        if (io.sockets.connected[data.sid]) {
            if(!requests[data.sid]) {
                requests[data.sid] = [socket.id];
            }else{
                requests[data.sid].push(socket.id)
            }

            io.sockets.connected[data.sid].emit('requests', {
                requests: requests[data.sid]
            })
        }else{
            requests[data.sid]
        }
    });

    socket.on('cancel', (data) => {
        for( let i = 0; i < requests[socket.id].length; i++ ) {
            if(data.sid == requests[socket.id][i]){
                requests[socket.id].splice(i,0);
                io.sockets.connected[data.sid].emit('canceled', {
                    sid: socket.id
                })
            }
        }
    });

    socket.on('accept', (data) => {
        players = [getUserBySid(data.sid), getUserBySid(socket.id)];
        
        for( let player of players) {
            io.sockets.connected[player.sid].emit('accepted', {
                players
            })
        }
    });

    socket.on('disconnect', () => {
        for( let i = 0; i < onlineUsers.length; i++) {
            if(onlineUsers[i].user.sid == socket.id){
                onlineUsers.splice(i,1);
                requests[data.sid] = [];
            }
        }
    });
});
