var Query = {}; // switch to collection, maybe do the calculations serverside
Query.priceFilter = '';

// returns what the user sets on the price button
Template.priceFilter.events({
'click .btn' : function(e, template) {
  e.preventDefault();
  var priceSelection = e.target.innerText;
  Query.priceFilter = priceSelection;
  }
});
