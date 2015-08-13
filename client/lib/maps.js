// loads the maps api stuff when the html loads (so the api isn't called before it is loaded)
Template.body.rendered = function() {
  Results = {};
  Results.path = function calcRoute(pathCallback) {
    var directionsService = new google.maps.DirectionsService();
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
        //directionsDisplay.setDirections(result);
        path = result.routes[0].overview_path;
        pathCallback(path);
        }
      });
  };
};