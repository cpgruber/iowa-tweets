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

app.get("/geotweets.json", function(req,res){
  Tweet.find({'geo':{ $ne: null }}, function(err,tweets){
    if (!err){
      res.json(tweets);
    }
  })
})

var http = require('http').Server(app);
var io = require('socket.io')(http);

// var terms = 'Bush,Jeb Bush,Jeb,Carson,Ben Carson,Christie,Chris Christie,Clinton,Hillary Clinton,Hillary,Cruz,Ted Cruz,Fiorina,Carly Fiorina,Gilmore,Jim Gilmore,Huckabee,Mike Huckabee,Kasich,John Kasich,O\'Malley,Martin O\'Malley,Paul,Rand Paul,Rubio,Marco Rubio,Marco,Sanders,Bernie Sanders,Bernie,Santorum,Rick Santorum,Trump,Donald Trump,Donald'

io.on('connection', function(socket){
  socket.on("start stream", function(b){
    var stream = twitter.stream('statuses/filter', { track: 'Iowa,Caucus' });
    stream.on('tweet', function (tweet) {
      if (tweet.geo){
        var newTweet = new Tweet();
        newTweet.createdAt = new Date();
        newTweet.user = tweet.user.screen_name;
        newTweet.text = tweet.text;
        newTweet.geo = tweet.geo.coordinates;
        newTweet.save(function(err,doc){
          io.emit("tweet", doc)
        })
      }else{
        var t = {};
        t.user = tweet.user.screen_name;
        t.text = tweet.text;
        io.emit("tweet",t)
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
