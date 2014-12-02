'use strict';

var nconf = require('nconf');
var restler = require('restler');
var error = require('../../common/helper/error');

exports.use = function (config) {
  var reqConfig = {};
  var req;
  var flag = false;

  if (typeof config === 'string') {
    config = nconf.get('rest_request:' + config);
  }
  for (var key in config) {
    reqConfig[key] = config[key];
  }

  var fullUrl = function (url) {
    if (!reqConfig.host) {
      throw error('Host for request is not configured');
    }
    var full = reqConfig.host;
    if (reqConfig.port) {
      full += ':' + reqConfig.port;
    }
    if (reqConfig.base_url) {
      full += reqConfig.base_url;
    }
    full += url;
    return full;
  };

  var request = function (method, url, params, failCallback) {
    if (typeof failCallback === 'undefined') {
      failCallback = params;
      params = {};
    }
    var func;
    if (method === 'get') {
      func = restler.json;
    } else if (method === 'post') {
      func = restler.postJson;
    }
    req = func(fullUrl(url), params);
    if (typeof failCallback === 'function') {
      var errHandler = function () {
        failCallback(error('Request Failed'));
      };
      req.on('error', errHandler).on('5XX', errHandler);
    }
  };

  return {
    /**
     * GET request
     * @param {String} url
     * @param {Object} [params]
     * @param {failCallback} [failCallback]
     */
    get: function (url, params, failCallback) {
      request('get', url, params, failCallback);
      return this;
    },
    /**
     * POST request
     * @param {String} url
     * @param {Object} [params]
     * @param {failCallback} [failCallback]
     */
    post: function (url, params, failCallback) {
      request('post', url, params, failCallback);
      return this;
    },
    /**
     * Bind 2XX and 3XX callback
     * @param {successCallback} callback
     */
    success: function (callback) {
      req.on('2XX', callback).on('3XX', callback);
      return this;
    },
    /**
     * Bind 4XX callback
     * @param {successCallback} callback
     */
    fail: function (callback) {
      req.on('4XX', callback);
      return this;
    }
    /**
     * @callback failCallback
     * @param error
     */
    /**
     * @callback successCallback
     * @param data
     * @param request
     */
  };
};
