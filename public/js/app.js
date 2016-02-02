L.mapbox.accessToken = 'pk.eyJ1IjoiYmdydWJlciIsImEiOiJjaWloeXQ3NGcwMGhrdnFtNXg2a25kbzkyIn0.inMMMxBgfMWXfaAfTKSfOw';

var maxSW = L.latLng(-85, -179),
  maxNE = L.latLng(85, 180),
  maxBounds = L.latLngBounds(maxSW, maxNE);

var map = L.mapbox.map('map', 'chasegruber.60d1e4d1', {zoomControl: false, maxBounds:maxBounds, minZoom:2});
new L.Control.Zoom({ position: 'topright' }).addTo(map);

var ptCluster = new L.MarkerClusterGroup({
    iconCreateFunction: function (cluster) {
      var count = cluster.getChildCount();
      var text = (count>100)?'100+':(count>250)?'250+':(count>500)?'500+':(count>750)?'750+':(count>1000)?'1k+':(count>1500)?'1.5k+':(count>2000)?'2k+':count;
        return L.divIcon({
          html:text,
          className: 'cluster',
          iconSize:L.point(30,30)
        })
    },
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    spiderLegPolylineOptions: {weight: 1, color:'#fff'},
    maxClusterRadius:20
}).addTo(map);

ptCluster.on('clustermouseover', function (a) {
  a.layer.spiderfy();
 });
