'use strict';

var config = {host: 'localhost', port: '9000'};
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
      'Content-Length': Buffer.byteLength(sendData, 'utf8')
    }
  };
  var req = http.request(options, function (res){
    res.setEncoding('utf8');
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
