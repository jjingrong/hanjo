var express = require('express');
var router = express.Router();
var allArrow = []
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hanjo' });
});

module.exports = router;
