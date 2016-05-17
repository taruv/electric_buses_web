var map, heatmap;
var markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 60.2, lng: 24.85},
    zoom: 7
  });
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos);
    });
  }
  for (i = 0; i < data.features.length; i++){
    addMarker({ lat: data.features[i].geometry.coordinates[0], lng: data.features[i].geometry.coordinates[1] }, data.features[i].properties.numberofbuses, map)
  }
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(),
    radius: 200,
    gradient: [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 0, 223, 1)',
          'rgba(0, 0, 191, 1)',
          'rgba(0, 0, 159, 1)',
          'rgba(0, 0, 127, 1)',
          'rgba(63, 0, 91, 1)',
          'rgba(127, 0, 63, 1)',
          'rgba(191, 0, 31, 1)',
          'rgba(255, 0, 0, 1)'
        ],
    map: map
  });
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function addMarker(location, numberofbuses, map) {
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    icon: 'map-marker.png'
  });
  markers.push(marker);
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
  
  if (markers.length != 0) {
    for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
    markers = [];
  } else {
    for (i = 0; i < data.features.length; i++){
      addMarker({ lat: data.features[i].geometry.coordinates[0], lng: data.features[i].geometry.coordinates[1] }, data.features[i].properties.numberofbuses, map)
    }
  }
}

function getPoints() {
  var points = [];
  for (i = 0; i < data.features.length; i++){
    var point = new google.maps.LatLng(data.features[i].geometry.coordinates[0], data.features[i].geometry.coordinates[1]);
    for (u = 0; u < data.features[i].properties.numberofbuses; u++) {
      points.push(point);
    }
  }
  return points;
}

 google.load("feeds", "1");

function initialize() {
  var feed = new google.feeds.Feed("http://evobsession.com/feed/");
  feed.load(function(result) {
     if (!result.error) {
       var container = document.getElementById("feed");
       for (var i = 0; i < result.feed.entries.length; i++) {
          var entry = result.feed.entries[i];
          var div = document.createElement("div");
          div.id = "newstitle";
          div.appendChild(document.createTextNode(entry.title));
          container.appendChild(div);
          var pdiv = document.createElement("div");
          pdiv.id = "newsdate";
          pdiv.appendChild(document.createTextNode(entry.publishedDate));
          container.appendChild(pdiv);
          var aDiv = document.createElement("div");
          aDiv.id = "newslink"; 
          a = document.createElement('a');
          a.href =  entry.link; 
          a.innerHTML = "Read more..";
          aDiv.appendChild(a); 
          container.appendChild(aDiv);
        }
      }
    });
}
google.setOnLoadCallback(initialize);
