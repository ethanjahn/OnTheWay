Query = {};
Query.priceFilter = '';

/*
 * Updates the Query global object's priceFilter field to be the clicked
 * dollar-amount filter
 */
Template.priceFilter.events({
  'click .btn' : function(e, template) {
    e.preventDefault();
    var priceSelection = e.target.innerText;
    Query.priceFilter = priceSelection;
  }
});

/*
 * Function to be executed upon successful return from Yelp
 */
function yelpCallback (result) {
  console.log(result);
}

/*
 * When user hits submit, make sure all the fields have been set, determine
 * points to query Yelp for, and then make the queries and log results.
 */
Template.body.events({
  'click .submitButton' : function(e, template) {
    e.preventDefault();

    // Get start and end locations from input text boxes
    Query.startLocation = template.find('#start.form-control').value;
    Query.endLocation = template.find('#end.form-control').value;

    // Ensure something input into both start and end locations
    if (Query.endLocation === '' && Query.startLocation === '') {
      console.log('Please choose a filter');
      return;
    // Ensure the price filter is set
    } else if (Query.priceFilter === '') {
      console.log('Please input locations');
      return;
    }

    Query.valid = true;
    // Callback of the path of the directionsService
    Results.path(function (path) {
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
          console.log('if');
          yelp.Results(lat2,lng2, yelpCallback);
        // Otherwise, continue the loop
        } else {
          console.log('else');
          distTotal += dist;
        }
      }
    });
  }
});
