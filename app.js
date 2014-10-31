'use strict';
var express = require('express');

var app = express();

var server = require('http').createServer(app);
var db = require('./config/db');
require('./config/express')(app);
require('./routes')(app);
db.connect(function(err) {
  if (!err) {
    server.listen(process.env.PORT || 9000, function () {
      console.log('Express server listening');
    });
  } else {
    throw err;
  }
});
module.exports = app;
