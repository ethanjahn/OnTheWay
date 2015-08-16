Query = {};
Query.priceFilter = '';

// set the UI to the initial state
Session.set('state', 'initial')


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

    //update the UI to reflect the valid input, and display a load screen
    Session.set('state', 'loading')

    // Callback of the path of the directionsService
    Results.path(sampleCoords);
  }
});
