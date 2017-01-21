var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hanjo' });
});

router.post('/shoot-arrow', function(req, res) {
  // get lat, lng, username and heading
  var lat = req.body.lat;
  var lng = req.body.lng;
  var usernameid = req.body.username;
  var heading = req.body.heading;
  if (typeof lat != 'undefined' &&
    typeof lng != 'undefined' &&
    typeof usernameid != 'undefined' &&
    typeof heading != 'undefined'
  ) {
    addArrow(usernameid, parseFloat(lat), parseFloat(lng), parseInt(heading));
    console.log('added arrow');
    res.send('done');
  } else {
    console.log('error adding arrow');
    res.send('error');
  }
});

router.get('/get-status', function(req, res) {
  // get lat, lng, username
  var lat = req.query.lat;
  var lng = req.query.lng;
  var usernameid = req.query.username;

  if (typeof lat != 'undefined' &&
    typeof lng != 'undefined' &&
    typeof usernameid != 'undefined'
  ) {
    var status = checkArrowsHitTarget(parseFloat(lat), parseFloat(lng));
    res.send(status);
  } else {
    res.send('error');
  }

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
  console.log('processing...');
  for (var key in arrowGroup) {
    var arrow = arrowGroup[key]

    var newLatLng = calculateLatLng(arrow.lat, arrow.lng, arrow.heading, 0.02);

    arrow.lat = newLatLng[0];
    arrow.lng = newLatLng[1];
  }
  console.log('loop finished.');
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

 var lat1 = lat.toRad(), lng1 = lng.toRad();

 var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
                      Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

 var lng2 = lng1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
                              Math.cos(lat1),
                              Math.cos(dist) - Math.sin(lat1) *
                              Math.sin(lat2));

 if (isNaN(lat2) || isNaN(lng2)) return null;

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

setInterval(processingLoop, 1000);

module.exports = router;
