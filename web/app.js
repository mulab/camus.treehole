'use strict';
var express = require('express');

var app = express();

var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);
server.listen(process.env.PORT || 8000, function () {
  console.log('Express server listening');
});

module.exports = app;
