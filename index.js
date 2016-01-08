var express = require("express");
var app = express();
app.use(express.static(__dirname + '/public'));

var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('point', function(msg){
    console.log('message: ' + msg);
    io.emit('point', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('listening on *:3000');
});
