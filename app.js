var app = require('express')();
var http = require('http').Server(app);
let io = require("socket.io")(http);
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


app.get('/', function (req, res) {
    res.sendfile('./public/index.html');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

let games = [

];


http.listen(80, function () {
    console.log('listening on *:3000');
    io.on('connection', function (socket) {
        // socket.emit("welcome")

        socket.on('buzz', function(uuid, team, game){

            let cG; //currentGame
            let aB; //activeBuzz


            for(let j = 0; j < games.length; j++){
                if(games[j].roomNumber === game){
                    cG = games[j];
                   aB = cG.activeBuzz;
                }
            }



            "use strict";
            if(!aB){
                console.log(uuid + " buzzed");
                io.emit("lockout", uuid, team);
                for(let j = 0; j < games.length; j++){
                    // console.log(games[j])
                    if(games[j].roomNumber === game){
                        games[j].activeBuzz = true;
                        // console.log(games[j].activeBuzz)
                    }
                }
            }
        });

        socket.on('reset', function (rN) {
            for(let j = 0; j < games.length; j++){
                if(games[j].roomNumber = rN){
                    games[j].activeBuzz = false;
                    io.emit("resetGame", rN)
                }
            }
        });

        socket.on('createGame', function (number) {
            games.push({
                roomNumber: number,
                teams: 2,
                activeBuzz: false
            });
            console.log(games)
        });

        socket.on('destroyGame', function (number) {
            for(let i = 0; i < games.length; i++){
                if(games[i].roomNumber === number){
                    games.splice(i,1);
                }
            }
            console.log(games)
        });

        socket.on('setTeamCount', function (roomNumber, teamCount) {
            console.log(teamCount + " teams in " + roomNumber)
            for(let k = 0; k < games.length; k++){
                if(games[k].roomNumber === roomNumber){
                    games[k].teams = teamCount;
                }
            }
        });

        socket.on('getTeams', function (gN) {
            console.log('recieved getteams');
            console.log(gN);
            for(let i = 0; i < games.length; i++){
                if(games[i].roomNumber === gN){
                    socket.emit('returnTeams', games[i].teams);
                    console.log(games[i].teams);
                    return;
                }
            }
            console.log("test")
        })
    })
});



app.post('/buzz', function(req, res){
    "use strict";
    console.log("buzzed");
    console.log(new Date().getTime() - req.body.time)
});



module.exports = app;