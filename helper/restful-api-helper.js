'use strict';

var config = {host: 'localhost', port: '80'};
var http = require('http');

exports.set = function (props) {
  for (var key in props) {
    config[key] = props[key];
  }
};

var sendRequest = function (path, method, params, callback) {
  var sendData = JSON.stringify(params);
  var options = {
    host: config.host,
    port: config.port,
    path: path,
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': sendData.length
    }
  };
  var req = http.request(options, function (res){
    var result = '';
    res.on('data', function (chunk) {
      result += chunk;
    });

    res.on('end', function () {
      if (callback) {
        callback(res.statusCode, result);
      }
    });
  });
  req.write(sendData);
  req.end();
};

exports.get = function (path, params, callback) {
  sendRequest(path, 'GET', params, callback);
};

exports.post = function (path, params, callback) {
  sendRequest(path, 'POST', params, callback);
};
