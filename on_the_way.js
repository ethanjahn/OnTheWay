var Query = {}; // switch to collection, maybe do the calculations serverside
Query.priceFilter = '';

if (Meteor.isClient) {

  Template.priceFilter.events({
    'click .btn' : function(e, template) {
      e.preventDefault();
      var priceSelection = e.target.innerText;
      Query.priceFilter = priceSelection;
      }
    });

  Template.body.events({
    'click .submitButton' : function(e, template) {
      e.preventDefault();
      Query.startLocation = template.find('#start.form-control').value;
      Query.endLocation = template.find('#end.form-control').value;
      if(Query.endLocation != '' && Query.startLocation != '') {
        if(Query.priceFilter != '') {
          Query.status = 'OK';
          Results.path(function(path) {
            var distTotal = 0;
            var tripDist = google.maps.geometry.spherical.computeLength(path);
            var distThresh = tripDist / 10;
            for(var i = 0; i < (path.length - 1); i++) {
              var coord1 = path[i];
              var lat1 = coord1.lat();
              var lng1 = coord1.lng();
              var coord2 = path[i+1];
              var lat2 = coord2.lat();
              var lng2 = coord2.lng();
              var dist = distFromCoords(lat1,lng1,lat2,lng2);
              if(distTotal > distThresh) {
                distTotal = 0;
                console.log('if');
                yelp.Results(lat2,lng2,function(result){
                  console.log(result)
                });
              } else {
                console.log('else')
                distTotal += dist;
              }
            }
          });
        } else {
          console.log('Please Choose a filter')
        }
      } else {
        console.log('Please input locations')
      }
    }
  });

  Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
    }

  function distFromCoords(lat1,lon1,lat2,lon2) {
      var phi1 = lat1.toRadians()
      var phi2 = lat2.toRadians()
      var lambda = (lon2-lon1).toRadians()
      var R = 6371000; // gives d in metres
      var d = Math.acos( Math.sin(phi1)*Math.sin(phi2) + Math.cos(phi1)*Math.cos(phi2) * Math.cos(lambda) ) * R;
      return(d)
    }

    yelp = new Object;
  yelp.Results = function returnFromYelp(lat,lng,resultCallback) {
    var apiKey = 1234;
    var term = 'food';
    var limit = 10;
    var Consumer_Key = 'xNu1H29MMzaKWYBEMQwygw';
    var Consumer_Secret =	'X-XnqfK2_L8SlRBcuMwh57Iro30';
    var Token = '-CanrItylf2VMctD-hHMsa0C6yMF6lTX';
    var Token_Secret = 'ifbaBpWDTQdcPnC9gis2-KTT4C8';
    var radius_filter = 2000; //meters
    var yelpUrl = 'http://api.yelp.com/v2/search?term=' + term + '&radius_filter=' + radius_filter + '&ll' + lat + ',' + lng;
    yelp.Result = HTTP.call("get",yelpUrl, function(error,result) {
      if(error) {
        console.log(error);
      } else {
        resultCallback(result)
      }
    });
  }

  Template.body.rendered = function() {
    Results = new Object();
    Results.path = function calcRoute(pathCallback) {
      var directionsService = new google.maps.DirectionsService();
      var path = []
      var start = Query.startLocation;
      var end = Query.endLocation;
      var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.TravelMode.DRIVING
      };
      directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          //directionsDisplay.setDirections(result);
          path = result.routes[0].overview_path;
          pathCallback(path)
          }
        });
    }
}
}
