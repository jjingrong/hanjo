var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hanjo' });
});

router.post('/shoot-arrow', function(req, res) {
  // get lat, lng, username and heading
  var lat = req.param('lat');
  var lng = req.param('lng');
  var usernameid = req.param('username');
  var heading = req.param('heading');

  addArrow(usernameid, lat, lng, heading);

  // respond with success
  res.send('done');
});

router.get('/get-status', function(req, res) {
  // get lat, lng, username
  var lat = req.param('lat');
  var lng = req.param('lng');
  var usernameid = req.param('username');

  var status = checkArrowsHitTarget(lat, lng);

  res.send(status);
});

var arrowGroup = {};

function addArrow(usernameid, lat, lng, heading) {
  arrowGroup[usernameid] = {
    lat: lat,
    lng: lng,
    heading: heading
  };
}

function processingLoop() {
  for (var key in arrowGroup) {
    var arrow = arrowGroup[key]

    var newLatLng = calculateLatLng(arrow.lat, arrow.lng, arrow.heading, 0.02);

    arrow.lat = newLatLng[0];
    arrow.lng = newLatLng[1];
  }
}

function checkArrowsHitTarget(targetLat, targetLng) {
  for (var key in arrowGroup) {
    var arrow = arrowGroup[key];
    if (calculateDistance(targetLat, targetLng, arrow.lat, arrow.lng) < 0.01) {
      delete arrowGroup[key];
      return { hit: true, by: key };
    };
  }

  return { hit: false, by: null };
}

Number.prototype.toRad = function() {
   return this * Math.PI / 180;
}

Number.prototype.toDeg = function() {
   return this * 180 / Math.PI;
}

function calculateLatLng(lat, lng, brng, dist) {
 dist = dist / 6371;
 brng = brng.toRad();

 var lat1 = lat.toRad(), lng = lng1.toRad();

 var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
                      Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

 var lng2 = lng1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
                              Math.cos(lat1),
                              Math.cos(dist) - Math.sin(lat1) *
                              Math.sin(lat2));

 if (isNaN(lat2) || isNaN(lon2)) return null;

 return [lat2.toDeg(), lng2.toDeg()];
}

function calculateDistance(lat1, lng1, lat2, lng2) {
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var theta = lng1-lng2;
	var radtheta = Math.PI * theta/180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) +
             Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515;
	dist = dist * 1.609344;

	return dist;
}

module.exports = router;
