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
http.listen(80, function () {
    console.log('listening on *:3000');
    io.on('connection', function (socket) {
        // socket.emit("welcome")
        socket.on('buzz', function(data, uuid){
            "use strict";
            console.log(data - new Date().getTime());
            console.log(uuid);
            socket.emit('return', new Date().getTime());
            io.emit("lockout", uuid)
        })
    })
});



app.post('/buzz', function(req, res){
    "use strict";
    console.log("buzzed");
    console.log(new Date().getTime() - req.body.time)
});



module.exports = app;