// convert to radians
Number.prototype.toRadians = function() {
  return this * Math.PI / 180;
};

// return ditance between lat,lng
distFromCoords = function distFromCoords(lat1, lon1, lat2, lon2) {
  var phi1 = lat1.toRadians();
  var phi2 = lat2.toRadians();
  var lambda = (lon2 - lon1).toRadians();
  var R = 6371000; // gives d in metres
  var d = Math.acos(Math.sin(phi1) * Math.sin(phi2) + Math.cos(phi1) * Math.cos(phi2) * Math.cos(lambda)) * R;
  return (d);
};
