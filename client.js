var Clockk = {
    totalSeconds: 3600,
    nowSeconds: 3600,
    dntm:0,
    ispl:0,
    logicHint:0,

    start: function () {
        let self = this;
        if(this.ispl == 0) $('.WmzmIsr').addClass('WmzmIsrChrtl');
        

        this.interval = setInterval(function () {
            if (!self.ispl) return;
            self.nowSeconds -= 1;
            $('#D1tsttmmma').html('<span id="D1tsttmmWtt">'+zfill(Math.floor((3600-self.nowSeconds+self.dntm*15*60)/60),2)+'</span>:'+zfill(Math.floor(3600-self.nowSeconds+self.dntm*15*60)%60,2)+'');
            
            //if(self.nowSeconds<0) {if(self.nowSeconds+self.dntm*15*60<0) self.dntm+=1; }
        }, 1000);
    },

    reset: function(){
        this.nowSeconds = this.totalSeconds;
    },


    
    pause: function () {
        $('.WmzmIsr').removeClass('WmzmIsrChrtl');
        this.ispl = 0;
        clearInterval(this.interval);
        delete this.interval;
    },

    resume: function () {
        if (isClPaused) return;
        $('.WmzmIsr').addClass('WmzmIsrChrtl');
        if (!this.interval) this.start();
    }
};

var curQuestion = "";
var answerId = -1;
function answered(answer1) {
    if (answerId != -1) return;
    answerId = answer1;
    let answer = $("#answer" + answer1).text();
    io.emit('checkAnswer', {
        answer
    })
    /* $.ajax({
        type: "POST",
        async: false,
        url: "/checkAnswer",
        data: { question: $(".Qstat").text(), answer: $("#answer" + answer).text() },
        success: function(succ)
        {
            $('.Qstat').html(succ);
            var x = '<div align="center" id="asd" style = "font-size :300%; margin-bottom: 100px;" > ყოჩაღ პასუხი სწორია </div>' 
            console.log(succ);
            $('#tstcontzd').prepend(x);
            $('.Qchoices').remove();
            $('#tstcontqv').remove(); 
        }
    }); */
}

var questions = [];

function sendRequ(userName) {
    io.emit('sendRequest', {
        userName
    })
}

function accepted(userName) {
    io.emit('accept', {
        userName
    })

}

function rejected(userName) {
    console.log(userName);
}


window.onload = function() {
    let userForm        = document.getElementById('userForm'),
        onlineUsersList = document.getElementById('onlineUsersList'),
        userNameInput   = document.getElementById('username');
        requestsList    = document.getElementsByClassName('requestListDiv');
    io = io('http://localhost:4000'); // razec server.js dastarte
    
    io.emit('newUser', {
          userName : playerUserName,
          name : playerName
    })

    let userName = '';

    io.on('getOnlineUsers', (data) => {
        onlineUsersList.innerHTML = '';
        let html = '';
        console.log("asdasdasddfg");
        // console.log(data);
        for(let key in data.onlineUsers){
            let user = data.onlineUsers[key];
            if(playerUserName != user._userName){
                console.log(user);
                html += `<div class="col p-1 align-self-center"> <div class="gamer text-center mx-auto "> <div class="avatar d-flex justify-content-center align-items-center"> <div> <img src="images/img_avatar.png"> </div> </div> <div> N: <span>4</span></div> <div class="name"> ${user._name} </div> <div class="point"> <span>${user._totalScore}</span> ქულა </div> <div class="bolt" onclick="sendRequ('${user._userName}')"> <i class="fas fa-bolt"></i> </div> </div> </div>`;
            }
        }

        onlineUsersList.innerHTML = html;
    });
    io.on('requests', (data) => {
        console.log(requestsList);
        if (requestsList.length == 0) {
            let dv;
            
            dv = `<div id = "requestListDiv" class="pop"><div class="request"> <div class="searched_gamers d-flex align-items-center justify-content-center"><div class="avatar "><img width="40px;" src="images/img_avatar.png"></div><div class="gamer_info d-flex align-items-center"><span class="number"> N:<span>6</span> &nbsp; </span> ${data.sendUserName}&nbsp; <sapn class="pint"> ${data.sendUserPoint} </sapn>&nbsp;ქულა </div> </div><div class="text-center"> <button class="btn btn_confirm" onclick = "accepted('${data.sendUserUserName}')">დათანხმება</button> <button class="btn btn_cancel" onclick = "rejected('${data.sendUserUserName}')"> უარყოფა</button></div> </div> </div>`;
            $('#content').append(dv);
            requestsList = document.getElementById('requestListDiv');
        } else {
            dv = `<div class="request"> <div class="searched_gamers d-flex align-items-center justify-content-center"><div class="avatar "><img width="40px;" src="images/img_avatar.png"></div><div class="gamer_info d-flex align-items-center"><span class="number"> N:<span>6</span> &nbsp; </span> ${data.sendUserName}&nbsp; <sapn class="pint"> ${data.sendUserPoint} </sapn>&nbsp;ქულა </div> </div><div class="text-center"> <button class="btn btn_confirm" onclick = "accepted('${data.sendUserUserName}')">დათანხმება</button> <button class="btn btn_cancel" onclick = "rejected('${data.sendUserUserName}')"> უარყოფა</button></div> </div>`;
            requestsList.innerHTML = requestsList.innerHTML + dv;
        }
        
    });

    io.on('sends', (data) => {
        
        $('.onlineUser'+data.reqUser).find('.navigation').removeClass('sendReq').addClass('sent').html('Sent');
    });

    /* userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        userName = userNameInput.value;

        if(userName) {
            io.emit('newUser', {
                userName
            });

            userNameInput.setAttribute('disabled','disabled');
            document.getElementById('submit').setAttribute('disabled','disabled');

            $('#userFormWrapper').html(`<h1 class="hello">Hello ${userName}</h1> <div id="scores"></div> `);

            return userName;
        }

        alert("Username field is empty");
    }); */

   /*  $(document).on('click', '.sendReq', (e) => {
        e.preventDefault();
        let parent = e.currentTarget.parentNode.parentNode;
        let reqUser = parent.getAttribute('data-sid');
        
        $(e.currentTarget).removeClass('sendReq').addClass('sent').html('Sent');

        io.emit('sendRequest', {
            reqUser
        });
    }); */

    /* $(document).on('click', '.cancel' , (e) => {
        e.preventDefault();
        let parent = e.currentTarget.parentNode.parentNode;
        let sid = parent.getAttribute('data-sid');

        $(parent).find('.navigation').html('<span class="sendReq">Send Request</span>');

        io.emit('cancel', {
            sid
        });
    }); */

    io.on('canceled', (data) => {
        $('.onlineUser'+data.sid).find('.navigation').html(`<span class="canceled">Canceled</span>`);
    });

    /* $(document).on('click','.accept', (e) => {
        e.preventDefault();
        let parent = e.currentTarget.parentNode.parentNode;
        let sid = parent.getAttribute('data-sid');

        io.emit('accept', {
            sid
        })

    }); */

    io.on('accepted', (data) => {
               
        // for(let player of data.players) {
        
        
        curQuestion = data.question;
        
        //Clockk.start();
        this.console.log(curQuestion);
        /* let html = `<div class="question_page"> <div class="VStiemer "> <div style=" " id="timer_line" class="Timer_line"> </div> <div class="outVS d-flex align-items-center justify-content-between"> <div class="VS2 d-flex align-items-center "> <div class="outline d-flex align-items-center justify-content-center"> <div class="avatar"> <div class="star"> <div class="point">`;
        html += 900;
        html += `</div> <i class="fas fa-star"></i> </div> <img src="images/img_avatar.png"> </div> </div> <div class="name">`;
        html += ` თაკო `;
        html += `<div class="point2">`;
        html += `20`;
        html += `</div> </div> </div> <div class="timer"> <i class="fas fa-stopwatch"></i> <span id="game_timer_time" class="timer_time">10</span> </div> <div class="outVS d-flex align-items-center"> <div class="VS2 d-flex align-items-center "> <div class="name">`;
        html += `თაკო`;
        html += `<div class="point2 text-right">`;
        html += `20`;
        html += `</div> </div> <div class="outline d-flex align-items-center justify-content-center"> <div class="avatar"> <div class="star"> <div class="point">`;
        html += `900`;
        html += `</div> <i class="fas fa-star"></i> </div> <img src="images/img_avatar.png"> </div> </div> </div> </div> </div> </div> <div class="question_block"> <div class="question">`;
        html += curQuestion.statement;
        html += `</div> <div class="container"> <div class="row d-flex justify-content-between"> <a href=""> <div class="answer corect">`;
        html += curQuestion.choices[0];
        html += `</div> </a> <a href=""> <div class="answer other ">`;
        html += curQuestion.choices[1];
        html += `</div> </a> <a href="#"> <div class="answer wrong">`;
        html += curQuestion.choices[2];
        html += `</div> </a> <a href="#"> <div class="answer">`;
        html += curQuestion.choices[3];
        html += ` </div> </a> </div> </div> </div> </div>`; */
        let q_page = document.getElementById('requestListDiv');
       // this.console.log(q_page);
        //this.console.log(q_page.style);
        q_page.remove();
        //var div = document.createElement(html);
       // $('#content').append(html); 
        /* let html = '<div style="width: 100%; overflow: hidden;">';
        html += `<div style="width: 250px; float: left;"> <div id = "playerName"> ${userName} </div> <div id = "playerScore"><span>0</span></div> </div>`
        html += `<div style="margin-left: 620px;"> <div id = "playerName"> ${data.oponent} </div> <div id = "playerScore"><span>0</span></div> </div>`;
        html += '</div>'; */
        /* html += `<div class="Qstat"> ${enc.decode(questions[0].statement)}</div>`;
        // html += '<input value="'+'რამ სიმაღლეა ევერესტი ?'+'" disabled type="text" class="Qstat">';
        html += `<div style="width: 100%; overflow: hidden;"> <div style="width: 250px; float: left;"> <div id = "answer1" class="D1dwk D1dwkCh" onclick="answered(1)">A: ფგდლფგკ ლკფდკ ლკდფგლ დფგ</div> </div> <div style="width: 250px; margin-left: 620px;"> <div id = "answer2" class="D1dwk D1dwkCh" onclick="answered(2)">B: ფგდლფგკ ლკფდკ ლკდფგლ დფგ</div> </div> </div> <div style="width: 100%; overflow: hidden;"> <div id = "answer3" class="D1dwk D1dwkCh" style="width: 250px; float: left;" onclick="answered(3)"> ფგდლფგკ ლკფდკ ლკდფგლ დფგ ასდსდფ სდ ,სდფ სმ სდ,ფმ ,სმფ, სმ,ფს,დფ, </div> <div style="width: 250px; margin-left: 620px;"> <div id = "answer4" class="D1dwk D1dwkCh" onclick="answered(4)">D: ფგდლფგკ ლკფდკ ლკდფგლ დფგ</div> </div> </div>`; */
        //$('#userFormWrapper').append(html); 
        drawNewQuery();
        //$('.onlineUser'+data.oponent).find('.navigation').html(`<span class="navBtn ready">Ready</span>`)
    });

    io.on('answered', (data) => {
        this.console.log("answered", data.succ);
    });

    io.on('answerChecked', (data) => {
        
    });

    io.on('gameFinished', (data) => {
        this.console.log("gameFinished", data);
    });

    io.on('newQuestion', (data) => {
        curQuestion = data.question;
        drawNewQuery();
        this.console.log("newQuestion", data);
    });

}

function drawNewQuery() {
    
    timerChanger();
    return;
    let html = `<div class="question_page"> <div class="VStiemer "> <div style=" " id="timer_line" class="Timer_line"> </div> <div class="outVS d-flex align-items-center justify-content-between"> <div class="VS2 d-flex align-items-center "> <div class="outline d-flex align-items-center justify-content-center"> <div class="avatar"> <div class="star"> <div class="point">`;
    html += 900;
    html += `</div> <i class="fas fa-star"></i> </div> <img src="images/img_avatar.png"> </div> </div> <div class="name">`;
    html += ` თაკო `;
    html += `<div class="point2">`;
    html += `20`;
    html += `</div> </div> </div> <div class="timer"> <i class="fas fa-stopwatch"></i> <span id="game_timer_time" class="timer_time">10</span> </div> <div class="outVS d-flex align-items-center"> <div class="VS2 d-flex align-items-center "> <div class="name">`;
    html += `თაკო`;
    html += `<div class="point2 text-right">`;
    html += `20`;
    html += `</div> </div> <div class="outline d-flex align-items-center justify-content-center"> <div class="avatar"> <div class="star"> <div class="point">`;
    html += `900`;
    html += `</div> <i class="fas fa-star"></i> </div> <img src="images/img_avatar.png"> </div> </div> </div> </div> </div> </div> <div class="question_block"> <div class="question">`;
    html += curQuestion.statement;
    html += `</div> <div class="container"> <div class="row d-flex justify-content-between"> <a href=""> <div class="answer">`;
    html += curQuestion.choices[0];
    html += `</div> </a> <a href=""> <div class="answer">`;
    html += curQuestion.choices[1];
    html += `</div> </a> <a href="#"> <div class="answer">`;
    html += curQuestion.choices[2];
    html += `</div> </a> <a href="#"> <div class="answer">`;
    html += curQuestion.choices[3];
    html += ` </div> </a> </div> </div> </div> </div>`;
    //console.log(curQuestion);
    $('#content').append(html); 
   
    $('#userFormWrapper').append(html);
    
}

function timerChanger(){
                   
    $('.start_game').addClass('hidden');
    $('.question_page').removeClass('hidden');

    let timeleft = 10;
    let transitonFor=10;
    let downloadTimer = setInterval(function(){
        console.log(timeleft);
        console.log(transitonFor);
        console.log("\n\n\n -------------\n\n\n");
        document.getElementById("game_timer_time").innerHTML =timeleft;
        document.getElementById("timer_line").style.width=0+'%';
        docxument.getElementById("timer_line").style.transition = transitonFor+'s';
        document.getElementById("timer_line").style.transitionTimingFunction='linear'

        if(timeleft <= 0){
            clearInterval(downloadTimer)
        }
        timeleft--;
    },1000);
}








