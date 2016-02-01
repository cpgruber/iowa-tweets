L.mapbox.accessToken = 'pk.eyJ1IjoiYmdydWJlciIsImEiOiJjaWloeXQ3NGcwMGhrdnFtNXg2a25kbzkyIn0.inMMMxBgfMWXfaAfTKSfOw';

var maxSW = L.latLng(-85, -179),
  maxNE = L.latLng(85, 180),
  maxBounds = L.latLngBounds(maxSW, maxNE);

var map = L.mapbox.map('map', 'chasegruber.60d1e4d1', {zoomControl: false, maxBounds:maxBounds, minZoom:2});
new L.Control.Zoom({ position: 'topright' }).addTo(map);

var ptCluster = new L.MarkerClusterGroup({
    iconCreateFunction: function (cluster) {
        return L.divIcon({
          html:cluster.getChildCount(),
          className: 'cluster',
          iconSize:L.point(40,40)
        })
    },
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    spiderLegPolylineOptions: {weight: 1, color:'#fff'},
    maxClusterRadius:30
}).addTo(map);

ptCluster.on('clustermouseover', function (a) {
  a.layer.spiderfy();
 });
