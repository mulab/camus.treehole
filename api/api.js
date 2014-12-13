/**
 * Created by guangchen on 10/26/14.
 */
'use strict';

var express = require('express');
var db = require('../config/db').db();
var app = express();

app.use('/status', function (req, res, next) {
  db.collection('holes', {strict: true}, function (err, collection) {
    if (err) {
      err.status = 500;
      next(err);
    } else {
      res.sendStatus(200);
    }
  });
});

var server = require('http').createServer(app);

require('./config/express')(app);
require('./routes')(app);

module.exports = server;
