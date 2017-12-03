
document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    let teamNum = 2;
    let gameCode = "0000";
    roomNumber = gameCode;

    let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

    document.getElementById("createGameBtn").addEventListener(touchEvent, function () {
        admin = true;
        gameCode = Math.ceil(Math.random() * 10000).toString();
        while(gameCode.length !== 4){
            gameCode = Math.ceil(Math.random() * 10000).toString();
        }
        drawAdminScreen();
    });

    let drawAdminScreen = function(){
        document.getElementsByClassName("wrapper")[0].style.display = "none";
        document.getElementById("adminScreenWrapper").style.display = "inline-block";
        document.getElementById("adminGameNumber").innerHTML = "Room Number: " + gameCode;
        socket.emit("createGame", gameCode);
    };

    window.onbeforeunload = function(){
        socket.emit("destroyGame", gameCode)
    };

    document.getElementById("team_count").addEventListener("keypress", function (e) {
        if(e.keyCode === 13){
            socket.emit("setTeamCount", gameCode, parseInt(document.getElementById("team_count").value));
            teamNum = parseInt(document.getElementById("team_count").value);
            document.getElementById("team_count").setAttribute("placeholder", teamNum.toString())
        }
    });

    document.getElementById("adminScreenWrapper").addEventListener(touchEvent, function () {
        socket.emit('reset', gameCode);
        document.body.style.backgroundColor = "white";
        document.getElementById("adminScreenWrapper").removeChild(document.getElementById("buzzNotif"));
    });

    socket.on("lockout", function (uid, teamNum) {
        navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

        if (navigator.vibrate) {
            // vibration API supported
            if(admin){
                window.navigator.vibrate([200,200]);
            }else{
                window.navigator.vibrate(200);
            }


        }

        if( admin ){
            document.getElementById("adminScreenWrapper").innerHTML += "<h2 id='buzzNotif'>Team " + teamNum + " buzzed</h2>"
            // enable vibration support
        }
    })

});