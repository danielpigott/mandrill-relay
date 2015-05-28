var _ = require('lodash');
var crypto = require('crypto');

exports.generateSignature = function(key, url, post) {
  var signingString = url;
  var postKeys = _.keys(post).sort();
  _.each(postKeys, function(k) {
      signingString = signingString + k + post[k];
  });
  return crypto.createHmac('sha1', new Buffer(key, 'utf-8')).update(signingString).digest('base64');
};
