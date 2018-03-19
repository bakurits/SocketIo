var Clockk = {
    totalSeconds: 3600,
    nowSeconds: 3600,
    dntm:0,
    ispl:0,
    logicHint:0,

    start: function () {
        var self = this;
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

function answered(answer1) {
    console.log(answer1);
    let answer = $("#answer" + answer1).text();
    console.log(answer);
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

window.onload = function() {
    let userForm        = document.getElementById('userForm'),
        onlineUsersList = document.getElementById('onlineUsersList'),
        userNameInput   = document.getElementById('username')
        io              = io();

    let userName = '';

    io.on('getOnlineUsers', (data) => {
        onlineUsersList.innerHTML = '';
        let html = '';
        // console.log(data);
        for(let key in data.onlineUsers){
            let user = data.onlineUsers[key];
            if(userName != user._userName){
               // console.log(user);
                html += `<li data-sid="${user._userName}" class="onlineUser onlineUser${user._userName}">${user._userName} 
                <div class="navigation"><span class="sendReq">Send Request</span></div> 
                </li>`;
            }
        }

        onlineUsersList.innerHTML = html;
    });
    io.on('requests', (data) => {
        console.log(data.sendUser);
        $('.onlineUser'+data.sendUser).find('.navigation').html(`<span class="navBtn accept">Accept</span> <span class="navBtn cancel">Cancel</span>`);
    });

    io.on('sends', (data) => {
        console.log(data.sendUser);
        $('.onlineUser'+data.reqUser).find('.navigation').removeClass('sendReq').addClass('sent').html('Sent');
    });

    userForm.addEventListener('submit', (e) => {
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
    });

    $(document).on('click', '.sendReq', (e) => {
        e.preventDefault();
        let parent = e.currentTarget.parentNode.parentNode;
        let reqUser = parent.getAttribute('data-sid');
        
        $(e.currentTarget).removeClass('sendReq').addClass('sent').html('Sent');

        io.emit('sendRequest', {
            reqUser
        });
    });

    $(document).on('click', '.cancel' , (e) => {
        e.preventDefault();
        let parent = e.currentTarget.parentNode.parentNode;
        let sid = parent.getAttribute('data-sid');

        $(parent).find('.navigation').html('<span class="sendReq">Send Request</span>');

        io.emit('cancel', {
            sid
        });
    });

    io.on('canceled', (data) => {
        $('.onlineUser'+data.sid).find('.navigation').html(`<span class="canceled">Canceled</span>`);
    });


    $(document).on('click','.accept', (e) => {
        e.preventDefault();
        let parent = e.currentTarget.parentNode.parentNode;
        let sid = parent.getAttribute('data-sid');

        io.emit('accept', {
            sid
        })

    });

    io.on('accepted', (data) => {
               
        // for(let player of data.players) {
        
        this.console.log(data);
        curQuestion = data;
        
        Clockk.start();
        let html = '<div style="width: 100%; overflow: hidden;">';
        html += `<div style="width: 250px; float: left;"> <div id = "playerName"> ${userName} </div> <div id = "playerScore"><span>0</span></div> </div>`
        html += `<div style="margin-left: 620px;"> <div id = "playerName"> ${data.oponent} </div> <div id = "playerScore"><span>0</span></div> </div>`;
        html += '</div>';
        /* html += `<div class="Qstat"> ${enc.decode(questions[0].statement)}</div>`;
        // html += '<input value="'+'რამ სიმაღლეა ევერესტი ?'+'" disabled type="text" class="Qstat">';
        html += `<div style="width: 100%; overflow: hidden;"> <div style="width: 250px; float: left;"> <div id = "answer1" class="D1dwk D1dwkCh" onclick="answered(1)">A: ფგდლფგკ ლკფდკ ლკდფგლ დფგ</div> </div> <div style="width: 250px; margin-left: 620px;"> <div id = "answer2" class="D1dwk D1dwkCh" onclick="answered(2)">B: ფგდლფგკ ლკფდკ ლკდფგლ დფგ</div> </div> </div> <div style="width: 100%; overflow: hidden;"> <div id = "answer3" class="D1dwk D1dwkCh" style="width: 250px; float: left;" onclick="answered(3)"> ფგდლფგკ ლკფდკ ლკდფგლ დფგ ასდსდფ სდ ,სდფ სმ სდ,ფმ ,სმფ, სმ,ფს,დფ, </div> <div style="width: 250px; margin-left: 620px;"> <div id = "answer4" class="D1dwk D1dwkCh" onclick="answered(4)">D: ფგდლფგკ ლკფდკ ლკდფგლ დფგ</div> </div> </div>`; */
        $('#userFormWrapper').append(html); 
        drawNewQuery();
        $('.onlineUser'+data.oponent).find('.navigation').html(`<span class="navBtn ready">Ready</span>`)
    });
}

function drawNewQuery() {
    //console.log(curQuestion);
    let html = "";
    html += `<div class="Qstat"> ${curQuestion.questions.statement}</div>`;
        // html += '<input value="'+'რამ სიმაღლეა ევერესტი ?'+'" disabled type="text" class="Qstat">';
    html += `<div style="width: 100%; overflow: hidden;"> <div id = "answer1" style="width: 600px; float: left;"> <div class="D1dwk D1dwkCh" onclick="answered(1)">${curQuestion.questions.choices[0]}</div> </div> <div style="width: 600px; margin-left: 620px;"> <div id = "answer2" class="D1dwk D1dwkCh" onclick="answered(2)">${curQuestion.questions.choices[1]}</div> </div> </div> <div style="width: 100%; overflow: hidden;"> <div class="D1dwk D1dwkCh" id = "answer3" style="width: 600px; float: left;" onclick="answered(3)"> ${curQuestion.questions.choices[2]} </div> <div style="width: 600px; margin-left: 620px;"> <div id = "answer4" class="D1dwk D1dwkCh" onclick="answered(4)">${curQuestion.questions.choices[3]}</div> </div> </div>`
    $('#userFormWrapper').append(html);
    
}








