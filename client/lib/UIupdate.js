// Helper function to check which state the UI should be in.
Template.UIstate.helpers({
  checkState: function(state) {
    if (state == Session.get('state')) {
      return (true);
    } else {
      return (false);
    }
  },
});

// helper function to display all of the yelp results in the local DB.
Template.yelpResultsPage.helpers({
  result: function() {
    return YelpResults.find({});
  },
});
