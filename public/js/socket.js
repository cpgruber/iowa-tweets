var socket = io();
socket.emit("start stream",true);

var list = document.querySelector("ul");

function makePopup(tweet,c){
  var p = document.createElement("p");
  p.innerHTML = "<b>"+tweet.user+"</b>: "+tweet.text+"<br>";
  if (c){
    var close = document.createElement("a");
    close.textContent = "close";
    close.addEventListener("click", function(e){
      e.preventDefault();
      map.closePopup();
    })
    p.appendChild(close)
  }
  return p;
}

function addPoint(tweet){
  var marker = L.marker(tweet.geo)
  .setIcon(L.divIcon({
    className: 'cluster',
    iconSize:[15,15],
  }))
  .bindPopup(makePopup(tweet,true))
  .addTo(ptCluster);

  marker.on("mouseover",function(evt){
    evt.preventDefault;
    this.openPopup();
  })
}

function addTweet(tweet){
  var li = document.createElement("li");
  li.appendChild(makePopup(tweet,false));
  list.insertBefore(li, list.childNodes[0]);
  if (list.childNodes.length > 25){
    var len = list.childNodes.length;
    for (var i=len-1;i>25;i--){
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
    map.fitBounds(ptCluster.getBounds())
  })
})
