let socket = io();

let team = 0;

let admin = false;

let buzzlock = true;

let roomNumber = "0000";

document.addEventListener("DOMContentLoaded", function () {
        let uuid = md5(Math.random().toString());


        let activebuzz = false;

        document.getElementById("gameCodeInput").addEventListener("keypress", function(e){
            if(document.getElementById("gameCodeInput").value.length >= 4){
                e.preventDefault()
            }
            if(e.keyCode === 13 && document.getElementById("gameCodeInput").value.length === 4){
                roomNumber = document.getElementById("gameCodeInput").value;

                drawGameScreen();
            }
        });

    let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';
        document.addEventListener(touchEvent, function (e) {
            if(e.toElement.classList.contains("buzzLock")){
                buzzlock = document.getElementById("buzzLock").checked;
            }else if(e.toElement.tagName.toLowerCase() === "button") {
                // cancels click
            }else{
                if(!buzzlock){
                    buzz()
                }
            }
        });




        let drawGameScreen = function () {
            document.getElementsByClassName("wrapper")[0].style.display = "none";
            document.getElementById("gameNumber").innerHTML = "Game " + roomNumber;
            document.getElementById("gameScreenWrapper").style.display = "block";

            // console.log('emitting getTeams');
            socket.emit('getTeams', roomNumber);
            // console.log(roomNumber);
        };


        socket.on('returnTeams', function (tC) {
            for(let i = 1; i <= tC; i++){
                document.getElementById("gameScreenWrapper").innerHTML += "<button class='btn teamJoin' id='" + "joinTeam" + "" + i + "'>Join Team " + i + "</button><br><br>";
                setTimeout(function () {
                    document.getElementById("joinTeam" + i).addEventListener(touchEvent, function () {
                        joinTeam(i);
                    });
                },10);
            }
        });

        socket.on('lockout', function (user) {
            if(user === uuid){
                document.body.style.backgroundColor = "#5cb85c";

            }else{
                document.body.style.backgroundColor = "#d9534f";

            }
        });

        let lasttime = 0;
        let buzz = function(){
            socket.emit('buzz', uuid, team, roomNumber);
            lasttime = new Date().getTime()
        };

        socket.on('return', function(time){
            console.log(lasttime - time + " roundtrip")
        });

        socket.on('resetGame', function (gC) {
            console.log("recieved reset");
            if(gC === roomNumber){
                document.body.style.backgroundColor = "white";
            }
        })
});

//this has to be down here otherwise the join team button can't trigger the function

let joinTeam = function (number) {
team = number;
buzzlock = false;

    for (let i = 0; i <= document.getElementsByClassName("teamJoin").length+5; i++) {
        document.getElementById("gameScreenWrapper").removeChild(document.getElementsByClassName("teamJoin")[0]);
    }

};