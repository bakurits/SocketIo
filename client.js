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
        if(data.players.length) {
            $('#scores').html('');
        }

        for(let player of data.players) {
            $('#scores').append(`<h3>${player.userName} - </h3>`);
            $('.onlineUser'+player.sid).find('.navigation').html(`<span class="navBtn ready">Ready</span>`);
        }
    });
}








