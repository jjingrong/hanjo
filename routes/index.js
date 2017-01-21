var express = require('express');
var router = express.Router();
var allArrow = []
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
    var status1 = checkArrowsHitSelf(usernameid, parseFloat(lat), parseFloat(lng));
    var status2 = checkArrowHitTarget(usernameid);

    var status = {
      self_hit: status1.hit,
      self_hit_by: status1.by,
      arrow_hit: status2.hit,
      arrow_hit_at: status2.at,
    };

    if (status.arrow_hit) {
      status.arrow_hit_lat = status2.arrow_lat;
      status.arrow_hit_lng = status2.arrow_lng;
    }

    res.send(status);
  } else {
    res.send('error');
  }

});

var arrowGroup = {};
const HIT_DIST = 0.03; // 30m range
const SPEED_DIST = 0.005 // 5m/sec

function addArrow(usernameid, lat, lng, heading) {
  arrowGroup[usernameid] = {
    lat: lat,
    lng: lng,
    heading: heading,
    hit: false,
  };
}

function processingLoop() {
  for (var key in arrowGroup) {
    var arrow = arrowGroup[key]

    var newLatLng = calculateLatLng(arrow.lat, arrow.lng, arrow.heading, SPEED_DIST);

    arrow.lat = newLatLng[0];
    arrow.lng = newLatLng[1];
  }
}

function checkArrowsHitSelf(usernameid, targetLat, targetLng) {
  for (var key in arrowGroup) {
    var arrow = arrowGroup[key];
    if (calculateDistance(targetLat, targetLng, arrow.lat, arrow.lng) < HIT_DIST
      && key !== usernameid) {
      console.log('collision occured');
      arrow.hit = true;
      arrow.at = usernameid;
      delete arrowGroup[usernameid];
      return { hit: true, by: key };
    };
  }

  return { hit: false, by: null };
}

function checkArrowHitTarget(usernameid) {
  var arrow = arrowGroup[usernameid];
  console.log(arrow);
  if (arrow && arrow.hit) {
    delete arrowGroup[usernameid];
    return { hit: true, at: arrow.at, arrow_lat: arrow.lat, arrow_lng: arrow.lng };
  } else {
    return { hit: false, at: null };
  }
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

// Do the eval loop
setInterval(processingLoop, 1000);

module.exports = router;
