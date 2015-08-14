// yelp stuff, not working yet
var oauth_config = {
  'consumerKey': 'xNu1H29MMzaKWYBEMQwygw',
  'consumerSecret': 'X-XnqfK2_L8SlRBcuMwh57Iro30',
  'accessToken': '-CanrItylf2VMctD-hHMsa0C6yMF6lTX',
  'accessTokenSecret': 'ifbaBpWDTQdcPnC9gis2-KTT4C8'
};

yelp = {};
yelp.Results = function returnFromYelp(lat,lng,resultCallback) {
  Meteor.call('configureYelp', oauth_config);
  Meteor.call('searchYelp', 'food', true, lat, lng, function (err, result) {
    if (err) {
      alert(err);
    } else {
      resultCallback(result);
    }
  });
};