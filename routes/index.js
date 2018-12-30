var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'NEO Lookup', api:process.env.NASA_API });
});

module.exports = router;
