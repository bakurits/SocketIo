let express  = require('express'),
    app      = express(),
    path     = require('path'),
    http     = require('http'),
    socketIO = require('socket.io'),
    bodyParser = require('body-parser'),
    server, io;
let mysql = require('sync-mysql');
let PHPUnserialize = require('php-unserialize');

let onlineUsers      = {}, // kay is username and value User
    onlineSockets   = {}, // kay is socketId and value is userName
    players          = [], // stores players game status
    requests         = {}, // key is receiver and values array - senders
    gameInfo = {}, // key game id and game
    playerGameStatus = {}; // Stores player game status

function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

const timeForAnswer = 10;  // კითხვაზე პასუხის გაცემის დრო

class User {
    constructor(userName) {
        this._userName = userName;
        this._onlineSockets = [];
        this._gameStatus = -2;   // -1 meens dont pleying searching, if its postive 
                                // than it's game id which player is playing 
    };

    set userName(userName) {
        this._userName = userName;
    }

    addSocket(socketId) {
        this._onlineSockets.push(socketId);
    }

    removeSocket(socketId) {
        let indOfSocket = this._onlineSockets.indexOf(socketId);
        if (indOfSocket != -1) {
            this._onlineSockets.splice(0, 1);
        }
    }

    set gameStatus(gameStatus) {
        this._gameStatus = gameStatus;
    }

    get userName() {
        return this._userName;
    }
    
    get onlineSockets() {
        return this._onlineSockets;
    }

    get gameStatus() {
        return this._gameStatus;
    }

}

function jsonToArray(parsed){

   // var parsed = JSON.parse(json);

    var arr = [];

    for(var x in parsed){
        arr.push(parsed[x]);
    }
    return arr;
}

class Game {
    constructor(player1, player2, gameId) {
        this._players = [player1, player2];
        this._gameId = gameId;
        this._quizQuestionIndex = 0;
        this._questions = [];
        this._scores = [0, 0];
        this._curQuestionStatus = [0, 0]; // 0 meens not answered
        this.Clockk = {
            totalSeconds: timeForAnswer,
            nowSeconds: timeForAnswer,
        
            start: function () {
                var self = this;
                this.interval = setInterval(function () {
                    self.nowSeconds -= 1;
                    if (self.nowSeconds == 0) {
                        this.answered(this.players[0], 0);
                        this.answered(this.players[1], 0);
                    }
                    //if(self.nowSeconds<0) {if(self.nowSeconds+self.dntm*15*60<0) self.dntm+=1; }
                }, 1000);
            },
        
            reset: function(){
                this.nowSeconds = this.totalSeconds;
            },
        };
    };

    set players(players1) {
        this._players = players1;
    }

    set gameId(gameId) {
        this._gameId = gameId;
    }
    set quizQuestionIndex(quizQuestionIndex) {
        this._quizQuestionIndex = quizQuestionIndex;
    }
    /* set questions(subjs) {
        Imposter.init(getQuestions(subjs, clas, queryCountInQuiz)).each(function(question) {
            
            //console.log(Json.parse(question.statement) + " " +question.choices);
        });
        this.questions = data;
    } */
    setQuestions(subjs, clas) {
        let curData = [];
        Imposter.init(getQuestions(subjs, clas, queryCountInQuiz)).each(function(question) {
            let data = {
                statement: PHPUnserialize.unserialize(question.statement)[1],
                choices: jsonToArray(PHPUnserialize.unserialize(question.choices)),
                answer: "",
                id : question.id
            }
            //statement['statement'];
            //console.log(statement[1]);
            //console.log(question.statement + " " +question.choices);
            // data[choices].splice(0, .length - 4);
           // let arr = jsonToArray(data.choices);
            data.answer = data.choices[0];
            data.choices = shuffleArray(data.choices);
            console.log(data);
            curData.push(data);
            
        });
        this._questions = curData;
    }

    get players() {
        return this._players;
    }

    get gameId() {
        return this._gameId;
    }

    get quizQuestionIndex() {
        return this._quizQuestionIndex;
    }

    get questions() {
        return this._questions;
    }

    answered(player, succ) {

        let playerId = 0; // 0 ან 1
        if (player != this.players[0]) playerId = 1;
        let opponentId = 1 - playerId;
        if (this._curQuestionStatus[playerId] != 0) return; 
        this._scores[playerId] += (this.Clockk.nowSeconds * 2) * succ;
        this._curQuestionStatus[playerId] = 1;
        
        onlineUsers[players[playerId]].forEach(element => {
            io.sockets.connected[element].emit(
                'answered', {
                    succ : succ,
                    newScore : this._scores[playerId]
                }
            )
        });

        if (this._curQuestionStatus[opponentId] == 1) {
            this._curQuestionStatus[0] = this._curQuestionStatus[1] = 0;
            this.quizQuestionIndex++;
            this.Clockk.reset();
            if (this._quizQuestionIndex >= queryCountInQuiz) {
                // მორჩა თამაში
                onlineUsers[players[playerId]].forEach(element => {
                    io.sockets.connected[element].emit(
                        'gameFinished', {
                            oponent : this._scores[opponentId],
                            me : this._scores[playerId]
                        }
                    )
                });

                onlineUsers[players[opponentId]].forEach(element => {
                    io.sockets.connected[element].emit(
                        'gameFinished', {
                            oponent : this._scores[playerId],
                            me : this._scores[opponentId]
                        }
                    )
                });
            } else {
                // ახალი კითხვა
                let quest = this._questions[this._quizQuestionIndex];
                let clonedQuest = {
                    statement : quest.statement,
                    choices : quest.choices,
                    id: quest.id
                }
                onlineUsers[players[playerId]].forEach(element => {
                    io.sockets.connected[element].emit(
                        'newQuestion', {
                            question : clondeQuestion
                        }
                    )
                });

                onlineUsers[players[opponentId]].forEach(element => {
                    io.sockets.connected[element].emit(
                        'newQuestion', {
                            question : clondeQuestion
                        }
                    )
                });
            }
        } else {
            // ერთმა უპასუხა
            onlineUsers[players[playerId]].forEach(element => {
                io.sockets.connected[element].emit(
                    'newQuestion', {
                        question : clondeQuestion
                    }
                )
            });

            onlineUsers[players[opponentId]].forEach(element => {
                io.sockets.connected[element].emit(
                    'newQuestion', {
                        question : clondeQuestion
                    }
                )
            });
        }

    }
    
}

      

let Imposter = { // object hendles mysql calls
    data: {},
    each: function(callback){
        for(let obj of this.data){
            callback(obj);
        }
    },
    init: function(data) {
        this.data = data;
        return this;
    }
};

app.use(express.static(path.join(__dirname)));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});



server = http.Server(app);

server.listen(4000);

io = socketIO(server);

let con = new mysql({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "kings_platform"
});

//con.connect();
const subjCount = 4; // საგნების საერთო რაოდენობა

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
    let query = "SELECT id, statement, choices FROM questions WHERE " +  sqlQueryForSubs(subjs) + " AND class = " + clas + " ORDER BY RAND() LIMIT " + count;
    return con.query(query);/* 
        if (err) {    
            console.log(err);
           return err;
        }
        else{
            console.log(result);
            return result;
        }
    }); */

    //     function(err,data){
    //         if (err) {
    //             // error handling code goes here
    //             console.log("ERROR : ",err);            
    //         } else {            
    //             // code to execute on data retrieval
    //             console.log("result from db is : ",data);   
    //         }    
    
    // }
};

function mapContains(dct, obj) {
    if (dct[obj] === undefined)
        return false;
    else
        return true;
}

function getUserBySid(sid) {
    return onlineSockets[sid];
    /* for(let i = 0; i < onlineUsers.length; i++){
        if(onlineUsers[i].sid == sid) {
            return onlineUsers[i];
        }
    }
    return null; */
}

function getClonedQuestion(gameId, questionIndex) {
    let quest = gameInfo[gameId].questions[questionIndex];
    // TODO: clone quest
    console.log("\n\n\n -------------\n\n\n");
    console.log(quest);
    console.log("\n\n\n -------------\n\n\n");

    let clonedQuest = {
        statement : quest.statement,
        choices : quest.choices,
        id: quest.id
    }

    return clonedQuest;
}
const queryCountInQuiz = 6; // კითხვების რაოდენობა ერთ თამაშში

io.on('connection', (socket) => {

    socket.on('newUser', (user) => {
        console.log("newUser");
        
        console.log(socket.id);
        let curUser = onlineUsers[user.userName];
        if (curUser === undefined) {
            onlineUsers[user.userName] = new User(user.userName);
        }
        console.log(curUser);         
        onlineUsers[user.userName].addSocket(socket.id);
        user.sid = socket.id;
        //var curGame = new Game(1, 1, 1);
       
        //curGame.setQuestions(1, 4);
        console.log("sd\n\n");
        onlineSockets[socket.id] = user.userName;

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

        for (var sid of onlineUsers[reqUser].onlineSockets) {
            console.log(sid);
            if (io.sockets.connected[sid]) {
                io.sockets.connected[sid].emit('requests', {
                    sendUser
                })
            }
        }
        
        for (var sid of onlineUsers[sendUser].onlineSockets) {
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
    

    socket.on('checkAnswer', (data) => {
        let usr = getUserBySid(socket.id);
        let curGame = gameInfo[onlineUsers[usr].gameStatus];
        if (curGame === undefined) { console.log("this socket currently doesn't plays"); return; }
        let quest = curGame.questions[curGame.quizQuestionIndex];
        Game
        /* console.log(quest.answer);
        console.log(data.answ) */
        if (quest.answer == data.answer)
            curGame.answered(usr, 1);
        else {
            curGame.answered(usr, 0);
        }
        
    });

    socket.on('accept', (data) => {
        console.log("accept");
        console.log(onlineUsers);
        console.log(data.sid, socket.id);
        let player1 = data.sid;
        let player2 = getUserBySid(socket.id);
        players.push([player1, player2]);
        console.log(players);
        let newGame = new Game(player1, player2, players.length);
        newGame.setQuestions(1, 4);
        gameInfo[players.length] = newGame;
           
        console.log("\n\n kaia \n\n");
        console.log(newGame.questions);

        onlineUsers[player1].gameStatus = players.length; 
        onlineUsers[player2].gameStatus = players.length;

        for (var playerSid1 of onlineUsers[player1].onlineSockets) {
            let clondeQuestion = getClonedQuestion(players.length, 0);
            io.sockets.connected[playerSid1].emit(
                'accepted', {
                    oponent : player2,
                    questions : clondeQuestion
                }
            )
        }

        for (var playerSid2 of onlineUsers[player2].onlineSockets) {
            let clondeQuestion = getClonedQuestion(players.length, 0);
            io.sockets.connected[playerSid2].emit(
                'accepted', {
                    oponent : player1,
                    questions : clondeQuestion
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
