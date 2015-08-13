Query = {};
Query.priceFilter = '';

// returns what the user sets on the price button
Template.priceFilter.events({
'click .btn' : function(e, template) {
    e.preventDefault();
    var priceSelection = e.target.innerText;
    Query.priceFilter = priceSelection;
  }
});

// what happens when someone clicks submit
Template.body.events({
  'click .submitButton' : function(e, template) {
    e.preventDefault();
    Query.startLocation = template.find('#start.form-control').value;
    Query.endLocation = template.find('#end.form-control').value;
    if (Query.endLocation !== '' && Query.startLocation !== '') {
      if (Query.priceFilter !== '') { //all three inputs have actual input
        Query.status = 'OK';
        Results.path(function(path) { // callback of the path of the directionsService
          var distTotal = 0;
          var tripDist = google.maps.geometry.spherical.computeLength(path);
          var distThresh = tripDist / 10;
          for(var i = 0; i < (path.length - 1); i++) { // iterate through the points to find the distance between them
            var coord1 = path[i];
            var lat1 = coord1.lat();
            var lng1 = coord1.lng();
            var coord2 = path[i+1];
            var lat2 = coord2.lat();
            var lng2 = coord2.lng();
            var dist = distFromCoords(lat1,lng1,lat2,lng2);
            if(distTotal > distThresh) { // log points when the total distance is greater than the threshold
              distTotal = 0;
              console.log('if');
              yelp.Results(lat2,lng2, function (result) {
                console.log(result);
              });
            } else {
              console.log('else');
              distTotal += dist;
            }
          }
        });
      } else {
        console.log('Please Choose a filter');
      }
    } else {
      console.log('Please input locations');
    }
  }
});