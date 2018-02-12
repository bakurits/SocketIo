let express  = require('express'),
    app      = express(),
    path     = require('path'),
    http     = require('http'),
    socketIO = require('socket.io'),
    server, io;
let mysql = require('mysql');

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

let con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "kings_platform"
});

function getQuestions(subj, clas, count) {
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM questions WHERE subj=" + subj + " AND class = " + clas + " LIMIT" + count, function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          return result;
        });
    }); 
}


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
        console.log("newUser");
        console.log(socket.id);
        user.sid = socket.id;
        onlineUsers.push(user);

        socket.broadcast.emit('getOnlineUsers', {
            onlineUsers
        });
    });

    socket.on('sendRequest', (data) => {
        console.log("sendRequest");
        if (io.sockets.connected[data.sid]) {
            if(!requests[data.sid]) {
                requests[data.sid] = [socket.id];
            }else{
                requests[data.sid].push(socket.id)
            }

            io.sockets.connected[data.sid].emit('requests', {
                requestsrequests: requests[data.sid]
            })
        }else{
            requests[data.sid]
        }
    });

    socket.on('cancel', (data) => {
        console.log("cancel");
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
        console.log("accept");
        players = [getUserBySid(data.sid), getUserBySid(socket.id)];
        
        for( let player of players) {
            io.sockets.connected[player.sid].emit('accepted', {
                players
            })
        }
    });
    

    socket.on('disconnect', () => {
        console.log("disconect");
        console.log(onlineUsers.length);
        console.log(socket.id);
        for( let i = 0; i < onlineUsers.length; i++) {
            if(onlineUsers[i].sid == socket.id){
                onlineUsers.splice(i,1);
                requests[socket.id] = [];
            }
        }
    });
});
