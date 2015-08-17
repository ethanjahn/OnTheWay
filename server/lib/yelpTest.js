YelpConfig = new Mongo.Collection('loginConfigs'); 
var yelp_base_url = 'http://api.yelp.com/v2/';

var getYelpOauthBinding = function(url) {
  var config = YelpConfig.findOne({service: 'yelp'});
  if (config) {
    config.secret = config.consumerSecret;
    var oauthBinding = new OAuth1Binding(config, url);
    oauthBinding.accessToken = config.accessToken;
    oauthBinding.accessTokenSecret = config.accessTokenSecret;

    return oauthBinding;
  } else {
    throw new Meteor.Error(500, 'Yelp Not Configured');
  }
};

Meteor.methods({
  configureYelp: function(oauth_config) {
    Accounts.loginServiceConfiguration.remove({
      service: "yelp"
    });

    YelpConfig.insert({
      service: 'yelp',
      consumerKey: oauth_config.consumerKey,
      consumerSecret: oauth_config.consumerSecret,
      accessToken: oauth_config.accessToken,
      accessTokenSecret: oauth_config.accessTokenSecret
    });
  },
  searchYelp: function(search, isCategory, latitude, longitude) {
    this.unblock();

    console.log('Yelp search for userId: ' + this.userId + '(search, isCategory, lat, lon) with vals (', search, isCategory, latitude, longitude, ')');

    // Add REST resource to base URL
    var url = yelp_base_url + 'search';

    var oauthBinding = getYelpOauthBinding(url);

    // Build up query
    var parameters = {};
    // Search term or categories query
    if(isCategory)
      parameters.category_filter = search;
    else
      parameters.term = search;

    // Set lat, lon location, if available or default location
    if(longitude && latitude)
      parameters.ll = latitude + ',' + longitude;
    else
      parameters.location = 'New+York';

    // Results limited to 5
    parameters.limit = 5;

    // Only return .data because that is how yelp formats its responses
    var data = oauthBinding.get(url, parameters).data;
    return data;
  },
  yelpBusiness: function(id) {
    this.unblock();
    console.log('Yelp business for userId: ' + this.userId + '(id, lat, lon) with vals (', id, ')');
    var url = yelp_base_url + 'business/' + id;
    // Query OAUTH credentials (these are set manually)
    var oauthBinding = getYelpOauthBinding(url);

    // Only return .data because that is how yelp formats its responses
    return oauthBinding.get(url).data;
  }
});
