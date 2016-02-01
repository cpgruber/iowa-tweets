L.mapbox.accessToken = 'pk.eyJ1IjoiYmdydWJlciIsImEiOiJjaWloeXQ3NGcwMGhrdnFtNXg2a25kbzkyIn0.inMMMxBgfMWXfaAfTKSfOw';
var initExtent = [39.2918809, -76.6400553];
    southWest = L.latLng(38, -78),
    northEast = L.latLng(41, -75),
    bounds = L.latLngBounds(southWest, northEast);

var map = L.mapbox.map('map', 'mapbox.streets', {zoomControl: false});
new L.Control.Zoom({ position: 'topright' }).addTo(map);
