let express  = require('express'),
    app      = express(),
    path     = require('path'),
    http     = require('http'),
    socketIO = require('socket.io'),
    server, io;
let mysql = require('mysql');

let onlineUsers      = {}, // kay is username and values array of socketId
    onelineSockets   = [],
    players          = [],
    requests         = {}; // key is receiver and values array - senders

app.use(express.static(path.join(__dirname)));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server = http.Server(app);

server.listen(4000);

io = socketIO(server);

/* let con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "kings_platform"
});

con.connect(); */
const subjCount = 4;

function sqlQueryForSubs(subjs) {
    let ans = "";
    for (let i = 0; i < subjCount; i++) {
        if (1 << i & subjs) {
            if (ans.length == 0) {
                ans = ans + "subj=" + (i + 1);
            } else {
                ans = ans + " OR subj=" + (i + 1);
            }
        }
    }
    return ("(" + ans + ")");
}

function getQuestions(subjs, clas, count) {
/*     con.query("SELECT * FROM questions WHERE " +  sqlQueryForSubs(subjs) + " AND class = " + clas + " ORDER BY RAND() LIMIT " + count, function (err, result, fields) {
          if (err) throw err;
          return result;
        }); */
};

function mapContains(dct, obj) {
    if (dct[obj] === undefined)
        return false;
    else
        return true;
}

function getUserBySid(sid) {
    console.log("\n\nyleo\n\n\n");
    console.log(sid);
    for (let user in onlineUsers) {
        console.log(user);
        console.log(onlineUsers[user]);
        if (onlineUsers[user].indexOf(sid) != -1) return user;
    }
    
    /* for(let i = 0; i < onlineUsers.length; i++){
        if(onlineUsers[i].sid == sid) {
            return onlineUsers[i];
        }
    }
    return null; */
}

io.on('connection', (socket) => {
    socket.on('newUser', (user) => {
        console.log("newUser");
        console.log(socket.id);
        user.sid = socket.id;
        if (mapContains(onlineUsers, user.userName))
            onlineUsers[user.userName].push(user.sid);
        else {
            onlineUsers[user.userName] = []
            onlineUsers[user.userName].push(user.sid);
        }

        socket.broadcast.emit('getOnlineUsers', {
            onlineUsers
        });
        socket.emit('getOnlineUsers', {
            onlineUsers
        });
    });

    socket.on('sendRequest', (data) => {
        console.log("sendRequest");
        let reqUser = data.reqUser;
        let sendUser = getUserBySid(socket.id);
        /* for(let user in data.onlineUsers){
            if(userName != user)
                html += `<li data-sid="${user}" class="onlineUser onlineUser${user}">${user} 
                <div class="navigation"><span class="sendReq">Send Request</span></div> 
                </li>`;
        } */
        if(!requests[reqUser]) {
            requests[reqUser] = [sendUser];
        }else{
            requests[reqUser].push(sendUser);
        }

        console.log(onlineUsers);

        for (var sid of onlineUsers[reqUser]) {
            console.log(sid);
            if (io.sockets.connected[sid]) {
                io.sockets.connected[sid].emit('requests', {
                    sendUser
                })
            }
        }
        
        for (var sid of onlineUsers[sendUser]) {
            console.log(sid);
            if (io.sockets.connected[sid]) {
                io.sockets.connected[sid].emit('sends', {
                    reqUser
                })
            }
        }
        
        
        /* if (io.sockets.connected[data.sid]) {
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
        } */
    });

    socket.on('cancel', (data) => {
        console.log("cancel");
        let dataName = getUserBySid(data.sid);
        let socketName = getUserBySid(socket.id);
        for( let i = 0; i < requests[socketName].length; i++ ) {
            if(dataName == requests[socketName][i]){
                requests[socketName].splice(i, 0);
                io.sockets.connected[dataName].emit('canceled', {
                    sid: socketName
                })
            }
        }
    });

    socket.on('accept', (data) => {
        console.log("accept");
        console.log(onlineUsers);
        console.log(data.sid, socket.id);
        let player1 = data.sid;
        let player2 = getUserBySid(socket.id);
        players = [player1, player2];
        console.log(players);
        
        for (var playerSid1 of onlineUsers[player1]) {
            io.sockets.connected[playerSid1].emit(
                'accepted', {
                    oponent : player2
                }
            )
        }

        for (var playerSid2 of onlineUsers[player2]) {
            io.sockets.connected[playerSid2].emit(
                'accepted', {
                    oponent : player1
                }
            )
        }
        
        /* for (let player of players) {
            io.sockets.connected[player.sid].emit('accepted', {
                players
            })
        } */
    });
    

    socket.on('disconnect', () => {
        console.log("disconect");
        console.log(socket.id);
        let user = getUserBySid(socket.id);
        if (user === undefined) return;
        if (onlineUsers[user] === undefined) return;
        let indx = onlineUsers[user].indexOf(socket.id);
        onlineUsers[user].splice(indx, 1);
        if (onlineUsers[user].length == 0) delete onlineUsers[user];
        delete requests[user];
        /* for( let i = 0; i < onlineUsers.length; i++) {
            if(onlineUsers[i].sid == socket.id){
                onlineUsers.splice(i,1);
                requests[socket.id] = [];
            }
        } */
    });
});
