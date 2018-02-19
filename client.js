
function answered(answer) {
    console.log($(".Qstat").text());
    console.log($("#answer" + answer).text());
    console.log(answer);

    $.ajax({
        type: "POST",
        async: false,
        url: "/checkAnswer",
        data: { question: $(".Qstat").text(), answer: $("#answer" + answer).text() },
        success: function(succ)
        {
            /* $('.Qstat').html(succ);
            var x = '<div align="center" id="asd" style = "font-size :300%; margin-bottom: 100px;" > ყოჩაღ პასუხი სწორია </div>' */
            console.log(succ);
            /* $('#tstcontzd').prepend(x);
            $('.Qchoices').remove();
            $('#tstcontqv').remove(); */
        }
    });
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

        for(let user in data.onlineUsers){
            if(userName != user)
                html += `<li data-sid="${user}" class="onlineUser onlineUser${user}">${user} 
                <div class="navigation"><span class="sendReq">Send Request</span></div> 
                </li>`;
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

        let html = '<div style="width: 100%; overflow: hidden;">';
        html += `<div style="width: 250px; float: left;"> <div id = "playerName"> ${userName} </div> <div id = "playerScore"><span>0</span></div> </div>`
        html += `<div style="margin-left: 620px;"> <div id = "playerName"> ${data.oponent} </div> <div id = "playerScore"><span>0</span></div> </div>`;
        html += '</div>';
        html += `<div class="Qstat">რამდენი წვერო, წიბო და წახნაგი აქვს კუბს? </div>`;
        // html += '<input value="'+'რამ სიმაღლეა ევერესტი ?'+'" disabled type="text" class="Qstat">';
        html += `<div style="width: 100%; overflow: hidden;"> <div style="width: 250px; float: left;"> <div id = "answer1" class="D1dwk D1dwkCh" onclick="answered(1)">A: ფგდლფგკ ლკფდკ ლკდფგლ დფგ</div> </div> <div style="width: 250px; margin-left: 620px;"> <div id = "answer2" class="D1dwk D1dwkCh" onclick="answered(2)">B: ფგდლფგკ ლკფდკ ლკდფგლ დფგ</div> </div> </div> <div style="width: 100%; overflow: hidden;"> <div id = "answer3" class="D1dwk D1dwkCh" style="width: 250px; float: left;" onclick="answered(3)"> ფგდლფგკ ლკფდკ ლკდფგლ დფგ ასდსდფ სდ ,სდფ სმ სდ,ფმ ,სმფ, სმ,ფს,დფ, </div> <div style="width: 250px; margin-left: 620px;"> <div id = "answer4" class="D1dwk D1dwkCh" onclick="answered(4)">D: ფგდლფგკ ლკფდკ ლკდფგლ დფგ</div> </div> </div>`;
        $('#userFormWrapper').append(html);
        $('.onlineUser'+data.oponent).find('.navigation').html(`<span class="navBtn ready">Ready</span>`)
    });
}








