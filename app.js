'use strict';
var express = require('express');

var app = express();

require('./config/express')(app, function() {
  var server = require('http').createServer(app);
  server.listen(process.env.PORT || 3000, function () {
    console.log('Express server listening');
  });
});

module.exports = app;
