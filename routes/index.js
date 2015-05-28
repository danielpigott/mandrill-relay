var util = require('util');
var fs = require('fs');
var express = require('express');
var router = express.Router();
var _  = require('lodash');
var config = JSON.parse(fs.readFileSync(__dirname + '/../config.json'));
console.log(config);
var mandrill = require('node-mandrill')(config.key);
var signing = require(__dirname + '/../lib/mandrill-signature');

router.get('/', function(req, res) {
    res.render('index', { title: 'Mandrill Relay' });
});

router.post('/', function(req, res) {
    function sendMessages() {
      var messages = JSON.parse(req.param('mandrill_events'));
      _.each(messages, function(message) {
        var sent = false;
        var destinationParts = message.msg.email.split('@');
        var destinationId = destinationParts[0];
        var destinationDomain = destinationParts[1];
        _.each(config.forwarders, function(forwarder) {
          var forwardParts = forwarder.from.split('@');
          var forwardId = forwardParts[0];
          var forwardDomain = forwardParts[1] || '*';
          if ((destinationDomain == forwardDomain || forwardDomain === '*') && (forwardId == destinationId || forwardId == '*')) {
            if (config.auth === true) {
              var calculatedSignature = signing.generateSignature(forwarder.authKey, config.url, req.body);
              var requestSignature = req.get('X-Mandrill-Signature');
              if (calculatedSignature !== requestSignature) {
                console.log(util.format('Calculated Signature %s did not match sent signature %s', calculatedSignature, requestSignature));
                throw {message: 'Error with request signature'};
              }
            }
            var relayMessage = {
              to: [{email: forwarder.to, name: message.msg.sender}],
              from_email: util.format('relay@%s', destinationDomain),
              from_name: util.format('%s via Relay', message.msg.from_name),
              subject: util.format('Message to %s from %s: %s', message.msg.email,  message.msg.from_email, message.msg.subject),
              headers: {
                'Reply-To': message.msg.from_email
              },
              html: message.msg.html,
              text: message.msg.text
            };
            mandrill('/messages/send', { message: relayMessage}, function(error, response) {
                if (error) {
                  console.log(error.message);
                } else {
                  console.log(JSON.stringify(response));
                }
            });
          }
        });
    });

    return true;
  };
  try {
    sendMessages();
    res.send('ok');
  } catch(e) {
    res.status(500).send({error: e.message});
  }
});

module.exports = router;
