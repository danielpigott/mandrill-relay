var express = require('express');
var router = express.Router();
var _  = require('lodash');
var config = require('config.json')('../sample.json');

/*
 * Send back a 500 error
 */
function handleError(res, error) {
    return res.send(500, {error: error.message});
}

router.get('/', function(req, res) {
    res.render('index', { title: 'Mandrill Relay' });
});

router.post('/', function(req, res) {
    var messages = JSON.parse(req.param('mandrill_events'));
     console.log(messages);
    _.each(messages, function(message) {
        console.log(message);
	});
  res.render('index', { title: 'Mandrill Relay' });
});

module.exports = router;
