// yelp stuff, not working yet
yelp = new Object();
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
      resultCallback(result);
    }
  });
};