var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
	if (process.env.NASA_API) {
		res.render('index', { title: 'NEO Lookup', api:process.env.NASA_API });
	} else {
		res.render('index', { title: 'No API Key Set Up' });
	}
});

module.exports = router;
