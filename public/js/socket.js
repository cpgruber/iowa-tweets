var socket = io();
socket.emit("start stream",true);

var list = document.querySelector("ul");

function makePopup(tweet){
  var p = document.createElement("p")
  p.textContent = tweet.user+": "+tweet.text;
  return p;
}

function addPoint(tweet){
  L.marker(tweet.geo)
  .bindPopup(makePopup(tweet))
  .addTo(map);
}

function addTweet(tweet){
  var li = document.createElement("li");
  li.appendChild(makePopup(tweet));
  list.insertBefore(li, list.childNodes[0]);
  if (list.childNodes.length > 25){
    var len = list.childNodes.length;
    for (var i=len-1;i<25;i--){
       list.removeChild(list.childNodes[i]);
    }
  }
}

socket.on("tweet", function(tweet){
  addTweet(tweet);
  if(tweet.geo){
    addPoint(tweet);
  }
})

$(document).ready(function(){
  $.getJSON("/geotweets.json").then(function(tweets){
    tweets.forEach(function(tweet){
      addPoint(tweet)
    })
  })
})
