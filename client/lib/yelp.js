// Generate a client side only database to store the yelp results
YelpResults = new Meteor.Collection(null);

// yelp stuff, not working yet
var oauth_config = {
  'consumerKey': 'xNu1H29MMzaKWYBEMQwygw',
  'consumerSecret': 'X-XnqfK2_L8SlRBcuMwh57Iro30',
  'accessToken': '-CanrItylf2VMctD-hHMsa0C6yMF6lTX',
  'accessTokenSecret': 'ifbaBpWDTQdcPnC9gis2-KTT4C8'
};

yelp = {};
yelp.Results = function returnFromYelp(lat, lng, resultCallback) {
  Meteor.call('configureYelp', oauth_config);
  Meteor.call('searchYelp', 'food', true, lat, lng, function(err, result) {
    if (err) {
      alert(err);
    } else {
      resultCallback(result);
    }
  });
};

/*
 * Function to be executed upon successful return from Yelp
 */
// Used to give both an ID in the database and a label for the map
var simpleIDindex = -1;
var markerLabels = 'abcdefghijklmnopqrstuvwxyz123456789';

yelpCallback = function yelpCallback(result) {
  // iterate through the returned businesses for a given result
  for (var index in result.businesses) {
    var businessObject = {
      // generate a database entry for each business
      name: result.businesses[index].name,
      rating: result.businesses[index].rating,
      review_count: result.businesses[index].review_count,
      latitude: result.businesses[index].location.coordinate.latitude,
      longitude: result.businesses[index].location.coordinate.longitude,
    };
    // try to find the business in the DB, if it is not there, add it
    var tryToFind = YelpResults.findOne({
      name: businessObject.name
    });
    if (typeof tryToFind === 'undefined') {
      simpleIDindex += 1;
      businessObject.simpleID = markerLabels[simpleIDindex];
      // insert result into local DB
      YelpResults.insert(businessObject);
      // addMarker to the google map
      addMarker(businessObject.latitude, businessObject.longitude, businessObject.simpleID.toString());
      //Record that a result has been loaded, the rest of the results should add to the list reactively
      Session.set('state', 'resultsLoaded');
    }
  }
};
