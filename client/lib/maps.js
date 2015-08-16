// loads the maps api stuff when the html loads (so the api isn't called before it is loaded)
Template.body.rendered = function() {
  Results = {};
  Results.path = function calcRoute(resultCallback) {
    directionsService = new google.maps.DirectionsService();
    var path = [];
    var start = Query.startLocation;
    var end = Query.endLocation;
    var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(result, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        resultCallback(result);
      }
    });
  };
};

// moved from anoymous function to function in maps.js
sampleCoords = function sampleCoords(result) {
  initializeMaps();
  directionsDisplay.setDirections(result);
  var path = result.routes[0].overview_path;
  var distTotal = 0;
  var tripDist = google.maps.geometry.spherical.computeLength(path);
  var distThresh = tripDist / 10;
  // Iterate through the points to find the distance between them
  for(var i = 0; i < (path.length - 1); i++) {
    // Get i-th point
    var coord1 = path[i];
    var lat1 = coord1.lat();
    var lng1 = coord1.lng();

    // Get i+1-th point
    var coord2 = path[i+1];
    var lat2 = coord2.lat();
    var lng2 = coord2.lng();

    // If distance between points is larger than the threshold, then log
    var dist = distFromCoords(lat1,lng1,lat2,lng2);
    if(distTotal > distThresh) {
      distTotal = 0;
      yelp.Results(lat2,lng2,yelpCallback);
    // Otherwise, continue the loop
    } else {
      distTotal += dist;
    }
  };
  Session.set('state', 'resultsLoaded');
}

// creates the map objects necessary to display the map and directions
initializeMaps = function initializeMaps() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var chicago = new google.maps.LatLng(41.850033, -87.6500523);
  var mapOptions = {
    zoom:7,
    center: chicago,
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions)
  // attaches the new map to the the directionsRenderer object
  directionsDisplay.setMap(map)
}

// adds a marker to the map defined in initializeMaps
addMarker = function addMarker(Lat,Lng,id) {
  var marker = new google.maps.Marker({
    position: {lat: Lat, lng: Lng},
    map: map,
    label: id,
  })
}
