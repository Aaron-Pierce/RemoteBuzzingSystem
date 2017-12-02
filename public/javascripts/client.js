const WebSocket = require('ws');
const ws = new WebSocket("ws://localhost:6061");
ws.on('open', function () {
    $(document).click(function(){
        "use strict";
        ws.send("buzz")
    })
});