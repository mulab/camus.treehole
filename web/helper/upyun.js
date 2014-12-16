'use strict';

var md5 = require('MD5');
var nconf = require('nconf');
var _ = require('lodash');
require('date-utils');

var encodeBase64 = function (string) {
  return new Buffer(string).toString("base64");
};

var getExpireTime = function (delta) {
  var d = new Date();
  d.addMinutes(delta);
  return Math.floor(d.getTime() / 1000);
};

var getRequestUrl = function () {
  return nconf.get('upyun:request_base_url') + '/' + nconf.get('upyun:bucket');
};

var getSavePath = function (imageId) {
  return '/' + imageId + '.jpg';
};

var getShowUrl = function (imageId) {
  return nconf.get('upyun:show_url') + getSavePath(imageId);
};

var validateSign = function (body, sign) {
  return sign === md5(body + '&' + nconf.get('upyun:api_secret'));
};

var generateRequest = function (imageId) {
  var params = _.cloneDeep(nconf.get('upyun:upload_options'));
  params['bucket'] = nconf.get('upyun:bucket');
  params['save-key'] = getSavePath(imageId);
  params['expiration'] = getExpireTime(nconf.get('upyun:valid_minutes'));
  var policy = encodeBase64(JSON.stringify(params));
  var signature = md5(policy + '&' + nconf.get('upyun:api_secret'));
  return { policy: policy, signature: signature };
};

exports.getRequestUrl = getRequestUrl;
exports.getShowUrl = getShowUrl;
exports.validateSign = validateSign;
exports.generateRequest = generateRequest;
