// loads the maps api stuff when the html loads (so the api isn't called before it is loaded)
Template.body.rendered = function() {
  Results = {};
  Results.path = function calcRoute(resultCallback) {
    directionsService = new google.maps.DirectionsService();
    var path = [];
    var start = Query.startLocation;
    var end = Query.endLocation;
    var request = {
      origin: start,
      destination: end,
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
  Query.initializeMaps();
  directionsDisplay.setDirections(result);
  var path = result.routes[0].overview_path;
  var distTotal = 0;
  var tripDist = google.maps.geometry.spherical.computeLength(path);
  var distThresh = tripDist / 10;
  // Iterate through the points to find the distance between them
  for (var i = 0; i < (path.length - 1); i++) {
    // Get i-th point
    var coord1 = path[i];
    var lat1 = coord1.lat();
    var lng1 = coord1.lng();

    // Get i+1-th point
    var coord2 = path[i + 1];
    var lat2 = coord2.lat();
    var lng2 = coord2.lng();

    // If distance between points is larger than the threshold, then log
    var dist = distFromCoords(lat1, lng1, lat2, lng2);
    if (distTotal > distThresh) {
      distTotal = 0;
      yelp.Results(lat2, lng2, yelpCallback);
      // Otherwise, continue the loop
    } else {
      distTotal += dist;
    }
  }
};



// adds a marker to the map defined in initializeMaps
addMarker = function addMarker(Lat, Lng, id) {
  var marker = new google.maps.Marker({
    position: {
      lat: Lat,
      lng: Lng
    },
    map: map,
    label: id,
  });
};

getLatLng = function getLatLng(businessObject) {
  lat = businessObject.latitude;
  lng = businessObject.longitude;
  latlng = new google.maps.LatLng(lat,lng);
  return latlng;
};

getDistanceMatrix = function getDistanceMatrix(startLocation,yelpArray,endLocation) {
  var service = new google.maps.DistanceMatrixService();
  originParameters = {
    origins: startLocation,
    destinations: yelpArray,
    travelMode: google.maps.TravelMode.DRIVING,
  };
  // Add the start location to the request to get the travel time without having an additional request
  yelpArray.push(startLocation);
  destinationParameters = {
    origins: yelpArray,
    destinations: endLocation,
    travelMode: google.maps.TravelMode.DRIVING,
  };
  function distanceMatrixCallback(response, status) {
    if(status == google.maps.DistanceMatrixStatus.OK) {
      console.log(response);
    } else {
      console.log(status);
    }
  }
  service.getDistanceMatrix(originParameters,distanceMatrixCallback);
  service.getDistanceMatrix(destinationParameters,distanceMatrixCallback);
};

getDistanceCallback = function getDistanceCallback() {
  var yelpLatLngArray = [];
  YelpResults.find().forEach(function(result){
    console.log(result);
  });
  YelpResults.find().forEach(function(businessResult) {
    console.log(businessResult);
    var latlng = getLatLng(businessResult);
    yelpLatLngArray.push(latlng);
  });
  console.log(yelpLatLngArray);
  console.log('^ this is the array');
  console.log(_.values(yelpLatLngArray));
  getDistanceMatrix(Query.startLocation,yelpLatLngArray,Query.endLocation);
};

/*  In order to find the map I could not use getElementByID because of template scope, so I
 *  put the initialze function within an onRendered so I could get the map div once loaded
 */
Template.mapTemplate.onRendered(function() {
  if(!this.hasDOM) {
    console.log('created');
    var div = this.find('#map-canvas');
    // creates the map objects necessary to display the map and directions
      Query.initializeMaps = function initializeMaps() {
      directionsDisplay = new google.maps.DirectionsRenderer();
      var Duncan4B = new google.maps.LatLng(29.722156, -95.398327);
      var mapOptions = {
        zoom: 20,
        center: Duncan4B,
      };
      map = new google.maps.Map(div, mapOptions);
        // attaches the new map to the the directionsRenderer object
      directionsDisplay.setMap(map);
    };
    this.hasDOM = true;
  }
});
