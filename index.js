var express = require("express");
var Twit = require("twit");
var fs = require("fs");
var env = fs.existsSync("./env.js") ? require("./env") : process.env;

var Tweet = require("./models/tweet");

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
  socket.on("start stream", function(b){
    var stream = twitter.stream('statuses/filter', { track: 'Iowa' });
    stream.on('tweet', function (tweet) {
      var newTweet = new Tweet();
      newTweet.createdAt = new Date();
      newTweet.user = tweet.user.screen_name;
      newTweet.text = tweet.text;
      newTweet.geo = (tweet.geo)?tweet.geo.coordinates:null;
      newTweet.save(function(err,doc){
        if(!err){
          io.emit("tweet", doc)
        }
      })
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
