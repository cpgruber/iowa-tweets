var express = require("express");
var Twit = require("twit");
var fs = require("fs");
var env = fs.existsSync("./env.js") ? require("./env") : process.env;

var app = express();
app.use(express.static(__dirname + '/public'));

var twitter = new Twit({
  consumer_key: env.consumer_key,
  consumer_secret: env.consumer_secret,
  access_token: env.access_token,
  access_token_secret: env.access_token_secret
});

var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){

  console.log('user connected');
  socket.on('point', function(coords){
    io.emit('point', coords);
  });

  socket.on("start stream", function(b){
    var stream = twitter.stream('statuses/filter', { track: 'el chapo' });
    stream.on('tweet', function (tweet) {
      var asker = tweet.user.screen_name;
      var id = tweet.id_str;
      var text = tweet.text;
      var geo = tweet.geo;
      var coordinates = tweet.coordinates;
      console.log(geo, coordinates, text);
      if (geo){
        io.emit('point', geo.coordinates);
      }
    });
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});

var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('listening on *:'+port);
});
